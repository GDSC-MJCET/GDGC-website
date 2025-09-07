import grp from  '../assets/grp1.jpg' 
import epam from  '../assets/epam.jpg' 
import grpbuilding from  '../assets/epambuild.jpg' 
import grid from  '../assets/grid.JPG' 
import next1 from  '../assets/next1.jpg' 
import next2 from  '../assets/next2.jpg' 
import breakthrough from  '../assets/breakthro1.png' 
import gridcool from  '../assets/gridcool.jpg' 
import cool2 from "../assets/cool2.jpg"
import { Button } from "../components/ui/button";
import gdglogo from "../assets/gdg-logo.png"
import random from "../assets/random.png"

export const HiringPage = () => {
  return (
    <div className='flex flex-col items-center'>
        <div className="container mx-auto p-8 pt-24">
          <h1 className="mb-4 text-center text-5xl font-bold">
            We are Hiring !!
          </h1>
          <p className="mb-10 text-center text-sm text-zinc-500">
            Be a part of our Amazing Team 
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              {
                id: 1,
                title: "Seek",
                width: "md:col-span-1",
                height: "h-60",
                bg : epam
              },
              {
                id: 2,
                title: "Growth?",
                width: "md:col-span-2",
                height: "h-60",
                bg: grpbuilding,
              },
              {
                id: 3,
                title: "Love",
                width: "md:col-span-1",
                height: "h-60",
                bg: random,
              },
              {
                id: 4,
                title: "Tech?",
                width: "md:col-span-3",
                height: "h-60",
                bg: cool2,
                textColor: "text-white",
              },
              {
                id: 5,
                title: "Want",
                width: "md:col-span-1",
                height: "h-60",
                bg: next1,
                textColor: "text-white",
              },
              {
                id: 6,
                title: "Impact?",
                width: "md:col-span-2",
                height: "h-60",
                bg: next2,
              },
              {
                id: 7,
                title: "Come",
                width: "md:col-span-2",
                height: "h-60",
                bg: grid,
              },
              {
                id: 8,
                title: "Build",
                width: "md:col-span-1",
                height: "h-60",
                bg: gridcool,
                textColor: "text-white",
              },
              {
                id: 9,
                title: "The Future",
                width: "md:col-span-2",
                height: "h-60",
                bg: grp,
                textColor: "text-black",
              },
              {
                id: 10,
                title: "Here",
                width: "md:col-span-1",
                height: "h-60",
                bg: breakthrough,
                textColor: "text-white",
              },
            ].map((box) => (
              <div
                key={box.id}
                className={`${box.width} ${box.height} flex items-center justify-center rounded-lg p-4 shadow-sm overflow-hidden relative`}
              >
                {box.bg ? (
                  <>
                    <img 
                      src={box.bg} 
                      alt={box.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <h2 className="relative z-10 text-xl font-bold text-white drop-shadow-lg bg-black/20 px-3 py-1 rounded-full">
                      {box.title}
                    </h2>
                  </>
                ) : (
                  <div className={`w-full h-full ${box.bg} flex items-center justify-center rounded-lg`}>
                    <h2 className={`text-xl font-bold ${box.textColor || 'text-gray-800'}`}>
                      {box.title}
                    </h2>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <JoinUsButton/>
    </div>

  );
};



const JoinUsButton = () => {
  return (
    <div className="flex flex-col  items-center space-y-6 py-16">
      {/* Text */}
      <p className="text-xl md:text-2xl font-medium text-gray-800 text-center">
        Apply for an Execom position !!
      </p>
      <img src={gdglogo} alt=""  className="w-10" />
      {/* Swigly Arrow SVG */}
      <svg 
        width="120" 
        height="60" 
        viewBox="0 0 120 60" 
        className="text-gray-600"
      >
        <path
          d="M10 20 Q30 10, 50 25 T90 30 L85 25 M90 30 L85 35"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        />
      </svg>
      
      {/* Button */}
      <Button className="bg-black hover:bg-gray-800 text-white px-8 py-8 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105">
        Apply Here !!
      </Button>
    </div>
  );
}

