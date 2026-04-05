// import { motion } from "framer-motion";
// import TeamCard from "./TeamCard";
// // src/components/team
// import abrar from "/src/assets/abrar2.png";
// import aimen from "/src/assets/aimenn2.png";
// import adeeba from "/src/assets/adeeba2.png";
// import atif from "/src/assets/atif2.png";
// import amaan from "/src/assets/amaan2.png";
// import hadi from "/src/assets/hadi2.png";
// import saleha from "/src/assets/saleha2.png";
// import zoha from "/src/assets/zoha2.png";
// import sami from "/src/assets/smaii.png";
// import talib from "/src/assets/talib2.png";
// import { LiaLinkedin } from "react-icons/lia";

// export default function VerticalLineTimeline() {
//   // const team = [
//   //   { name: "Mohammed Abrar", role: "GDGC Organiser", image: abrar ,github: "https://github.com/mohammedabrar2004" , linkedin:"https://in.linkedin.com/in/mohammed-abrar-farooque"},
//   //   { name: "Mohammed Abdul Hadi", role: "Treasurer", image: hadi ,github: "" , linkedin:"https://in.linkedin.com/in/abdul-hadi-a3694725b"},
//   //   { name: "Aimen Laiba", role: "Chief Coordinator", image: aimen ,github: "https://github.com/aimenlaiba" , linkedin:"https://in.linkedin.com/in/aimen-laiba"},
//   //   { name: "Mohammed Amaan", role: "Chief Coordinator", image: amaan ,github: "https://github.com/mohammed-amaan04" , linkedin:"https://in.linkedin.com/in/mohammed-amaan-mahmood-khan-7b8167215" },
//   //   { name: "Syed Atif", role: "General Secretary", image: atif ,github: "https://github.com/syedatif04" , linkedin:"https://in.linkedin.com/in/syed-atif04" },
//   //   { name: "Zoha Maria", role: "General Secretary", image: zoha ,github: "https://github.com/zohamaria" , linkedin:"https://in.linkedin.com/in/syedazohamaria" },
//   //   { name: "Adeeba Anees", role: "Chief Representative", image: adeeba, github: "https://github.com/adeebaanees" , linkedin:"https://in.linkedin.com/in/adeeba-anees-0807562a1" },
//   //   { name: "Aqueeb Talib", role: "Chief Representative", image: talib,github: "https://github.com/flexsyyy" , linkedin:"https://in.linkedin.com/in/syed-aqeeb-talib-08326125a" },
//   //   { name: "Mohammed Sami", role: "Tech Captain", image: sami,github: "https://github.com/Ms3314" , linkedin:"https://in.linkedin.com/in/sami31" },
//   //   { name: "Saleha Abdul Baseer", role: "Tech Captain", image: saleha,github: "https://github.com/anxiousyougart" , linkedin:"https://in.linkedin.com/in/saleha-abdul-baseer-1054bb216" },
//   // ];
//   const team = [
//   {
//     name: "Mohammed Abrar",
//     role: "GDGC Organiser",
//     image: abrar,
//     github: "https://github.com/mohammedabrar2004",
//     linkedin: "https://in.linkedin.com/in/mohammed-abrar-farooque",
//     about: "Mohammed Abrar leads the Google Developer Groups on Campus chapter, driving the vision and direction of the community. He brings people together through tech events, workshops, and collaborations that empower students to grow as developers.",
//     tags: ["Community Building", "Leadership", "Google Developer Groups", "Event Management"],
//   },
//   {
//     name: "Mohammed Abdul Hadi",
//     role: "Treasurer",
//     image: hadi,
//     github: "",
//     linkedin: "https://in.linkedin.com/in/abdul-hadi-a3694725b",
//     about: "Abdul Hadi manages the financial backbone of GDGC, ensuring every event and initiative is resourced well. His meticulous approach to budgeting keeps the chapter running smoothly and sustainably.",
//     tags: ["Finance", "Budgeting", "Operations", "Resource Planning"],
//   },
//   {
//     name: "Aimen Laiba",
//     role: "Chief Coordinator",
//     image: aimen,
//     github: "https://github.com/aimenlaiba",
//     linkedin: "https://in.linkedin.com/in/aimen-laiba",
//     about: "Aimen Laiba orchestrates cross-team coordination, making sure every moving part of the chapter aligns. She's the bridge between vision and execution — keeping teams focused, motivated, and in sync.",
//     tags: ["Coordination", "Team Management", "Planning", "Communication"],
//   },
//   {
//     name: "Mohammed Amaan",
//     role: "Chief Coordinator",
//     image: amaan,
//     github: "https://github.com/mohammed-amaan04",
//     linkedin: "https://in.linkedin.com/in/mohammed-amaan-mahmood-khan-7b8167215",
//     about: "Mohammed Amaan co-leads chapter coordination with a strong focus on logistics and member engagement. He ensures initiatives are executed on time and that every team member has what they need to succeed.",
//     tags: ["Coordination", "Logistics", "Member Engagement", "Execution"],
//   },
//   {
//     name: "Syed Atif",
//     role: "General Secretary",
//     image: atif,
//     github: "https://github.com/syedatif04",
//     linkedin: "https://in.linkedin.com/in/syed-atif04",
//     about: "Syed Atif handles the operational and administrative pulse of GDGC. From maintaining records to coordinating communications, he ensures the chapter runs with clarity and efficiency behind the scenes.",
//     tags: ["Administration", "Documentation", "Operations", "Communication"],
//   },
//   {
//     name: "Zoha Maria",
//     role: "General Secretary",
//     image: zoha,
//     github: "https://github.com/zohamaria",
//     linkedin: "https://in.linkedin.com/in/syedazohamaria",
//     about: "Zoha Maria brings structure and warmth to GDGC's administration. She manages correspondence, documentation, and inter-team communication — ensuring nothing slips through the cracks.",
//     tags: ["Administration", "Communication", "Outreach", "Documentation"],
//   },
//   {
//     name: "Adeeba Anees",
//     role: "Chief Representative",
//     image: adeeba,
//     github: "https://github.com/adeebaanees",
//     linkedin: "https://in.linkedin.com/in/adeeba-anees-0807562a1",
//     about: "Adeeba Anees represents the student community and voices their interests within GDGC. She bridges the gap between the core team and the broader membership, championing inclusivity and participation.",
//     tags: ["Community Outreach", "Student Advocacy", "Representation", "Engagement"],
//   },
//   {
//     name: "Aqueeb Talib",
//     role: "Chief Representative",
//     image: talib,
//     github: "https://github.com/flexsyyy",
//     linkedin: "https://in.linkedin.com/in/syed-aqeeb-talib-08326125a",
//     about: "Aqueeb Talib is the community's connector — proactively reaching out, welcoming new members, and representing GDGC at external platforms. His energy keeps the community vibrant and growing.",
//     tags: ["Networking", "Community Growth", "Representation", "Public Relations"],
//   },
//   {
//     name: "Mohammed Sami",
//     role: "Tech Captain",
//     image: sami,
//     github: "https://github.com/Ms3314",
//     linkedin: "https://in.linkedin.com/in/sami31",
//     about: "Mohammed Sami leads the technical initiatives of GDGC, from hands-on workshops to hackathons. He mentors peers in software development and keeps the chapter at the forefront of emerging technologies.",
//     tags: ["Software Development", "Mentorship", "Hackathons", "Open Source"],
//   },
//   {
//     name: "Saleha Abdul Baseer",
//     role: "Tech Captain",
//     image: saleha,
//     github: "https://github.com/anxiousyougart",
//     linkedin: "https://in.linkedin.com/in/saleha-abdul-baseer-1054bb216",
//     about: "Saleha Abdul Baseer co-captains the tech wing with a passion for building and teaching. She drives technical projects, conducts sessions, and inspires members to dive deeper into development and problem-solving.",
//     tags: ["Full Stack", "Teaching", "Problem Solving", "Tech Events"],
//   },
// ];

//   return (
//     <div className="overflow-hidden min-h-screen py-20 px-4">
     
//       <div className="relative overflow-hidden py-16 sm:py-20 md:py-20">
//             <div className="absolute inset-0 flex items-center pointer-events-none">
//                 <div className="flex animate-marquee gap-16 sm:gap-20 md:gap-24 lg:gap-32 whitespace-nowrap pb-6">
//                 <h1 className="outline-text text-[8rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-sans font-semibold">
//                     Meet the Team
//                 </h1>
//                 <h1 className="outline-text text-[8rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-sans font-semibold">
//                     Meet the Team
//                 </h1>
//                 </div>
//             </div>

//             <h1  className="relative z-10 text-center text-shadow-xl text-shadow-white
//              bg-linear-to-r from-[#f8d8d8] to-[#cdf6c5]
//              bg-clip-text text-transparent font-sans font-light
//              px-4 whitespace-nowrap" style={{ fontSize: "clamp(5rem, 12vw, 14rem)" }}
//              > 
//                 Meet the Team
//               </h1>
//       </div>

//       {/* Governing Body Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 gap-6 mb-16">
//         <h2 className="text-transparent font-sans text-5xl md:pb-32 pb-2" style={{
//                 background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}>
//           Governing Body
//         </h2>

//         <p className="text-white">
//           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates
//           blanditiis eius error officia impedit corporis consequuntur laboriosam
//           culpa voluptatem sed nostrum voluptas esse, cumque dolorem aperiam
//           repudiandae vitae omnis suscipit ut quos, eaque libero magnam
//           incidunt. Est dolorum cum enim adipisci impedit perspiciatis eum,
//           omnis, consequuntur reprehenderit voluptas unde. Quaerat.
//         </p>
//       </div>
  
//       <div className="relative max-w-5xl mx-auto">
//         {/* Vertical Line */}
//         <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-400 h-full"></div>

//             {team.map((member, index) => (
//               <motion.div
//                     key={index}
//                     className="relative mb-10 md:mb-0"
//                     initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 1.2 }}
//               >
//             <div className="flex flex-col md:hidden items-center space-y-6">
//               <TeamCard side={index % 2 === 0 ? "left" : "right"} {...member} />
//             </div>

//             <div className="hidden md:flex items-center  h-24">
//               {/* LEFT */}
//                 <div className="w-1/2 flex justify-end items-center">
//                 {index % 2 === 0 && (
//                   <>
//                     <TeamCard side="left" {...member} />
//                     <div className="w-10 h-0.5 mb-10 bg-gray-400"></div>
//                   </>
//             )}
//             </div>

//             {/* RIGHT */}
//             <div className="w-1/2 flex items-center space-y-6">
//               {index % 2 !== 0 && (
//                 <>
//                   <div className="w-10 h-0.5 mb-6  bg-gray-400"></div>
//                   <TeamCard side="right" {...member} />
//                 </>
//               )}
//             </div>
//         </div>
//       </motion.div>
//     ))}
//       </div>
//     </div>
//   );
// }





import { motion } from "framer-motion";
import TeamCard from "./TeamCard";
// src/components/team
import abrar from "/src/assets/abrar2.png";
import aimen from "/src/assets/aimenn2.png";
import adeeba from "/src/assets/adeeba2.png";
import atif from "/src/assets/atif2.png";
import amaan from "/src/assets/amaan2.png";
import hadi from "/src/assets/hadi2.png";
import saleha from "/src/assets/saleha2.png";
import zoha from "/src/assets/zoha2.png";
import sami from "/src/assets/smaii.png";
import talib from "/src/assets/talib2.png";

const team = [
  {
    name: "Mohammed Abrar",
    role: "GDGC Organiser",
    image: abrar,
    github: "https://github.com/mohammedabrar2004",
    linkedin: "https://in.linkedin.com/in/mohammed-abrar-farooque",
    about: "Mohammed Abrar leads the Google Developer Groups on Campus chapter, driving the vision and direction of the community. He brings people together through tech events, workshops, and collaborations that empower students to grow as developers.",
    tags: ["Community Building", "Leadership", "Google Developer Groups", "Event Management"],
  },
  {
    name: "Mohammed Abdul Hadi",
    role: "Treasurer",
    image: hadi,
    github: "",
    linkedin: "https://in.linkedin.com/in/abdul-hadi-a3694725b",
    about: "Abdul Hadi manages the financial backbone of GDGC, ensuring every event and initiative is resourced well. His meticulous approach to budgeting keeps the chapter running smoothly and sustainably.",
    tags: ["Finance", "Budgeting", "Operations", "Resource Planning"],
  },
  {
    name: "Aimen Laiba",
    role: "Chief Coordinator",
    image: aimen,
    github: "https://github.com/aimenlaiba",
    linkedin: "https://in.linkedin.com/in/aimen-laiba",
    about: "Aimen Laiba orchestrates cross-team coordination, making sure every moving part of the chapter aligns. She's the bridge between vision and execution — keeping teams focused, motivated, and in sync.",
    tags: ["Coordination", "Team Management", "Planning", "Communication"],
  },
  {
    name: "Mohammed Amaan",
    role: "Chief Coordinator",
    image: amaan,
    github: "https://github.com/mohammed-amaan04",
    linkedin: "https://in.linkedin.com/in/mohammed-amaan-mahmood-khan-7b8167215",
    about: "Mohammed Amaan co-leads chapter coordination with a strong focus on logistics and member engagement. He ensures initiatives are executed on time and that every team member has what they need to succeed.",
    tags: ["Coordination", "Logistics", "Member Engagement", "Execution"],
  },
  {
    name: "Syed Atif",
    role: "General Secretary",
    image: atif,
    github: "https://github.com/syedatif04",
    linkedin: "https://in.linkedin.com/in/syed-atif04",
    about: "Syed Atif handles the operational and administrative pulse of GDGC. From maintaining records to coordinating communications, he ensures the chapter runs with clarity and efficiency behind the scenes.",
    tags: ["Administration", "Documentation", "Operations", "Communication"],
  },
  {
    name: "Zoha Maria",
    role: "General Secretary",
    image: zoha,
    github: "https://github.com/zohamaria",
    linkedin: "https://in.linkedin.com/in/syedazohamaria",
    about: "Zoha Maria brings structure and warmth to GDGC's administration. She manages correspondence, documentation, and inter-team communication — ensuring nothing slips through the cracks.",
    tags: ["Administration", "Communication", "Outreach", "Documentation"],
  },
  {
    name: "Adeeba Anees",
    role: "Chief Representative",
    image: adeeba,
    github: "https://github.com/adeebaanees",
    linkedin: "https://in.linkedin.com/in/adeeba-anees-0807562a1",
    about: "Adeeba Anees represents the student community and voices their interests within GDGC. She bridges the gap between the core team and the broader membership, championing inclusivity and participation.",
    tags: ["Community Outreach", "Student Advocacy", "Representation", "Engagement"],
  },
  {
    name: "Aqueeb Talib",
    role: "Chief Representative",
    image: talib,
    github: "https://github.com/flexsyyy",
    linkedin: "https://in.linkedin.com/in/syed-aqeeb-talib-08326125a",
    about: "Aqueeb Talib is the community's connector — proactively reaching out, welcoming new members, and representing GDGC at external platforms. His energy keeps the community vibrant and growing.",
    tags: ["Networking", "Community Growth", "Representation", "Public Relations"],
  },
  {
    name: "Mohammed Sami",
    role: "Tech Captain",
    image: sami,
    github: "https://github.com/Ms3314",
    linkedin: "https://in.linkedin.com/in/sami31",
    about: "Mohammed Sami leads the technical initiatives of GDGC, from hands-on workshops to hackathons. He mentors peers in software development and keeps the chapter at the forefront of emerging technologies.",
    tags: ["Software Development", "Mentorship", "Hackathons", "Open Source"],
  },
  {
    name: "Saleha Abdul Baseer",
    role: "Tech Captain",
    image: saleha,
    github: "https://github.com/anxiousyougart",
    linkedin: "https://in.linkedin.com/in/saleha-abdul-baseer-1054bb216",
    about: "Saleha Abdul Baseer co-captains the tech wing with a passion for building and teaching. She drives technical projects, conducts sessions, and inspires members to dive deeper into development and problem-solving.",
    tags: ["Full Stack", "Teaching", "Problem Solving", "Tech Events"],
  },
];

export default function VerticalLineTimeline() {
  return (
    <div className="overflow-hidden min-h-screen py-20 px-4">

      {/* ── Marquee header ── */}
      {/* <div className="relative overflow-hidden py-16 sm:py-20 md:py-20">
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="flex animate-marquee gap-16 sm:gap-20 md:gap-24 lg:gap-32 whitespace-nowrap pb-6">
            <h1 className="outline-text text-[8rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-sans font-semibold">
              Meet the Team
            </h1>
            <h1 className="outline-text text-[8rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-sans font-semibold">
              Meet the Team
            </h1>
          </div>
        </div>
        <h1
          className="relative z-10 text-center text-shadow-xl text-shadow-white bg-linear-to-r from-[#f8d8d8] to-[#cdf6c5] bg-clip-text text-transparent font-sans font-light px-4 whitespace-nowrap"
          style={{ fontSize: "clamp(5rem, 12vw, 14rem)" }}
        >
          Meet the Team
        </h1>
      </div> */}

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
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates
          blanditiis eius error officia impedit corporis consequuntur laboriosam
          culpa voluptatem sed nostrum voluptas esse, cumque dolorem aperiam
          repudiandae vitae omnis suscipit ut quos, eaque libero magnam
          incidunt. Est dolorum cum enim adipisci impedit perspiciatis eum,
          omnis, consequuntur reprehenderit voluptas unde. Quaerat.
        </p>
      </div>

      {/* ── Timeline ── */}
      <div className="relative max-w-5xl mx-auto">

        {/* Desktop centre spine — spans full height of the list */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-400" />

        {team.map((member, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              {/* ── Mobile: single column ── */}
              <div className="flex md:hidden justify-center py-6">
                <TeamCard side={isLeft ? "left" : "right"} {...member} />
              </div>

              {/* ── Desktop: alternating sides ── */}
              <div className="hidden md:flex items-center py-6">

                {/* Left half */}
                <div className="w-1/2 flex justify-end items-center pr-0">
                  {isLeft ? (
                    <>
                      <TeamCard side="left" {...member} />
                      {/* connector from card edge to spine */}
                      <div className="w-10 h-0.5 bg-gray-400 flex-shrink-0" />
                    </>
                  ) : (
                    /* empty placeholder so the right column stays in place */
                    <div className="w-10 h-0.5 opacity-0 flex-shrink-0" />
                  )}
                </div>

                {/* Dot on the spine */}
                <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0 z-10 -mx-1.5" />

                {/* Right half */}
                <div className="w-1/2 flex justify-start items-center pl-0">
                  {!isLeft ? (
                    <>
                      {/* connector from spine to card edge */}
                      <div className="w-10 h-0.5 bg-gray-400 flex-shrink-0" />
                      <TeamCard side="right" {...member} />
                    </>
                  ) : (
                    <div className="w-10 h-0.5 opacity-0 flex-shrink-0" />
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}