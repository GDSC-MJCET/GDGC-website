import { ArrowRight } from "lucide-react";

export default function Events() {
  const cards = [
    {
      title: "Pixel X — Frontend Mastery",
      text: "Learn real-world frontend engineering with production-grade workflows. Learn real-world frontend engineering with production-grade workflows.",
      image: "/poster.png",
      color: "#38BDF8",
      date: "December 2025",
    },
    {
      title: "Pixel X — Frontend Mastery",
      text: "Learn real-world frontend engineering with production-grade workflows. Learn real-world frontend engineering with production-grade workflows.",
      image: "/poster.png",
      color: "#EC4899",
      date: "December 2025",
    },
    {
      title: "Pixel X — Frontend Mastery",
      text: "Learn real-world frontend engineering with production-grade workflows. Learn real-world frontend engineering with production-grade workflows.",
      image: "/poster.png",
      color: "#22C55E",
      date: "December 2025",
    },
    {
      title: "Pixel X — Frontend Mastery",
      text: "Learn real-world frontend engineering with production-grade workflows. Learn real-world frontend engineering with production-grade workflows.",
      image: "/poster.png",
      color: "#FACC15",
      date: "December 2025",
    },
  ];

  return (
    <section className="relative py-20 items-center">
      {/* <div className="hidden md:block relative w-full items-center" style={{ height: "380vh" }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              top: `${20 + i * 7}vh`,
              width: `${82 + i * 4}%`,
            }}
            className="sticky flex justify-center items-center h-[80vh] w-full mb-12 z-20"
          >
            <EventCard card={card} />
          </div>
        ))}
      </div> */}
      <div className="hidden md:block relative w-full" style={{ height: "380vh" }}>
  {cards.map((card, i) => (
    <div
      key={i}
      className="sticky top-[20vh] flex justify-center h-[80vh] mb-12 z-20 md:px-12"
      style={{
        top: `${20 + i * 7}vh`,
      }}
    >
      <div
        style={{ width: `${74 + i * 4}%` }}
        className="flex justify-center" 
      >
        <EventCard card={card} />
      </div>
    </div>
  ))}
</div>


      <div className="md:hidden space-y-10 px-4">
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              top: `${10 + i * 6}vh`,
            }}
            className="sticky flex justify-center items-center h-[65vh] w-full mb-10 z-20"
          >
            <EventCard card={card} mobile />
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col md:flex-row gap-6 justify-between items-center max-w-6xl mx-auto px-6">
        <ActionButton label="Live Events" color="#5ddb6e" />
        <ActionButton label="Past Events" color="#ffe7a5" />
      </div>
    </section>
  );
}

function EventCard({ card, mobile = false }) {
  return (
    <div
      style={{ backgroundColor: card.color }}
      className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="flex justify-between items-center px-6 py-4 text-black">
        <span className="uppercase tracking-wide text-sm">{card.date}</span>
        <span className="text-sm font-medium">GDGC MJCET</span>
      </div>

      <hr className="h-0.5 bg-black mx-6" />

      <div className="p-6 text-black">
        <div className="flex items-center justify-between gap-6 mb-4">
          <h2 className="font-bold text-2xl md:text-5xl">{card.title}</h2>
          <ArrowRight className="w-6 h-6 md:w-12 md:h-12" />
        </div>

        <p className="text-sm md:text-lg opacity-80 max-w-2xl">
          {card.text}
        </p>
      </div>

      <div className="px-4 pb-6">
        <img
          src={card.image}
          alt=""
          className={`w-full rounded-2xl object-cover ${
            mobile ? "h-56" : "h-[44vh]"
          }`}
        />
      </div>
    </div>
  );
}

function ActionButton({ label, color }) {
  return (
    <button
      style={{ backgroundColor: color }}
      className="flex items-center gap-3 text-black font-bold px-4 py-2 rounded-full"
    >
      <span>{label}</span>
      <span className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full">
        →
      </span>
    </button>
  );
}
