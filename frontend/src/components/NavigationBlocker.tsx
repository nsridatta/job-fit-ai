import { useBlocker } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { PiWarningCircleBold, PiShieldWarningDuotone, PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";
import { Button } from "./ui/Button";

interface NavigationBlockerProps {
    when: boolean;
}

export const NavigationBlocker: React.FC<NavigationBlockerProps> = ({ when }) => {
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            when &&
            currentLocation.pathname !== nextLocation.pathname &&
            nextLocation.pathname !== "/results" &&
            nextLocation.pathname !== "/dashboard"
    );
    return (
        <AnimatePresence>
            {blocker.state === "blocked" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => blocker.reset?.()}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Top Pattern/Decoration */}
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

                        <div className="p-8 space-y-6">
                            {/* Icon & Warning */}
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
                                    <PiShieldWarningDuotone className="w-12 h-12" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        Analysis in Progress
                                    </h2>
                                    <p className="text-slate-500 leading-relaxed">
                                        If you leave now, your resume analysis will be cancelled and you'll lose your progress. Are you sure?
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button
                                    size="lg"
                                    onClick={() => blocker.reset?.()}
                                    className="w-full bg-primary hover:bg-primary-dark group"
                                >
                                    <PiArrowLeftBold className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    Keep Analyzing
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => blocker.proceed?.()}
                                    className="w-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    Leave Anyway
                                    <PiArrowRightBold className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
                            <PiWarningCircleBold className="text-amber-500 w-4 h-4" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Data is not saved automatically
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
