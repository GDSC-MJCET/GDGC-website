import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ClickSpark from "./ClickSpark";
import { setLenis } from "./smooth";

gsap.registerPlugin(ScrollTrigger);

// Site-wide effects, mounted once inside the router:
//  - Lenis smooth scrolling on the content pages, driven by GSAP's ticker so ScrollTrigger stays in step
//  - back to the top on every page change
//  - a little spark burst where you click
// The full-screen gallery, the Adsophos experience, the admin screens and the practice editor keep native scrolling.

const SMOOTH = ["/", "/events", "/event-details", "/team-page", "/contact", "/projects", "/blogs", "/techfaceoff", "/buildweek-form", "/score"];

export default function SiteEffects() {
  const { pathname } = useLocation();
  const smooth = SMOOTH.includes(pathname.replace(/(.)\/+$/, "$1"));

  useEffect(() => {
    window.scrollTo(0, 0);
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
