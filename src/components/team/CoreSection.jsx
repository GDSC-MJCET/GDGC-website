export default function CoreSection() {
  return (
    <section className="w-full text-white overflow-hidden mt-18">
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

      {/* ── Coming soon ── */}
      <div className="px-8 md:px-16 pb-20">
        <div className="min-h-[240px] flex items-center justify-center text-muted-foreground text-lg text-center">
          Coming Soon — the Core Team for this term hasn't been finalized yet.
        </div>
      </div>
    </section>
  );
}
