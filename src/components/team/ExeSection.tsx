export default function ExeSection() {
  return (
    <section className="w-full text-white overflow-hidden">
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
          The Executive Committee is formed and appointed by the Governing Body. They are the subject matter experts who lead various domains within the chapter. The EXECOM is responsible for hiring and managing their own Core team members, overseeing major executions, and ensuring that every initiative is executed with excellence and alignment to the chapter's goals.
        </p>
      </div>

      {/* ── Coming soon ── */}
      <div className="px-8 md:px-16 pb-20">
        <div className="min-h-[240px] flex items-center justify-center text-muted-foreground text-lg text-center">
          Coming Soon — the Executive Committee for this term hasn't been finalized yet.
        </div>
      </div>
    </section>
  );
}
