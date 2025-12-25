import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
    PiArrowLeftBold,
    PiMagicWandDuotone,
    PiCheckCircleFill,
    PiDownloadSimpleBold,
    PiSparkleBold,
    PiInfoBold,
    PiInfoFill,
    PiMagicWandFill
} from "react-icons/pi";
import { Button } from "../components/ui/Button";
import { generateOptimizedDocx } from "../utils/docxGenerator";

interface SectionData {
    score: number;
    suggestion: string;
    original: string;
    updated: string;
}

interface ResultsData {
    sections: { [key: string]: SectionData };
    overallSuggestion: string;
    jobMatchScore: number;
    missingKeywords: string[];
    templateVerdict: string;
}

const OptimizationHub: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state as ResultsData;

    const [isGenerating, setIsGenerating] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: ""
    });
    const [editedContent, setEditedContent] = useState<{ [key: string]: string }>({});

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center space-y-4">
                    <PiInfoBold className="w-16 h-16 text-blue-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900">Analysis Required</h2>
                    <p className="text-slate-500">Please analyze your resume first to use the Optimizer Hub.</p>
                    <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    // Initialize edited content with original resume text
    useEffect(() => {
        if (data?.sections) {
            const initial: { [key: string]: string } = {};
            Object.entries(data.sections).forEach(([name, section]) => {
                initial[name] = section.original || section.updated || "";
            });
            setEditedContent(initial);
        }
    }, [data]);

    const handleApplyAI = (sectionName: string) => {
        const aiText = data.sections[sectionName]?.updated;
        if (aiText) {
            setEditedContent(prev => ({ ...prev, [sectionName]: aiText }));
        }
    };

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            await generateOptimizedDocx(data, editedContent, personalInfo);
        } catch (error) {
            console.error("Failed to generate docx:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white selection:bg-primary/20 overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
                <div className="bg-blur-blob w-[600px] h-[600px] bg-violet-100/30 -top-40 -left-20" />
                <div className="bg-blur-blob w-[500px] h-[500px] bg-blue-100/30 -bottom-20 -right-20" />
            </div>

            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/results", { state: data })}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <PiArrowLeftBold className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <PiMagicWandDuotone className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Resume Optimizer Hub</h1>
                        </div>
                    </div>
                    <Button
                        className="hidden md:flex bg-primary hover:bg-primary-dark"
                        onClick={handleDownload}
                        isLoading={isGenerating}
                    >
                        <PiDownloadSimpleBold className="w-5 h-5" />
                        Download Optimized DOCX
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid lg:grid-cols-3 gap-12"
                >
                    {/* Sidebar: Control Panel */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-100 border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <PiSparkleBold className="text-primary w-6 h-6" />
                                AI Improvements
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(data.sections).map(([name, section]) => (
                                    <div
                                        key={name}
                                        className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-900 capitalize">{name.toLowerCase()}</p>
                                            <p className="text-xs text-slate-500">Analysis Score: {section.score}/10</p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${section.score >= 8
                                            ? 'bg-primary/10 border-primary/20 text-primary'
                                            : 'bg-amber-50 border-amber-200 text-amber-500'
                                            }`}>
                                            <span className="text-[10px] font-bold">{section.score}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Personal Info Form */}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-100 border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <PiInfoBold className="text-primary w-6 h-6" />
                                Contact Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={personalInfo.name}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Email</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={personalInfo.email}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Phone</label>
                                        <input
                                            type="text"
                                            placeholder="+1..."
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={personalInfo.phone}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Location</label>
                                        <input
                                            type="text"
                                            placeholder="City, ST"
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={personalInfo.location}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">LinkedIn (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="linkedin.com/in/..."
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={personalInfo.linkedin}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
                            <h3 className="text-lg font-bold mb-4">Why use this?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Our AI suggests precise keywords and structural shifts that ATS systems are looking for.
                                Integrating these changes typically increases match scores by 30-40%.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-3 rounded-xl border border-white/10">
                                    <PiCheckCircleFill className="text-primary" />
                                    ATS-Friendly Structure
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-3 rounded-xl border border-white/10">
                                    <PiCheckCircleFill className="text-primary" />
                                    Keyword Optimized
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main: Content Preview */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900">Optimization Preview</h2>
                                <div className="text-xs text-slate-400 italic font-medium">This is how your optimized resume will look</div>
                            </div>

                            {/* Header Preview */}
                            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-slate-100/50 text-center space-y-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight relative">
                                    {personalInfo.name || "YOUR NAME"}
                                </h3>
                                <p className="text-slate-500 text-sm font-semibold tracking-wide relative">
                                    {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin]
                                        .filter(Boolean)
                                        .join(" • ") || "your.email@example.com • +0 000 000 0000 • City, ST"}
                                </p>
                            </div>

                            {Object.entries(data.sections).map(([name, section]) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 space-y-6"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                {name}
                                            </span>
                                        </div>
                                        {section.updated && (
                                            <button
                                                onClick={() => handleApplyAI(name)}
                                                className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary-dark uppercase tracking-tighter bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 transition-all"
                                            >
                                                <PiSparkleBold className="w-3 h-3" />
                                                Quick Apply AI
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid lg:grid-cols-3 gap-6">
                                        {/* Editor Column */}
                                        <div className="lg:col-span-2 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black uppercase text-slate-400">Section Editor</p>
                                                <span className="text-[10px] text-slate-300 italic">Self-editing encouraged</span>
                                            </div>
                                            <textarea
                                                className="w-full h-48 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-slate-700 leading-relaxed font-medium resize-none"
                                                value={editedContent[name] || ""}
                                                onChange={(e) => setEditedContent(prev => ({ ...prev, [name]: e.target.value }))}
                                                placeholder={`Enter your ${name} content here...`}
                                            />
                                        </div>

                                        {/* AI Reference Column */}
                                        <div className="space-y-4">
                                            {section.suggestion && (
                                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <PiInfoFill className="text-amber-500 w-3 h-3" />
                                                        <p className="text-[10px] font-black uppercase text-amber-600">AI Strategy</p>
                                                    </div>
                                                    <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium">
                                                        {section.suggestion}
                                                    </p>
                                                </div>
                                            )}

                                            {section.updated && (
                                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <PiMagicWandFill className="text-primary w-3 h-3" />
                                                        <p className="text-[10px] font-black uppercase text-primary">AI Version</p>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                                                        {section.updated.length > 150 ? section.updated.substring(0, 150) + "..." : section.updated}
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(section.updated);
                                                        }}
                                                        className="text-[9px] font-bold text-primary hover:underline"
                                                    >
                                                        Copy to Clipboard
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants} className="md:hidden">
                            <Button
                                size="xl"
                                className="w-full bg-primary hover:bg-primary-dark"
                                onClick={handleDownload}
                                isLoading={isGenerating}
                            >
                                Download Optimized DOCX
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            <footer className="border-t border-gray-100 bg-slate-50/50 py-12 px-6 mt-12 text-center">
                <p className="text-sm text-slate-400">
                    JobFit AI Resume Optimizer • 100% Client-side • Your data never leaves your browser.
                </p>
            </footer>
        </div>
    );
};

export default OptimizationHub;
