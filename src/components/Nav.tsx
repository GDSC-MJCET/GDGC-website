import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight } from "lucide-react";
import {
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconBrandYoutubeFilled,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { ReplayIntroButton } from "@/components/ui/replay-intro-button";
import GdgMark from "./landing-cinema/GdgMark";
import { menuItems } from "./navItems";

const JOIN_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSfMc7dWVyNixPNjBIc-PZmCuzifw0j2w0c7x1ms2h3H9mnVyw/viewform?usp=send_form";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/gdgc.mjcet/",
    icon: IconBrandInstagramFilled,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/gdgmjcet",
    icon: IconBrandLinkedinFilled,
  },
  {
    label: "GitHub",
    href: "https://github.com/GDSC-MJCET",
    icon: IconBrandGithubFilled,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@gdgcmjcet",
    icon: IconBrandYoutubeFilled,
  },
];

// one GDG colour per link, used for its active/hover underline
const LINK_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

// Site navbar: fixed to the top. With `overlay` (home page) it starts transparent over the hero and turns into
// a dark glass bar once you scroll; elsewhere it is always the bar, with a spacer so the page starts below it.
// (bgColor is accepted for callers' sake but not used.)
const Nav = ({ overlay = false }: { bgColor?: string; overlay?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // hide while scrolling down, come back on any scroll up (and always near the top)
      if (y < 120) setHidden(false);
      else if (Math.abs(y - last) > 6) setHidden(y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = !overlay || scrolled;
  const away = hidden && !open;

  // sticky bars under the nav read this to sit flush against it, or against the top when it is away
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--nav-h",
      away ? "0px" : "72px",
    );
  }, [away]);
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--nav-h");
    },
    [],
  );
  const links = Object.entries(menuItems);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${away ? "-translate-y-full" : "translate-y-0"}`}
        onFocusCapture={() => setHidden(false)}
      >
        <div
          className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
            solid
              ? "border-white/10 bg-[#050506]/75 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <nav className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-10 lg:px-16">
            <Link
              to="/"
              aria-label="GDGC MJCET home"
              className="group flex shrink-0 items-center gap-3"
            >
              <GdgMark className="h-6 w-auto transition-transform duration-500 group-hover:scale-110" />
              <span className="leading-none">
                <span className="block text-[16px] font-black tracking-[-0.02em] text-white">
                  GDGC MJCET
                </span>
                <span className="mt-1 hidden text-[9px] font-medium tracking-[0.22em] text-white/45 uppercase sm:block">
                  Google Developer Groups
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {links.map(([name, path], i) => {
                const active = location.pathname === path;
                const color = LINK_COLORS[i % LINK_COLORS.length];
                return (
                  <li key={name}>
                    <Link
                      to={path}
                      aria-current={active ? "page" : undefined}
                      className={`group relative block px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${
                        active ? "text-white" : "text-white/55 hover:text-white"
                      }`}
                    >
                      {name}
                      {active ? (
                        <motion.span
                          layoutId="nav-underline"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                          className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full"
                          style={{
                            background: color,
                            boxShadow: `0 0 12px ${color}`,
                          }}
                        />
                      ) : (
                        <span
                          className="absolute inset-x-3 -bottom-0.5 h-[3px] origin-left scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100"
                          style={{ background: color }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1.5">
              {location.pathname === "/" && (
                <ReplayIntroButton
                  variant="ghost"
                  size="icon"
                  title="Replay intro"
                  aria-label="Replay intro"
                  className="h-9 w-9 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <span className="sr-only">Replay intro</span>
                </ReplayIntroButton>
              )}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={JOIN_FORM}
                className="group hidden items-center gap-2 rounded-full bg-white py-2 pr-2 pl-4 text-[13px] font-semibold text-black transition-shadow hover:shadow-[0_0_28px_rgba(66,133,244,0.55)] sm:inline-flex"
              >
                Join Us
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={13} />
                </span>
              </a>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
              >
                <IconMenu2 size={22} />
              </button>
            </div>
          </nav>
        </div>
      </header>
      {!overlay && <div aria-hidden className="h-[72px]" />}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[200] flex flex-col bg-[#050506] text-white"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-[72px] items-center justify-between px-5 sm:px-10">
              <span className="flex items-center gap-3">
                <GdgMark className="h-6 w-auto" />
                <span className="text-[16px] font-black tracking-[-0.02em]">
                  GDGC MJCET
                </span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
              >
                <IconX size={24} />
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-1 px-5 sm:px-10">
              {links.map(([name, path], i) => (
                <motion.li
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25 + i * 0.05,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    to={path}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4"
                  >
                    <span className="w-6 text-xs font-medium text-white/40">
                      0{i + 1}
                    </span>
                    <span
                      className="text-[clamp(2.5rem,10vw,4rem)] leading-[1.08] font-black tracking-[-0.035em] transition-colors duration-200"
                      style={{
                        color:
                          location.pathname === path
                            ? LINK_COLORS[i % 4]
                            : undefined,
                      }}
                    >
                      {name}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-5 border-t border-white/10 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <div className="flex gap-2">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/75 hover:border-white hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
              <a
                href={JOIN_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black"
              >
                Join Us <ArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
