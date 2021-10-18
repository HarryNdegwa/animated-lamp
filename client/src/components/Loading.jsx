import React from "react";

export default function Loading({ isHome, isCar }) {
  return (
    <div
      className="demoLoader"
      style={(isHome || isCar) && { height: "calc(100vh - 70px)" }}
    >
      <div className="spinner-border text-orange height20px" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
