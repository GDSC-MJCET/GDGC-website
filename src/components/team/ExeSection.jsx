import ExeCard from "./ExeCard";

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const members = [
  // WEB
  { name: "Aryan Mehta",     image: "https://i.pravatar.cc/300?img=1",  domain: "WEB",        linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Sara Qureshi",    image: "https://i.pravatar.cc/300?img=2",  domain: "WEB",        linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Nabil Hasan",     image: "https://i.pravatar.cc/300?img=3",  domain: "WEB",        linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Zara Fatima",     image: "https://i.pravatar.cc/300?img=4",  domain: "WEB",        linkedin: "https://linkedin.com", instagram: "https://instagram.com" },

  // UI/UX
  { name: "Layla Noor",      image: "https://i.pravatar.cc/300?img=5",  domain: "UI/UX",      linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Rohan Sharma",    image: "https://i.pravatar.cc/300?img=6",  domain: "UI/UX",      linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Isha Patel",      image: "https://i.pravatar.cc/300?img=7",  domain: "UI/UX",      linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Omar Khalid",     image: "https://i.pravatar.cc/300?img=8",  domain: "UI/UX",      linkedin: "https://linkedin.com", github: "https://github.com" },

  // AI/ML
  { name: "Ayesha Raza",     image: "https://i.pravatar.cc/300?img=9",  domain: "AI/ML",      linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Farhan Ali",      image: "https://i.pravatar.cc/300?img=10", domain: "AI/ML",      linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Priya Nair",      image: "https://i.pravatar.cc/300?img=11", domain: "AI/ML",      linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Zaid Mirza",      image: "https://i.pravatar.cc/300?img=12", domain: "AI/ML",      linkedin: "https://linkedin.com", github: "https://github.com" },

  // CYBERSEC
  { name: "Hamza Sheikh",    image: "https://i.pravatar.cc/300?img=13", domain: "CYBERSEC",   linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Nadia Ansari",    image: "https://i.pravatar.cc/300?img=14", domain: "CYBERSEC",   linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Amir Baig",       image: "https://i.pravatar.cc/300?img=15", domain: "CYBERSEC",   linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Sana Rizvi",      image: "https://i.pravatar.cc/300?img=16", domain: "CYBERSEC",   linkedin: "https://linkedin.com", instagram: "https://instagram.com" },

  // CLOUD
  { name: "Kabir Joshi",     image: "https://i.pravatar.cc/300?img=17", domain: "CLOUD",      linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Mehak Siddiqui",  image: "https://i.pravatar.cc/300?img=18", domain: "CLOUD",      linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Tariq Hassan",    image: "https://i.pravatar.cc/300?img=19", domain: "CLOUD",      linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Riya Kapoor",     image: "https://i.pravatar.cc/300?img=20", domain: "CLOUD",      linkedin: "https://linkedin.com", instagram: "https://instagram.com" },

  // HR
  { name: "Amna Butt",       image: "https://i.pravatar.cc/300?img=21", domain: "HR",         linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Salman Qazi",     image: "https://i.pravatar.cc/300?img=22", domain: "HR",         linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Fatima Zahra",    image: "https://i.pravatar.cc/300?img=23", domain: "HR",         linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Usman Tariq",     image: "https://i.pravatar.cc/300?img=24", domain: "HR",         linkedin: "https://linkedin.com", github: "https://github.com" },

  // MEDIA
  { name: "Hira Malik",      image: "https://i.pravatar.cc/300?img=25", domain: "MEDIA",      linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Danish Syed",     image: "https://i.pravatar.cc/300?img=26", domain: "MEDIA",      linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Maryam Khan",     image: "https://i.pravatar.cc/300?img=27", domain: "MEDIA",      linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Bilal Chaudhry",  image: "https://i.pravatar.cc/300?img=28", domain: "MEDIA",      linkedin: "https://linkedin.com", instagram: "https://instagram.com" },

  // DESIGN
  { name: "Aliya Shaikh",    image: "https://i.pravatar.cc/300?img=29", domain: "DESIGN",     linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Junaid Rauf",     image: "https://i.pravatar.cc/300?img=30", domain: "DESIGN",     linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Nimra Asif",      image: "https://i.pravatar.cc/300?img=31", domain: "DESIGN",     linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Rehan Baig",      image: "https://i.pravatar.cc/300?img=32", domain: "DESIGN",     linkedin: "https://linkedin.com", instagram: "https://instagram.com" },

  // DOC
  { name: "Sadia Imran",     image: "https://i.pravatar.cc/300?img=33", domain: "DOC",        linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Ahsan Nawaz",     image: "https://i.pravatar.cc/300?img=34", domain: "DOC",        linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Maira Hussain",   image: "https://i.pravatar.cc/300?img=35", domain: "DOC",        linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Faizan Iqbal",    image: "https://i.pravatar.cc/300?img=36", domain: "DOC",        linkedin: "https://linkedin.com", github: "https://github.com" },

  // EVENTS
  { name: "Kiran Shakeel",   image: "https://i.pravatar.cc/300?img=37", domain: "EVENTS",     linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Waleed Aslam",    image: "https://i.pravatar.cc/300?img=38", domain: "EVENTS",     linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Hana Zubair",     image: "https://i.pravatar.cc/300?img=39", domain: "EVENTS",     linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Saad Kamran",     image: "https://i.pravatar.cc/300?img=40", domain: "EVENTS",     linkedin: "https://linkedin.com", github: "https://github.com" },

  // OPERATIONS
  { name: "Lubna Farooq",    image: "https://i.pravatar.cc/300?img=41", domain: "OPERATIONS", linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Hassan Mehmood",  image: "https://i.pravatar.cc/300?img=42", domain: "OPERATIONS", linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Shazia Rehman",   image: "https://i.pravatar.cc/300?img=43", domain: "OPERATIONS", linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Imran Siddiq",    image: "https://i.pravatar.cc/300?img=44", domain: "OPERATIONS", linkedin: "https://linkedin.com", github: "https://github.com" },

  // MARKETING
  { name: "Rabia Naz",       image: "https://i.pravatar.cc/300?img=45", domain: "MARKETING",  linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Adil Ghani",      image: "https://i.pravatar.cc/300?img=46", domain: "MARKETING",  linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Sumbul Haider",   image: "https://i.pravatar.cc/300?img=47", domain: "MARKETING",  linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  { name: "Talha Waqar",     image: "https://i.pravatar.cc/300?img=48", domain: "MARKETING",  linkedin: "https://linkedin.com", github: "https://github.com" },
];

const FILTERS = [
  "ALL", "WEB", "UI/UX", "AI/ML", "CYBERSEC", "CLOUD",
  "HR", "MEDIA", "DESIGN", "DOC", "EVENTS", "OPERATIONS", "MARKETING",
];

// ─── ExeSection ──────────────────────────────────────────────────────────────
export default function ExeSection({ activeFilter, setActiveFilter }) {
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
          incidunt. Est dolorum cum enim adipisci impedit perspiciatis eum,
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
        <div className="grid md:grid-cols-2 gird-cols-1 lg:grid-cols-4 space-y-10 gap-x-8 gap-y-10">
          {filtered.map((member, i) => (
            <ExeCard key={`${member.domain}-${i}`} {...member} />
          ))}
        </div>
      </div>

    </section>
  );
}