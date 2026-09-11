"use client";

import React, { useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
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
// Light/dark toggle disabled for now, see index.css — re-enable by
// uncommenting the light palette there and restoring this import + usage.
// import { ModeToggle } from "./mode-toggle";

const Nav = () => {
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

  const menuItems = { "Home": "/", "Tech Face-off": "/techfaceoff", "Events": "/events", "Adsophos": "/adsophos", "Team": "/team-page", "Contact Us": "/contact" };

  return (
    <div>
      <header className="relative z-100 flex w-full justify-center px-4 py-6">
        <nav className="grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-full border border-border bg-card px-6 py-4 shadow-lg lg:grid-cols-[1fr_auto_1fr] md:px-8">
          <Link to="/" className="flex min-w-0 items-center">
            <img src="/logo.svg" alt="Google Developer Groups" className="h-14 w-auto shrink-0" />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {Object.entries(menuItems).map(([name, path]) => {
              const isActive = location.pathname === path;
              return (
                <li key={name} className="relative">
                  <Link
                    to={path}
                    className="text-sm text-foreground/80 transition-opacity duration-200 hover:opacity-100 hover:text-foreground"
                  >
                    {name}
                  </Link>
                  <span
                    className={`absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-foreground transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end gap-3">
            {/* <ModeToggle /> */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfMc7dWVyNixPNjBIc-PZmCuzifw0j2w0c7x1ms2h3H9mnVyw/viewform?usp=send_form"
              className="hidden items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-85 hover:scale-[1.03] sm:inline-flex"
            >
              Join Us <ArrowUpRight size={16} />
            </a>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-accent"
            >
              <span className="lg:hidden">
                <IconMenu2 size={24} />
              </span>
              <span className="hidden grid-cols-3 gap-[3px] lg:grid">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="h-[3px] w-[3px] rounded-full bg-foreground/70" />
                ))}
              </span>
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
