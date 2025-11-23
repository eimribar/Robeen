import React, { useState, useRef, useEffect } from 'react';
import { Send, Keyboard, Mic, Zap, Activity, AlertCircle } from 'lucide-react';
import { sendChatMessage, ChatMessage, getLiveClient, connectLiveParams } from '../services/geminiService';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import RobeenAvatar from './RobeenAvatar';
import { UserProfileData } from '../types';

interface ChatAssistantProps {
  userProfile?: UserProfileData;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ userProfile }) => {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  
  // Construct Personalized Context
  const getContextString = () => {
    if (!userProfile) return "";
    return `You are speaking to ${userProfile.parentName}. The baby is named ${userProfile.babyName} (${userProfile.gender}) and was born on ${userProfile.birthDate}. Use these names and correct pronouns (he/him for boy, she/her for girl) naturally in conversation. Customize advice based on the baby's age calculated from the birthdate.`;
  };

  // --- Text State ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi ${userProfile?.parentName || 'there'}! I'm ready to help with ${userProfile?.babyName || 'your baby'}. What's on your mind?` }
  ]);
  const [input, setInput] = useState('');
  const [isTextLoading, setIsTextLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Voice State ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [volume, setVolume] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs for Voice
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSessionRef = useRef<any>(null); 
  const isLiveActiveRef = useRef(false); 

  // --- Text Logic ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, mode]);

  const handleSendText = async () => {
    if (!input.trim() || isTextLoading) return;
    const userMsg = input;
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTextLoading(true);

    try {
      const history = messages; 
      const response = await sendChatMessage(userMsg, history, getContextString());
      
      let responseText = response.text;
      if (response.sources && response.sources.length > 0) {
        const links = response.sources
            .map(chunk => chunk.web?.uri ? `[${chunk.web.title}](${chunk.web.uri})` : '')
            .filter(Boolean)
            .join(', ');
        if (links) responseText += `\n\nSources: ${links}`;
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTextLoading(false);
    }
  };

  // --- Voice Logic ---
  useEffect(() => {
    let animId: number;
    const animate = () => {
      if (isLiveActiveRef.current && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolume(avg);
      } else if (!isLiveActiveRef.current) {
        setVolume(0);
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []); 

  const startVoiceSession = async () => {
    setErrorMessage(null);
    setLiveStatus('connecting');
    setIsLiveActive(true);
    isLiveActiveRef.current = true;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support audio recording.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      const audioCtx = new AudioCtx({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      const outputCtx = new AudioCtx({ sampleRate: 24000 });

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      source.connect(analyser);
      source.connect(processor);
      processor.connect(audioCtx.destination);

      const liveClient = getLiveClient();
      
      // Personalized Instruction
      const systemInstruction = `You are Robeen, a specialized parenting assistant helping ${userProfile?.parentName || 'a parent'}. The baby is named ${userProfile?.babyName || 'the baby'} (${userProfile?.gender || 'baby'}). ${userProfile?.birthDate ? `Born on ${userProfile.birthDate}.` : ''} You MUST ONLY discuss topics related to parenting, babies, and children. Politely refuse to discuss anything else. Speak naturally, concisely, and with empathy. Use the baby's name often and use correct pronouns (he/him if boy, she/her if girl).`;

      const sessionPromise = liveClient.connect(connectLiveParams({
        onOpen: () => {
            if (!isLiveActiveRef.current) return;
            setLiveStatus('connected');
        },
        onMessage: async (msg) => {
            if (!isLiveActiveRef.current) return;
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
                try {
                  const buffer = await decodeAudioData(base64ToUint8Array(audioData), outputCtx, 24000);
                  const source = outputCtx.createBufferSource();
                  source.buffer = buffer;
                  source.connect(outputCtx.destination);
                  
                  const now = outputCtx.currentTime;
                  const start = Math.max(now, nextStartTimeRef.current);
                  source.start(start);
                  nextStartTimeRef.current = start + buffer.duration;
                } catch (e) {
                  console.error("Error decoding audio", e);
                }
            }
        },
        onClose: () => {
            if (isLiveActiveRef.current) stopVoiceSession();
        },
        onError: (e) => {
            if (isLiveActiveRef.current) {
                setErrorMessage("Connection lost. Please try again.");
                stopVoiceSession();
            }
        }
      }, systemInstruction));
      
      sessionPromise.then(session => {
          if (!isLiveActiveRef.current) {
            session.close();
            return;
          }
          activeSessionRef.current = session;
          processor.onaudioprocess = (e) => {
            if (!isLiveActiveRef.current) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            session.sendRealtimeInput({ media: pcmBlob });
          };
      });

    } catch (err: any) {
      console.error("Failed to start live session", err);
      stopVoiceSession(); 
      setErrorMessage(err.message || "Failed to connect. Please try again.");
    }
  };

  const stopVoiceSession = () => {
    setIsLiveActive(false);
    setLiveStatus('idle');
    isLiveActiveRef.current = false;
    
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    
    try {
        sourceRef.current?.disconnect();
        processorRef.current?.disconnect();
        analyserRef.current?.disconnect();
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    } catch (e) {
        console.error("Error closing audio context", e);
    }

    if (activeSessionRef.current) {
        try { activeSessionRef.current.close(); } catch (e) {}
        activeSessionRef.current = null;
    }
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    return () => { stopVoiceSession(); };
  }, []);

  return (
    <div className="bg-white md:rounded-3xl shadow-none md:shadow-xl border-x-0 md:border border-slate-100 flex flex-col h-[calc(100vh-130px)] md:h-[600px] w-full max-w-4xl mx-auto overflow-hidden relative">
      
      {/* Header - Shared */}
      <div className="p-3 md:p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
              <RobeenAvatar size="sm" />
          </div>
          <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">Robeen Assistant</h3>
              <p className="text-[10px] md:text-xs text-slate-500 flex items-center gap-1">
                  {mode === 'voice' ? 'Live Voice Mode' : 'Chat Mode'}
              </p>
          </div>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm">
          <button 
            onClick={() => {
              stopVoiceSession();
              setMode('voice');
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
              mode === 'voice' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Mic size={14} className="md:w-4 md:h-4" /> Voice
          </button>
          <button 
            onClick={() => {
              stopVoiceSession();
              setMode('text');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
              mode === 'text' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Keyboard size={14} className="md:w-4 md:h-4" /> Text
          </button>
        </div>
      </div>

      {/* --- VOICE MODE UI --- */}
      {mode === 'voice' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-1000 ${isLiveActive ? 'scale-150 opacity-50' : 'scale-100'}`} />
            <div className={`w-48 h-48 md:w-64 md:h-64 bg-secondary/5 rounded-full blur-2xl transition-all duration-1000 absolute ${isLiveActive ? 'scale-125 opacity-50' : 'scale-100'}`} />
          </div>

          <div className="z-10 flex flex-col items-center space-y-8 md:space-y-10 w-full px-6">
            
            {errorMessage && (
               <div className="absolute top-4 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 border border-red-100 animate-fade-in-up z-20 max-w-[90%] text-center">
                 <AlertCircle size={16} className="flex-shrink-0" /> {errorMessage}
               </div>
            )}

            <div className="relative group">
              {isLiveActive && (
                <>
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="absolute -inset-4 bg-secondary/10 rounded-full animate-pulse" />
                </>
              )}

              <button
                onClick={isLiveActive ? stopVoiceSession : startVoiceSession}
                disabled={liveStatus === 'connecting'}
                className={`relative w-36 h-36 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95
                  ${isLiveActive ? 'scale-110' : 'hover:scale-105'}
                  ${liveStatus === 'connecting' ? 'opacity-80 cursor-wait' : ''}
                `}
              >
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                   <RobeenAvatar 
                    size="xl" 
                    className={`transition-transform duration-300 ${isLiveActive ? 'scale-110' : ''}`}
                    emotion={isLiveActive ? (volume > 20 ? 'talking' : 'listening') : 'neutral'}
                   />
                </div>

                {liveStatus === 'connecting' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full">
                     <Activity className="w-10 h-10 text-primary animate-spin" />
                  </div>
                )}
                
                {isLiveActive && liveStatus === 'connected' && (
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1 items-end h-8">
                       {[...Array(5)].map((_, i) => (
                           <div 
                              key={i} 
                              className="w-1.5 bg-primary rounded-full transition-all duration-75"
                              style={{ height: `${Math.max(20, Math.min(100, volume * (i + 1) * 0.5 + 20))}%` }}
                           />
                       ))}
                   </div>
                )}
              </button>
            </div>

            <div className="text-center space-y-2 mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                    {liveStatus === 'connecting' && "Waking up Robeen..."}
                    {liveStatus === 'connected' && `I'm listening, ${userProfile?.parentName || ''}`}
                    {liveStatus === 'idle' && "Tap to talk to Robeen"}
                </h2>
                <p className="text-sm md:text-base text-slate-500 max-w-[260px] md:max-w-xs mx-auto leading-relaxed">
                    {liveStatus === 'connected' 
                        ? `Discussing ${userProfile?.babyName || 'the baby'}. Talk naturally.` 
                        : "Have a conversation for real-time soothing advice."}
                </p>
            </div>
          </div>
        </div>
      )}

      {/* --- TEXT MODE UI --- */}
      {mode === 'text' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="flex-shrink-0 mt-auto">
                    <RobeenAvatar size="sm" emotion="happy" />
                  </div>
                )}

                <div 
                  className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl shadow-sm whitespace-pre-wrap text-sm md:text-base ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTextLoading && (
              <div className="flex justify-start gap-3">
                <div className="flex-shrink-0 mt-auto">
                    <RobeenAvatar size="sm" emotion="listening" />
                </div>
                <div className="bg-white p-3 md:p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 md:p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-center bg-slate-50 p-1.5 md:p-2 rounded-full border border-slate-200 focus-within:ring-2 ring-primary/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder={`Ask about ${userProfile?.babyName || 'the baby'}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 md:px-4 py-2 text-sm md:text-base text-slate-800 placeholder:text-slate-400"
              />
              <button
                onClick={handleSendText}
                disabled={!input.trim() || isTextLoading}
                className="p-2.5 md:p-3 bg-primary text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-primary transition-all flex-shrink-0"
              >
                <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
            <p className="text-center text-[10px] md:text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
              <Zap size={10} className="md:w-3 md:h-3" /> Powered by Robeen with Google Search
            </p>
          </div>
        </>
      )}

    </div>
  );
};

export default ChatAssistant;
