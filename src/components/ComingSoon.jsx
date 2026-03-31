import React from "react";
import Nav from "./Nav";
import Background from "./Background";
import Footer from "./Footer";
import { motion } from "motion/react"
const ComingSoon = () => {
  return (
    <Background bgColor="#000000">
      <Nav />
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 font-mono text-white">
              Coming Soon
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            We're working on something amazing. Stay tuned for updates!
          </motion.p>
        </div>
      </div>
      <Footer />
    </Background>
  );
};

export default ComingSoon;
