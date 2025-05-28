// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarExpanded: boolean; // ¡Nuevo!
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarExpanded }) => {
  return (
    <nav className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-4 flex justify-between items-center shadow-lg relative z-10">
      {/* Botón para abrir/cerrar el sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-white text-xl focus:outline-none hover:text-pink-100 transition-colors duration-300 p-2 rounded-md hover:bg-pink-500"
        aria-label={isSidebarExpanded ? "Contraer sidebar" : "Expandir sidebar"}
      >
        <FaBars />
      </button>

      <div className="font-bold text-2xl tracking-wider cursor-pointer">
        <Link to="/admin/dashboard" className="hover:text-pink-100 transition-colors duration-300">GlamGiant</Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Puedes agregar otros elementos aquí si los necesitas */}
      </div>
    </nav>
  );
};

export default Navbar;