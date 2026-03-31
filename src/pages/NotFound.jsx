import React from "react";
import Background from "../components/Background";
import Nav from "../components/Nav";

const NotFound = () => {
  return (
    <Background bgColor="#000000">
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center text-white">
        <img src="/logo.svg" alt="GDGC Logo" className="w-32 h-32 mb-6" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Oops, this page does not exist.
        </h1>
        <p className="text-gray-400 text-lg max-w-xl">
          The route you tried to visit isn&apos;t configured. Please use the navigation above to go to an existing page.
        </p>
      </div>
    </Background>
  );
};

export default NotFound;

