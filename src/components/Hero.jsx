"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imagesY = useTransform(scrollYProgress, [0, 1], [0, 580]);
  const contentY = useTransform(scrollYProgress, [0, 40], [0, -80]);

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
      
      <motion.div
        style={{ y: imagesY }}
        className="flex justify-between -mt-12  will-change-transform"
      >
        <div>
          <img src="/hero-1.svg" className="w-22 md:w-auto" />
          <img src="/hero-2.svg" className="mt-24 w-16 md:w-auto" />
        </div>

        <div className="flex flex-col gap-12 md:gap-22">
          <img src="/hero-3.svg" className="ml-4 w-22 md:w-auto" />
          <img src="/hero-4.svg" className="ml-4 w-22 md:w-auto" />
        </div>
      </motion.div>

      <div className="flex flex-col justify-between min-h-screen">
       
        <motion.div
          style={{ y: contentY }}
          className="absolute inset-0 flex flex-col items-center text-center text-white px-6 py-12 pointer-events-none will-change-transform translate-y-24 md:translate-y-35"
        >
          <h2 className="text-3xl text-center md:text-6xl font-bold  max-w-2xl lg:max-w-5xl md:text-left">
            A community built around learning, technology and collaboration
          </h2>

          <p className="mt-4 text-base text-center md:text-lg md:text-left max-w-2xl lg:max-w-5xl">
           GDGC MJCET brings students together to learn with intent , build strong fundamentals, and collaborate on real-world problems, creating a student-driven ecosystem rooted in consistency, mentorship, and meaningful growth
          </p>
        </motion.div>

        <motion.div style={{ y: contentY }} className="mt-24 md:mt-22 pt-12">
          <div>
            <div className="bg-[#000000] border-2 border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.85)] rounded-full px-4 md:px-6 py-4 flex items-center justify-between max-w-4xl h-auto md:h-16 mx-auto gap-4">
              <img src="/globe-blue.svg" className="h-10 md:h-16" />
              <img src="/hash-yellow.svg" className="h-6 md:h-9" />
              <img src="/globe-red.svg" className="h-10 md:h-16" />

              <h2 className="font-medium text-xl md:text-5xl text-center bg-linear-to-r from-[#F8D8D8] to-[#CDF6C5] bg-clip-text text-transparent">
                Live Event
              </h2>

              <img src="/pinpoint-green.svg" className="h-10 md:h-16" />
              <img src="/circles-pink.svg" className="h-10 md:h-16" />
            </div>

            <div className="flex  bg-[#000000] flex-col md:flex-row justify-center items-center rounded-b-4xl border-2 border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.85)] max-w-3xl mx-auto px-6 md:px-22 py-18 gap-10 md:gap-22">
              <div>
                <img
                  src="/tech-face-off.jpeg"
                  alt=""
                  className="rounded-sm scale-100 md:scale-150"
                />
              </div>

              <div className="flex flex-col gap-6 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  TECH FACE OFF : The Verdict
                </h2>

                <p className="text-white text-base md:text-lg">
                  Tech Face-Off: The Verdict is where chapters go head-to-head in a high-stakes technical debate, judged, challenged, and decided with zero bias and full intensity. This isn’t about who speaks louder, it’s about who thinks deeper and defends better.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center md:justify-start">
                  <button onClick={()=>navigate("/techdebate")} className="bg-[#f9ac02] text-black px-6 py-2 rounded-full font-semibold border border-white/40 shadow-[0_0_6px_rgba(255,255,255,0.85)]">
                    Learn More 
                  </button>
                  <button  onClick={()=>navigate("/score")} className="bg-[#57cbff] text-black px-6 py-2 rounded-full font-semibold border border-white/40 shadow-[0_0_6px_rgba(255,255,255,0.85)]">
                    Live Scorecard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;