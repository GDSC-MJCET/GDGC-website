import { FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-5 text-center font-poppins">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>

        <div className="flex justify-center items-center gap-6 mb-6 text-[1.8rem] text-[#bbb]">
          <a
            href="https://www.instagram.com/gdg.mjcet/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#EA4335] hover:scale-125 transition-transform duration-300 hover:drop-shadow-[0_0_16px_#EA4335]"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://in.linkedin.com/company/gdgmjcet"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#4285F4] hover:scale-125 transition-transform duration-300 hover:drop-shadow-[0_0_12px_#4285F4]"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>

          <a
            href="mailto:contact@gdgcmjcet.in"
            className="hover:text-[#FBBC05] hover:scale-125 transition-transform duration-300 hover:drop-shadow-[0_0_12px_#FBBC05]"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>


          <a
            href="tel:+917842483580"
            className="hover:text-[#34A853] hover:scale-125 transition-transform duration-300 hover:drop-shadow-[0_0_10px_#34A853]"
            aria-label="Phone"
          >
        <FaPhoneAlt />
        </a>
        </div>
        <div className="text-sm text-[#ccc] space-y-1">
          <p>Email: gdscmjcet@gmail.com</p>
          <p>
              Abrar: <a href="tel:+917842483580" className="underline hover:text-white">+91 78424 83580</a><br />
              Aimen: <a href="tel:+919676071331" className="underline hover:text-white">+91 96760 71331</a>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
