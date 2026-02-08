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
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";

const Nav = ({ bgColor = "#1e1e1e" }) => {
  const [open, setOpen] = useState(false);
  const links = [
    {
      title: "Instagram",
      icon: <IconBrandInstagramFilled className="h-full w-full" />,
      href: "#",
    },
    {
      title: "LinkedIn",
      icon: <IconBrandLinkedinFilled className="h-full w-full" />,
      href: "#",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithubFilled className="h-full w-full" />,
      href: "#",
    },
    {
      title: "YouTube",
      icon: <IconBrandYoutubeFilled className="h-full w-full" />,
      href: "#",
    },
  ];

  const menuItems = {"Home" : "/", "Tech Debate" : "/techdebate" , "Events" : "/events", "Team" : "/team-page", "Gallery" : "/gallery", "Contact Us" : "/contact"};

  return (
    <>
      <header
        style={{ backgroundColor: bgColor }}
        className="relative z-100 shadow-xl"
      >
        <div className="flex items-center justify-between px-6 md:px-20 py-4">
          <img src="/logo.svg" alt="Logo" className="h-9" />

          <ul className="hidden md:flex gap-12 items-center text-white text-sm tracking-wide">
            {Object.entries(menuItems).map(([index,item]) => (
              <li
                key={index}
                className="cursor-pointer opacity-80 hover:opacity-100 transition"
              >
                <Link to={item}>{index}</Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setOpen(true)}
              className=" text-white"
            >
              <IconMenu2 size={28} />
            </button>
          </div>
        </div>

        <div className="px-6 md:px-20">
          <hr className="border-white/20" />
        </div>

        <div className="flex items-center justify-between px-6 md:px-20 py-3">
          <FloatingDock
            items={links}
            desktopClassName="text-neutral-400"
            mobileClassName="text-neutral-400"
          />

          <a target="_blank" rel="noopener noreferrer" href="https://gdg.community.dev/gdg-on-campus-muffakham-jah-college-of-engineering-and-technology-hyderabad-india/" className=" bg-[#5ddb6e] text-black py-2 px-8 rounded-full text-sm font-semibold">
            Join Us
          </a>
        </div>
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
              className="fixed top-0 right-0 h-full w-full bg-[#111] z-999 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <img src="/logo.svg" className="h-8" />
                <button onClick={() => setOpen(false)}>
                  <IconX className="text-white" size={28} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8 gap-8 text-white text-2xl font-medium">
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
                <button className="w-full bg-[#5ddb6e] text-black py-3 rounded-full font-semibold">
                  Join GDG
                </button>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center text-white">
                <FloatingDock items={links} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
