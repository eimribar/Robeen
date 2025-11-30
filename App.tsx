import React, { useState } from 'react';
import { Activity, Sparkles, User, Home } from 'lucide-react';
import VideoInput from './components/VideoInput';
import AnalysisResults from './components/AnalysisResults';
import ChatAssistant from './components/ChatAssistant';
import RobeenAvatar from './components/RobeenAvatar';
import AuthScreen from './components/AuthScreen';
import ProfileScreen from './components/ProfileScreen';
import OnboardingFlow from './components/OnboardingFlow';
import LandingPage from './components/LandingPage';
import { analyzeCryVideo, getQuickTips, preloadTTS } from './services/geminiService';
import { CryAnalysisResult, HistoryItem, UserProfileData } from './types';

const App: React.FC = () => {
  // --- Navigation State ---
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // --- App State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'analyze' | 'chat' | 'profile'>('analyze');
  
  // Real App Data
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [analysisResult, setAnalysisResult] = useState<CryAnalysisResult | null>(null);
  
  const [audioStreamPromise, setAudioStreamPromise] = useState<Promise<AsyncGenerator<Uint8Array>> | null>(null);
  const [quickTips, setQuickTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<string>('');

  // --- 1. LANDING PAGE FLOW ---
  if (viewState === 'landing' && !isAuthenticated) {
    return <LandingPage 
      onGetStarted={() => {
        setAuthMode('signup');
        setViewState('auth');
      }}
      onLogin={() => {
        setAuthMode('signin');
        setViewState('auth');
      }}
    />;
  }

  // --- 2. AUTHENTICATION FLOW ---
  if (viewState === 'auth' && !isAuthenticated) {
    return <AuthScreen 
      initialMode={authMode}
      onBack={() => setViewState('landing')}
      onAuthenticated={(email) => {
        setUserEmail(email);
        setIsAuthenticated(true);
        setViewState('app');
      }} 
    />;
  }

  // --- 3. ONBOARDING FLOW ---
  if (isAuthenticated && !isOnboarded) {
    return <OnboardingFlow onComplete={(data) => {
      setUserProfile(data);
      setIsOnboarded(true);
    }} />;
  }

  // Generate quick tips immediately when analysis starts
  const handleAnalysisStart = async (file: File, base64: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setAudioStreamPromise(null);
    setQuickTips(null);
    
    try {
      // 1. Fire off Quick Tips (Fast Model)
      setLoadingPhase("Getting immediate soothing tips...");
      getQuickTips()
        .then(tips => setQuickTips(tips))
        .catch(err => console.warn("Quick tips unavailable due to load", err));

      // 2. Start Deep Analysis (Pro Model with Thinking)
      setLoadingPhase("Analyzing cry patterns & body language...");
      // Pass baby name and gender to analysis service
      const result = await analyzeCryVideo(
        base64, 
        file.type, 
        userProfile?.babyName, 
        userProfile?.gender || 'baby'
      );
      
      // 3. Eagerly Start TTS Generation
      // We start this request NOW, before the React state update even finishes processing.
      // This ensures the network request for audio is in flight immediately.
      const conciseSteps = result.actionableSteps.slice(0, 2).join('. ');
      const textToSpeak = `Analysis complete for ${userProfile?.babyName || 'your baby'}. The primary reason seems to be ${result.primaryReason}. ${result.analysisContext}. Here are two things to try: ${conciseSteps}`;
      const streamPromise = preloadTTS(textToSpeak);
      setAudioStreamPromise(streamPromise);

      setAnalysisResult(result);

      // 4. Save to History
      const newHistoryItem: HistoryItem = {
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date()
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (error: any) {
      console.error("Analysis Error:", error);
      if (error?.message?.includes('429') || error?.status === 429 || error?.message?.toLowerCase().includes('exhausted')) {
        alert("Robeen is experiencing very high traffic right now. Please try again in 10-15 seconds.");
      } else {
        alert("Analysis failed. Please try a different video or try again later.");
      }
    } finally {
      setIsLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 md:pb-20 selection:bg-pink-200 font-sans">
      {/* Navbar (Desktop: Full Nav, Mobile: Brand only) */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 safe-top">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Avatar without background container */}
            <RobeenAvatar size="md" emotion="happy" />
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
              Robeen
            </h1>
          </div>
          
          {/* Desktop Nav Items */}
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => setActiveTab('analyze')}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${activeTab === 'analyze' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Analyzer
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${activeTab === 'chat' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Assistant
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {activeTab === 'analyze' && (
          <div className="space-y-8 md:space-y-12 animate-fade-in">
            <div className="text-center space-y-3 md:space-y-4 mt-2 md:mt-0">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Why is {userProfile?.babyName || 'baby'} crying?</h2>
              <p className="text-sm md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
                Upload a short video. Robeen analyzes facial expressions, cry acoustics, and body movements to tell you why.
              </p>
            </div>

            <VideoInput onVideoSelected={handleAnalysisStart} isLoading={isLoading} />

            {/* Loading State with Quick Tips */}
            {isLoading && (
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="flex flex-col items-center">
                   <RobeenAvatar size="lg" className="animate-pulse mb-4" emotion="listening" />
                   <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse-slow w-1/2"></div>
                   </div>
                   <p className="text-lg font-medium text-slate-700 mt-4">{loadingPhase}</p>
                </div>
                
                {quickTips && (
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl text-left animate-fade-in-up shadow-sm">
                    <h4 className="text-indigo-800 font-bold mb-2 flex items-center gap-2">
                      <Activity size={18} /> While you wait (Quick Tips):
                    </h4>
                    <p className="text-indigo-700 leading-relaxed">{quickTips}</p>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {analysisResult && !isLoading && (
              <AnalysisResults 
                result={analysisResult} 
                audioStreamPromise={audioStreamPromise}
              />
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4 md:space-y-6 h-full md:h-auto">
            <div className="text-center space-y-1 md:block hidden">
              <h2 className="text-3xl font-bold text-slate-800">Ask Robeen</h2>
              <p className="text-slate-500">Evidence-based answers powered by Google Search.</p>
            </div>
            {/* Pass profile to Chat Assistant for personalized context */}
            <ChatAssistant userProfile={userProfile} />
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileScreen 
            onSignOut={() => {
              setIsAuthenticated(false);
              setIsOnboarded(false);
              setHistory([]);
              setViewState('landing');
            }} 
            initialProfile={userProfile}
            userEmail={userEmail}
            history={history}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex justify-around items-center z-50 safe-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-6 pt-3">
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`flex flex-col items-center gap-1.5 transition-colors w-16 ${activeTab === 'analyze' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-300 ${activeTab === 'analyze' ? 'bg-primary/10 translate-y-[-2px]' : ''}`}>
            <Home size={24} strokeWidth={activeTab === 'analyze' ? 2.5 : 2} />
          </div>
          <span className="text-[11px] font-bold tracking-wide">Analyzer</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1.5 transition-colors w-16 ${activeTab === 'chat' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
           <div className={`p-1.5 rounded-xl transition-all duration-300 ${activeTab === 'chat' ? 'bg-primary/10 translate-y-[-2px]' : ''}`}>
            <Sparkles size={24} strokeWidth={activeTab === 'chat' ? 2.5 : 2} />
          </div>
          <span className="text-[11px] font-bold tracking-wide">Assistant</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1.5 transition-colors w-16 ${activeTab === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
           <div className={`p-1.5 rounded-xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-primary/10 translate-y-[-2px]' : ''}`}>
            <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          </div>
          <span className="text-[11px] font-bold tracking-wide">Profile</span>
        </button>
      </div>

      {/* Footer Disclaimer (Desktop Only) */}
      <footer className="py-8 text-center text-slate-400 text-sm hidden md:block">
        <p>© {new Date().getFullYear()} Robeen. Not a medical device.</p>
      </footer>
    </div>
  );
};

export default App;
