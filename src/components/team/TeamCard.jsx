import { useState, useEffect } from "react";
import { IconBrandGithub, IconBrandLinkedin, IconX } from "@tabler/icons-react";
import { LiaPlusSolid } from "react-icons/lia";

// ─── Profile Overlay ────────────────────────────────────────────────────────
function ProfileOverlay({ person, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: isOpen ? "blur(10px)" : "blur(0px)",
          WebkitBackdropFilter: isOpen ? "blur(10px)" : "blur(0px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s ease, backdrop-filter 0.4s ease",
        }}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-hidden"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden my-auto"
          style={{
            maxWidth: "480px",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 40%, #0d1f0d 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 80px rgba(205,246,197,0.08), 0 40px 80px rgba(0,0,0,0.7)",
            transform: isOpen ? "translateY(0) scale(1)" : "translateY(48px) scale(0.95)",
            opacity: isOpen ? 1 : 0,
            transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 0%, rgba(248,216,216,0.08) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(205,246,197,0.08) 0%, transparent 55%)",
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full text-white/50 hover:text-white cursor-pointer transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <IconX size={15} />
          </button>

          <div
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(200px, 48vw, 280px)" }}
          >
            <img
              src={person.image}
              alt={person.name}
              className="w-full h-full object-cover object-top"
              style={{ filter: "brightness(0.7)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, #131313 0%, rgba(13,13,13,0.25) 55%, transparent 100%)",
              }}
            />
            <div className="absolute bottom-4 left-5 right-12 z-10">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{
                  background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {person.role}
              </p>
              <h2
                className="font-light tracking-tight text-white leading-tight"
                style={{ fontSize: "clamp(1.35rem, 5vw, 1.9rem)" }}
              >
                {person.name}
              </h2>
            </div>
          </div>

          <div className="relative z-10 px-5 py-5">
            <div
              className="w-full h-px mb-5"
              style={{
                background: "linear-gradient(to right, rgba(248,216,216,0.35), rgba(205,246,197,0.35), transparent)",
              }}
            />
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "rgba(205,246,197,0.5)" }}
            >
              About
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.62)" }}>
              {person.about}
            </p>
            {person.tags && person.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {person.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {(person.linkedin || person.github) && (
              <div className="flex flex-wrap gap-3">
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(248,216,216,0.12)";
                      e.currentTarget.style.borderColor = "rgba(248,216,216,0.35)";
                      e.currentTarget.style.color = "#f8d8d8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    <IconBrandLinkedin size={16} />
                    LinkedIn
                  </a>
                )}
                {person.github && (
                  <a
                    href={person.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(205,246,197,0.12)";
                      e.currentTarget.style.borderColor = "rgba(205,246,197,0.35)";
                      e.currentTarget.style.color = "#cdf6c5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    <IconBrandGithub size={16} />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── TeamCard ────────────────────────────────────────────────────────────────
export default function TeamCard({ side, role, name, image, linkedin, github, about, tags }) {
  const isLeft = side === "left";
  const [isOpen, setIsOpen] = useState(false);

  const person = { side, role, name, image, linkedin, github, about, tags };

  return (
    <>
      {/* ── Mobile: simple card, image side alternates with `side` prop ── */}
      <div className="flex md:hidden w-full max-w-xs rounded-xl overflow-hidden text-white"
        style={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 40%, #0d1f0d 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={() => setIsOpen(true)}
      >
        {/* Image — left when side="left" */}
        {isLeft && (
          <div className="w-28 flex-shrink-0 overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover object-top" />
          </div>
        )}

        {/* Text */}
        <div className={`flex-1 p-3 flex flex-col justify-center min-w-0 ${isLeft ? "text-left" : "text-right"}`}>
          <p
            className="text-xs mb-0.5 truncate"
            style={{
              background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {role}
          </p>
          <h3 className="text-base leading-tight mb-2">{name}</h3>
          {/* <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white/60 hover:bg-white hover:text-red-500 cursor-pointer text-black px-1 flex justify-center items-center rounded-sm text-lg transition-colors duration-200"
              aria-label={`View ${name}'s profile`}
            >
              <LiaPlusSolid /> <span>View Info</span>
            </button>
          </div> */}
        </div>

        {/* Image — right when side="right" */}
        {!isLeft && (
          <div className="w-28 flex-shrink-0 overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover object-top" />
          </div>
        )}
      </div>

      {/* ── Desktop: original horizontal timeline card ── */}
      <div className={`hidden md:flex w-full overflow-hidden cursor-pointer duration-75 group-hover:scale-110 sm:w-80 ${isLeft ? "justify-end" : "justify-start"}`} title="View Info" onClick={() => setIsOpen(true)}>
        <div className="flex w-full justify-center md:justify-around items-center overflow-hidden rounded-xl gap-2 text-white">

          {isLeft && (
            <div className="w-36 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover grayscale-100 hover:grayscale-0 shadow-black transition-transform duration-500 hover:scale-110"
              />
            </div>
          )}

          <div className={`flex-1 p-2 min-w-0 group-hover:scale-105 duration-75 ${isLeft ? "text-right" : "text-left"}`}>
            <p
              className="font-sans text-xs sm:text-sm mb-1 truncate"
              style={{
                background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {role}
            </p>
            <h3 className="text-lg sm:text-2xl leading-tight mb-1">{name}</h3>
            {/* <div className={`flex gap-2 mt-1 items-center ${isLeft ? "justify-end" : "justify-start"}`}>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-white/60 hover:bg-white hover:text-red-500 cursor-pointer text-black px-1 flex justify-center items-center rounded-sm text-xl mt-2 transition-colors duration-200"
                aria-label={`View ${name}'s profile`}
              >
                <span className="text-sm">View Info</span>
              </button>
            </div> */}
          </div>

          {!isLeft && (
            <div className="w-36 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover grayscale-100 hover:grayscale-0 transition-transform duration-500 hover:scale-110"
              />
            </div>
          )}
        </div>
      </div>

      <ProfileOverlay
        person={person}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}