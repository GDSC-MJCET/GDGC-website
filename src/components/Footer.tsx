import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import {
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import { menuItems } from "./navItems";

const JOIN_URL =
  "https://gdg.community.dev/gdg-on-campus-muffakham-jah-college-of-engineering-and-technology-hyderabad-india/";
const MAP_URL = "https://maps.app.goo.gl/?q=Muffakham+Jah+College+of+Engineering+and+Technology";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/gdgc.mjcet/", icon: IconBrandInstagramFilled },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/gdgmjcet", icon: IconBrandLinkedinFilled },
  { label: "GitHub", href: "https://github.com/GDSC-MJCET", icon: IconBrandGithubFilled },
  { label: "YouTube", href: "https://www.youtube.com/@gdgcmjcet", icon: IconBrandYoutubeFilled },
];

const CONTACTS = [
  { name: "Afzal", phone: "+91 73962 11824", tel: "+917396211824" },
  { name: "Ibrahim", phone: "+91 63059 96906", tel: "+916305996906" },
];

const label = "text-[11px] font-medium tracking-[0.3em] text-white/45 uppercase";

// Site footer: a big call to action in the hero's type style, then contact, links and socials, on the same
// soft Google-colour glow as the home page. (bgColor is accepted for callers' sake but not used.)
const Footer = (_props: { bgColor?: string }) => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10">
      {/* colour glow along the bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -bottom-40 -left-24 h-[440px] w-[440px] rounded-full bg-google-blue opacity-[0.16] blur-[130px]" />
        <span className="absolute -bottom-48 left-[30%] h-[400px] w-[400px] rounded-full bg-google-red opacity-[0.12] blur-[130px]" />
        <span className="absolute -bottom-40 left-[55%] h-[400px] w-[400px] rounded-full bg-google-yellow opacity-[0.1] blur-[130px]" />
        <span className="absolute -right-24 -bottom-40 h-[440px] w-[440px] rounded-full bg-google-green opacity-[0.14] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 pt-20 pb-10 sm:px-10 lg:px-[5.5%]">
        {/* call to action */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={`flex items-center gap-3 ${label}`}>
              Get In Touch
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-google-green" />
            </p>
            <h2 className="mt-4 text-[clamp(2.6rem,6vw,6rem)] leading-[0.95] font-black tracking-[-0.03em] text-white">
              Let&apos;s Build
              <span className="block pl-[0.5em]">
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "2px rgba(255,255,255,0.92)", paintOrder: "stroke fill" }}
                >
                  Together
                </span>
                <span className="ml-[0.04em] inline-block h-[0.13em] w-[0.13em] rounded-full bg-google-red align-baseline" />
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.03] hover:opacity-90"
            >
              Join the Community <ArrowUpRight size={15} />
            </a>
            <a
              href="mailto:gdscmjcet@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
            >
              Email Us <Mail size={15} />
            </a>
          </div>
        </div>

        <div className="my-14 h-px bg-gradient-to-r from-google-blue/40 via-white/10 to-google-green/40" />

        {/* details */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src="/logo.svg" alt="Google Developer Groups On Campus MJCET" className="w-56 max-w-full" />
            <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-white/60">
              A student-led community where curious minds learn, build, and solve real-world problems together.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ label: l, href, icon: Icon }) => (
                <a
                  key={l}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/50 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className={label}>Explore</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {Object.entries(menuItems).map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="text-white/70 transition-colors hover:text-white">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={label}>Business Inquiries</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href="mailto:gdscmjcet@gmail.com" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                  <Mail size={14} className="text-google-red" /> gdscmjcet@gmail.com
                </a>
              </li>
              {CONTACTS.map((c) => (
                <li key={c.name}>
                  <a href={`tel:${c.tel}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                    <Phone size={14} className="text-google-green" /> {c.name}: {c.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={label}>Find Us</p>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex gap-2 text-sm leading-relaxed text-white/70 hover:text-white"
            >
              <MapPin size={14} className="mt-1 shrink-0 text-google-blue" />
              <span>
                Muffakham Jah College of Engineering and Technology, Mount Pleasant, 8-2-249, Rd No. 3, Banjara Hills,
                Hyderabad, Telangana 500082
              </span>
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} GDGC MJCET. All rights reserved.</p>
          <p className="flex items-center gap-2 tracking-[0.25em] uppercase">
            Learn <span className="h-1 w-1 rounded-full bg-google-blue" /> Build{" "}
            <span className="h-1 w-1 rounded-full bg-google-red" /> Connect{" "}
            <span className="h-1 w-1 rounded-full bg-google-yellow" /> Grow
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
