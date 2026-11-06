import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import {
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import { menuItems } from "./navItems";
import { Shape } from "./landing/primitives";
import { GOOGLE_HEX } from "./fx/tokens";
import { JOIN_URL, WRAP } from "./landing/constants";

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

const label = "font-tech text-[11px] tracking-[0.16em] text-white/45 uppercase";

// Site footer: a big call to action, contact, links and socials, and the four Google shapes rising out of the
// bottom edge. (bgColor is accepted for callers' sake but not used.)
const Footer = (_props: { bgColor?: string }) => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10">
      <div className={`${WRAP} pt-20 md:pt-28`}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={label}>[—] Get in touch</p>
            <h2 className="mt-6 font-display text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.86] font-extrabold tracking-[-0.045em] text-white">
              Let&apos;s build
              <br />
              together<span className="text-google-green">.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:mb-3">
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-colors hover:bg-google-yellow"
            >
              Join the Community
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </a>
            <a
              href="mailto:gdscmjcet@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-[15px] text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              Email Us <Mail size={15} />
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-12 border-t border-white/15 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
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
            <p className={label}>Business inquiries</p>
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
            <p className={label}>Find us</p>
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

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 font-tech text-[11px] tracking-[0.12em] text-white/40 uppercase sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} GDGC MJCET</p>
          <p>Learn · Build · Connect · Grow</p>
        </div>
      </div>

      {/* the four shapes, half sunk below the bottom edge */}
      <div aria-hidden className={`${WRAP} mt-12 grid h-[11vw] max-h-[170px] grid-cols-4 items-start gap-[3vw]`}>
        <Shape kind="circle" fill={GOOGLE_HEX.blue} className="aspect-square w-full" />
        <Shape kind="square" fill={GOOGLE_HEX.red} className="aspect-square w-full" />
        <Shape kind="triangle" fill={GOOGLE_HEX.yellow} className="w-full" />
        <Shape kind="pill" fill={GOOGLE_HEX.green} className="mt-[3vw] aspect-[1/2] w-full origin-bottom -rotate-[24deg]" />
      </div>
    </footer>
  );
};

export default Footer;
