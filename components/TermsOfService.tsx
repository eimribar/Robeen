import React, { useEffect } from 'react';
import { ArrowLeft, AlertTriangle, FileText, CheckCircle, Scale } from 'lucide-react';
import RobeenAvatar from './RobeenAvatar';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-100">
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
            <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FileText size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Terms of Service</h1>
            <p className="text-lg text-slate-500 font-medium">Last updated: October 26, 2023</p>
        </div>

        {/* MEDICAL DISCLAIMER ALERT */}
        <div className="bg-red-50 p-6 md:p-8 rounded-3xl border border-red-100 mb-16 shadow-sm">
            <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-xl shrink-0">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">IMPORTANT: Medical Disclaimer</h3>
                    <p className="text-red-800/80 font-medium leading-relaxed">
                        Robeen is NOT a medical device. It is an information tool powered by artificial intelligence. 
                        The analysis, advice, and content provided by this application are for informational purposes only 
                        and do not constitute medical advice, diagnosis, or treatment. <br/><br/>
                        <strong>Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.</strong>
                    </p>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none">
            
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using the Robeen application ("Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                <p>
                    Robeen provides AI-powered analysis of audio and video recordings to suggest potential reasons for a baby's cry (e.g., hunger, tiredness) and offers soothing tips.
                </p>
                <p className="font-bold text-slate-700 mt-4">Limitations:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>The AI analysis is probabilistic and may not always be accurate.</li>
                    <li>The Service cannot detect underlying medical issues, injuries, or illnesses.</li>
                    <li>You are solely responsible for the care and safety of your child.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
                <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitation of Liability</h2>
                <p>
                    In no event shall Robeen, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>Your access to or use of or inability to access or use the Service;</li>
                    <li>Any reliance placed by you on the completeness, accuracy or existence of any information found on the Service;</li>
                    <li>Any unauthorized access to or use of our secure servers and/or any and all personal information stored therein.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at <a href="mailto:support@robeen.ai" className="text-indigo-600 font-bold hover:underline">support@robeen.ai</a>.
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

export default TermsOfService;