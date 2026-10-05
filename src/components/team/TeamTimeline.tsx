import { ThreeDPhotoCarousel } from "../ui/3d-carousel";

const GB_MEMBERS = [
  { name: "Afzal Hashmi", role: "Chief Coordinator", image: "/gb-267/afzal-hashmi.png" },
  { name: "Liyaqat Ahmed", role: "Chief Coordinator", image: "/gb-267/liyaqat-ahmed.png" },
  { name: "Misbah Hussien", role: "General Secretary", image: "/gb-267/misbah-hussien.png" },
  { name: "Linra Khan", role: "General Secretary", image: "/gb-267/linra-khan.png" },
  { name: "Rehmath Unnisa", role: "Chief Representative", image: "/gb-267/rehmath-unnisa.png" },
  { name: "Ibrahim Wajid", role: "Chief Representative", image: "/gb-267/ibrahim-wajid.png" },
  { name: "Afra Ahmed", role: "Treasurer", image: "/gb-267/afra-ahmed.png" },
  { name: "Ayaan Tabrez", role: "Tech Captain", image: "/gb-267/ayaan-tabrez.png" },
  { name: "Moid Abdul", role: "Tech Captain", image: "/gb-267/moid-abdul.png" },
  { name: "Afeefuddin", role: "Tech Captain", image: "/gb-267/afeef-uddin.png" },
];

export default function VerticalLineTimeline() {
  return (
    <div className="overflow-hidden min-h-screen py-20 px-4">
      <div className="relative overflow-hidden py-16 sm:py-20 md:py-20">
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="flex animate-marquee gap-16 sm:gap-20 md:gap-24 lg:gap-32 whitespace-nowrap pb-6">
            <h1 className="outline-text text-[4rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem] xl:text-[16rem] font-sans font-semibold">
              Meet the Team
            </h1>
            <h1 className="outline-text text-[4rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem] xl:text-[16rem] font-sans font-semibold">
              Meet the Team
            </h1>
          </div>
        </div>

        <h1 className="relative z-10 text-center text-shadow-xl text-shadow-white bg-linear-to-r from-[#f8d8d8] to-[#cdf6c5] bg-clip-text text-transparent font-sans text-[3rem] sm:text-[5rem] md:text-[8rem]  font-light px-4">
          Meet the Team
        </h1>
      </div>

      {/* ── Governing Body heading ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 gap-6 mb-16">
        <h2
          className="text-transparent font-sans text-5xl md:pb-32 pb-2"
          style={{
            background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Governing Body
        </h2>
        <p className="text-white">
          The Governing Body stands at the apex of GDGC MJCET's hierarchy. They are responsible for steering the chapter's overall direction, establishing policies, and maintaining accountability. The Governing Body has the authority to appoint and form the Executive Committee, ensuring that leadership aligns with the chapter's mission and values.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <ThreeDPhotoCarousel items={GB_MEMBERS} />
      </div>
    </div>
  );
}
