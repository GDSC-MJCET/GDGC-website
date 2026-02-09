import React from 'react'

const Idk = () => {
  return (
    <div>
        <div className='px-6  sm:px-12 lg:px-22 flex flex-col justify-center items-center'>
            <h2 className='text-left text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl '>
                Our Journey and Vision
            </h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 my-12 sm:my-16 lg:my-22 text-white/70 text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed'>
                <p>
                    Founded in 2023, our community was initiated by Mohd Abdul Aleem, a Computer Science Engineering
                    student, with the guidance of Dr. Maniza Hijab, Faculty Advisor, MJCET. Since its inception, the
                    group has steadily grown into an active technical hub, hosting workshops, hands-on sessions, study
                    jams, and collaborative projects across multiple domains of technology.
                </p>
                <p>
                    Our vision is to foster a thriving campus innovation ecosystem where students grow into capable,
                    industry-ready developers, apply technology to address complex real-world challenges, and create
                    meaningful, technology-driven impact.
                </p>
            </div>
        </div>
        <div className='flex justify-center items-center w-full px-6 sm:px-12 lg:px-22'>
            <img src="idk-img-final-3.jpeg" alt="" className='h-[150px] sm:h-[30vh] md:h-[30vh] lg:h-[40vh] xl:h-[50vh] 2xl:h-[60vh] object-center w-full'/>
            
        </div>
        

        <div className='px-4 sm:px-8 md:px-12 lg:px-16 text-white mt-12 sm:mt-16 lg:mt-22 pt-6'>
            <div className='flex flex-col-reverse md:flex-row justify-between md:items-center items-start gap-6 md:gap-0'>
                <div className='max-w-xl'>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-semibold'>Community</h2>
                    <p className='text-base sm:text-lg md:text-xl mt-2'>A student-first community where technical and non-technical individuals collaborate, learn together, and grow through trust, inclusivity, and shared ownership.</p>
                </div>
                <div className='flex justify-center items-center'>
                    <img src="/cube.svg" alt="" className='w-24 h-24 md:h-56 md:w-56' />
                    <span className='text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] leading-tight antonio-uniquifier'>01</span>
                </div>
            </div>
            <div className='flex flex-col md:flex-row justify-between md:items-center items-start gap-6 md:gap-24 mt-8 sm:mt-10 md:mt-12'>
                <div className='flex justify-center items-center'>
                    <span className='text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] leading-tight antonio-uniquifier'>02</span>
                    <img src="/triangle.svg" alt="" className='w-24 h-24 md:h-56 md:w-56' />
                </div>
                <div className='max-w-xl'>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-semibold'>Learning Ecosystem</h2>
                    <p className='text-base sm:text-lg md:text-xl mt-2'>A structured, hands-on learning ecosystem focused on fundamentals, real-world problem solving, mentorship, and long-term skill development over short-term hype.</p>
                </div>
            </div>
            <div className='flex flex-col-reverse md:flex-row justify-between md:items-center items-start gap-6 md:gap-0 mt-8 sm:mt-10 md:mt-12'>
                <div className='max-w-xl'>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-semibold'>Networking & Outreach
</h2>
                    <p className='text-base sm:text-lg md:text-xl mt-2'>Meaningful networking and outreach initiatives that connect students with industry professionals, global developer communities, and impactful opportunities beyond campus.
</p>
                </div>
                <div className='flex justify-center items-center'>
                    <img src="/cylinder.svg" alt="" className='w-24 h-24 md:h-44 md:w-44' />
                    <span className='text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] leading-tight antonio-uniquifier'>03</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Idk