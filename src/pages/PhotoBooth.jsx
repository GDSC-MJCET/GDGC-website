import { useEffect,useState } from 'react';
import Hero from '../components/photobooth/Hero';
import Room1 from '../components/adsophos/Room1';
import Room2 from '../components/adsophos/Room2';
// import Booth from '../components/adsophos/Booth';
import Final from '../components/adsophos/Final';
import Nav from '../components/adsophos/nav';
import GridTrail from '../components/adsophos/GridTrail';
import Booth from '../components/photobooth/Booth';
export const PhotoBooth=()=>{
const [activePalette, setActivePalette] = useState(['#EA4335', '#FF00A2']);

  const palettes = {
    'hero-section': ['#EA4335', '#FF00A2'],
    'room1-section': ['#2BDDE1', '#0DEBFF'],
    'room2-section': ['#686868', '#FFFFFF', '#EA4336'],
    'booth-section': ['#EA4336', '#FFFFFF'],
    'final-section': ['#FF00A2', '#FF5700'],
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Detect middle of the screen
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (palettes[sectionId]) {
            setActivePalette(palettes[sectionId]);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('[id$="-section"]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
  return (
    <div className="bg-[#1e1e1e]">

      <Nav />
      <GridTrail palette={activePalette} />
      
      
      {/* Hero — full viewport height  */}
       <div id="hero-section" className="relative z-10">
        <Hero />
      </div>
      <div id="booth-section" className='mt-20'>
        <Booth/>
      </div>

      

      <div id="final-section" className=''>
        <Final />
      </div>

    </div>
  );
}