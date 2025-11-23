import React, { useState } from 'react';
import { ArrowRight, User, Baby, Calendar, Check, ChevronLeft, Heart } from 'lucide-react';
import RobeenAvatar from './RobeenAvatar';
import { UserProfileData } from '../types';

interface OnboardingFlowProps {
  onComplete: (data: UserProfileData) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserProfileData>({
    parentName: '',
    babyName: '',
    gender: 'boy', // Default
    birthDate: '',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) return data.parentName.trim().length > 0;
    if (step === 2) return data.babyName.trim().length > 0;
    if (step === 3) return true; // Gender has a default
    if (step === 4) return data.birthDate.length > 0;
    return false;
  };

  // Progress calculation
  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-pink-100/50 rounded-full blur-[120px]" />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Navigation Header */}
        <div className="mb-8 flex justify-between items-center h-8">
           {step > 1 ? (
             <button onClick={handleBack} className="text-slate-400 hover:text-slate-600 transition-colors">
               <ChevronLeft size={24} />
             </button>
           ) : (
             <div />
           )}
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step} of 4</span>
           <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/10 border border-slate-100 relative overflow-hidden min-h-[420px] flex flex-col">
            
            {/* Step 1: Parent Name */}
            {step === 1 && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                   <RobeenAvatar size="lg" emotion="happy" />
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Let's get introduced.</h2>
                     <p className="text-slate-500 font-medium">I'm Robeen. What should I call you?</p>
                   </div>
                   
                   <div className="w-full relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                      <input 
                        autoFocus
                        type="text"
                        value={data.parentName}
                        onChange={(e) => setData({ ...data, parentName: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleNext()}
                        placeholder="Your Name"
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none transition-all"
                      />
                   </div>
                </div>
              </div>
            )}

            {/* Step 2: Baby Name */}
            {step === 2 && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-2">
                      <Baby size={48} className="text-pink-400" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Who is the little one?</h2>
                     <p className="text-slate-500 font-medium">So I can personalize my advice.</p>
                   </div>
                   
                   <div className="w-full relative group">
                      <Baby className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                      <input 
                        autoFocus
                        type="text"
                        value={data.babyName}
                        onChange={(e) => setData({ ...data, babyName: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleNext()}
                        placeholder="Baby's Name"
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-pink-500 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none transition-all"
                      />
                   </div>
                </div>
              </div>
            )}

            {/* Step 3: Gender */}
            {step === 3 && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mb-2">
                      <Heart size={48} className="text-sky-400" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Is {data.babyName} a...</h2>
                     <p className="text-slate-500 font-medium">For accurate pronouns.</p>
                   </div>
                   
                   <div className="w-full grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setData({...data, gender: 'boy'})}
                        className={`py-6 rounded-2xl border-2 font-bold text-lg transition-all ${
                          data.gender === 'boy' 
                          ? 'border-sky-500 bg-sky-50 text-sky-600 shadow-md transform scale-[1.02]' 
                          : 'border-slate-100 bg-white text-slate-400 hover:border-sky-200'
                        }`}
                      >
                        Boy
                      </button>
                      <button 
                        onClick={() => setData({...data, gender: 'girl'})}
                        className={`py-6 rounded-2xl border-2 font-bold text-lg transition-all ${
                          data.gender === 'girl' 
                          ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-md transform scale-[1.02]' 
                          : 'border-slate-100 bg-white text-slate-400 hover:border-pink-200'
                        }`}
                      >
                        Girl
                      </button>
                   </div>
                </div>
              </div>
            )}

            {/* Step 4: Birth Date */}
            {step === 4 && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                      <Calendar size={48} className="text-indigo-400" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">When did {data.babyName || 'they'} arrive?</h2>
                     <p className="text-slate-500 font-medium">To help me track developmental milestones.</p>
                   </div>
                   
                   <div className="w-full relative group">
                      <input 
                        type="date"
                        value={data.birthDate}
                        onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl py-4 px-6 text-lg font-bold text-slate-800 outline-none transition-all text-center"
                      />
                   </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8">
              <button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  isStepValid() 
                    ? 'bg-slate-900 text-white shadow-lg hover:bg-slate-800 active:scale-[0.98]' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {step === 4 ? 'Get Started' : 'Continue'} 
                {step === 4 ? <Check size={20} /> : <ArrowRight size={20} />}
              </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
