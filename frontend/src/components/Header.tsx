import React from "react";
import { Link } from "react-router";
import { PiMagicWandDuotone } from "react-icons/pi";
import { ColorModeButton } from "./ui/color-mode";

const Header: React.FC = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <PiMagicWandDuotone className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        JobFit AI
                    </span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/blog/resume-keywords-2025" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Resume Tips</Link>
                        <Link to="/blog/how-jobfit-ai-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">How it works</Link>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
                    <ColorModeButton />
                </div>
            </div>
        </nav>
    );
};

export default Header;
