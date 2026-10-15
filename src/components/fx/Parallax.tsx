import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// GSAP scroll parallax: the wrapped content drifts up or down by `distance` px as its section passes through
// the screen. Put it around things that already have their own transforms. Skipped under reduced motion.

export default function Parallax({
  children,
  distance = 60,
  className = "",
  style,
}: {
  children: ReactNode;
  /** px of travel; negative moves against the scroll direction */
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -distance },
        { y: distance, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }, el);
    return () => ctx.revert();
  }, [distance]);
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
