import React from "react";

const Footer = ({ bgColor = "#272727" }) => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      
      <div className="relative z-10 mt-12 flex justify-center gap-6 px-6 md:justify-around">
        <img
          src="/idk-1.png"
          alt=""
          className="h-32 md:h-56 rounded-2xl rotate-12 shadow-xl"
        />
        <img
          src="/idk-2.png"
          alt=""
          className="h-32 md:h-56 rounded-2xl -rotate-8 shadow-xl"
        />
        <img
          src="/idk-3.png"
          alt=""
          className="h-36 md:h-64 rounded-2xl grayscale rotate-10 shadow-xl"
        />
      </div>

      <div
        className="relative -mt-24 md:-mt-32 text-white z-20"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="flex flex-col space-y-4">
            <img src="/logo.svg" alt="Logo" className="w-40 md:w-full" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.492450109216!2d78.46720307510536!3d17.406602388066857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb937f4b3f0d91%3A0x362e2e1c845e9f7b!2sMuffakham%20Jah%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1706949370000!5m2!1sen!2sin"
              height="200"
              className="w-full rounded-lg border-0"
              loading="lazy"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#686868]">
              BUSINESS INQUIRIES
            </h3>
            <div className="space-y-3 text-gray-300">
              <p>Email: gdgcmjcet@gmail.com</p>
              <p>Phone: +91 123456789</p>
              <p>Phone: +91 987654321</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#686868]">ADDRESS</h3>
            <div className="text-gray-300 space-y-3">
              <p>Muffakham Jah College of Engineering and Technology</p>
              <p>
                Road No. 9, Banjara Hills, Hyderabad, Telangana, India
              </p>
            </div>

            <a target="_blank" rel="noopener noreferrer" href="https://gdg.community.dev/gdg-on-campus-muffakham-jah-college-of-engineering-and-technology-hyderabad-india/" className="mt-6 md:mt-12 w-fit bg-[#5ddb6e] text-black py-2 px-8 rounded-3xl font-semibold hover:bg-green-500 transition border border-white/60">
              Join Us
            </a>
          </div>
        </div>

        <div className=" py-4 px-6 md:px-12 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center text-gray-400 text-sm">
          <p>All rights reserved 2026 © GDGC MJCET</p>
          <p>Privacy Policy</p>
        </div>

        <div className="relative overflow-hidden py-20">
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div className="flex animate-marquee gap-32 whitespace-nowrap pt-12">
              <h1 className="outline-text text-[6rem] md:text-[18rem] font-semibold">
                Get In Touch
              </h1>
              <h1 className="outline-text text-[6rem] md:text-[18rem] font-semibold">
                Get In Touch
              </h1>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
