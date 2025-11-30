import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Apple } from 'lucide-react';
import RobeenAvatar from './RobeenAvatar';

interface AuthScreenProps {
  onAuthenticated: (email: string) => void;
  initialMode?: 'signin' | 'signup';
  onBack?: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated, initialMode = 'signin', onBack }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Allow updating mode if prop changes (though usually component remounts)
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated(email);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate an email for social login users
      onAuthenticated(`user@${provider.toLowerCase()}.com`);
    }, 1500);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 relative flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-indigo-200/30 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-pink-200/30 rounded-full blur-[100px]" />
      </div>

      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 z-20 text-slate-400 hover:text-slate-600 font-bold text-sm"
        >
          ← Back
        </button>
      )}

      <div className="w-full max-w-md z-10 flex flex-col items-center animate-fade-in-up">
        
        {/* Brand Hero */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-indigo-100 mb-6 border border-white/50 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-[2rem] opacity-50" />
            <RobeenAvatar size="xl" emotion="happy" className="relative z-10 animate-pulse-slow" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Join Robeen'}
          </h1>
          <p className="text-slate-500 text-lg max-w-[280px] leading-relaxed">
            Your AI parenting companion for sleepless nights.
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/5 border border-white">
          <form onSubmit={handleAuth} className="space-y-5">
            
            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                type="button" 
                onClick={() => handleSocialLogin('Apple')}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <Apple size={20} fill="currentColor" /> Apple
              </button>
              <button 
                type="button" 
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                 {/* Simple Google Icon Mock */}
                 <div className="w-5 h-5 relative">
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-full h-full" />
                 </div>
                 Google
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
               <span className="relative bg-white/0 px-3 text-xs font-medium text-slate-400 uppercase backdrop-blur-xl">Or with email</span>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="group relative transition-all focus-within:scale-[1.02]">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="group relative transition-all focus-within:scale-[1.02]">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Main Action */}
            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Toggle Mode */}
        <p className="mt-8 text-center text-slate-500 font-medium">
          {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={toggleMode}
            className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors ml-1"
          >
            {mode === 'signin' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
