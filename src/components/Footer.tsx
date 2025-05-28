import React from 'react';
import { FaHeart } from 'react-icons/fa'; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-4 text-center text-sm shadow-inner mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
        <span>© {new Date().getFullYear()} GlamGiant Inc. Sin derechos por negros.</span>
        <span className="flex items-center">
          Hecho por JJ (Jaider y Juanjo) con el <FaHeart className="text-red-300 mx-1" /> para la belleza de SebasSexy.
        </span>
      </div>
    </footer>
  );
};

export default Footer;