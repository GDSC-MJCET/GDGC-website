import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
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
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { axiosResponse } from "../lib/http";
import { LIMITS, fieldProblem, validateContact, type ContactErrors, type ContactFields } from "../lib/contactValidation";
import { Dot, Outline } from "../components/fx/designSystem";
import { EASE } from "../components/fx/tokens";

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

const WRAP = "mx-auto w-full max-w-[1400px] px-5 sm:px-10 lg:px-16";
// underline fields: no boxes, just a line that lights up
const field = (bad: boolean) =>
  `w-full border-0 border-b bg-transparent px-0 py-3 text-lg text-white placeholder-white/30 transition-colors focus:outline-none ${
    bad ? "border-google-red focus:border-google-red" : "border-white/25 focus:border-white"
  }`;
const MAIL = "gdscmjcet@gmail.com";
const label = "block text-[11px] font-medium tracking-[0.25em] text-white/55 uppercase";

type Status = "idle" | "sending" | "sent" | "error";

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} role="alert" className="mt-2 text-sm text-google-red">
      {text}
    </p>
  ) : null;
}

const ContactUsPage = () => {
  const reduce = !!useReducedMotion();
  const server = import.meta.env.VITE_SERVER as string | undefined;
  const [formData, setFormData] = useState<ContactFields>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  // what went wrong when sending; `mail` adds an "email us instead" link for problems the visitor cannot fix
  const [failure, setFailure] = useState<{ text: string; mail: boolean }>({ text: "", mail: false });
  const [errors, setErrors] = useState<ContactErrors>({});
  const form = useRef<HTMLFormElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.target.name as keyof ContactFields;
    setFormData({ ...formData, [key]: e.target.value });
    if (status === "sent" || status === "error") setStatus("idle");
    // a field that was flagged is re-checked as you fix it, so the message goes away the moment it is right
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: fieldProblem(key, e.target.value) ?? undefined }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.target.name as keyof ContactFields;
    if (!e.target.value.trim()) return; // an empty field is only flagged when you try to send
    setErrors((prev) => ({ ...prev, [key]: fieldProblem(key, e.target.value) ?? undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validateContact(formData);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("idle");
      const first = (["name", "email", "subject", "message"] as const).find((k) => found[k]);
      if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    if (!server) {
      // without the server address the request would go to this site's own "/undefined/..." and fail
      setFailure({ text: "Messages can't be sent from here right now.", mail: true });
      setStatus("error");
      return;
    }
    setStatus("sending");
    const clean = { name: formData.name.trim(), email: formData.email.trim(), subject: formData.subject.trim(), message: formData.message.trim() };
    try {
      const res = await axios.post(`${server.replace(/\/+$/, "")}/api/v1/contact`, clean, { timeout: 15000 });
      if (res.data?.success) {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setStatus("sent");
      } else {
        setFailure({ text: "That didn't go through.", mail: true });
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      const r = axiosResponse(err);
      // a message from the server (like "invalid email") is shown as it is; anything else means we could not reach it
      const fromServer = r && r.status >= 400 && r.status < 500 && r.status !== 404 && typeof r.data?.msg === "string" ? r.data.msg : "";
      setFailure(fromServer ? { text: fromServer, mail: false } : { text: "We couldn't reach the server.", mail: true });
      setStatus("error");
    }
  };

  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  const note = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <Nav />
      <main>
        {/* masthead */}
        <header className={`${WRAP} pt-14 md:pt-20`}>
          <motion.div {...rise()} className="flex flex-col gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">Get in touch · GDGC MJCET</p>
              <h1 className="mt-4 text-[clamp(3.5rem,11vw,10rem)] leading-[0.86] font-black tracking-[-0.05em]">
                Say <Outline>hello</Outline>
                <Dot color="bg-google-red" />
              </h1>
            </div>
            <p className="max-w-[22rem] text-base leading-relaxed text-white/65 md:mb-3 md:text-right">
              Questions, collaborations, a room for your event or just an idea. We read everything.
            </p>
          </motion.div>
        </header>

        <section className={`${WRAP} grid gap-14 py-12 md:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20`}>
          {/* ways to reach us */}
          <motion.div {...rise(0.1)}>
            <h2 className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">Find your people</h2>
            <ul className="mt-5 border-t border-white/15">
              {CHANNELS.map(({ label: l, value, icon: Icon, tone, ...rest }, i) => {
                const href = "href" in rest ? rest.href : undefined;
                const body = (
                  <>
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 ${tone}`}>
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] tracking-[0.25em] text-white/50 uppercase">{l}</span>
                      <span className="mt-1 block text-lg leading-snug text-white sm:text-xl">{value}</span>
                    </span>
                    {href && (
                      <ArrowUpRight size={18} className="shrink-0 text-white/40 transition-all duration-300 group-hover:rotate-45 group-hover:text-white" />
                    )}
                  </>
                );
                return (
                  <motion.li
                    key={l}
                    className="border-b border-white/15"
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 + i * 0.07, ease: EASE }}
                  >
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="group flex items-center gap-5 py-5"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-center gap-5 py-5">{body}</div>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            <p className="mt-8 text-sm text-white/55">Follow along for events, builds and announcements.</p>
            <div className="mt-4 flex gap-3">
              {SOCIALS.map(({ label: l, href, icon: Icon }) => (
                <a
                  key={l}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* the form */}
          <motion.div {...rise(0.2)}>
            <h2 className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">Send a message</h2>
            <form ref={form} onSubmit={handleSubmit} noValidate className="mt-5 space-y-8 border-t border-white/15 pt-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={label}>Name</label>
                  <input id="c-name" type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} required maxLength={LIMITS.name[1] + 20} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} className={field(!!errors.name)} placeholder="Your name" autoComplete="name" />
                  <FieldError id="c-name-err" text={errors.name} />
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>Email</label>
                  <input id="c-email" type="email" inputMode="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} required autoCapitalize="none" spellCheck={false} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} className={field(!!errors.email)} placeholder="you@email.com" autoComplete="email" />
                  <FieldError id="c-email-err" text={errors.email} />
                </div>
              </div>
              <div>
                <label htmlFor="c-subject" className={label}>Subject</label>
                <input id="c-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} onBlur={handleBlur} required maxLength={LIMITS.subject[1] + 20} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "c-subject-err" : undefined} className={field(!!errors.subject)} placeholder="What is this about?" />
                <FieldError id="c-subject-err" text={errors.subject} />
              </div>
              <div>
                <label htmlFor="c-message" className={label}>Message</label>
                <textarea id="c-message" name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur} required rows={5} maxLength={LIMITS.message[1] + 200} aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-err" : undefined} className={`${field(!!errors.message)} resize-none`} placeholder="Tell us more…" />
                <FieldError id="c-message-err" text={errors.message} />
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(255,255,255,0.35)] disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
                </button>
                <AnimatePresence mode="wait">
                  {status === "sent" && (
                    <motion.p key="sent" role="status" aria-live="polite" {...note} className="inline-flex items-center gap-2 text-sm text-google-green">
                      <Check size={16} /> Message sent. Thank you!
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p key="error" role="status" aria-live="polite" {...note} className="text-sm text-google-red">
                      {failure.text}
                      {failure.mail && (
                        <>
                          {" "}
                          Please email us at{" "}
                          <a href={`mailto:${MAIL}`} className="underline underline-offset-4 hover:text-white">
                            {MAIL}
                          </a>{" "}
                          instead.
                        </>
                      )}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
