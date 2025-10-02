import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
};

export const Container: React.FC<LayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export const Main: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex-1 ${className}`}>
      {children}
    </motion.main>
  );
};

export const Sidebar: React.FC<LayoutProps & { isOpen?: boolean }> = ({
  children,
  isOpen = true,
  className = "",
}) => {
  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: isOpen ? 0 : -300,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className={`w-80 bg-white dark:bg-gray-800 shadow-lg ${className}`}>
      {children}
    </motion.aside>
  );
};

export const Grid: React.FC<
  LayoutProps & {
    columns?: number;
    gap?: "sm" | "md" | "lg";
  }
> = ({ children, columns = 4, gap = "md", className = "" }) => {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      className={`
      grid grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-${Math.min(columns, 4)} 
      xl:grid-cols-${columns} 
      ${gapClasses[gap]} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export const Card: React.FC<
  LayoutProps & {
    hover?: boolean;
    padding?: "sm" | "md" | "lg";
  }
> = ({ children, hover = true, padding = "md", className = "" }) => {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md
        ${hover ? "hover:shadow-lg transition-shadow duration-300" : ""}
        ${paddingClasses[padding]}
        ${className}
      `}>
      {children}
    </motion.div>
  );
};

export default Layout;
