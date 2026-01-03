// src/pages/Contact.tsx
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
    PiArrowLeftBold,
    PiMagicWandDuotone,
    PiEnvelopeDuotone,
    PiGithubLogoDuotone,
    PiLinkedinLogoDuotone,
    PiTwitterLogoDuotone,
    PiCheckCircleFill
} from "react-icons/pi";
import { Button } from "../components/ui/Button";

const Contact: React.FC = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this to a backend
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
                <div className="bg-blur-blob w-[500px] h-[500px] bg-emerald-100/40 -top-20 -left-20" />
                <div className="bg-blur-blob w-[400px] h-[400px] bg-blue-100/40 bottom-20 -right-20" />
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
                    className="space-y-12"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                            <PiEnvelopeDuotone className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
                        <p className="text-xl text-slate-500 max-w-lg mx-auto">
                            Have questions, feedback, or suggestions? We'd love to hear from you!
                        </p>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-100/50 border border-slate-100">
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <PiCheckCircleFill className="w-16 h-16 text-primary mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                                <p className="text-slate-500">
                                    We've received your message and will get back to you soon.
                                </p>
                                <Button
                                    variant="secondary"
                                    className="mt-6"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Send Another Message
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Subject
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="feedback">General Feedback</option>
                                        <option value="bug">Report a Bug</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="partnership">Partnership Inquiry</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>
                                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-dark">
                                    Send Message
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Connect With Us</h3>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://github.com/nsridatta"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <PiGithubLogoDuotone className="w-6 h-6 text-slate-700" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                                <PiLinkedinLogoDuotone className="w-6 h-6 text-blue-600" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 transition-colors"
                            >
                                <PiTwitterLogoDuotone className="w-6 h-6 text-sky-500" />
                            </a>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-slate-50 rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl p-6">
                                <h4 className="font-semibold text-slate-900 mb-2">Is JobFit AI really free?</h4>
                                <p className="text-slate-500 text-sm">Yes! JobFit AI is completely free to use with no hidden costs or premium tiers.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6">
                                <h4 className="font-semibold text-slate-900 mb-2">Do you store my resume?</h4>
                                <p className="text-slate-500 text-sm">No, we process your resume in real-time and immediately discard it. Your data is never stored.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6">
                                <h4 className="font-semibold text-slate-900 mb-2">How accurate is the analysis?</h4>
                                <p className="text-slate-500 text-sm">Our AI provides helpful suggestions, but we recommend using it as one of many tools in your job search toolkit.</p>
                            </div>
                        </div>
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

export default Contact;
