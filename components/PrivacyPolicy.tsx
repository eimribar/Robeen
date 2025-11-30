import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server, Database, Globe, Bell, Mail, Trash2 } from 'lucide-react';
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
            <p className="text-lg text-slate-500 font-medium">Last Updated: November 28, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none">

            {/* Section 1 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                <p>
                    Robeen ("we," "our," or "us") operates the Robeen mobile application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App.
                </p>
                <p>
                    By using Robeen, you agree to the collection and use of information in accordance with this policy.
                </p>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">2.1 Information You Provide Directly</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Account Information:</strong> Email address, password (stored securely as a hash), and display name</li>
                    <li><strong>Baby Profile Data:</strong> Your baby's name, gender, and birth date</li>
                    <li><strong>Profile Pictures:</strong> Photos you upload for your baby's profile</li>
                    <li><strong>Video/Audio Content:</strong> Recordings of your baby crying that you submit for analysis</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Device Information:</strong> Device type, operating system version, and unique device identifiers</li>
                    <li><strong>Usage Data:</strong> How you interact with the App, features used, and timestamps</li>
                    <li><strong>Crash Reports:</strong> Technical information when the App encounters errors</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">2.3 Information from Third Parties</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Sign in with Apple:</strong> If you choose to sign in with Apple, we receive your Apple ID identifier and, if you choose to share it, your email address</li>
                </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Provide Cry Analysis:</strong> Process your baby's crying audio/video using AI technology to provide insights</li>
                    <li><strong>Maintain Your Account:</strong> Authenticate you and manage your profile and preferences</li>
                    <li><strong>Improve the App:</strong> Analyze usage patterns to enhance features and fix issues</li>
                    <li><strong>Communicate:</strong> Send important updates about your account or the service</li>
                    <li><strong>Ensure Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                </ul>
            </section>

            {/* Section 4 - AI Processing */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. AI Processing Disclosure</h2>
                <p>
                    Your baby's crying audio/video is processed by Google Gemini AI to provide cry analysis. This processing:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 not-prose">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <Server className="w-8 h-8 text-indigo-500 mb-3" />
                        <h4 className="font-bold text-slate-800 mb-2">Real-Time Processing</h4>
                        <p className="text-sm text-slate-500">Occurs in real-time when you submit a recording and is used solely for providing the cry analysis feature.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <Eye className="w-8 h-8 text-pink-500 mb-3" />
                        <h4 className="font-bold text-slate-800 mb-2">Not Used for Training</h4>
                        <p className="text-sm text-slate-500">Your data is not used by us to train AI models. May involve transmission to Google's servers for analysis only.</p>
                    </div>
                </div>
                <p className="text-slate-600 italic">
                    The AI analysis provides suggestions only and should not be considered medical advice.
                </p>
            </section>

            {/* Section 5 - Third Party Services */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Sharing and Third-Party Services</h2>
                <p>We use the following third-party services to operate the App:</p>

                <div className="overflow-x-auto my-6 not-prose">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left p-3 font-bold text-slate-700 rounded-tl-xl">Service</th>
                                <th className="text-left p-3 font-bold text-slate-700">Purpose</th>
                                <th className="text-left p-3 font-bold text-slate-700 rounded-tr-xl">Data Shared</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="p-3 text-slate-600">Supabase</td>
                                <td className="p-3 text-slate-600">Database and storage</td>
                                <td className="p-3 text-slate-600">Account data, baby profiles, analysis history</td>
                            </tr>
                            <tr>
                                <td className="p-3 text-slate-600">Google Gemini</td>
                                <td className="p-3 text-slate-600">AI-powered cry analysis</td>
                                <td className="p-3 text-slate-600">Video/audio content for analysis</td>
                            </tr>
                            <tr>
                                <td className="p-3 text-slate-600">Vercel</td>
                                <td className="p-3 text-slate-600">Backend hosting</td>
                                <td className="p-3 text-slate-600">API request logs</td>
                            </tr>
                            <tr>
                                <td className="p-3 text-slate-600">Apple</td>
                                <td className="p-3 text-slate-600">Authentication</td>
                                <td className="p-3 text-slate-600">Apple ID identifier (if using Sign in with Apple)</td>
                            </tr>
                            <tr>
                                <td className="p-3 text-slate-600">Sentry</td>
                                <td className="p-3 text-slate-600">Error monitoring</td>
                                <td className="p-3 text-slate-600">Crash reports, error logs (no personal data)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 not-prose">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="text-indigo-600" size={20} />
                        <span className="font-bold text-indigo-900">We do not sell your personal information to third parties.</span>
                    </div>
                </div>
            </section>

            {/* Section 6 - Data Retention */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Account Data:</strong> Retained until you delete your account</li>
                    <li><strong>Baby Profiles:</strong> Retained until deleted by you or account deletion</li>
                    <li><strong>Analysis History:</strong> Retained until deleted by you or account deletion</li>
                    <li><strong>Video/Audio:</strong> Processed in real-time; not permanently stored on our servers</li>
                    <li><strong>Crash Reports:</strong> Retained for 90 days for debugging purposes</li>
                </ul>
            </section>

            {/* Section 7 - Data Security */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Security</h2>
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Encryption in Transit:</strong> All data is transmitted using TLS 1.2 or higher</li>
                    <li><strong>Encryption at Rest:</strong> Data stored in our database is encrypted</li>
                    <li><strong>Secure Authentication:</strong> Passwords are hashed using bcrypt; tokens use JWT with secure rotation</li>
                    <li><strong>Access Controls:</strong> Only authorized personnel can access user data for support purposes</li>
                </ul>
            </section>

            {/* Section 8 - Your Rights */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Your Rights</h2>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">All Users Can:</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>Access:</strong> View your personal data through the App</li>
                    <li><strong>Correct:</strong> Update inaccurate information in your profile</li>
                    <li><strong>Delete:</strong> Delete your account and all associated data</li>
                    <li><strong>Export:</strong> Request a copy of your data</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Additional Rights for EU Residents (GDPR):</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li>Right to data portability</li>
                    <li>Right to restrict processing</li>
                    <li>Right to object to processing</li>
                    <li>Right to lodge a complaint with a supervisory authority</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Additional Rights for California Residents (CCPA):</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li>Right to know what personal information is collected</li>
                    <li>Right to know if personal information is sold or disclosed (we do not sell data)</li>
                    <li>Right to opt-out of sale of personal information</li>
                    <li>Right to non-discrimination for exercising CCPA rights</li>
                </ul>
            </section>

            {/* Section 9 - Children's Privacy */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
                <p>
                    Robeen is designed for parents and caregivers to use regarding their babies. We do not knowingly collect information directly from children under 13.
                </p>
                <p>
                    The baby profile information (name, gender, birth date) is provided by and controlled by the parent or guardian. Parents can:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li>Review their baby's profile information at any time</li>
                    <li>Delete baby profiles through the App</li>
                    <li>Request complete data deletion by deleting their account</li>
                </ul>
            </section>

            {/* Section 10 - International Data Transfers */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">10. International Data Transfers</h2>
                <p>
                    Your data may be transferred to and processed in countries other than your country of residence, including the United States. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
                </p>
            </section>

            {/* Section 11 - Changes */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of material changes by:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li>Posting the new Privacy Policy in the App</li>
                    <li>Updating the "Last Updated" date above</li>
                    <li>Sending an email to your registered address for significant changes</li>
                </ul>
                <p>
                    Your continued use of the App after changes constitutes acceptance of the updated policy.
                </p>
            </section>

            {/* Section 12 - Contact */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
                <p>For privacy-related inquiries or to exercise your rights:</p>
                <ul className="list-none space-y-2 text-slate-600">
                    <li><strong>Email:</strong> <a href="mailto:privacy@robeen.ai" className="text-indigo-600 font-bold hover:underline">privacy@robeen.ai</a></li>
                    <li><strong>Support:</strong> <a href="mailto:support@robeen.ai" className="text-indigo-600 font-bold hover:underline">support@robeen.ai</a></li>
                </ul>
                <p className="mt-4">For data deletion requests:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-500">
                    <li><strong>In-App:</strong> Settings &gt; Account &gt; Delete Account</li>
                    <li><strong>Email:</strong> <a href="mailto:privacy@robeen.ai" className="text-indigo-600 font-bold hover:underline">privacy@robeen.ai</a> with subject "Data Deletion Request"</li>
                </ul>
            </section>

            <hr className="my-12 border-slate-200" />

            <p className="text-slate-500 italic text-center">
                This Privacy Policy is effective as of November 28, 2025.
            </p>

        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Robeen AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
