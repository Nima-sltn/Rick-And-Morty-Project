import React, { FC } from "react";

interface SkeletonProps {
  type: "list" | "detail";
}

const Skeleton: FC<SkeletonProps> = ({ type }) => {
  const containerClass = `skeleton ${type}`;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      {type === "list" ? (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton-item" />
          ))}
        </>
      ) : (
        <>
          <div className="skeleton-img" />
          <div className="skeleton-info" />
        </>
      )}
    </div>
  );
};

export default Skeleton;
