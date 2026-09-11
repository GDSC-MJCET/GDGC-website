import React from "react";

const Background = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Background;
