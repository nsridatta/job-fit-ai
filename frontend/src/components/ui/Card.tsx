// src/components/ui/Card.tsx
import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "bg-white rounded-2xl shadow-md border border-gray-200 p-6",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card };
