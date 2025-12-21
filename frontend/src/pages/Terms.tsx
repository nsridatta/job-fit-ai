// src/pages/Terms.tsx
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router";
import { PiArrowLeftBold, PiMagicWandDuotone, PiScalesDuotone } from "react-icons/pi";
import { Button } from "../components/ui/Button";

const Terms: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
                <div className="bg-blur-blob w-[500px] h-[500px] bg-violet-100/40 -top-20 -right-20" />
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <PiArrowLeftBold className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <PiMagicWandDuotone className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">JobFit AI</span>
                        </div>
                    </div>
                    <Button size="sm" onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary-dark">
                        Try Free Analyzer
                    </Button>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-2xl mb-4">
                            <PiScalesDuotone className="w-8 h-8 text-violet-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
                        <p className="text-slate-500">Last updated: December 22, 2025</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing and using JobFit AI ("the Service"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use the Service.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
                        <p className="text-slate-600 leading-relaxed">
                            JobFit AI is a free, AI-powered resume analysis tool that helps users optimize their resumes
                            for job applications. The Service analyzes uploaded resumes against job descriptions and
                            provides suggestions for improvement.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Free Service</h2>
                        <p className="text-slate-600 leading-relaxed">
                            JobFit AI is provided free of charge. We reserve the right to introduce premium features
                            in the future, but the core analysis functionality will remain free.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. User Responsibilities</h2>
                        <ul className="text-slate-600 space-y-2">
                            <li>You must only upload resumes and content that you have the right to use</li>
                            <li>You must not use the Service for any illegal or unauthorized purpose</li>
                            <li>You must not attempt to disrupt or compromise the Service's security</li>
                            <li>You are responsible for the accuracy of the information you provide</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Disclaimer of Warranties</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The Service is provided "as is" without warranties of any kind. We do not guarantee that:
                        </p>
                        <ul className="text-slate-600 space-y-2">
                            <li>The Service will meet your specific requirements</li>
                            <li>The analysis results will lead to job offers or interviews</li>
                            <li>The Service will be uninterrupted or error-free</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            JobFit AI shall not be liable for any indirect, incidental, special, consequential, or
                            punitive damages resulting from your use of or inability to use the Service.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            You retain all rights to your resume content. By using the Service, you grant us a
                            temporary license to process your content solely for the purpose of providing the analysis.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Changes to Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. Continued use of the Service
                            after changes constitutes acceptance of the new terms.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Contact</h2>
                        <p className="text-slate-600 leading-relaxed">
                            For questions about these terms, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-slate-50/50 py-8 px-6">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <PiMagicWandDuotone className="text-primary w-5 h-5" />
                        <span className="text-lg font-bold text-slate-900">JobFit AI</span>
                    </div>
                    <p className="text-xs text-slate-400">© 2025 JobFit AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Terms;
