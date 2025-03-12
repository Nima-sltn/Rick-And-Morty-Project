import React, { FC } from "react";

interface SkeletonProps {
  type: "list" | "detail";
}

const Skeleton: FC<SkeletonProps> = ({ type }) => {
  const containerClass = `skeleton ${type}`;
  const skeletonItems = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];

 

  return (
    <output className={containerClass} aria-live="polite">
      {type === "list" ? (
        <>
          {skeletonItems.map((item) => (
             <div key={item.id} className="skeleton-item" />
          ))}
        </>
      ) : (
        <>
          <div className="skeleton-img" />
          <div className="skeleton-info" />
        </>
      )}
    </output>
  );
};

export default Skeleton;
