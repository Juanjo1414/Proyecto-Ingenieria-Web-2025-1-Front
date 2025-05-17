import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar arriba */}
      <Navbar />

      {/* Contenedor principal con sidebar y contenido */}
      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar a la izquierda */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-1 p-8">
          <section className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Resumen general</h2>
            <p>Bienvenido al panel administrativo. Aquí podrás gestionar productos, usuarios y más.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
