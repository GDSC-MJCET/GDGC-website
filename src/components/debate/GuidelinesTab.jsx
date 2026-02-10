import { useState } from "react";

function TabButton({ id, label, active, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className={`
        relative px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 bg-[#111a29] text-white
        text-sm sm:text-base md:text-lg
        ${active === id ? "font-semibold" : "opacity-70"}
      `}
    >
      {label}

      {active === id && (
        <>
          <span className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-green-400" />
          <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-green-400" />
          <span className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-green-400" />
          <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-green-400" />
        </>
      )}
    </button>
  );
}

export default function GuidelinesTab() {
  const [active, setActive] = useState("rules");

  const rules = [
    "Each club may register one team of 5 members (3 active + 2 reserves) ,  cross-chapter teams are prohibited",
    "⁠Only verified speakers with valid chapter proof may participate; others will be disqualified",
    "Complete registration with verified speaker details is mandatory for final selection",
    "⁠Teams must report 15 minutes early , late reporting may result in forfeiture or disqualification",
    "⁠The event follows a single-elimination knockout format starting from the Round of 16",
    "⁠Random and transparent draws for clubs , topics, stances, and time slots will be held on 10th February",
    "⁠Each debate is 30 minutes , with strict time limits for all rounds ; penalties apply for overruns",
    "⁠Rebuttals must address existing arguments only ; no new arguments are allowed"
  ];

  const judging = [
    "judging criteria will be annouced soon !!"
  ];

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-22 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-22">
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        <TabButton
          id="rules"
          label="Rules"
          active={active}
          setActive={setActive}
        />
        <TabButton
          id="judging"
          label="Judging Criteria"
          active={active}
          setActive={setActive}
        />
      </div>

      <ul className="min-h-[300px] text-white text-base sm:text-lg md:text-xl lg:text-2xl space-y-2 sm:space-y-2.5 md:space-y-3 list-disc list-inside">
        {(active === "rules" ? rules : judging).map((item, i) => (
          <li key={i} className="leading-relaxed opacity-90">
            {item}
          </li>
        ))}
      </ul>
      <div className="gap-4 flex flex-row">
        <a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/1ojSPsRsuG6zZ2yKYaSEmzmH6Cxfik0JL/view"  className="p-3 bg-[#111a29] hover:bg-white hover:text-[#111a29]  font-mono text-white">Download Rule Book</a>
        
        <button className="p-3 bg-[#111a29]  hover:bg-white hover:text-[#111a29] font-mono text-white">Download Judging Criteria</button>
      </div>
    </div>
  );
}