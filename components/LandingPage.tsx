import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Mic, BrainCircuit, Star, CheckCircle, 
  Apple, Smartphone, Zap, Quote, Lock, Menu, X, 
  Camera, FolderOpen, ChevronLeft, 
  Utensils, Moon, AlertCircle, Baby, Wifi, Battery, User, Activity, Heart
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import RobeenAvatar from './RobeenAvatar';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

// --- LIVE PRODUCT SIMULATIONS (Using Real Component Code) ---

// 1. The Phone Container
const MockPhoneFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`relative bg-slate-950 rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-900 ${className}`}>
    {/* Status Bar Mock */}
    <div className="absolute top-4 left-0 right-0 px-7 z-40 flex justify-between items-center text-white text-[10px] font-medium tracking-wide">
       <span>9:41</span>
       <div className="flex items-center gap-1.5">
          <Wifi size={12} />
          <Battery size={12} />
       </div>
    </div>

    {/* Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-slate-950 rounded-b-3xl z-40 flex items-center justify-center space-x-2 pointer-events-none">
       <div className="w-16 h-4 bg-black rounded-full mb-1"></div>
    </div>

    {/* Hardware Buttons */}
    <div className="absolute -right-[10px] top-28 h-16 w-[10px] bg-slate-800 rounded-r-md shadow-sm border-l border-slate-900"></div>
    <div className="absolute -left-[10px] top-28 h-10 w-[10px] bg-slate-800 rounded-l-md shadow-sm border-r border-slate-900"></div>
    <div className="absolute -left-[10px] top-44 h-16 w-[10px] bg-slate-800 rounded-l-md shadow-sm border-r border-slate-900"></div>
    
    <div className="bg-slate-50 w-full h-full rounded-[2.5rem] overflow-hidden relative isolate font-sans flex flex-col mask-image-rounded">
       {children}
       
       {/* Home Indicator */}
       <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-50 backdrop-blur-sm"></div>
    </div>
  </div>
);

// 2. Feature Demo: Analyzer (VideoInput -> Loading -> AnalysisResults)
const DemoAnalyzer = () => {
  const [phase, setPhase] = useState<'menu' | 'loading' | 'result'>('menu');

  // Animation Loop
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runSequence = () => {
      // 1. MENU: Show for 2s
      setPhase('menu');

      // 2. LOADING: Show for 2.5s (Skip Camera)
      timeout = setTimeout(() => {
        setPhase('loading');
      }, 2000);

      // 3. RESULT: Show for 6s
      timeout = setTimeout(() => {
        setPhase('result');
      }, 4500);

      // Loop
      timeout = setTimeout(() => {
        runSequence();
      }, 10500);
    };

    runSequence();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-full w-full bg-slate-50 relative flex flex-col overflow-hidden">
      
      {/* --- PHASE 1: MENU (High Fidelity) --- */}
      {phase === 'menu' && (
        <div className="flex-1 flex flex-col pt-12 p-6 animate-fade-in space-y-6 bg-slate-50">
           {/* Header */}
           <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
                <RobeenAvatar size="sm" />
                <h2 className="text-xl font-bold text-slate-900">Robeen</h2>
             </div>
             <div className="w-8 h-8 bg-slate-200 rounded-full" />
           </div>

           <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-800 leading-tight">New Analysis</h2>
              <p className="text-sm text-slate-500 font-medium">Why is baby crying?</p>
           </div>
           
           <div className="grid grid-cols-1 gap-4 mt-4">
              {/* Record Button */}
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-200 group transform transition-transform duration-300 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
                  
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white leading-none mb-1.5">Record</h3>
                      <p className="text-indigo-100 text-[10px] font-bold opacity-80 uppercase tracking-wide">Capture Now</p>
                    </div>
                  </div>
                  {/* Simulate Tap */}
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>

              {/* Upload Button */}
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl shadow-pink-200 opacity-60">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500" />
                  <div className="absolute inset-0 p-6 flex flex-col items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <FolderOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white leading-none mb-1.5">Upload</h3>
                      <p className="text-pink-100 text-[10px] font-bold opacity-80 uppercase tracking-wide">Select Video</p>
                    </div>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* --- PHASE 2: LOADING (High Fidelity) --- */}
      {phase === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/95 backdrop-blur-xl animate-fade-in z-30">
             <div className="relative mb-8">
                <RobeenAvatar size="xl" className="filter drop-shadow-2xl" emotion="listening" />
                <div className="absolute -inset-4 border-2 border-indigo-100 rounded-full animate-[spin_3s_linear_infinite] border-t-indigo-500"></div>
             </div>
             
             <div className="space-y-3 text-center max-w-[200px]">
                <h3 className="text-lg font-bold text-slate-800">Analyzing...</h3>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 w-1/2 animate-[loading_1s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-xs text-slate-400 font-medium">Checking facial cues & cry patterns</p>
             </div>
        </div>
      )}

      {/* --- PHASE 3: RESULTS (High Fidelity) --- */}
      {phase === 'result' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col pt-12 animate-fade-in-up z-20">
           <div className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
             
             {/* Result Card */}
             <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col h-full">
                
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 pt-8 pb-10 text-white relative shrink-0">
                   <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">Hunger</h2>
                        <div className="flex gap-2">
                            <span className="bg-white/20 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border border-white/10 uppercase tracking-wide flex items-center gap-1">
                                <Zap size={10} fill="currentColor"/> 94% Match
                            </span>
                        </div>
                      </div>
                      <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/30 transition-colors">
                         <Play size={20} fill="currentColor" />
                      </div>
                   </div>
                   
                   {/* Decorative Curve */}
                   <div className="absolute -bottom-1 left-0 right-0 h-6 bg-white rounded-t-[2rem]"></div>
                </div>

                {/* Content Body */}
                <div className="flex-1 px-5 pb-5 overflow-hidden flex flex-col -mt-2">
                    
                    {/* Main Insight & Chart */}
                    <div className="flex items-center gap-5 mb-6">
                       <div className="w-20 h-20 relative shrink-0">
                           <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                               <Pie
                                 data={[{value:94}, {value:6}]}
                                 innerRadius={25}
                                 outerRadius={38}
                                 dataKey="value"
                                 stroke="none"
                                 startAngle={90}
                                 endAngle={-270}
                                 paddingAngle={5}
                                 cornerRadius={5}
                               >
                                 <Cell fill="#4f46e5" />
                                 <Cell fill="#f1f5f9" />
                               </Pie>
                             </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-sm font-black text-slate-800 leading-none">94%</span>
                           </div>
                       </div>
                       
                       <div className="flex-1">
                           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Analysis</h4>
                           <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                              "Rooting reflex and hand-to-mouth movement detected."
                           </p>
                       </div>
                    </div>

                    {/* Action Steps */}
                    <div className="space-y-3 flex-1">
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><CheckCircle size={12}/> Immediate Steps</h4>
                       
                       <div className="flex gap-3 items-start p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-colors">
                           <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm mt-0.5">1</span>
                           <span className="text-xs font-bold text-slate-700 leading-snug pt-0.5">Check last feed time. Is it due?</span>
                       </div>
                       
                       <div className="flex gap-3 items-start p-3 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all">
                           <span className="w-6 h-6 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                           <span className="text-xs font-bold text-slate-700 leading-snug pt-0.5">Look for rooting reflex.</span>
                       </div>

                       <div className="flex gap-3 items-start p-3 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all">
                           <span className="w-6 h-6 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                           <span className="text-xs font-bold text-slate-700 leading-snug pt-0.5">Offer feed in a quiet room.</span>
                       </div>
                    </div>

                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

// 3. Feature Demo: Coach (ChatAssistant)
const DemoCoach = () => {
  const [msgs, setMsgs] = useState<any[]>([]);

  useEffect(() => {
    // Reset
    setMsgs([{ role: 'model', text: "Hi Sarah! I'm here. How is Leo doing?" }]);

    const seq = [
      { delay: 1000, action: () => {} }, // Pause
      { delay: 2000, action: () => setMsgs(prev => [...prev, { role: 'user', text: "He keeps arching his back after feeding." }]) },
      { delay: 1500, action: () => setMsgs(prev => [...prev, { role: 'loading' }]) }, // Thinking
      { delay: 2000, action: () => setMsgs(prev => [prev[0], prev[1], { role: 'model', text: "That is a classic sign of Reflux or trapped gas.\n\nTry keeping him upright for 20-30 mins." }]) },
    ];

    let timeouts: any[] = [];
    let cumulative = 0;
    
    // Run sequence then loop
    const run = () => {
        setMsgs([{ role: 'model', text: "Hi Sarah! I'm here. How is Leo doing?" }]);
        cumulative = 0;
        seq.forEach(({ delay, action }) => {
            cumulative += delay;
            timeouts.push(setTimeout(action, cumulative));
        });
        timeouts.push(setTimeout(run, cumulative + 5000));
    };
    
    run();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full bg-white flex flex-col font-sans pt-8">
       {/* Header (From ChatAssistant.tsx) */}
       <div className="p-5 bg-white border-b border-slate-100 flex justify-between items-center z-10 pt-8">
          <div className="flex items-center gap-2.5">
             <RobeenAvatar size="sm" emotion="happy" />
             <div>
                <h3 className="font-bold text-slate-800 text-sm">Robeen Coach</h3>
                <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wide"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live</p>
             </div>
          </div>
          <div className="flex bg-slate-50 border border-slate-200 rounded-full p-1 shadow-inner transform scale-90 origin-right">
             <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-indigo-600 shadow-sm flex gap-1 items-center border border-slate-100"><Mic size={10}/> Voice</div>
             <div className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-400">Text</div>
          </div>
       </div>

       {/* Messages */}
       <div className="flex-1 p-4 space-y-4 overflow-hidden bg-slate-50/50">
          {msgs.map((m, i) => (
             <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                {m.role === 'model' && <div className="mt-auto shrink-0"><RobeenAvatar size="sm" className="w-8 h-8"/></div>}
                
                {m.role === 'loading' ? (
                   <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex gap-1 items-center h-10">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                   </div>
                ) : (
                   <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm font-medium shadow-sm leading-relaxed ${
                      m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-200' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                   }`}>
                      {m.text}
                   </div>
                )}
             </div>
          ))}
       </div>

       {/* Input */}
       <div className="p-4 bg-white border-t border-slate-100 pb-8">
          <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-full border border-slate-200">
              <div className="flex-1 px-4 text-xs font-medium text-slate-400">Type a message...</div>
              <div className="p-2.5 bg-indigo-600 text-white rounded-full shadow-md shadow-indigo-200"><ArrowRight size={14}/></div>
          </div>
       </div>
    </div>
  );
};

// 4. Feature Demo: Profile/Insights (Using ProfileScreen styles)
const DemoInsights = () => (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden pt-12">
        {/* Header Card (From ProfileScreen.tsx) */}
        <div className="bg-white m-4 mb-2 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden p-6 text-center">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-indigo-50 flex items-center justify-center mb-2">
                    <User className="w-8 h-8 text-indigo-200" />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Leo</h2>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 border border-indigo-100">
                   3 Months Old
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
             <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex-1 py-2 text-center text-[10px] font-bold text-slate-400 tracking-wide uppercase">Journal</div>
                <div className="flex-1 py-2 text-center text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-lg tracking-wide uppercase border border-indigo-100 shadow-sm">Insights</div>
                <div className="flex-1 py-2 text-center text-[10px] font-bold text-slate-400 tracking-wide uppercase">Settings</div>
             </div>
        </div>

        {/* Insight Cards (From ProfileScreen logic) */}
        <div className="px-4 space-y-3 overflow-hidden">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden group animate-fade-in-up">
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-pink-500" />
                 <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                         <BrainCircuit size={18} />
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-800 text-sm">Recurring Pattern</h4>
                         <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">
                             Leo struggles with <span className="font-bold text-indigo-600">Overtiredness</span> around 4 PM. Try nap earlier.
                         </p>
                     </div>
                 </div>
            </div>

             <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-400 to-yellow-400" />
                 <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 border border-orange-100">
                         <Utensils size={18} />
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-800 text-sm">Feeding Trend</h4>
                         <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">
                             Cluster feeding detected in evenings.
                         </p>
                     </div>
                 </div>
            </div>
        </div>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play().catch(() => {
          // Autoplay may be blocked, show play button
          setIsVideoPlaying(false);
        });
        setIsVideoPlaying(true);
      }
    }
  };

  // Handle video play/pause events for proper state sync
  const handleVideoPlay = () => setIsVideoPlaying(true);
  const handleVideoPause = () => setIsVideoPlaying(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Mom of 2-month-old",
      image: "https://i.pravatar.cc/150?img=1",
      text: "I was losing my mind at 3AM. Robeen identified hunger instantly when I thought it was colic. Truly a lifesaver.",
      tag: "Sleep"
    },
    {
      name: "Michael Chen",
      role: "Dad of twins",
      image: "https://i.pravatar.cc/150?img=11",
      text: "The voice coach feature is incredible. Being able to just ask 'what do I do?' while holding two crying babies is exactly what I needed.",
      tag: "Coach"
    },
    {
      name: "Emily Rodriguez",
      role: "First-time mom",
      image: "https://i.pravatar.cc/150?img=5",
      text: "The accuracy is scary good. It picked up on 'tired cues' that I completely missed. We adjusted nap times and he sleeps so much better now.",
      tag: "Analysis"
    },
    {
      name: "Jessica & Tom",
      role: "Parents of newborn",
      image: "https://i.pravatar.cc/150?img=32",
      text: "We were skeptical about AI, but the 'pain' cry analysis was spot on—turns out he had an ear infection. Pediatrician was impressed.",
      tag: "Health"
    },
     {
      name: "David Kim",
      role: "Single Dad",
      image: "https://i.pravatar.cc/150?img=60",
      text: "As a single dad, I don't have anyone to bounce ideas off of at night. Robeen feels like having an expert in the room.",
      tag: "Support"
    },
    {
      name: "Maria Garcia",
      role: "Mom of 6-month-old",
      image: "https://i.pravatar.cc/150?img=9",
      text: "I love the tracking. Seeing the patterns made me realize she gets overstimulated every Tuesday after swim class. Game changer.",
      tag: "Insights"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-pink-200 overflow-x-hidden text-slate-900">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RobeenAvatar size="sm" emotion="happy" />
            <span className="text-xl font-bold tracking-tight text-slate-900">Robeen</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
             <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
             <a href="#reviews" className="hover:text-indigo-600 transition-colors">Stories</a>
             <button onClick={() => onNavigate('blog')} className="hover:text-indigo-600 transition-colors">Blog</button>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={() => setShowComingSoon(true)}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 hidden md:block"
            >
              Download the App
            </button>
            <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl md:hidden">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-600">Features</a>
                <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-600">Stories</a>
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('blog'); }} className="text-lg font-medium text-slate-600 text-left">Blog</button>
                <button onClick={() => { setMobileMenuOpen(false); setShowComingSoon(true); }} className="text-lg font-medium text-slate-600 text-left">Download the App</button>
            </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-0 md:pt-48 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[800px] bg-gradient-to-b from-indigo-50/50 via-white to-white pointer-events-none -z-10" />
        <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            
            {/* New Badge (Subtle, High End) */}
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-8 animate-fade-in-up shadow-sm">
                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                 AI Parenting Assistant 2.0
             </div>

            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-slate-900 mb-6 leading-[1.05] animate-fade-in-up">
                Why is my <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 font-serif italic pb-2 pr-4">baby crying?</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in-up delay-100">
                Record 10 seconds of crying. Robeen tells you why — hungry, tired, gassy, or in pain — and exactly what to do.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-fade-in-up delay-200">
                {/* Apple App Store Badge */}
                <a
                    href="https://apps.apple.com/il/app/robeen/id6755863731"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity focus:outline-none hover:-translate-y-1 active:scale-95 transition-transform"
                >
                    <img
                        src="/badges/app-store-badge.svg"
                        alt="Download on the App Store"
                        className="h-[52px]"
                    />
                </a>

                {/* Google Play Badge */}
                <button
                    onClick={() => setShowComingSoon(true)}
                    className="hover:opacity-80 transition-opacity focus:outline-none hover:-translate-y-1 active:scale-95 transition-transform"
                >
                    <img
                        src="/badges/google-play-badge.png"
                        alt="Get it on Google Play"
                        className="h-[70px]"
                    />
                </button>
            </div>

            {/* Community Avatar Pile (Subtle) */}
            <div className="mt-10 flex items-center justify-center gap-3 animate-fade-in-up delay-300 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+25}`} alt="User" />
                        </div>
                    ))}
                </div>
                <span className="text-xs font-bold text-slate-500">Trusted by 10k+ parents</span>
            </div>

        </div>
      </section>

      {/* --- PRODUCT VIDEO --- */}
      <section className="py-24 bg-white relative">
         <div className="max-w-6xl mx-auto px-6">
            <div
               className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-200 border border-slate-200 aspect-video group cursor-pointer"
               onClick={handleVideoClick}
            >
               {/* Video Element */}
               <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/videos/robeen-intro.mp4"
                  poster="/videos/robeen-intro-poster.jpg"
                  preload="metadata"
                  playsInline
                  webkit-playsinline="true"
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onEnded={() => setIsVideoPlaying(false)}
               />

               {/* Play/Pause Overlay - hidden when playing on mobile, shown on hover for desktop */}
               <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
               >
                  {/* Dark gradient overlay when paused */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`} />

                  <div className="relative z-10 pointer-events-auto">
                     <div className={`absolute inset-0 bg-white/30 rounded-full animate-ping opacity-20 ${isVideoPlaying ? 'hidden' : ''}`} />
                     <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl transition-transform duration-500 active:scale-95 md:group-hover:scale-110 md:group-hover:bg-white/20">
                        <Play size={36} className="text-white fill-white ml-1.5 md:ml-2" />
                     </div>
                  </div>
               </div>

               {/* Label - only show when paused */}
               <div className={`absolute bottom-8 left-8 right-8 flex justify-between items-end text-white/80 transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}>
                  <div>
                     <p className="text-sm font-bold uppercase tracking-widest mb-1 text-indigo-300">Intro</p>
                     <h3 className="text-2xl font-medium">Meet Robeen, your parenting assistant</h3>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FEATURE 1: ANALYZER (Merged Visually) --- */}
      <section id="features" className="pt-24 pb-32 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
               
               {/* Left: Content */}
               <div className="flex-1 space-y-8 animate-fade-in-up delay-300">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                     <Camera size={28} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.1]">
                     Don't guess. <br/>
                     <span className="font-serif italic text-indigo-600">Know instantly.</span>
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed max-w-lg font-medium">
                     A 10-second video is all it takes. Robeen analyzes facial cues and cry acoustics to identify the root cause: Hunger, Pain, Gas, or Tiredness.
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                     <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center mt-0.5 text-indigo-600 shadow-sm"><CheckCircle size={14}/></div>
                        <div>
                            <p className="text-slate-900 font-bold">95% Accuracy</p>
                            <p className="text-slate-500 text-sm">Identifying needs in newborns to 12 months.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center mt-0.5 text-indigo-600 shadow-sm"><CheckCircle size={14}/></div>
                        <div>
                            <p className="text-slate-900 font-bold">Actionable Steps</p>
                            <p className="text-slate-500 text-sm">Get a specific checklist for every result.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Visual (DemoAnalyzer) */}
               <div className="flex-1 flex justify-center perspective-[2000px] animate-fade-in-up delay-500">
                  <div className="relative transform transition-transform duration-700 hover:rotate-y-6 hover:scale-[1.02]">
                     {/* Background Blob behind phone */}
                     <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full transform scale-90 -z-10 translate-y-10"></div>
                     
                     <MockPhoneFrame className="w-[320px] h-[680px] md:w-[350px] md:h-[720px] mx-auto shadow-2xl shadow-indigo-200/50 border-slate-800 bg-slate-900">
                        <DemoAnalyzer />
                     </MockPhoneFrame>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* --- FEATURE 2: COACH --- */}
      <section className="py-32 bg-[#FDF4FF] relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink-100 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
               
               {/* Content */}
               <div className="flex-1 space-y-8">
                  <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6 shadow-sm shadow-pink-100">
                     <Mic size={32} />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-900 leading-[1.1]">
                     You're not alone <br/>
                     <span className="font-serif italic text-pink-600">at 3 AM.</span>
                  </h2>
                  <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-medium">
                     Hands full? Just speak. "Robeen, he's arching his back." Get instant, hands-free guidance to soothe your baby without putting them down.
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-pink-100/50">
                     <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-1 text-pink-600 shadow-sm"><CheckCircle size={14}/></div>
                        <div>
                            <p className="text-slate-900 font-bold">Voice Activated</p>
                            <p className="text-slate-500 text-sm">Calm, reassuring voice support when you need it.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Visual (DemoCoach) */}
               <div className="flex-1 flex justify-center perspective-[2000px]">
                  <div className="relative transform transition-transform duration-700 hover:-rotate-y-6 hover:scale-[1.02]">
                     <div className="absolute inset-0 bg-pink-500/30 blur-[80px] rounded-full transform scale-90 -z-10"></div>
                     <MockPhoneFrame className="w-[340px] h-[700px] mx-auto shadow-2xl border-slate-800 bg-slate-900">
                        <DemoCoach />
                     </MockPhoneFrame>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* --- FEATURE 3: INSIGHTS --- */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               
               {/* Content */}
               <div className="flex-1 space-y-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-sm shadow-purple-100">
                     <BrainCircuit size={32} />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-900 leading-[1.1]">
                     Get ahead of <br/>
                     <span className="font-serif italic text-purple-600">the tears.</span>
                  </h2>
                  <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-medium">
                     Spot the patterns. "Leo cries every day at 4 PM." We help you understand the rhythm so you can plan nap times perfectly.
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                     <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1 text-purple-600 shadow-sm"><CheckCircle size={14}/></div>
                        <div>
                            <p className="text-slate-900 font-bold">Visual Trends</p>
                            <p className="text-slate-500 text-sm">Visualize sleep & cry intensity over time.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Visual (DemoInsights) */}
               <div className="flex-1 flex justify-center perspective-[2000px]">
                  <div className="relative transform transition-transform duration-700 hover:rotate-y-6 hover:scale-[1.02]">
                     <div className="absolute inset-0 bg-purple-500/30 blur-[80px] rounded-full transform scale-90 -z-10"></div>
                     <MockPhoneFrame className="w-[340px] h-[700px] mx-auto shadow-2xl border-slate-800 bg-slate-900">
                        <DemoInsights />
                     </MockPhoneFrame>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* --- WALL OF LOVE (Testimonials) --- */}
      <section id="reviews" className="py-32 bg-slate-50 relative overflow-hidden">
         {/* Background gradients */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px]" />
             <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-pink-100/40 rounded-full blur-[100px]" />
         </div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="text-center mb-24 max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-pink-100 text-[10px] font-bold uppercase tracking-wider text-pink-600 mb-6 shadow-sm">
                    <Heart size={12} fill="currentColor" /> Wall of Love
                 </div>
                 <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-900 mb-6 leading-tight">
                     Loved by parents <br/>
                     <span className="font-serif italic text-pink-600 pr-2">who finally sleep.</span>
                 </h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed">
                     Join thousands of mothers and fathers who found their rhythm with Robeen.
                 </p>
             </div>

             <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                 {testimonials.map((t, i) => (
                    <div key={i} className="break-inside-avoid bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-50" />
                                <div>
                                    <h4 className="font-bold text-slate-900 leading-none">{t.name}</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{t.role}</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-50">
                                {t.tag}
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <Quote className="absolute -top-3 -left-3 text-indigo-50 w-10 h-10 -z-10 transform -scale-x-100" />
                            <p className="text-slate-600 font-medium leading-relaxed text-lg relative">
                               "{t.text}"
                            </p>
                        </div>

                        <div className="flex gap-1 mt-6 text-yellow-400">
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                        </div>
                    </div>
                 ))}
             </div>
             
             <div className="mt-16 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                      See 2,000+ more stories on App Store <ArrowRight size={14} />
                  </div>
             </div>
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <footer className="bg-white pt-32 pb-20 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6 text-center">
            
            <h2 className="text-5xl md:text-8xl font-medium text-slate-900 mb-12 tracking-tight leading-none">
               Sleep better <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 font-serif italic">tonight.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
                {/* Apple App Store Badge */}
                <a
                    href="https://apps.apple.com/il/app/robeen/id6755863731"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity focus:outline-none hover:-translate-y-1 active:scale-95 transition-transform"
                >
                    <img
                        src="/badges/app-store-badge.svg"
                        alt="Download on the App Store"
                        className="h-[52px]"
                    />
                </a>

                {/* Google Play Badge */}
                <button
                    onClick={() => setShowComingSoon(true)}
                    className="hover:opacity-80 transition-opacity focus:outline-none hover:-translate-y-1 active:scale-95 transition-transform"
                >
                    <img
                        src="/badges/google-play-badge.png"
                        alt="Get it on Google Play"
                        className="h-[70px]"
                    />
                </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400 font-medium pt-12 border-t border-slate-100">
               <div className="flex items-center gap-2">
                  <RobeenAvatar size="sm" />
                  <span className="font-bold text-slate-900 text-lg">Robeen</span>
               </div>
               
               {/* Footer Links */}
               <div className="flex items-center gap-6">
                  <button onClick={() => onNavigate('blog')} className="hover:text-indigo-600 transition-colors">Blog</button>
                  <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
                  <button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 transition-colors">Terms & Conditions</button>
               </div>
               
               <p>© {new Date().getFullYear()} Robeen AI.</p>
            </div>
         </div>
      </footer>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Coming Soon!</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Robeen will be available on the App Store and Google Play very soon. Stay tuned!
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;