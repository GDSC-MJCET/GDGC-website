import { motion } from "framer-motion";
import dyeLoad from '../assets/DYE-LOAD.png'; 
import planet from '../assets/Wireframe 57.png';
import stars from '../assets/Group 49.png';

function HeadingSection() {
  return (

<div className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden bg-black text-white font-inter pt-20 sm:pt-32">

  {/* Header */}
<header className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[90%] flex flex-col sm:flex-row sm:justify-between items-center gap-2 text-[1.1rem] text-center sm:text-left z-50">
  <div className="flex items-center gap-2 font-semibold">
    <img src="gdg-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
    <span>
      <span className="text-[#4285F4]">GDGC</span> MJCET
    </span>
  </div>
</header>

<section className="py-40 bg-black text-white flex justify-center items-center relative">

  {/* Dye Image with bounce + float */}
  <motion.div
    initial={{ y: -400, opacity: 0 }}
    animate={{ y: [-400, 0, -30, 0, -15, 0], opacity: 1 }}
    transition={{
      duration: 3.5,
      ease: "easeOut",
    }}
    className="text-center relative z-10"
  >
    <motion.img
      src={dyeLoad}
      alt="Dye Load"
      className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[420px] xl:w-[480px] h-auto mx-auto"
      animate={{ y: [0, -10, 0] }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
        delay: 3.5,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
    />
  </motion.div>

  {/* Star - Top Left (moved farther left) */}
<motion.img
  src={stars}
  alt="Star Top Left"
  className="w-14 sm:w-16 lg:w-20 absolute -top-10 -left-20 sm:-left-14 pointer-events-none z-0"
  animate={{ opacity: [0.4, 1, 0.4] }}
  transition={{
    duration: 1.1,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
<motion.img
  src={stars}
  alt="Star Near Red Circle Right Side"
  className="w-16 sm:w-20 absolute top-12 right-[-40px] pointer-events-none z-0"
  style={{ right: '-12px' }}  // moves star 12px outside right boundary
  animate={{ opacity: [0.4, 1, 0.4] }}
  transition={{
    duration: 1.3,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>

  {/* Star Bottom-Right */}
  <motion.img
    src={stars}
    alt="Star Bottom Right"
    className="w-14 sm:w-16 lg:w-20 absolute bottom-4 right-[-40px] pointer-events-none z-0"
    animate={{ opacity: [0.3, 1, 0.3] }}
    transition={{
      duration: 1.4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Optional: Star slightly behind the image */}
  {/* Remove this one if you only want 2 */}
  <motion.img
    src={stars}
    alt="Star Behind Image"
    className="w-12 sm:w-14 lg:w-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-0"
    animate={{ opacity: [0.3, 1, 0.3] }}
    transition={{
      duration: 1.3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</section>





{/* Floating shapes */}
<div className="pointer-events-none">
  <div className="absolute top-10 right-10 w-16 h-16 bg-red-400 rounded-full opacity-20 animate-bounce"></div>
  <div className="absolute top-1/3 left-5 w-12 h-12 bg-yellow-400 rounded-full opacity-20 animate-ping delay-200"></div>
  <div className="absolute bottom-20 right-20 w-14 h-14 bg-yellow-500 rounded-full opacity-15 animate-spin-slow"></div>
  <div className="absolute bottom-10 left-1/4 w-10 h-10 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
  <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-blue-400 rounded-full opacity-10 animate-bounce delay-400"></div>
</div>
<div className="pointer-events-none">
  <div className="absolute top-10 right-10 w-16 h-16 bg-red-400 rounded-full opacity-20 animate-bounce"></div>
  <div
    className="absolute bottom-20 left-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-green-400 opacity-20 animate-ping"
  ></div>
</div>


{/* THIS IS THE STOOPID SHAPES THING I TRIED BUT NOT TOO HARD SO NVM 
<motion.div
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
  className="absolute  w-full h-[250px] max-sm:h-[180px] flex justify-center items-end gap-2.5"
>
  <div className="w-20 h-10 bg-[#FBBC05] rounded-t-full"></div>
  <div className="w-[60px] h-[60px] bg-white rotate-45"></div>
  <div className="w-40 h-20 bg-[#EA4335] rounded-full"></div>

  <div className="w-0 h-0 border-l-[45px] border-r-[45px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#34A853]"></div>
  
  <div className="w-20 h-20 bg-[#4285F4] rounded-full"></div>
</motion.div> */}
      


{/* ABOUT SECTION + STARS */}
<section className="w-full bg-black text-white pt-36 pb-36 px-6 text-center flex justify-center relative overflow-hidden">
  {/* ✨ Twinkling Stars */}
  <motion.img
  src={stars}
  alt="Star Top Left"
  className="w-14 lg:w-16 absolute top-10 left-10 pointer-events-none"
  animate={{ opacity: [0.3, 1, 0.3] }}
  transition={{
    duration: 1.2, 
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>

<motion.img
  src={stars}
  alt="Star Bottom Right"
  className="w-14 lg:w-16 absolute bottom-10 right-10 pointer-events-none"
  animate={{ opacity: [0.4, 1, 0.4] }}
  transition={{
    duration: 1.5, 
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>


  {/* Main Content */}
  <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl text-left">
    {/* Text Content */}
    <div className="flex-1">
      <h2 className="text-5xl font-extrabold mb-10 text-[#00FF7F] text-center lg:text-left">
        About the Event
      </h2>
      <p className="max-w-xl text-xl text-gray-300 leading-relaxed mb-12">
        Doodle Your Engineering is a one-of-a-kind tech and design event hosted by GDGC MJCET. 
        It's a space for creative engineers and developers to showcase their innovative ideas through doodles, designs, and prototypes. 
        Whether you're a coder, designer, or just curious about tech, there's something here for you. Come connect, build, and be inspired!
      </p>
      <a
        href=""
        target="_blank"
        rel="noreferrer"
        className="inline-block bg-[#8A2BE2] hover:bg-[#FFD700] hover:text-black text-white py-5 px-12 text-xl rounded-full font-semibold transition-all duration-300 shadow-md"
      >
        Apply Now
      </a>
    </div>

    <motion.img 
  src={planet}  
  alt="Planet"
  className="w-60 h-60 spin-slow"
  style={{
    filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.4))',
    transformOrigin: 'center',
  }}
  whileHover={{
    scale: 1.1,
    transition: { duration: 0.3 },
  }}
/>

  </div>
</section>
     
      </div>
  );
}

export default HeadingSection;
