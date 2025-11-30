import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server, UserCheck } from 'lucide-react';
import RobeenAvatar from './RobeenAvatar';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RobeenAvatar size="sm" />
            <span className="font-bold text-lg tracking-tight">Robeen</span>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-full"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* Title Section */}
        <div className="mb-16 text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Shield size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Privacy Policy</h1>
            <p className="text-lg text-slate-500 font-medium">Last updated: October 26, 2023</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none">
            
            <p className="lead text-xl text-slate-600 font-medium leading-relaxed mb-12">
                At Robeen, we understand that nothing is more important than the privacy and safety of your family. 
                This Privacy Policy outlines how we collect, use, and protect your data when you use our AI parenting assistant.
            </p>

            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 mb-12 not-prose">
                <h3 className="flex items-center gap-3 text-xl font-bold text-indigo-900 mb-4">
                    <Lock className="text-indigo-600" /> Key Privacy Commitments
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-indigo-800 font-medium text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
                        We do not sell your personal data or your baby's data to third parties.
                    </li>
                    <li className="flex gap-3 text-indigo-800 font-medium text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
                        Video and audio data is processed for analysis and is not permanently stored on our servers without your explicit consent.
                    </li>
                    <li className="flex gap-3 text-indigo-800 font-medium text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
                        You have full control to delete your history and account data at any time.
                    </li>
                </ul>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                <p>We collect information to provide you with accurate cry analysis and parenting advice.</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Account Information:</strong> Name, email address, and password.</li>
                    <li><strong>Child Profile:</strong> Name (optional), birth date (for developmental context), and gender.</li>
                    <li><strong>Media Data:</strong> Video and audio recordings you upload or stream for analysis.</li>
                    <li><strong>Usage Data:</strong> How you interact with the app, features used, and crash logs.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use AI & Media</h2>
                <p>
                    Robeen uses advanced Artificial Intelligence (including Google Gemini models) to analyze the visual and auditory cues in your recordings.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 not-prose">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <Server className="w-8 h-8 text-indigo-500 mb-3" />
                        <h4 className="font-bold text-slate-800 mb-2">Processing</h4>
                        <p className="text-sm text-slate-500">Media is securely transmitted to our AI processors solely for the purpose of generating the analysis result.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <Eye className="w-8 h-8 text-pink-500 mb-3" />
                        <h4 className="font-bold text-slate-800 mb-2">No Human Review</h4>
                        <p className="text-sm text-slate-500">Your private videos are processed automatically by algorithms. No human team members view your content.</p>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Security</h2>
                <p>
                    We implement industry-standard security measures, including encryption in transit (TLS/SSL) and at rest, to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li>Access the personal data we hold about you.</li>
                    <li>Request the correction of inaccurate data.</li>
                    <li>Request the deletion of your account and all associated data ("Right to be Forgotten").</li>
                    <li>Opt-out of marketing communications.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Children's Privacy</h2>
                <p>
                    While our service analyzes data related to babies, our Service is intended for use by parents and legal guardians over the age of 18. We do not knowingly collect personal information directly from children without parental consent.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:
                    <br/>
                    <a href="mailto:privacy@robeen.ai" className="text-indigo-600 font-bold hover:underline">privacy@robeen.ai</a>
                </p>
            </section>

        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Robeen AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;