import { createElement, useLayoutEffect, useMemo, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// React Bits "Scroll Reveal", done with GSAP: the words of a paragraph start dim and blurred, and light up
// one after another as you scroll it through the screen. Under reduced motion the text is simply shown.

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
};

export default function ScrollReveal({ text, as: Tag = "p", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-w]"),
        { opacity: 0.18, filter: "blur(4px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 55%", scrub: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [text]);

  return createElement(
    Tag,
    { ref, className },
    words.map((w, i) =>
      /^\s+$/.test(w) ? (
        w
      ) : (
        <span key={i} data-w className="inline-block">
          {w}
        </span>
      )
    )
  );
}
