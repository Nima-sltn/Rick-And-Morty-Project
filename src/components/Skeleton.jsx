import React from "react";
import "./Skeleton.css";

const Skeleton = ({ type }) => {
  const classes = `skeleton ${type}`;
  return (
    <div className={classes}>
      {type === "list" && (
        <>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </>
      )}
      {type === "detail" && (
        <>
          <div className="skeleton-img"></div>
          <div className="skeleton-info"></div>
        </>
      )}
    </div>
  );
};

export default Skeleton;
