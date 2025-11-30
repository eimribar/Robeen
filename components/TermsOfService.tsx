import React, { useEffect } from 'react';
import { ArrowLeft, AlertTriangle, FileText, CheckCircle, Scale, Shield, Ban, UserCheck, Gavel, Mail } from 'lucide-react';
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
            <p className="text-lg text-slate-500 font-medium">Effective Date: November 28, 2025</p>
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
                        <strong>THE ROBEEN APP IS NOT A MEDICAL DEVICE AND DOES NOT PROVIDE MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.</strong>
                        <br /><br />
                        The cry analysis feature uses artificial intelligence to suggest possible reasons why your baby may be crying.
                        These suggestions are for informational and educational purposes only.
                        <br /><br />
                        <strong>Always consult a qualified healthcare provider for medical concerns about your baby. Never disregard professional medical advice or delay seeking medical attention because of something suggested by this App. In case of emergency, contact emergency services (911) immediately.</strong>
                    </p>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none">

            {/* Section 1 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p>
                    By downloading, installing, or using the Robeen mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
                </p>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility</h2>
                <p>To use Robeen, you must be:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>At least 18 years of age, OR</li>
                    <li>At least 13 years of age with verifiable parental or guardian consent</li>
                    <li>The parent or legal guardian of any baby whose information you add to the App</li>
                </ul>
                <p>By creating an account, you confirm that you meet these eligibility requirements.</p>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Account Registration</h2>
                <p>When creating an account, you agree to:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information as needed</li>
                    <li>Keep your login credentials secure and confidential</li>
                    <li>Notify us immediately of any unauthorized access to your account</li>
                    <li>Accept responsibility for all activities under your account</li>
                </ul>
                <p>You may not share your account or create multiple accounts.</p>
            </section>

            {/* Section 4 - Medical Disclaimer */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Medical Disclaimer</h2>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">4.1 Not Medical Advice</h3>
                <p>
                    The cry analysis feature uses artificial intelligence to suggest possible reasons why your baby may be crying. These suggestions are for informational and educational purposes only.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">4.2 Consult Healthcare Professionals</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li><strong>Always</strong> consult a qualified healthcare provider for medical concerns about your baby</li>
                    <li><strong>Never</strong> disregard professional medical advice based on information from this App</li>
                    <li><strong>Never</strong> delay seeking medical attention because of something suggested by this App</li>
                    <li>In case of emergency, contact emergency services (911) immediately</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">4.3 Limitations of Analysis</h3>
                <p>The AI-powered cry analysis:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Is based on pattern recognition and general information</li>
                    <li>Is <strong>not</strong> scientifically validated as a medical diagnostic tool</li>
                    <li>May be inaccurate or incorrect</li>
                    <li>Cannot detect medical emergencies, illnesses, or serious conditions</li>
                    <li>Should not be relied upon for health or safety decisions</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">4.4 Assumption of Risk</h3>
                <p>By using the cry analysis feature, you acknowledge and accept that:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>The analysis is provided "as is" without warranties of accuracy</li>
                    <li>You will not make medical or health decisions based solely on App output</li>
                    <li>We are not liable for any harm resulting from reliance on App analysis</li>
                    <li>You are solely responsible for your baby's health and safety decisions</li>
                </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Acceptable Use</h2>
                <p>You agree to use Robeen only for its intended purpose. You agree NOT to:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Upload content depicting anyone other than your own baby or children under your care</li>
                    <li>Share content depicting child abuse, neglect, or harm</li>
                    <li>Use the App for any illegal purpose</li>
                    <li>Attempt to reverse engineer, decompile, or hack the App</li>
                    <li>Interfere with or disrupt the App's servers or networks</li>
                    <li>Create multiple accounts or share account access</li>
                    <li>Use automated systems or bots to access the App</li>
                    <li>Collect data about other users</li>
                    <li>Impersonate another person or entity</li>
                </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. User-Generated Content</h2>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">6.1 Your Content</h3>
                <p>
                    You retain ownership of content you upload (videos, photos, profile information). By uploading content, you grant us a limited, non-exclusive license to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Process content to provide App services (e.g., cry analysis)</li>
                    <li>Store content on our servers</li>
                    <li>Transmit content to third-party AI services for analysis</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">6.2 Content Guidelines</h3>
                <p>All uploaded content must:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Feature only babies or children you have legal authority over</li>
                    <li>Not contain inappropriate, harmful, or illegal content</li>
                    <li>Not violate any third party's rights (copyright, privacy, etc.)</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">6.3 Content Removal</h3>
                <p>We reserve the right to remove any content that violates these Terms without prior notice.</p>
            </section>

            {/* Section 7 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>The App and its original content (excluding user content) are owned by Robeen and protected by copyright, trademark, and other intellectual property laws</li>
                    <li>Our name, logo, and branding may not be used without prior written permission</li>
                    <li>You may not copy, modify, distribute, sell, or lease any part of the App</li>
                </ul>
            </section>

            {/* Section 8 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Privacy</h2>
                <p>
                    Your use of the App is also governed by our Privacy Policy, available at <a href="/privacy" className="text-indigo-600 font-bold hover:underline">robeen.ai/privacy</a>. By using the App, you consent to the practices described in the Privacy Policy.
                </p>
            </section>

            {/* Section 9 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Account Termination</h2>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">9.1 Termination by You</h3>
                <p>You may delete your account at any time:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li><strong>In-App:</strong> Settings &gt; Account &gt; Delete Account</li>
                    <li><strong>Email:</strong> Contact <a href="mailto:support@robeen.ai" className="text-indigo-600 font-bold hover:underline">support@robeen.ai</a></li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">9.2 Termination by Us</h3>
                <p>We may suspend or terminate your account without notice for:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Violation of these Terms</li>
                    <li>Fraudulent, illegal, or harmful activity</li>
                    <li>Extended period of inactivity (with prior notice)</li>
                    <li>Any reason at our discretion</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">9.3 Effect of Termination</h3>
                <p>Upon termination:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Your license to use the App ends immediately</li>
                    <li>Your data will be deleted in accordance with our Privacy Policy</li>
                    <li>Provisions that should survive termination will remain in effect (including Disclaimers, Limitation of Liability, and Indemnification)</li>
                </ul>
            </section>

            {/* Section 10 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Disclaimers</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 not-prose">
                    <p className="text-slate-700 font-medium uppercase text-sm">
                        THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                    </p>
                    <p className="text-slate-600 mt-4 text-sm">WE SPECIFICALLY DISCLAIM ANY WARRANTIES OF:</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        <li>• MERCHANTABILITY</li>
                        <li>• FITNESS FOR A PARTICULAR PURPOSE</li>
                        <li>• NON-INFRINGEMENT</li>
                        <li>• ACCURACY OR RELIABILITY OF CONTENT</li>
                        <li>• UNINTERRUPTED OR ERROR-FREE OPERATION</li>
                    </ul>
                </div>
            </section>

            {/* Section 11 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Limitation of Liability</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 not-prose">
                    <p className="text-slate-700 font-medium uppercase text-sm">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        <li>• We shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                        <li>• We shall not be liable for any loss of profits, data, use, or goodwill</li>
                        <li>• We shall not be liable for any damages arising from your reliance on App analysis or suggestions</li>
                        <li>• Our total liability shall not exceed the amount you paid us in the past 12 months (or $100 if you have not paid anything)</li>
                    </ul>
                    <p className="text-slate-500 mt-4 text-xs italic">Some jurisdictions do not allow certain limitations, so some of these may not apply to you.</p>
                </div>
            </section>

            {/* Section 12 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Indemnification</h2>
                <p>
                    You agree to indemnify, defend, and hold harmless Robeen and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Your use of the App</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third party's rights</li>
                    <li>Content you upload or share through the App</li>
                </ul>
            </section>

            {/* Section 13 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Dispute Resolution</h2>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">13.1 Informal Resolution</h3>
                <p>
                    Before filing any formal dispute, you agree to contact us at <a href="mailto:legal@robeen.ai" className="text-indigo-600 font-bold hover:underline">legal@robeen.ai</a> to attempt to resolve the issue informally.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">13.2 Governing Law</h3>
                <p>
                    These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law provisions.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">13.3 Jurisdiction</h3>
                <p>
                    Any disputes not resolved informally shall be resolved in the state or federal courts located in Delaware, and you consent to personal jurisdiction in these courts.
                </p>
            </section>

            {/* Section 14 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Changes to Terms</h2>
                <p>We may modify these Terms at any time. We will provide notice of material changes by:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-pink-500">
                    <li>Posting updated Terms in the App</li>
                    <li>Updating the "Effective Date" above</li>
                    <li>Sending notification for significant changes</li>
                </ul>
                <p>
                    Your continued use of the App after changes constitutes acceptance. If you do not agree to updated Terms, you must stop using the App and delete your account.
                </p>
            </section>

            {/* Section 15 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">15. General Provisions</h2>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">15.1 Entire Agreement</h3>
                <p>
                    These Terms, together with the Privacy Policy, constitute the entire agreement between you and Robeen regarding the App.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">15.2 Severability</h3>
                <p>
                    If any provision of these Terms is found unenforceable, the remaining provisions will remain in full effect.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">15.3 Waiver</h3>
                <p>
                    Our failure to enforce any provision does not waive our right to enforce it later.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">15.4 Assignment</h3>
                <p>
                    You may not assign your rights under these Terms. We may assign our rights without restriction.
                </p>
            </section>

            {/* Section 16 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Contact Information</h2>
                <p>For questions about these Terms:</p>
                <ul className="list-none space-y-2 text-slate-600">
                    <li><strong>Email:</strong> <a href="mailto:legal@robeen.ai" className="text-indigo-600 font-bold hover:underline">legal@robeen.ai</a></li>
                    <li><strong>Support:</strong> <a href="mailto:support@robeen.ai" className="text-indigo-600 font-bold hover:underline">support@robeen.ai</a></li>
                </ul>
            </section>

            <hr className="my-12 border-slate-200" />

            <p className="text-slate-500 italic text-center">
                These Terms of Service are effective as of November 28, 2025.
            </p>

        </div>
      </main>

       <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Robeen AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsOfService;
