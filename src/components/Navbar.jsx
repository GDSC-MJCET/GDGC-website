"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Link, NavLink } from "react-router-dom";

export function Navibar() {
    const navItems = [
        // {
        //   name: "Home",
        //   link: "/",
        // },
        {
          name: "Hiring",
          link: "/  ",
        },
        // {
        //   name: "About",
        //   link: "/about",
        // },
    ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full ">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Book a call</NavbarButton> */}
          </div>
          <ModeToggle />
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center justify-center space-x-6 mr-5">
            {navItems.map((item, idx) => (
              <NavLink 
                key={idx}
                to={item.link} 
                className="relative text-neutral-600 dark:text-neutral-300 hover:text-blue-600 transition-colors duration-200"
              >
                {item.name}
              </NavLink>
            ))}
            </div>
          </MobileNavHeader>
          {/* <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
                  </a>
                ))}
            <div className="flex w-full flex-col gap-4">
              {/* <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full">
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full">
                Book a call
              </NavbarButton> */}
            {/* </div> */}
          {/* </MobileNavMenu> */} 
        </MobileNav>
      </Navbar>
      {/* Navbar */}
    </div>
  );
}
