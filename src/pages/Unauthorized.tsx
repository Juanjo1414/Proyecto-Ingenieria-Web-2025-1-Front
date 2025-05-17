import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <h1 className="text-4xl font-bold mb-4 text-red-600">403 - Acceso no autorizado</h1>
    <p className="mb-6">No tienes permisos para acceder a esta página.</p>
    <Link
      to="/"
      className="text-pink-600 font-semibold hover:underline"
    >
      Volver al inicio de sesión
    </Link>
  </div>
);

export default Unauthorized;
