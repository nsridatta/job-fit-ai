// src/components/ui/Button.tsx
import clsx from "clsx";
import { motion, HTMLMotionProps } from "framer-motion";
import React, { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "xl";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark active:bg-primary-dark border-b-4 border-primary-dark hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-[4px]",
            secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
            ghost: "bg-transparent text-slate-600 hover:bg-slate-50",
            danger: "bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600 border-b-4 border-red-800 hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-[4px]",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm rounded-lg",
            md: "px-6 py-3 text-base rounded-xl",
            lg: "px-8 py-4 text-lg rounded-2xl",
            xl: "px-10 py-5 text-xl rounded-2xl font-bold",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={!props.disabled ? { scale: 1.01 } : {}}
                whileTap={!props.disabled ? { scale: 0.98 } : {}}
                className={clsx(
                    "inline-flex items-center justify-center gap-2 transition-all duration-200 outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </div>
                ) : (
                    children
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
