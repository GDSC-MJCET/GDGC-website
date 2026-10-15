import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import axios from "axios";
import Background from "../components/Background";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AmbientGlow from "../components/home/AmbientGlow";
import { axiosResponse } from "../lib/http";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHANNELS = [
  { label: "Email", value: "gdscmjcet@gmail.com", href: "mailto:gdscmjcet@gmail.com", icon: IconMail, tone: "text-white" },
  { label: "Phone", value: "+91 73962 11824", href: "tel:+917396211824", icon: IconPhone, tone: "text-google-green" },
  {
    label: "Location",
    value: "Muffakham Jah College of Engineering & Technology, Hyderabad",
    href: "https://maps.app.goo.gl/?q=Muffakham+Jah+College+of+Engineering+and+Technology",
    icon: IconMapPin,
    tone: "text-white",
  },
  { label: "Office Hours", value: "Mon–Fri, 9AM–6PM", icon: IconClock, tone: "text-google-green" },
] as const;

const SOCIALS = [
  { label: "YouTube", href: "https://www.youtube.com/@gdgcmjcet", icon: IconBrandYoutube },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/gdgmjcet", icon: IconBrandLinkedin },
  { label: "Instagram", href: "https://www.instagram.com/gdgc.mjcet/", icon: IconBrandInstagram },
  { label: "GitHub", href: "https://github.com/GDSC-MJCET", icon: IconBrandGithub },
];

const card =
  "rounded-2xl border border-white/15 bg-white/[0.03] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-9";
const field =
  "w-full rounded-lg border border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 transition-colors focus:border-white/50 focus:outline-none";
const label = "mb-2 block text-sm text-white/70";

// A small orbit drawing for the hero: rings, a vertical axis, and dots on the rings.
function Orbit() {
  const rings = [
    { r: 150, dots: [[-58, "#4285F4", 9], [62, "#EA4335", 9]] },
    { r: 92, dots: [[-30, "#34A853", 10], [115, "#FBBC05", 9]] },
  ] as const;
  return (
    <svg aria-hidden viewBox="-170 -170 340 340" className="h-full w-full">
      <line x1="0" y1="-170" x2="0" y2="170" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      {rings.map((ring) => (
        <g key={ring.r}>
          <circle r={ring.r} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          {ring.dots.map(([deg, c, s]) => {
            const t = (deg * Math.PI) / 180;
            return <circle key={deg} cx={ring.r * Math.cos(t)} cy={ring.r * Math.sin(t)} r={s / 1.6} fill={c} />;
          })}
        </g>
      ))}
      <circle r="30" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <circle r="165" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="1 6" />
    </svg>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

const ContactUsPage = () => {
  const reduce = !!useReducedMotion();
  const server = import.meta.env.VITE_SERVER;
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await axios.post(`${server}/api/v1/contact`, formData);
      if (res.data.success) {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setStatus("sent");
      } else {
        setError("Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setError(axiosResponse(err)?.data?.msg || "Server error. Please try again in a moment.");
      setStatus("error");
    }
  };

  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <Background>
      <Nav />
      <div className="relative overflow-hidden">
        <AmbientGlow />
        <main className="relative mx-auto max-w-[1300px] px-6 pt-10 pb-24 sm:px-10">
          {/* hero */}
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
            <motion.div {...rise()}>
              <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">
                <span aria-hidden className="h-2 w-2 rounded-full bg-google-green shadow-[0_0_10px_#34A853]" />
                Get in touch / GDGC MJCET
              </p>
              <h1 className="mt-5 text-[clamp(2.4rem,5.2vw,4.5rem)] leading-[1] font-black tracking-[-0.03em] text-white">
                Have a question?
                <span className="mt-1 block lg:whitespace-nowrap">
                  <span className="text-transparent" style={{ WebkitTextStroke: "2px #4285F4", paintOrder: "stroke fill" }}>
                    Let&apos;s
                  </span>{" "}
                  <span className="text-transparent" style={{ WebkitTextStroke: "2px #34A853", paintOrder: "stroke fill" }}>
                    build
                  </span>{" "}
                  <span
                    className="text-transparent"
                    style={{ WebkitTextStroke: "2px rgba(255,255,255,0.92)", paintOrder: "stroke fill" }}
                  >
                    something
                  </span>
                  <span className="ml-[0.04em] inline-block h-[0.13em] w-[0.13em] rounded-full bg-google-red align-baseline" />
                </span>
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-white/65">
                Have questions or want to collaborate? We&apos;d love to hear from you. Let&apos;s connect and build
                something amazing together.
              </p>
            </motion.div>
            <motion.div {...rise(0.15)} className="mx-auto hidden aspect-square w-full max-w-[300px] lg:block">
              <Orbit />
            </motion.div>
          </div>

          {/* channels and the form */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <motion.section {...rise(0.1)} className={card}>
              <h2 className="text-2xl font-semibold text-white">Find your people</h2>
              <p className="mt-1.5 text-sm text-white/60">Reach out to us through any of the following channels.</p>

              <ul className="mt-7">
                {CHANNELS.map(({ label: l, value, icon: Icon, tone, ...rest }) => {
                  const href = "href" in rest ? rest.href : undefined;
                  const body = (
                    <>
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] ${tone}`}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-white/55">{l}</span>
                        <span className="mt-0.5 block text-lg leading-snug text-white">{value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={l} className="border-b border-white/10 last:border-b-0">
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="flex items-center gap-5 py-4 transition-opacity hover:opacity-80"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="flex items-center gap-5 py-4">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 text-sm text-white/55">Follow us for the latest updates, events and announcements.</p>
              <div className="mt-4 flex gap-3">
                {SOCIALS.map(({ label: l, href, icon: Icon }) => (
                  <a
                    key={l}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={l}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white/70 hover:bg-white/10"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </motion.section>

            <motion.section {...rise(0.2)} className={card}>
              <h2 className="text-2xl font-semibold text-white">Send a message</h2>
              <p className="mt-1.5 text-sm text-white/60">Tell us what you&apos;re working on. We&apos;ll get back to you soon.</p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className={label}>Name</label>
                    <input id="c-name" type="text" name="name" value={formData.name} onChange={handleChange} required className={field} placeholder="Your Name" autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="c-email" className={label}>Email</label>
                    <input id="c-email" type="email" name="email" value={formData.email} onChange={handleChange} required className={field} placeholder="your@email.com" autoComplete="email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-subject" className={label}>Subject</label>
                  <input id="c-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} required className={field} placeholder="What's this about?" />
                </div>
                <div>
                  <label htmlFor="c-message" className={label}>Message</label>
                  <textarea id="c-message" name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${field} resize-none`} placeholder="Tell us more..." />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03] disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send message"} <ArrowUpRight size={15} />
                  </button>
                  <p role="status" aria-live="polite" className="text-sm">
                    {status === "sent" && (
                      <span className="inline-flex items-center gap-2 text-google-green">
                        <Check size={16} /> Message sent. Thank you!
                      </span>
                    )}
                    {status === "error" && <span className="text-google-red">{error}</span>}
                  </p>
                </div>
              </form>
            </motion.section>
          </div>
        </main>
      </div>
      <Footer />
    </Background>
  );
};

export default ContactUsPage;
