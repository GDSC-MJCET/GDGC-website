import { motion } from "framer-motion";
import "./adsophos.css";
import PixelSkyline from "./PixelSkyline";

const Hero = () => {
  return (
    <div className="relative h-screen w-full bg-[url('/adsophos-hero.png')] bg-cover bg-no-repeat bg-center overflow-hidden">
  {/* Your content */}

      {/* Background Image Overlay */}
      <motion.div
        // style={{ backgroundImage: "url('/ad-hero.jpg')"  }}
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />

      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">

        {/* Thin rule above */}
        <motion.div
          className="w-24 h-px bg-white"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        />

        {/* Main Heading */}
        <motion.h1
          className="text-transparent adsophos-container bg-clip-text bg-linear-to-b from-[#ffffff] to-[#ff00a2] text-center font-black tracking-[0.18em] uppercase leading-none select-none"
          style={{
            // fontFamily: "'Georgia', 'Times New Roman', serif",
            // fontSize: "clamp(3.5rem, 8vw, 9rem)",
            fontSize: "8vw",
            background: "linear-gradient(180deg, #FFF 0%, #FF00A2 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  WebkitTextStrokeWidth: "0px",
  WebkitTextStrokeColor: "#000",
  textShadow: "0 42px 107px rgba(229, 0, 92, 0.34), 0 24.721px 32.257px rgba(255, 255, 255, 0.19), 0 10.268px 13.398px rgba(229, 0, 92, 0.22), 0 3.714px 4.846px rgba(229, 0, 92, 0.15), 0 0 0 #F8EAF0, 0 0 0 #FFF",
          }}
          initial={{ opacity: 0, y: 36, letterSpacing: "0.35em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8">ADSOPHOS</div> 2026
        </motion.h1>

        {/* Year — lighter weight, wider tracking */}
        <motion.span
          className="text-white font-light tracking-[0.55em] uppercase text-xl md:text-3xl opacity-80"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: "easeOut" }}
        >
          
        </motion.span>

        {/* Thin rule below */}
        <motion.div
          className="w-24 h-px bg-white"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 1.05, ease: "easeOut" }}
        />
      </div>

      {/* Animated Pixel Skyline Overlay */}
      <div className="absolute bottom-0 w-full z-20">
        <PixelSkyline />
      </div>
    </div>
  );
};

export default Hero;