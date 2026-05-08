import { useState, useEffect } from "react";
import ExeCard from "./ExeCard";
import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, "");

const FILTERS = [
  "ALL", "WEB", "UI/UX", "AI/ML", "CYBERSEC", "CLOUD",
  "HR", "MEDIA", "DESIGN", "DOC", "EVENTS", "OPERATIONS", "MARKETING", "DSA",
];

export default function ExeSection({ activeFilter, setActiveFilter }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${SERVER}/api/v1/team?role=EXECOM`);
        setMembers(data.members || []);
      } catch (err) {
        console.error("Failed to fetch EXECOM:", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filtered =
    activeFilter === "ALL" ? members : members.filter((m) => m.domain === activeFilter);

  return (
    <section className="w-full text-white min-h-screen overflow-hidden">

      {/* ── Header ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 md:gap-6 mb-16">
        <h2 className="text-transparent  font-sans text-5xl md:pb-32 pb-6" style={{
                background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
          Executive Committee
        </h2>

        <p className="text-white">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates
          blanditiis eius error officia impedit corporis consequuntur laboriosam
          culpa voluptatem sed nostrum voluptas esse, cumque dolorem aperiam
          repudiandae vitae omnis suscipit ut quos, eaque libero magnam
          incidunt. Est dolorum cum enim adipisci impedit perspicatis eum,
          omnis, consequuntur reprehenderit voluptas unde. Quaerat.
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
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500">No members found</div>
        ) : (
          <div className="grid md:grid-cols-2 gird-cols-1 lg:grid-cols-4 space-y-10 gap-x-8 gap-y-10">
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