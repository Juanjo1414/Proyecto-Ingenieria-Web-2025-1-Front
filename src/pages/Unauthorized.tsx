import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa'; 

const Unauthorized: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-pink-100 p-4 text-center"> {/* Fondo degradado pastel con toque de advertencia */}
    <FaExclamationTriangle className="text-red-500 text-6xl mb-6 animate-bounceOnce" /> 
    <h1 className="text-5xl font-extrabold mb-4 text-red-700">¡Acceso Denegado!</h1>
    <p className="mb-6 text-lg text-gray-700">
      Lo sentimos, no tienes los permisos necesarios para acceder a esta sección de GlamGiant Inc.
    </p>
    <Link
      to="/"
      className="inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-pink-600 hover:to-pink-800 transition-all duration-300 transform hover:scale-105"
    >
      <FaLock className="mr-2" /> Volver al Inicio de Sesión
    </Link>
  </div>
);

export default Unauthorized;