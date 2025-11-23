import React, { useState, useEffect } from 'react';
import { Camera, User, Calendar, Ruler, Mail, Bell, Moon, LogOut, ChevronRight, Edit2, Save, X, Sparkles, Settings, History, BrainCircuit, Utensils, AlertCircle, Baby, Activity, Heart } from 'lucide-react';
import { UserProfileData, HistoryItem } from '../types';

interface ProfileScreenProps {
  onSignOut: () => void;
  initialProfile?: UserProfileData;
  userEmail: string;
  history: HistoryItem[];
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onSignOut, initialProfile, userEmail, history }) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'insights' | 'settings'>('journal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'prefer_not_to_say'>('prefer_not_to_say');
  const [parentName, setParentName] = useState('');
  const [weight, setWeight] = useState('');

  // Settings State
  const [notifications, setNotifications] = useState(true);
  const [useMetric, setUseMetric] = useState(true);

  useEffect(() => {
    if (initialProfile) {
      setBabyName(initialProfile.babyName);
      setBirthDate(initialProfile.birthDate);
      setParentName(initialProfile.parentName);
      setGender(initialProfile.gender);
    }
  }, [initialProfile]);

  // --- Dynamic Helpers ---

  // Generate Insights based on real history
  const generateInsights = () => {
    if (history.length === 0) return [];

    const insights = [];
    
    // 1. Frequency Analysis
    const counts: Record<string, number> = {};
    history.forEach(h => {
        const key = h.primaryReason;
        counts[key] = (counts[key] || 0) + 1;
    });

    const topReason = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '');
    
    if (topReason) {
        insights.push({
            id: 'pattern-1',
            title: 'Recurring Pattern',
            description: `${babyName || 'The baby'} seems to be struggling mostly with ${topReason} (${counts[topReason]} times detected recently).`,
            type: 'pattern'
        });
    }

    // 2. Latest Action (if available)
    const latest = history[0];
    if (latest && latest.actionableSteps.length > 0) {
        insights.push({
            id: 'action-1',
            title: 'Recent Strategy',
            description: `For the last ${latest.primaryReason} episode, the suggested method was: "${latest.actionableSteps[0]}".`,
            type: 'success'
        });
    }

    // 3. General Advice based on age (if no history or just filler)
    if (insights.length < 2) {
         insights.push({ 
            id: 'general-1', 
            title: 'Development Tracking', 
            description: `As ${babyName} grows, crying patterns will change. Keep logging to see accurate trends here.`,
            type: 'prediction'
        });
    }

    return insights;
  };

  const insights = generateInsights();

  // Helper to map reasons to icons
  const getIconForReason = (reason: string) => {
    const r = reason.toLowerCase();
    if (r.includes('hunger')) return { icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' };
    if (r.includes('tired') || r.includes('sleep')) return { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' };
    if (r.includes('pain') || r.includes('gas')) return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' };
    if (r.includes('overstim')) return { icon: Activity, color: 'text-pink-500', bg: 'bg-pink-50' };
    return { icon: Baby, color: 'text-slate-500', bg: 'bg-slate-50' };
  };

  // Helper for relative time
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  // Helper to calculate age roughly
  const getAgeString = (dateString: string) => {
    if (!dateString) return '--';
    const birth = new Date(dateString);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months < 0) months = 0;
    
    if (months < 1) return 'Newborn';
    if (months < 12) return `${months} Months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years}y ${remainingMonths}m`;
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in pb-24 md:pb-10">
      
      {/* --- HEADER CARD --- */}
      <div className="relative bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        {/* Decor Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
           <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="relative px-6 pt-16 pb-8 flex flex-col items-center text-center">
          
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-indigo-50 flex items-center justify-center overflow-hidden relative z-10">
               <User className="w-12 h-12 text-indigo-200" /> 
            </div>
          </div>

          {/* Name & Age */}
          <div className="mt-4 space-y-2 flex flex-col items-center w-full">
             {isEditing ? (
               <input 
                 value={babyName}
                 onChange={(e) => setBabyName(e.target.value)}
                 className="text-2xl font-bold text-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1 focus:ring-2 focus:ring-primary focus:outline-none w-full max-w-[200px]"
                 placeholder="Baby Name"
               />
             ) : (
               <h2 className="text-3xl font-black text-slate-800 tracking-tight">{babyName || 'Baby'}</h2>
             )}
             
             {birthDate && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 shadow-sm">
                  <Sparkles size={12} /> {getAgeString(birthDate)} Old
                </div>
             )}
          </div>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="px-6 pb-2">
            <div className="flex p-1 bg-slate-100 rounded-2xl relative">
                <button 
                    onClick={() => setActiveTab('journal')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'journal' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <History size={16} /> Journal
                </button>
                <button 
                    onClick={() => setActiveTab('insights')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'insights' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <BrainCircuit size={16} /> Insights
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'settings' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Settings size={16} /> Settings
                </button>
            </div>
        </div>
      </div>

      {/* --- TAB CONTENT --- */}
      
      {/* 1. JOURNAL TAB */}
      {activeTab === 'journal' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <History size={14}/> Recent Analysis
                </h3>
            </div>

            {history.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <History size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 text-lg">No entries yet</h4>
                        <p className="text-slate-400 text-sm max-w-[200px] mx-auto">Upload a video in the Analyzer tab to start building your journal.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((item) => {
                        const style = getIconForReason(item.primaryReason);
                        return (
                            <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className={`w-12 h-12 rounded-2xl ${style.bg} ${style.color} flex items-center justify-center flex-shrink-0`}>
                                    <style.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-800">{item.primaryReason}</h4>
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{getTimeAgo(item.date)}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-current opacity-50" style={{ width: `${item.confidenceScore}%`, color: 'inherit' }} />
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-slate-400 font-medium">Confidence match</span>
                                        <span className="text-xs font-bold text-slate-600">{item.confidenceScore}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
          </div>
      )}

      {/* 2. INSIGHTS TAB */}
      {activeTab === 'insights' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14}/> Recommendations for {babyName || 'Baby'}
                </h3>
            </div>
            
            {history.length === 0 ? (
                 <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <BrainCircuit size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 text-lg">Gathering data...</h4>
                        <p className="text-slate-400 text-sm max-w-[200px] mx-auto">Robeen needs a few analyses to start spotting patterns and trends.</p>
                    </div>
                </div>
            ) : (
                insights.map((insight) => (
                    <div key={insight.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-pink-500" />
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center flex-shrink-0 border border-white shadow-sm">
                                <BrainCircuit size={18} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-lg mb-2">{insight.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{insight.description}</p>
                            </div>
                        </div>
                        {/* Background blob */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-indigo-50/50 transition-colors" />
                    </div>
                ))
            )}
          </div>
      )}

      {/* 3. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-fade-in-up">
            
            {/* Edit Toggle Header */}
            <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User size={14}/> Baby Details
            </h3>
            <button 
                onClick={toggleEdit}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                isEditing 
                    ? 'bg-slate-900 text-white shadow-lg hover:bg-slate-800' 
                    : 'bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50'
                }`}
            >
                {isEditing ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
            </button>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
            
            {/* Birth Date */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} />
                </div>
                <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Birthday</label>
                {isEditing ? (
                    <input 
                    type="date" 
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                    />
                ) : (
                    <p className="text-slate-800 font-bold text-lg">
                        {birthDate ? new Date(birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '--'}
                    </p>
                )}
                </div>
            </div>

            <div className="w-full h-px bg-slate-100" />
            
            {/* Gender */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0">
                <Heart size={20} />
                </div>
                <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Gender</label>
                {isEditing ? (
                   <select 
                     value={gender}
                     onChange={(e) => setGender(e.target.value as any)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                   >
                     <option value="boy">Boy</option>
                     <option value="girl">Girl</option>
                     <option value="prefer_not_to_say">Prefer not to say</option>
                   </select>
                ) : (
                    <p className="text-slate-800 font-bold text-lg capitalize">{gender.replace(/_/g, ' ')}</p>
                )}
                </div>
            </div>

            <div className="w-full h-px bg-slate-100" />

            {/* Weight */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0">
                <Ruler size={20} />
                </div>
                <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Weight</label>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input 
                        type="number" 
                        value={weight}
                        placeholder="--"
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        />
                        <span className="text-sm font-medium text-slate-500">{useMetric ? 'kg' : 'lbs'}</span>
                    </div>
                ) : (
                    <p className="text-slate-800 font-bold text-lg">{weight || '--'} <span className="text-sm text-slate-400 font-medium">{useMetric ? 'kg' : 'lbs'}</span></p>
                )}
                </div>
            </div>
            </div>

            {/* Account & Preferences */}
            <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-2">
                    <Settings size={14}/> Preferences
                </h3>
                
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    {/* Account Info */}
                    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {parentName ? parentName.charAt(0) : <User size={16}/>}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{parentName || 'Parent'}</p>
                        <p className="text-xs text-slate-500">{userEmail}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                    </div>

                    {/* Notifications Toggle */}
                    <div className="p-4 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                            <Bell size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Notifications</span>
                    </div>
                    <button 
                        onClick={() => setNotifications(!notifications)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${notifications ? 'left-6' : 'left-1'}`} />
                    </button>
                    </div>

                    {/* Units Toggle */}
                    <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                            <Ruler size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Use Metric Units</span>
                    </div>
                    <button 
                        onClick={() => setUseMetric(!useMetric)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${useMetric ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${useMetric ? 'left-6' : 'left-1'}`} />
                    </button>
                    </div>
                </div>
            </div>

            {/* --- SIGN OUT --- */}
            <button 
                onClick={onSignOut}
                className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2 mt-4"
            >
                <LogOut size={18} /> Sign Out
            </button>
        </div>
      )}

    </div>
  );
};

export default ProfileScreen;
