import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    wave: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
    none: {},
  };

  const style: React.CSSProperties = {
    width: width || (variant === "text" ? "100%" : undefined),
    height: height || (variant === "text" ? "1em" : undefined),
    ...(animation === "wave" && {
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      backgroundSize: "200% 100%",
    }),
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      animate={animation !== "none" ? animationVariants[animation] : undefined}
    />
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" width={60} height={60} />

      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="75%" height={20} />
        <Skeleton variant="text" width="50%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    </div>
  </div>
);

export const ListSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 5, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }, (_, index) => (
      <CardSkeleton key={`list-skeleton-${index}`} />
    ))}
  </div>
);

export const DetailSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`p-6 ${className}`}>
    <div className="flex flex-col md:flex-row gap-6">
      <Skeleton
        variant="rectangular"
        width={300}
        height={300}
        className="mx-auto md:mx-0"
      />

      <div className="flex-1 space-y-4">
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />

        <div className="space-y-2 mt-6">
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
          <Skeleton variant="text" width="95%" height={16} />
        </div>

        <div className="flex gap-2 mt-6">
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </div>
      </div>
    </div>
  </div>
);

export const GridSkeleton: React.FC<{
  count?: number;
  columns?: number;
  className?: string;
}> = ({ count = 12, columns = 4, className = "" }) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={`grid-skeleton-${index}`}
        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          className="mb-4"
        />

        <Skeleton variant="text" width="80%" height={20} className="mb-2" />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    ))}
  </div>
);

export default Skeleton;
