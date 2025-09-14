"use client";
import React from "react";
import { motion } from "motion/react";

export default function ColourfulText({
  text
}) {
  const colors = [
    "#4285f4", // Blue 500
    "#34a853", // Green 500
    "#f9ab00", // Yellow 600
    "#ea4335", // Red 500
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return text.split("").map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
        scale: 1,
        rotate: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -8, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        textShadow: [
          `0 0 0px ${currentColors[index % currentColors.length]}`,
          `0 0 20px ${currentColors[index % currentColors.length]}`,
          `0 0 0px ${currentColors[index % currentColors.length]}`
        ],
      }}
      transition={{
        duration: 1.2,
        delay: index * 0.1,
        ease: "easeInOut",
      }}
      className="inline-block whitespace-pre font-sans tracking-tight font-bold drop-shadow-lg"
      style={{
        textShadow: `0 0 10px ${currentColors[index % currentColors.length]}40`,
      }}>
      {char}
    </motion.span>
  ));
}
