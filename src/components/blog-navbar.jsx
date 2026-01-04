"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* enum-like nav keys */
const NAV = {
  FEED: "FEED",
  PUBLISH: "PUBLISH",
  MYBLOGS: "MYBLOGS",
  HELP: "HELP",
};

const navItems = [
  { key: NAV.FEED, label: "Feed", route: "/blog/home" },
  { key: NAV.PUBLISH, label: "Publish", route: "/blog/editor" },
  { key: NAV.MYBLOGS, label: "MyBlogs", route: "/blog/myblogs" },
  { key: NAV.HELP, label: "Help", route: "/blog/help" },
];

const BlogNavbar = () => {
  const [active, setActive] = useState(NAV.FEED);
  const navigate = useNavigate();

  const handleNav = (item) => {
    setActive(item.key);
    navigate(item.route);
  };

  return (
   <nav className="fixed top-0 left-0 w-full z-50">
  <div className="mx-auto max-w-7xl px-6">
    <div className="relative mt-4">
      <div className="flex items-center justify-center h-16 px-6">
        <img
          src="../../public/gdg-logo.png"
          className="absolute left-5 opacity-80"
        />

        <div className="flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = active === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNav(item)}
                className={`relative text-lg font-medium cursor-pointer transition-colors duration-200
                  ${
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }
                `}
              >
                {item.label}

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full
                    bg-white
                    transition-transform duration-300 origin-left
                    ${isActive ? "scale-x-100" : "scale-x-0"}
                  `}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
</nav>



  );
};

export default BlogNavbar;
