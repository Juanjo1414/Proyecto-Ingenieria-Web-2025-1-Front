import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-pink-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="font-bold text-lg cursor-pointer">
        <Link to="/admin/dashboard">GlamGiant</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="hover:text-pink-300">
          <FaBars />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
