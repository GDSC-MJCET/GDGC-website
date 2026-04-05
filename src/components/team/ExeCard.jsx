// import { IconBrandGithub, IconBrandLinkedin, IconBrandInstagram } from "@tabler/icons-react";

// export default function ExeCard({ name, image, linkedin, github, instagram }) {
//   return (
//     <div className="flex flex-col items-center gap-3 w-36 sm:w-40">

//       {/* Image */}
//       <div className="w-full aspect-[3/4] overflow-hidden rounded-xl">
//         <img
//           src={image}
//           alt={name}
//           className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
//         />
//       </div>

//       {/* Name */}
//       <div className="">
//         <div className="text-left">
//         <h3
//           className="text-sm sm:text-base font-light leading-tight text-white"
//         >
//           {name}
//         </h3>
//       </div>

//       {/* Social icons */}
//       <div className="flex items-center gap-2">
//         {linkedin && (
//           <a
//             href={linkedin}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200"
//             style={{
//               background: "rgba(255,255,255,0.06)",
//               border: "1px solid rgba(255,255,255,0.1)",
//               color: "rgba(255,255,255,0.5)",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "rgba(248,216,216,0.12)";
//               e.currentTarget.style.borderColor = "rgba(248,216,216,0.35)";
//               e.currentTarget.style.color = "#f8d8d8";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "rgba(255,255,255,0.06)";
//               e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
//               e.currentTarget.style.color = "rgba(255,255,255,0.5)";
//             }}
//             aria-label={`${name} on LinkedIn`}
//           >
//             <IconBrandLinkedin size={15} />
//           </a>
//         )}

//         {github && (
//           <a
//             href={github}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200"
//             style={{
//               background: "rgba(255,255,255,0.06)",
//               border: "1px solid rgba(255,255,255,0.1)",
//               color: "rgba(255,255,255,0.5)",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "rgba(205,246,197,0.12)";
//               e.currentTarget.style.borderColor = "rgba(205,246,197,0.35)";
//               e.currentTarget.style.color = "#cdf6c5";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "rgba(255,255,255,0.06)";
//               e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
//               e.currentTarget.style.color = "rgba(255,255,255,0.5)";
//             }}
//             aria-label={`${name} on GitHub`}
//           >
//             <IconBrandGithub size={15} />
//           </a>
//         )}

//         {!github && instagram && (
//           <a
//             href={instagram}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200"
//             style={{
//               background: "rgba(255,255,255,0.06)",
//               border: "1px solid rgba(255,255,255,0.1)",
//               color: "rgba(255,255,255,0.5)",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "rgba(205,246,197,0.12)";
//               e.currentTarget.style.borderColor = "rgba(205,246,197,0.35)";
//               e.currentTarget.style.color = "#cdf6c5";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "rgba(255,255,255,0.06)";
//               e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
//               e.currentTarget.style.color = "rgba(255,255,255,0.5)";
//             }}
//             aria-label={`${name} on Instagram`}
//           >
//             <IconBrandInstagram size={15} />
//           </a>
//         )}
//       </div>
//       </div>
//     </div>
//   );
// }


import { IconBrandGithub, IconBrandLinkedin, IconBrandInstagram } from "@tabler/icons-react";

export default function ExeCard({ name, image, linkedin, github, instagram }) {
  return (
    <div className="flex flex-col items-start gap-3 w-full">

      {/* Image */}
      <div className="w-full aspect-[3/4] overflow-hidden rounded-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Name */}
      <div className="text-left w-full">
        <h3 className="text-sm sm:text-base font-light leading-tight text-white">
          {name}
        </h3>
      </div>

      {/* Social icons */}
      <div className="flex items-center gap-2">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(248,216,216,0.12)";
              e.currentTarget.style.borderColor = "rgba(248,216,216,0.35)";
              e.currentTarget.style.color = "#f8d8d8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
            aria-label={`${name} on LinkedIn`}
          >
            <IconBrandLinkedin size={15} />
          </a>
        )}

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(205,246,197,0.12)";
              e.currentTarget.style.borderColor = "rgba(205,246,197,0.35)";
              e.currentTarget.style.color = "#cdf6c5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
            aria-label={`${name} on GitHub`}
          >
            <IconBrandGithub size={15} />
          </a>
        )}

        {!github && instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(205,246,197,0.12)";
              e.currentTarget.style.borderColor = "rgba(205,246,197,0.35)";
              e.currentTarget.style.color = "#cdf6c5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
            aria-label={`${name} on Instagram`}
          >
            <IconBrandInstagram size={15} />
          </a>
        )}
      </div>
    </div>
  );
}