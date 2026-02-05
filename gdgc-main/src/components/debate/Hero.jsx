import { ArrowRight } from 'lucide-react'
import React from 'react'

const Hero = () => {
  return (
    <div className='py-12 sm:py-14 md:py-16 lg:py-18 font-mono px-4'>
        <h2 className='text-3xl sm:text-4xl md:text-8xl text-center text-white'>Welcome to the </h2>
        <h2 className='text-5xl sm:text-6xl md:text-[12rem] tracking-tighter text-center mt-2 sm:mt-3 md:mt-4'>
          <span className='text-[#57cbff]' style={{
            textShadow: "0 0 40px rgba(87, 203, 255, 0.4)",
          }}>TECH</span> <span className='text-[#5ddb6e]'  style={{
            textShadow: "0 0 40px rgba(93, 219, 110, 0.4)",
          }}>DEBATE</span>
        </h2>
        <button className='flex text-[#ffd428] justify-center items-center w-full mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl gap-1 sm:gap-2 tracking-tighter hover:gap-3 sm:hover:gap-4 transition-all'>
          <span className='text-center'>CHECK OUT THE LIVE SCOREBOARD</span> 
          <span>→</span>
        </button>
        <div className='flex justify-center items-center w-full mt-4 sm:mt-6 md:mt-8'>
            <img src="/debateHero.png" alt="hero" className='w-full max-w-6xl h-auto object-contain' />
        </div>
    </div>
  )
}

export default Hero