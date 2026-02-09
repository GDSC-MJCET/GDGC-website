"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 120,
    mass: 0.3,
  });

  const textX = useTransform(smoothProgress, [0, 1], [200, -600]);

  const imgY1 = useTransform(smoothProgress, [0, 1], [90, -120]);
  const imgY2 = useTransform(smoothProgress, [0, 1], [130, -200]);
  const imgY3 = useTransform(smoothProgress, [0, 1], [120, -180]);
  const imgY4 = useTransform(smoothProgress, [0, 1], [110, -260]);
  const imgY5 = useTransform(smoothProgress, [0, 1], [0, -280]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[110vh] overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <motion.h2
        style={{ x: textX }}
        className="
          absolute top-32 left-1/2 -translate-x-1/2
          text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] 
          font-light
          bg-linear-to-r from-[#F8D8D8] to-[#CDF6C5]
          bg-clip-text text-transparent
          whitespace-nowrap
          pointer-events-none select-none
          text-center mt-12
        "
      >
        About
      </motion.h2>

      <div className="relative z-10 pt-40 max-w-7xl mx-auto">

        <div className="flex justify-between mb-12 sm:mb-16 md:mb-20 lg:mb-24 gap-4">
          <motion.img
            src="/about1.png"
            alt=""
            style={{ y: imgY1 }}
            className="h-28 w-36 sm:h-32 sm:w-44 md:h-36 md:w-52 lg:h-44 lg:w-60 object-cover"
          />

          <motion.img
            src="/about2.png"
            alt=""
            style={{ y: imgY2 }}
            className="h-32 w-40 sm:h-36 sm:w-48 md:h-40 md:w-56 lg:h-[250px] lg:w-[280px] object-cover"
          />
        </div>

        <div className="flex justify-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <motion.img
            src="/about3.webp"
            alt=""
            style={{ y: imgY3 }}
            className="h-20 w-28 sm:h-24 sm:w-32 md:h-28 md:w-40 lg:h-[280px] lg:w-[280px] object-cover"
          />
        </div>

        <div className="flex justify-end pr-4 sm:pr-6 md:pr-8 lg:pr-12 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <motion.img
            src="/about4.webp"
            alt=""
            style={{ y: imgY4 }}
            className="h-32 w-32 sm:h-28 sm:w-36 md:h-32 md:w-44 lg:h-[280px] lg:w-[290px] object-cover"
          />
        </div>

        <div className="flex justify-start pl-4 sm:pl-6 md:pl-8 lg:pl-12">
          <motion.img
            src="/about5.JPG"
            alt=""
            style={{ y: imgY5 }}
            className="h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-56  lg:mt-[-20px] lg:h-[280px] lg:w-[290px] object-cover"

          />
        </div>
        

      </div>
    </section>
  );
};

export default About;