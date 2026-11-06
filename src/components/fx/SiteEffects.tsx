import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ClickSpark from "./ClickSpark";
import { scrollToTop, setLenis } from "./smooth";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.clearScrollMemory("manual");

// Site-wide effects, mounted once inside the router:
//  - Lenis smooth scrolling on the content pages, driven by GSAP's ticker so ScrollTrigger stays in step
//  - back to the top on every page change
//  - a little spark burst where you click
// The full-screen gallery, the Adsophos experience, the admin screens and the practice editor keep native scrolling.

const SMOOTH = ["/", "/v1", "/events", "/team-page", "/contact", "/projects", "/blogs", "/techfaceoff", "/buildweek-form", "/score"];

export default function SiteEffects() {
  const { pathname } = useLocation();
  const clean = pathname.replace(/(.)\/+$/, "$1");
  const smooth = SMOOTH.includes(clean) || clean.startsWith("/events/");

  // every page change starts at the top, before the new page is painted
  useLayoutEffect(() => {
    // ScrollTrigger puts the browser's own scroll restoration back after every refresh; this keeps it off
    ScrollTrigger.clearScrollMemory("manual");
    scrollToTop();
  }, [pathname]);

  useEffect(() => {
    if (!smooth || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, [smooth]);

  return <ClickSpark />;
}
