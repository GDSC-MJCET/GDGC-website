import { useState } from "react";
import ExeCard from "./ExeCard";
import coreData from "../../core.json";

const FILTERS = [
  "ALL", "WEB", "UI/UX", "AI/ML", "CYBERSEC", "CLOUD",
  "HR", "MEDIA", "DESIGN", "DOC", "EVENTS", "OPERATIONS", "MARKETING", "DSA", "PR",
];

const members = Object.values(coreData.domains).flat();

export default function CoreSection({ activeFilter, setActiveFilter }) {
  const filtered =
    activeFilter === "ALL" ? members : members.filter((m) => m.domain === activeFilter);

  return (
    <section className="w-full text-white min-h-screen overflow-hidden mt-18">

      {/* ── Header ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 md:gap-6 mb-16">
        <h2 className="text-transparent  font-sans text-5xl md:pb-32 pb-6" style={{
                background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
          Core Team
        </h2>

        <p className="text-white">
          The Core Team is the heartbeat of GDGC MJCET — the learners, the doers, and the future leaders. Under the mentorship of the Executive Committee, they gain hands-on experience, develop domain expertise, and shine as the lime light of the club through various events and initiatives. Core members represent the chapter at the ground level and are the driving force behind execution.
        </p>
      </div>

      {/* ── Filter bar ── */}
      <div className="px-8 md:px-16 mb-10">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200"
                style={{
                  background: activeFilter === f
                    ? "linear-gradient(to right, rgba(248,216,216,0.15), rgba(205,246,197,0.15))"
                    : "rgba(255,255,255,0.04)",
                  border: activeFilter === f
                    ? "1px solid rgba(205,246,197,0.35)"
                    : "1px solid rgba(255,255,255,0.08)",
                  color: activeFilter === f
                    ? "#cdf6c5"
                    : "rgba(255,255,255,0.4)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Thin gradient rule below filters */}
        <div
          className="w-full h-px mt-6"
          style={{
            background:
              "linear-gradient(to right, rgba(248,216,216,0.2), rgba(205,246,197,0.2), transparent)",
          }}
        />
      </div>

      {/* ── Cards grid ── */}
      <div className="px-8 md:px-16">
        {filtered.length === 0 ? (
          <div className="text-gray-500">No members found</div>
        ) : (
          <div className="grid md:grid-cols-3 gird-cols-1 lg:grid-cols-5 space-y-10 gap-x-8 gap-y-10">
            {filtered.map((member, i) => (
              <ExeCard
                key={`${member.domain}-${member._id}-${i}`}
                name={member.name}
                image={member.image}
                domain={member.domain}
                linkedin={member.linkedin}
                github={member.github}
                instagram={member.instagram}
              />
            ))}
          </div>
        )}
      </div>

    </section>
  );
}