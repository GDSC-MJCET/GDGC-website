"use client";

import React, { useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { ReplayIntroButton } from "@/components/ui/replay-intro-button";
import {
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconBrandYoutubeFilled,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { menuItems } from "./navItems";
// Light/dark toggle disabled for now, see index.css — re-enable by
// uncommenting the light palette there and restoring this import + usage.
// import { ModeToggle } from "./mode-toggle";

// bgColor is accepted for callers' sake but not used by the pill navbar.
const Nav = (_props: { bgColor?: string }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    {
      title: "Instagram",
      icon: <IconBrandInstagramFilled className="h-full w-full" />,
      href: "https://www.instagram.com/gdgc.mjcet/",
    },
    {
      title: "LinkedIn",
      icon: <IconBrandLinkedinFilled className="h-full w-full" />,
      href: "https://www.linkedin.com/company/gdgmjcet",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithubFilled className="h-full w-full" />,
      href: "https://github.com/GDSC-MJCET",
    },
    {
      title: "YouTube",
      icon: <IconBrandYoutubeFilled className="h-full w-full" />,
      href: "https://www.youtube.com/@gdgcmjcet",
    },
  ];

  return (
    <div>
      <header className="relative z-100 flex w-full justify-center px-4 py-5">
        <nav className="grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-full border border-border bg-card/70 px-4 py-2 shadow-lg backdrop-blur-xl lg:grid-cols-[1fr_auto_1fr] md:px-5">
          <Link to="/" className="flex min-w-0 items-center">
            <img src="/logo.svg" alt="Google Developer Groups" className="h-9 w-auto shrink-0" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {Object.entries(menuItems).map(([name, path]) => {
              const isActive = location.pathname === path;
              return (
                <li key={name}>
                  <Link
                    to={path}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-accent"
                      />
                    )}
                    <span className="relative">{name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end gap-2">
            {/* <ModeToggle /> */}
            <ReplayIntroButton
              variant="ghost"
              size="icon"
              title="Replay intro"
              aria-label="Replay intro"
              className="h-9 w-9 rounded-full text-foreground/70 hover:bg-accent hover:text-foreground"
            >
              <span className="sr-only">Replay intro</span>
            </ReplayIntroButton>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfMc7dWVyNixPNjBIc-PZmCuzifw0j2w0c7x1ms2h3H9mnVyw/viewform?usp=send_form"
              className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-85 hover:scale-[1.03] sm:inline-flex"
            >
              Join Us <ArrowUpRight size={16} />
            </a>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-accent"
            >
              <IconMenu2 size={22} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-998"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full bg-background z-999 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <img src="/logo.svg" className="h-8" />
                <button onClick={() => setOpen(false)}>
                  <IconX className="text-foreground" size={28} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8 gap-8 text-foreground text-2xl font-medium">
                {Object.entries(menuItems).map(([name, path], i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="opacity-80 hover:opacity-100 transition"
                  >
                    <Link to={path} onClick={() => setOpen(false)}>
                      {name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="px-8 pb-24">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfMc7dWVyNixPNjBIc-PZmCuzifw0j2w0c7x1ms2h3H9mnVyw/viewform?usp=send_form"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-full font-semibold"
                >
                  Join Us <ArrowUpRight size={15} />
                </a>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center text-foreground">
                <FloatingDock items={links} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nav;
