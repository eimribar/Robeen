import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Camera, RotateCcw, Check, ChevronLeft, Image as ImageIcon, Zap, PlayCircle, Film, FolderOpen, ChevronRight } from 'lucide-react';

interface VideoInputProps {
  onVideoSelected: (file: File, base64: string) => void;
  isLoading: boolean;
}

type ViewState = 'menu' | 'camera' | 'preview';

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSelected, isLoading }) => {
  const [view, setView] = useState<ViewState>('menu');
  
  // --- Upload State ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Camera State ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [maxDuration, setMaxDuration] = useState(15); // Default 15s
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // Cleanup resources
  useEffect(() => {
    return () => {
      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, []);

  // Auto-stop timer for recording
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, maxDuration]);

  // --- Navigation & Reset ---
  const goToMenu = () => {
    stopCamera();
    setView('menu');
    setError(null);
    setRecordedBlob(null);
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Upload Handlers ---
  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setError("Video is too large. Please upload a clip under 100MB.");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setView('preview');

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',').pop() || '' : result;
      onVideoSelected(file, base64);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  // --- Camera Handlers ---
  const enterCameraMode = async () => {
    setView('camera');
    await startCamera();
  };

  const startCamera = async () => {
    try {
      setError(null);
      // Prefer rear camera on mobile devices
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; 
      }
      setIsCameraReady(true);
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    try {
      let options: MediaRecorderOptions = { 
        videoBitsPerSecond: 1500000 
      };

      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options.mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options.mimeType = 'video/webm';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        options.mimeType = 'video/mp4';
      }

      const recorder = new MediaRecorder(streamRef.current, options);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const type = chunksRef.current[0]?.type || 'video/webm';
        const blob = new Blob(chunksRef.current, { type });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        stopCamera();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error(err);
      setError("Failed to start recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetake = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null);
    setRecordedUrl(null);
    startCamera();
  };

  const confirmRecording = () => {
    if (!recordedBlob) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',').pop() || '' : result;
      const file = new File([recordedBlob], "camera-recording.webm", { type: recordedBlob.type });
      onVideoSelected(file, base64);
    };
    reader.readAsDataURL(recordedBlob);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 md:mb-8">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="video/mp4,video/webm,video/quicktime" 
        className="hidden" 
      />

      {/* --- MENU VIEW --- */}
      {view === 'menu' && (
        <div className="grid grid-cols-2 gap-4 md:gap-6 animate-fade-in-up">
          
          {/* OPTION 1: RECORD VIDEO */}
          <button
            onClick={enterCameraMode}
            disabled={isLoading}
            className="group relative w-full aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-indigo-200 hover:shadow-indigo-500/30 border border-white/20"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 transition-transform duration-700 group-hover:scale-105" />
            
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="absolute inset-0 p-5 md:p-8 flex flex-col items-start justify-between text-left">
               {/* Icon Circle */}
               <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                  <Camera className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-sm" strokeWidth={2} />
               </div>

               {/* Text */}
               <div className="flex flex-col gap-2 md:gap-3 w-full">
                 <h3 className="text-xl md:text-3xl font-black text-white tracking-tight leading-none">
                    Record<br/>Your Baby
                 </h3>
                 <p className="text-indigo-100 text-xs md:text-sm font-medium opacity-90 leading-relaxed max-w-[95%]">
                    Is your baby crying right now? Capture the moment to find out why.
                 </p>
               </div>
               
               {/* Arrow Icon on Hover/Active */}
               <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 hidden md:block">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                     <ChevronRight className="w-5 h-5 text-white" /> 
                  </div>
               </div>
            </div>
          </button>

          {/* OPTION 2: UPLOAD VIDEO */}
          <button
            onClick={triggerUpload}
            disabled={isLoading}
            className="group relative w-full aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-pink-200 hover:shadow-pink-500/30 border border-white/20"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 transition-transform duration-700 group-hover:scale-105" />

            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            
            <div className="absolute inset-0 p-5 md:p-8 flex flex-col items-start justify-between text-left">
               {/* Icon Circle */}
               <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                  <FolderOpen className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-sm" strokeWidth={2} />
               </div>

               {/* Text */}
               <div className="flex flex-col gap-2 md:gap-3 w-full">
                 <h3 className="text-xl md:text-3xl font-black text-white tracking-tight leading-none">
                    Upload<br/>Video
                 </h3>
                 <p className="text-pink-100 text-xs md:text-sm font-medium opacity-90 leading-relaxed max-w-[95%]">
                    Already have a video? See why your baby was crying earlier.
                 </p>
               </div>

               {/* Arrow Icon on Hover/Active */}
               <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 hidden md:block">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                     <ChevronRight className="w-5 h-5 text-white" /> 
                  </div>
               </div>
            </div>
          </button>

        </div>
      )}

      {/* --- PREVIEW VIEW (From Upload) --- */}
      {view === 'preview' && previewUrl && (
        <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl animate-fade-in aspect-video md:aspect-auto ring-4 ring-slate-100">
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10 flex justify-end">
            {!isLoading && (
              <button 
                onClick={goToMenu}
                className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all active:scale-90 flex items-center gap-2 pr-4 pl-2 border border-white/10"
              >
                <X size={18} /> <span className="text-sm font-bold">Close</span>
              </button>
            )}
          </div>
          
          <video 
            src={previewUrl} 
            controls 
            playsInline
            className="w-full max-h-[60vh] object-contain mx-auto"
          />
        </div>
      )}

      {/* --- CAMERA VIEW --- */}
      {view === 'camera' && (
        <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl animate-fade-in aspect-[9/16] md:aspect-video flex flex-col ring-4 ring-slate-900">
          
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
             {!isLoading && (
                <button 
                  onClick={goToMenu}
                  className="pointer-events-auto bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 flex items-center gap-1 pr-4 border border-white/10"
                >
                  <ChevronLeft size={20} /> <span className="text-sm font-bold">Back</span>
                </button>
             )}
             
             {/* Duration Selector */}
             {!isRecording && !recordedUrl && isCameraReady && (
                <div className="pointer-events-auto bg-black/40 backdrop-blur-md rounded-full p-1 flex gap-1 border border-white/10">
                  {[10, 15, 30].map(sec => (
                    <button
                      key={sec}
                      onClick={() => setMaxDuration(sec)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${maxDuration === sec ? 'bg-white text-black shadow-sm' : 'text-white/70 hover:text-white'}`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
             )}
          </div>

          {/* Camera / Video Area */}
          <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
             {recordedUrl ? (
                <video src={recordedUrl} controls playsInline className="w-full h-full object-contain" />
             ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]" 
                />
             )}
          </div>

          {/* Controls Layer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col items-center justify-end z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent h-48">
            
            {/* RECORDING STATE */}
            {isCameraReady && !recordedUrl && (
               <>
                  {isRecording && (
                    <div className="mb-6 flex items-center gap-2 bg-red-500/90 text-white px-4 py-1.5 rounded-full text-sm font-mono backdrop-blur animate-pulse shadow-lg border border-red-400/50">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      {recordingTime}s / {maxDuration}s
                    </div>
                  )}
                  
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative rounded-full border-[6px] border-white/80 transition-all duration-200 flex items-center justify-center shadow-2xl ${isRecording ? 'w-20 h-20 bg-red-600 scale-110' : 'w-18 h-18 bg-red-500 hover:bg-red-600 hover:scale-105'}`}
                  >
                    {isRecording ? <div className="w-8 h-8 bg-white rounded-md shadow-sm" /> : <div className="w-full h-full rounded-full bg-white/10" />}
                  </button>
                  
                  {!isRecording && (
                     <p className="text-white/60 text-xs mt-4 font-medium tracking-wide">TAP TO RECORD</p>
                  )}
               </>
            )}

            {/* REVIEW STATE */}
            {recordedUrl && !isLoading && (
               <div className="w-full flex gap-4 animate-fade-in-up pb-2">
                 <button 
                   onClick={handleRetake}
                   className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold backdrop-blur-md flex items-center justify-center gap-2 transition active:scale-95 border border-white/10"
                 >
                   <RotateCcw size={18} /> Retake
                 </button>
                 <button 
                   onClick={confirmRecording}
                   className="flex-1 bg-white text-indigo-600 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition active:scale-95 hover:bg-indigo-50"
                 >
                   <Check size={18} strokeWidth={3} /> Use Video
                 </button>
               </div>
            )}
          </div>

        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 mx-2 border border-red-100 animate-fade-in shadow-sm">
          <Zap size={18} className="text-red-500" /> {error}
        </div>
      )}
    </div>
  );
};

export default VideoInput;