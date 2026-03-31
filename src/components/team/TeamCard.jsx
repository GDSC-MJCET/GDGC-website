
export default function TeamCard({ side, role, name, image, linkedin, github}) {
  const isLeft = side === "left";

  return (
    <div className={`flex w-11/12 md:w-80 ${isLeft ? "justify-end" : "justify-start"}`}>
      {/* Card wrapper */}
      <div className="flex w-full overflow-hidden rounded-xl gap-2 text-white border-none">

        {/* LEFT IMAGE */}
        {isLeft && (
          <div className="w-36 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover shadow-black transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}

        {/* TEXT */}
        <div className={`flex-1 p-2 ${isLeft ? "text-right" : "text-left"}`}>
          <p className=" text-shadow-white
             bg-linear-to-r from-[#f8d8d8] to-[#cdf6c5]
             bg-clip-text text-transparent font-sans text-sm  mb-1">{role}</p>
          <h3 className="text-2xl mb-1">{name}</h3>

          <div className={`flex gap-2 mt-1 ${isLeft ? "justify-end" : "justify-start"}`}>
            <a href={github} target="_blank" rel="noopener noreferrer" className="transition-transform duration-150 hover:scale-125">
            <i className="ri-github-fill text-xl cursor-pointer "></i>
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="transition-transform duration-150 hover:scale-125">
            <i className="ri-linkedin-box-fill text-xl cursor-pointer "></i>
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        {!isLeft && (
          <div className="w-36 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}
      </div>
    </div>
  );
}