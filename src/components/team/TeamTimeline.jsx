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
import { LiaLinkedin } from "react-icons/lia";

export default function VerticalLineTimeline() {
  const team = [
    { name: "Mohammed Abrar", role: "GDGC Organiser", image: abrar ,github: "https://github.com/mohammedabrar2004" , linkedin:"https://in.linkedin.com/in/mohammed-abrar-farooque"},
    { name: "Mohammed Abdul Hadi", role: "Treasurer", image: hadi ,github: "" , linkedin:"https://in.linkedin.com/in/abdul-hadi-a3694725b"},
    { name: "Aimen Laiba", role: "Chief Coordinator", image: aimen ,github: "https://github.com/aimenlaiba" , linkedin:"https://in.linkedin.com/in/aimen-laiba"},
    { name: "Mohammed Amaan", role: "Chief Coordinator", image: amaan ,github: "https://github.com/mohammed-amaan04" , linkedin:"https://in.linkedin.com/in/mohammed-amaan-mahmood-khan-7b8167215" },
    { name: "Syed Atif", role: "General Secretary", image: atif ,github: "https://github.com/syedatif04" , linkedin:"https://in.linkedin.com/in/syed-atif04" },
    { name: "Zoha Maria", role: "General Secretary", image: zoha ,github: "https://github.com/zohamaria" , linkedin:"https://in.linkedin.com/in/syedazohamaria" },
    { name: "Adeeba Anees", role: "Chief Representative", image: adeeba, github: "https://github.com/adeebaanees" , linkedin:"https://in.linkedin.com/in/adeeba-anees-0807562a1" },
    { name: "Aqueeb Talib", role: "Chief Representative", image: talib,github: "https://github.com/flexsyyy" , linkedin:"https://in.linkedin.com/in/syed-aqeeb-talib-08326125a" },
    { name: "Mohammed Sami", role: "Tech Captain", image: sami,github: "https://github.com/Ms3314" , linkedin:"https://in.linkedin.com/in/sami31" },
    { name: "Saleha Abdul Baseer", role: "Tech Captain", image: saleha,github: "https://github.com/anxiousyougart" , linkedin:"https://in.linkedin.com/in/saleha-abdul-baseer-1054bb216" },
  ];

  return (
    <div className=" py-20 px-4">
     
      <div className="relative overflow-hidden py-16 sm:py-20 md:py-20">
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

            <h1  className="relative z-10 text-center text-shadow-xl text-shadow-white
             bg-linear-to-r from-[#f8d8d8] to-[#cdf6c5]
             bg-clip-text text-transparent font-sans font-light
             px-4 whitespace-nowrap" style={{ fontSize: "clamp(5rem, 12vw, 14rem)" }}
             > 
                Meet the Team
              </h1>
      </div>

      {/* Governing Body Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 gap-6 mb-16">
        <h2 className="text-white font-sans text-5xl pb-32">
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
  
      <div className="relative max-w-5xl mx-auto">
        {/* Vertical Line */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-400 h-full"></div>

            {team.map((member, index) => (
              <motion.div
                    key={index}
                    className="relative mb-10 md:mb-0"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
              >
            <div className="flex flex-col md:hidden items-center space-y-6">
              <TeamCard side={index % 2 === 0 ? "left" : "right"} {...member} />
            </div>

            <div className="hidden md:flex items-center h-24">
              {/* LEFT */}
                <div className="w-1/2 flex justify-end items-center">
                {index % 2 === 0 && (
                  <>
                    <TeamCard side="left" {...member} />
                    <div className="w-10 h-0.5 bg-gray-400"></div>
                  </>
            )}
            </div>

            {/* RIGHT */}
            <div className="w-1/2 flex items-center">
              {index % 2 !== 0 && (
                <>
                  <div className="w-10 h-0.5 bg-gray-400"></div>
                  <TeamCard side="right" {...member} />
                </>
              )}
            </div>
        </div>
      </motion.div>
    ))}
      </div>
    </div>
  );
}