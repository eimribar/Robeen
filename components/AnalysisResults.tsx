import React, { useState, useEffect, useRef } from 'react';
import { pcmToAudioBuffer } from '../utils/audioUtils';
import { Play, CheckCircle, AlertCircle, Activity, BrainCircuit, StopCircle, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CryAnalysisResult } from '../types';

interface AnalysisResultsProps {
  result: CryAnalysisResult;
  audioStreamPromise: Promise<AsyncGenerator<Uint8Array>> | null;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, audioStreamPromise }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isBuffering, setIsBuffering] = useState(true); // Tracks if we have initial data
  
  // --- Audio Ref Store (For Pre-fetching) ---
  const pcmBuffer = useRef<Uint8Array[]>([]); // Stores pre-fetched chunks
  const isPlayingRef = useRef(false); // Sync ref for the async loop
  const audioCtxRef = useRef<AudioContext | null>(null); // Ref for async access
  const nextStartTimeRef = useRef(0); // Gapless playback cursor
  const activeSourceNodes = useRef<AudioBufferSourceNode[]>([]); // To stop playback

  // --- 1. Pre-fetch Audio on Mount (Using passed promise) ---
  useEffect(() => {
    let active = true;
    
    // Reset state on new result
    pcmBuffer.current = [];
    nextStartTimeRef.current = 0;
    setIsBuffering(true);
    
    const fetchAudio = async () => {
      if (!audioStreamPromise) {
        setIsBuffering(false);
        return;
      }

      try {
        console.log("Connecting to preloaded audio stream...");
        const stream = await audioStreamPromise;
        
        for await (const chunk of stream) {
          if (!active) break;
          
          // If we are already playing, schedule directly to the context
          if (isPlayingRef.current && audioCtxRef.current) {
            scheduleChunk(chunk, audioCtxRef.current);
          } else {
            // Otherwise, buffer it for later
            pcmBuffer.current.push(chunk);
          }
          
          // We have data, so buffering is "done" for the initial loading perception
          setIsBuffering(false);
        }
      } catch (e) {
        console.error("Background TTS Error:", e);
        setIsBuffering(false);
      }
    };

    fetchAudio();

    return () => {
      active = false;
      handleStop(); // Cleanup audio on unmount
    };
  }, [audioStreamPromise]); // Depend on the promise object

  // --- 2. Playback Logic ---
  const scheduleChunk = (chunk: Uint8Array, ctx: AudioContext) => {
    try {
      // Decode synchronous
      const buffer = pcmToAudioBuffer(chunk, ctx, 24000);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      // Schedule ensuring no gap
      const start = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(start);
      nextStartTimeRef.current = start + buffer.duration;
      
      // Track node for stopping
      activeSourceNodes.current.push(source);
      
      // Cleanup old nodes to save memory
      source.onended = () => {
        activeSourceNodes.current = activeSourceNodes.current.filter(s => s !== source);
      };
    } catch (err) {
      console.error("Error scheduling chunk", err);
    }
  };

  const handleSpeak = async () => {
    if (isPlayingAudio) {
      handleStop();
      return;
    }

    // Initialize AudioContext on Click (User Gesture)
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx({ sampleRate: 24000 });
    await ctx.resume();
    
    setAudioCtx(ctx);
    audioCtxRef.current = ctx;
    nextStartTimeRef.current = ctx.currentTime; // Reset cursor to NOW
    
    setIsPlayingAudio(true);
    isPlayingRef.current = true;

    // --- FLUSH BUFFER ---
    // Immediately play everything we downloaded while the user was reading
    if (pcmBuffer.current.length > 0) {
      console.log(`Flushing ${pcmBuffer.current.length} buffered chunks immediately`);
      pcmBuffer.current.forEach(chunk => scheduleChunk(chunk, ctx));
      pcmBuffer.current = []; // Clear buffer
    }
    
    // The background loop (in useEffect) will now see isPlayingRef.current = true
    // and schedule future chunks directly as they arrive.
  };

  const handleStop = () => {
    setIsPlayingAudio(false);
    isPlayingRef.current = false;
    
    // Stop all currently playing nodes
    activeSourceNodes.current.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    activeSourceNodes.current = [];

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      setAudioCtx(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-6 md:pb-0">
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-primary to-secondary p-5 md:p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">{result.primaryReason}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm backdrop-blur-md font-medium">
                  {result.confidenceScore}% Confidence
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm backdrop-blur-md font-medium">
                  State: {result.emotionalState}
                </span>
              </div>
            </div>
            <button 
              onClick={handleSpeak}
              disabled={isBuffering && pcmBuffer.current.length === 0} 
              className={`bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-full transition flex-shrink-0 ml-4 shadow-lg relative disabled:opacity-50 disabled:cursor-wait`}
              aria-label={isPlayingAudio ? "Stop reading" : "Read advice"}
            >
              {isPlayingAudio ? (
                <StopCircle fill="currentColor" size={20} className="animate-pulse" />
              ) : isBuffering && pcmBuffer.current.length === 0 ? (
                 <Loader2 className="animate-spin text-white/80" size={20} />
              ) : (
                <Play fill="currentColor" size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Actionable Steps */}
          <div className="order-2 lg:order-1">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} /> Actionable Steps
            </h3>
            <ul className="space-y-3">
              {result.actionableSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chart & Context */}
          <div className="order-1 lg:order-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm relative overflow-hidden">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 z-10 relative">
                <Activity className="text-secondary w-5 h-5" /> Analysis Breakdown
               </h3>
               
               <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 z-10 relative">
                 {/* Donut Chart */}
                 <div className="w-44 h-44 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={5}
                        >
                          {result.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ color: '#1e293b', fontWeight: 600, fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-extrabold text-slate-800">{result.confidenceScore}<span className="text-base align-top">%</span></span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Match</span>
                    </div>
                 </div>

                 {/* Custom Legend */}
                 <div className="flex-1 w-full">
                   <div className="space-y-2.5">
                      {result.chartData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between group p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                             <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                             <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{entry.name}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-primary">{entry.value}%</span>
                        </div>
                      ))}
                   </div>
                 </div>
               </div>
               
               {/* Analysis Context */}
               {result.analysisContext && (
                 <div className="mt-6 relative">
                   <div className="absolute -left-6 top-0 bottom-0 w-1 bg-secondary/30 rounded-r-full"></div>
                   <div className="pl-0">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <BrainCircuit size={12} /> Why AI thinks this
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "{result.analysisContext}"
                      </p>
                   </div>
                 </div>
               )}

               {/* Decorative Background Blob */}
               <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 p-3 md:p-4 border-t border-amber-100 flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle className="flex-shrink-0 w-4 h-4 mt-0.5 text-amber-600" />
          <p className="font-medium opacity-90">{result.medicalDisclaimer || "This app is an AI assistant and does not replace professional medical advice. If your baby has a fever, is lethargic, or you are concerned, please contact a pediatrician immediately."}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
