import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
import { Dot, GlassCard, Outline } from "../components/fx/designSystem";
import { EASE, GOOGLE_HEX, HEADLINE_CLAMP } from "../components/fx/tokens";

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

const field =
  "w-full rounded-lg border border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 transition-colors focus:border-white/50 focus:outline-none";
const label = "mb-2 block text-sm text-white/70";

// A small orbit drawing for the hero: rings, a vertical axis, and dots on the rings.
function Orbit() {
  const rings = [
    { r: 150, dots: [[-58, GOOGLE_HEX.blue, 9], [62, GOOGLE_HEX.red, 9]] },
    { r: 92, dots: [[-30, GOOGLE_HEX.green, 10], [115, GOOGLE_HEX.yellow, 9]] },
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
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_260px]">
            <motion.div {...rise()}>
              <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase">
                <span aria-hidden className="h-2 w-2 rounded-full bg-google-green shadow-[0_0_10px_#34A853]" />
                Get in touch / GDGC MJCET
              </p>
              <h1 className={`mt-5 leading-[1] font-black tracking-[-0.03em] text-white ${HEADLINE_CLAMP}`}>
                Have a question?
                <span className="mt-1 block md:whitespace-nowrap">
                  <span className="text-transparent" style={{ WebkitTextStroke: `2px ${GOOGLE_HEX.blue}`, paintOrder: "stroke fill" }}>
                    Let&apos;s
                  </span>{" "}
                  <span className="text-transparent" style={{ WebkitTextStroke: `2px ${GOOGLE_HEX.green}`, paintOrder: "stroke fill" }}>
                    build
                  </span>{" "}
                  <Outline>something</Outline>
                  <Dot color="bg-google-red" />
                </span>
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-white/65">
                Have questions or want to collaborate? We&apos;d love to hear from you. Let&apos;s connect and build
                something amazing together.
              </p>
            </motion.div>
            <motion.div {...rise(0.15)} className="mx-auto hidden aspect-square w-full max-w-[300px] md:block">
              <Orbit />
            </motion.div>
          </div>

          {/* channels and the form */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
            <motion.div {...rise(0.1)}>
              <GlassCard className="p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] sm:p-9">
                <h2 className="text-2xl font-semibold text-white">Find your people</h2>
                <p className="mt-1.5 text-sm text-white/60">Reach out to us through any of the following channels.</p>

                <ul className="mt-7">
                  {CHANNELS.map(({ label: l, value, icon: Icon, tone, ...rest }, i) => {
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
                      <motion.li
                        key={l}
                        className="border-b border-white/10 last:border-b-0"
                        initial={reduce ? false : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.07, ease: EASE }}
                      >
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
                      </motion.li>
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
              </GlassCard>
            </motion.div>

            <motion.div {...rise(0.2)}>
              <GlassCard className="p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] sm:p-9">
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
                      className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_0_rgba(255,255,255,0)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(255,255,255,0.35)] disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending…" : "Send message"} <ArrowUpRight size={15} />
                    </button>
                    <AnimatePresence mode="wait">
                      {status === "sent" && (
                        <motion.p
                          key="sent"
                          role="status"
                          aria-live="polite"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="inline-flex items-center gap-2 text-sm text-google-green"
                        >
                          <Check size={16} /> Message sent. Thank you!
                        </motion.p>
                      )}
                      {status === "error" && (
                        <motion.p
                          key="error"
                          role="status"
                          aria-live="polite"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="text-sm text-google-red"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </Background>
  );
};

export default ContactUsPage;
