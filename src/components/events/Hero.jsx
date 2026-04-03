import React from 'react'

const Hero = () => {
  return (
    <div>
        <div className="relative overflow-hidden py-16 sm:py-20 md:py-20">
            <div className="absolute inset-0 flex items-center pointer-events-none">
                <div className="flex animate-marquee gap-16 sm:gap-20 md:gap-24 lg:gap-32 whitespace-nowrap pb-6">
                <h1 className="outline-text text-[8rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-sans font-semibold">
                    Events
                </h1>
                <h1 className="outline-text text-[8rem] sm:text-[12rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-sans font-semibold">
                    Events
                </h1>
                </div>
            </div>

            <h1 className="relative z-10 text-center text-shadow-xl text-shadow-white bg-linear-to-r from-[#f8d8d8] to-[#cdf6c5] bg-clip-text text-transparent font-sans text-[4rem] sm:text-[7rem] md:text-[16rem]  font-light px-4">
                Events
            </h1>
        </div>

        <div className='overflow-hidden px-4 sm:px-8 md:px-16 lg:px-24'>
      <p className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6 sm:mb-8 md:mb-10 lg:mb-12'>Live Event</p>
      <div className='rounded-2xl px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 w-full border border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.85)]'>
        <img src="/info-session-26.jpeg" alt="event" className='w-full h-40 sm:h-52 md:h-62 rounded-2xl object-cover'/>
        <h2 className='text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 md:mb-4'>Google Solutions Challenge Info Session</h2>
        <p className='text-left text-sm sm:text-base md:text-lg max-w-2xl'>This session is your roadmap to developing, refining, and positioning your project for a national-level platform — with direct insights from 2025 National Winners on exactly what it takes to succeed.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center md:justify-start">
          <a href="https://chat.whatsapp.com/I5JsIVcZrGFJHLsGCpPHx0" target="_blank" rel="noopener noreferrer">
          <button className="w-full sm:w-auto bg-[#f9ac02] hover:cursor-pointer text-black px-6 py-2 rounded-full font-semibold border border-white/40 shadow-[0_0_6px_rgba(255,255,255,0.85)]">
            Learn More
          </button></a>
          <a href="https://gdg.community.dev/events/details/google-gdg-on-campus-muffakham-jah-college-of-engineering-and-technology-hyderabad-india-presents-google-solution-challenge-2026-info-session/cohost-gdg-on-campus-muffakham-jah-college-of-engineering-and-technology-hyderabad-india/" target="_blank" rel="noopener noreferrer">
          <button className="w-full sm:w-auto bg-[#57cbff] text-black px-6 py-2 hover:cursor-pointer rounded-full font-semibold border border-white/40 shadow-[0_0_6px_rgba(255,255,255,0.85)]">
            Register Now
          </button></a>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Hero