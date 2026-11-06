import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { MEDIUM_URL, POSTS, type Post } from "../components/blogs/posts";
import { Dot, Outline } from "../components/fx/designSystem";
import { EASE } from "../components/fx/tokens";

const WRAP = "mx-auto w-full max-w-[1400px] px-5 sm:px-10 lg:px-16";
const DOTS = ["bg-google-blue", "bg-google-red", "bg-google-yellow", "bg-google-green"];

function Byline({ p, i }: { p: Post; i: number }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium tracking-[0.2em] text-white/55 uppercase">
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[i % 4]}`} />
      {p.author}
      <span className="text-white/25">·</span>
      {p.date}
    </p>
  );
}

// a post's cover; it settles from a slight zoom as it scrolls in, and zooms gently on hover
function Cover({ p, className }: { p: Post; className: string }) {
  const reduce = !!useReducedMotion();
  return (
    <div className={`overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 ${className}`}>
      <motion.img
        src={p.image}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        initial={reduce ? false : { scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </div>
  );
}

// The blog, as an editorial front page: the latest post as the cover story, then the rest as big rows.
// Every post opens on Medium.
const BlogsPage = () => {
  const reduce = !!useReducedMotion();
  const [lead, ...rest] = POSTS;
  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <Nav />
      <main>
        {/* masthead */}
        <header className={`${WRAP} pt-14 md:pt-20`}>
          <motion.div {...reveal()} className="flex flex-col gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">The GDGC MJCET Blog · Phase Three — Now</p>
              <h1 className="mt-4 text-[clamp(3.5rem,11vw,10rem)] leading-[0.86] font-black tracking-[-0.05em]">
                Field <Outline>Notes</Outline>
                <Dot color="bg-google-yellow" />
              </h1>
            </div>
            <div className="flex flex-col gap-4 md:mb-3 md:items-end md:text-right">
              <p className="max-w-[22rem] text-base leading-relaxed text-white/65">
                What we break, build and learn along the way, written up by the people who did it.
              </p>
              <a
                href={MEDIUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-white"
              >
                Follow us on Medium <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </div>
          </motion.div>
        </header>

        {/* the cover story */}
        {lead && (
          <section aria-label="Latest post" className={`${WRAP} pt-12 md:pt-16`}>
            <a href={lead.url} target="_blank" rel="noopener noreferrer" className="group grid items-center gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-14">
              <motion.div {...reveal()}>
                <Cover p={lead} className="aspect-[16/10]" />
              </motion.div>
              <motion.div {...reveal(0.1)}>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-black uppercase">
                  Latest
                </p>
                <Byline p={lead} i={0} />
                <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.75rem)] leading-[0.98] font-black tracking-[-0.035em] transition-colors group-hover:text-white/85">
                  {lead.title}
                </h2>
                <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-white/65">{lead.subtitle}</p>
                <span className="mt-8 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow group-hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]">
                  Read on Medium
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </span>
              </motion.div>
            </a>
          </section>
        )}

        {/* the rest */}
        <section aria-label="More posts" className={`${WRAP} pt-24 pb-10 md:pt-32`}>
          <p className="border-b border-white/15 pb-5 text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">More from the notebook</p>
          <ol>
            {rest.map((p, k) => (
              <motion.li key={p.url} {...reveal(k * 0.05)} className="border-b border-white/10">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="group grid items-center gap-6 py-10 md:grid-cols-[4rem_minmax(0,1fr)_18rem] md:gap-10 md:py-12">
                  <span className="hidden text-[2.75rem] leading-none font-black tracking-[-0.04em] md:block">
                    <Outline>{String(k + 2).padStart(2, "0")}</Outline>
                  </span>
                  <div className="order-2 md:order-none">
                    <Byline p={p} i={k + 1} />
                    <h3 className="mt-3 text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.02] font-black tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-white/55">{p.subtitle}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Cover p={p} className="order-1 aspect-[16/10] md:order-none" />
                </a>
              </motion.li>
            ))}
          </ol>

          <motion.div {...reveal()} className="mt-20 flex flex-col items-center gap-6 text-center">
            <p className="text-[clamp(2rem,4.5vw,4rem)] leading-[0.95] font-black tracking-[-0.04em]">
              Got something to <Outline>write</Outline>?<Dot color="bg-google-green" />
            </p>
            <p className="max-w-[28rem] text-base text-white/60">Members write here. Tell us what you&apos;ve been tinkering with and we&apos;ll help you publish it.</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_44px_rgba(66,133,244,0.6)]"
            >
              Pitch a post
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogsPage;
