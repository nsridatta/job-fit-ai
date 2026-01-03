// src/pages/Privacy.tsx
import { motion } from "framer-motion";
import React from "react";
import { useNavigate, Link } from "react-router";
import { PiArrowLeftBold, PiMagicWandDuotone, PiShieldCheckDuotone } from "react-icons/pi";
import { Button } from "../components/ui/Button";

const Privacy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
                <div className="bg-blur-blob w-[500px] h-[500px] bg-blue-100/40 -top-20 -left-20" />
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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                            <PiShieldCheckDuotone className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
                        <p className="text-slate-500">Last updated: December 22, 2025</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none">
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
                            <p className="text-lg font-semibold text-slate-900 mb-2">🔒 TL;DR: We don't store your data.</p>
                            <p className="text-slate-600 m-0">
                                Your resume and job descriptions are processed in real-time and immediately discarded.
                                We never store, sell, or share your personal information.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Information We Collect</h2>
                        <p className="text-slate-600 leading-relaxed">
                            When you use JobFit AI, you may provide:
                        </p>
                        <ul className="text-slate-600 space-y-2">
                            <li><strong>Resume files:</strong> PDF or Word documents you upload for analysis</li>
                            <li><strong>Job descriptions:</strong> Text you paste for comparison</li>
                            <li><strong>Usage data:</strong> Anonymous analytics about how you use our service</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How We Use Your Information</h2>
                        <ul className="text-slate-600 space-y-2">
                            <li>To analyze your resume against the job description you provide</li>
                            <li>To generate personalized improvement suggestions</li>
                            <li>To improve our AI algorithms and user experience</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Data Retention</h2>
                        <p className="text-slate-600 leading-relaxed">
                            <strong>We do not store your resume or personal data.</strong> All uploaded files and pasted text
                            are processed in memory and discarded immediately after your analysis is complete.
                            We do not retain copies of your documents.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Third-Party Services</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We use AI language models to analyze resumes. Your data is sent to these services
                            for processing but is not stored by them beyond the immediate request.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cookies</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We use minimal cookies for essential functionality and anonymous analytics.
                            We do not use tracking cookies or share data with advertisers.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Since we don't store your personal data, there's nothing to delete.
                            If you have questions about your privacy, please contact us.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            For privacy-related inquiries, please visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
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
                    <p className="text-xs text-slate-400">© 2026 JobFit AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Privacy;
