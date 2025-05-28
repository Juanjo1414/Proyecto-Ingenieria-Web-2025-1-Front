// src/pages/DashboardEmployee.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import { useAuth } from '../context/AuthContext';
import { FaBoxes, FaShippingFast, FaClipboardList } from 'react-icons/fa';

const DashboardEmployee: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 p-8 bg-gray-100">
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-pink-700 mb-4 font-serif">¡Hola, Esclavo con paga digo... Empleado {user?.name || user?.email}!</h2>
        <p className="text-gray-700 text-lg font-serif">Bienvenido a tu panel de control. Desde aquí puedes gestionar el inventario y los envíos para mantener la magia de GlamGiant en movimiento y servir como buen esclavo a la gran DOMINACION.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gestión de Inventario */}
        <Link to="/products" className="block"> 
          <div className="bg-gradient-to-br from-pink-300 to-pink-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Gestión de Inventario</h3>
              <p className="text-sm">Supervisa y actualiza los niveles de stock de productos.</p>
            </div>
            <FaBoxes className="text-4xl opacity-75" />
          </div>
        </Link>

        {/* Control de Envíos*/}
        <Link to="/orders-management" className="block"> 
          <div className="bg-gradient-to-br from-purple-300 to-purple-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Control de Envíos</h3>
              <p className="text-sm">Gestiona y rastrea el estado de los pedidos.</p>
            </div>
            <FaShippingFast className="text-4xl opacity-75" />
          </div>
        </Link>

        {/* Reportes Operacionales */}
        <Link to="/products" className="block"> 
          <div className="bg-gradient-to-br from-blue-300 to-blue-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Reportes Operacionales y Productos</h3>
              <p className="text-sm">Genera informes sobre el movimiento de productos.</p>
            </div>
            <FaClipboardList className="text-4xl opacity-75" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardEmployee;