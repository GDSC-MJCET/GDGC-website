import { motion } from "framer-motion";
import "../styles/photobooth.css";
import PixelSkyline from "./PixelSkyline";

const Hero = () => {
  return (
    <div className="relative h-[50vh] w-full bg-[url('./public/adsophos-hero.png')] bg-cover bg-no-repeat bg-center overflow-hidden">
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



      {/* Animated Pixel Skyline Overlay */}
      <div className="absolute bottom-0 w-full z-20">
        <PixelSkyline />
      </div>
    </div>
  );
};

export default Hero;