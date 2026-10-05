import type { ReactNode } from "react";

const Background = ({ children }: {
  children: ReactNode;
  bgColor?: string;
  columnColor?: string;
  dotColor?: string;
  dotGlowColor?: string;
}) => {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Background;
