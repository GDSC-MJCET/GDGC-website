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
import { PixelatedCanvas } from "../components/ui/pixelated-canvas";

export const HiringPage = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen '>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <h1 className="mb-4 text-center text-3xl sm:text-4xl lg:text-5xl font-bold">
            We are Hiring !!
          </h1>
          <p className="mb-8 sm:mb-10 text-center text-sm sm:text-base text-zinc-500">
            Be a part of our Amazing Team 
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 max-w-7xl mx-auto">
            {[
              {
                id: 1,
                title: "Seek",
                width: "col-span-1",
                height: "h-32 sm:h-40 lg:h-60",
                bg : epam
              },
              {
                id: 2,
                title: "Growth?",
                width: "col-span-1 sm:col-span-2 lg:col-span-3",
                height: "h-32 sm:h-40 lg:h-60",
                bg: grpbuilding,
              },
              {
                id: 3,
                title: "Love",
                width: "col-span-1",
                height: "h-32 sm:h-40 lg:h-60",
                bg: random,
              },
              {
                id: 4,
                title: "Tech?",
                width: "col-span-1 sm:col-span-1 lg:col-span-3",
                height: "h-24 sm:h-32 lg:h-60",
                bg: cool2,
                textColor: "text-white",
              },
              {
                id: 5,
                title: "Want",
                width: "col-span-1 lg:col-span-2",
                height: "h-24 sm:h-32 lg:h-60",
                bg: next1,
                textColor: "text-white",
              },
              {
                id: 6,
                title: "Impact?",
                width: "col-span-1 sm:col-span-2 lg:col-span-2",
                height: "h-32 sm:h-40 lg:h-60",
                bg: next2,
              },
              {
                id: 7,
                title: "Come",
                width: "col-span-2 sm:col-span-2 lg:col-span-3",
                height: "h-32 sm:h-40 lg:h-60",
                bg: grid,
              },
              {
                id: 8,
                title: "Build",
                width: "col-span-2 md:col-span-1",
                height: "h-32 sm:h-40 lg:h-60",
                bg: gridcool,
                textColor: "text-white",
              },
              {
                id: 9,
                title: "The Future",
                width: "col-span-2 lg:col-span-3",
                height: "h-32 sm:h-40 lg:h-60",
                bg: grp,
                textColor: "text-black",
              },
              {
                id: 10,
                title: "Here",
                width: "hidden md:block md:col-span-1",
                height: "h-32 sm:h-40 lg:h-60",
                bg: breakthrough,
                textColor: "text-white",
              },
            ].map((box) => (
              <div
                key={box.id}
                className={`${box.width} ${box.height} flex items-center justify-center rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm overflow-hidden relative`}
              >
                {box.bg ? (
                  <>
                    <img 
                      src={box.bg} 
                      alt={box.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <h2 className="relative z-10 text-sm sm:text-base lg:text-xl font-bold text-white drop-shadow-lg bg-black/20 px-2 sm:px-3 py-1 rounded-full text-center">
                      {box.title}
                    </h2>
                  </>
                ) : (
                  <div className={`w-full h-full ${box.bg} flex items-center justify-center rounded-lg`}>
                    <h2 className={`text-sm sm:text-base lg:text-xl font-bold ${box.textColor || 'text-gray-800'} text-center`}>
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
    <div className="flex flex-col items-center space-y-4 sm:space-y-6 py-8 sm:py-16 px-4">
      {/* Text */}
      <p className="text-lg sm:text-xl md:text-2xl font-medium text-center">
        Apply for an Execom position !!
      </p>
      <img src={gdglogo} alt="" className="w-8 sm:w-10" />
      {/* Swigly Arrow SVG */}
      
      {/* Button */}
      <Button className=" hover:bg-gray-800 px-6 sm:px-8 py-6 sm:py-8 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105">
        Apply Here !!
      </Button>
      <div className="w-full max-w-4xl">
        <PixelatedCanvasDemo />
      </div>
    </div>
  );
}

export function PixelatedCanvasDemo() {
  return (
    <div className="mx-auto mt-8 px-4">
      <PixelatedCanvas
        src={gdglogo}
        width={Math.min(900, window.innerWidth - 32)}
        height={Math.min(500, (window.innerWidth - 32) * 0.56) * 0.7  }
        cellSize={3}
        dotScale={0.9}
        shape="square"
        text="Hello"
        dropoutStrength={0.4}
        interactive
        distortionStrength={3}
        distortionRadius={80}
        distortionMode="swirl"
        followSpeed={0.2}
        jitterStrength={4}
        jitterSpeed={4}
        sampleAverage
        tintColor="#FFFFFF"
        tintStrength={0.2}
        className="rounded-xl border border-neutral-800 shadow-lg w-full max-w-full" 
      />
    </div>
  );
}