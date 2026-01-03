// src/pages/Blog.tsx
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router";
import {
    PiArrowLeftBold,
    PiMagicWandDuotone,
    PiCalendarDuotone,
    PiClockDuotone,
    PiArrowRightBold
} from "react-icons/pi";
import { Button } from "../components/ui/Button";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    slug: string;
}

const blogPosts: BlogPost[] = [
    {
        id: "0",
        title: "How JobFit AI Works: Your Free AI Resume Analyzer Explained",
        excerpt: "Learn exactly how our free AI-powered resume analyzer works. From uploading your resume to getting instant feedback, discover how JobFit AI helps you land more interviews.",
        date: "December 22, 2025",
        readTime: "4 min read",
        slug: "how-jobfit-ai-works"
    },
    {
        id: "1",
        title: "What is an ATS and Why Does Your Resume Need to Pass It?",
        excerpt: "Learn how Applicant Tracking Systems work and why 75% of resumes never reach human eyes. Discover the secrets to creating an ATS-friendly resume that gets you interviews.",
        date: "December 22, 2025",
        readTime: "5 min read",
        slug: "what-is-ats-resume-checker"
    },
    {
        id: "2",
        title: "10 Resume Keywords That Will Get You Hired in 2025",
        excerpt: "Recruiters and ATS systems look for specific keywords. Here are the top 10 power words and phrases that increase your chances of landing an interview.",
        date: "December 20, 2025",
        readTime: "4 min read",
        slug: "resume-keywords-2025"
    },
    {
        id: "3",
        title: "Common Resume Mistakes That Get You Rejected Instantly",
        excerpt: "Avoid these fatal resume errors that cause immediate rejection. From formatting issues to missing information, learn what NOT to do on your resume.",
        date: "December 18, 2025",
        readTime: "6 min read",
        slug: "resume-mistakes-to-avoid"
    }
];

const Blog: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
                <div className="bg-blur-blob w-[500px] h-[500px] bg-blue-100/40 -top-20 -left-20" />
                <div className="bg-blur-blob w-[400px] h-[400px] bg-emerald-100/40 bottom-20 -right-20" />
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
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

            <main className="max-w-4xl mx-auto px-6 py-16">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                            Career Blog
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Resume Tips & Career Advice
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            Expert insights to help you land your dream job. Learn how to optimize your resume, ace interviews, and stand out from the competition.
                        </p>
                    </motion.div>

                    {/* Blog Posts */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {blogPosts.map((post) => (
                            <motion.article
                                key={post.id}
                                variants={itemVariants}
                                className="group bg-white rounded-2xl p-8 shadow-lg shadow-slate-100/50 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer"
                                onClick={() => navigate(`/blog/${post.slug}`)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-slate-500 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                <PiCalendarDuotone className="w-4 h-4" />
                                                {post.date}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <PiClockDuotone className="w-4 h-4" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Read More <PiArrowRightBold className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="text-center bg-gradient-to-r from-primary/5 to-blue-50 rounded-3xl p-12 border border-primary/10">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Ready to Optimize Your Resume?
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-lg mx-auto">
                            Use our free AI-powered resume analyzer to check ATS compatibility and get instant improvement suggestions.
                        </p>
                        <Button size="xl" onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary-dark">
                            Analyze My Resume Free
                        </Button>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-slate-50/50 py-8 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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

export default Blog;
