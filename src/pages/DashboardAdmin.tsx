import React from 'react';
import { Link } from 'react-router-dom'; 
import { FaChartLine, FaUsersCog, FaBox, FaShoppingCart } from 'react-icons/fa';

const DashboardAdmin: React.FC = () => {
  return (
    <div className="flex-1 p-8">
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-pink-700 mb-4 font-serif">¡Bienvenido, Administrador!</h2>
        <p className="text-gray-700 text-lg  font-serif">Este es tu centro de control para gestionar todos los aspectos de GlamGiant Inc. Desde aquí, tienes el poder de supervisar (De forma muy etica y progress) productos, usuarios, órdenes y pruebas para alcanzar la <b>DOMINACION DE LAS COMPAÑIAS DE MAQUILLAJE MUAJAJAJAJAJ</b>.</p>
      </section>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gestión de Usuarios */}
        <Link to="/users-management" className="block"> 
          <div className="bg-gradient-to-br from-pink-300 to-pink-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Gestión de Usuarios</h3>
              <p className="text-sm">Controla todos los usuarios del sistema.</p>
            </div>
            <FaUsersCog className="text-4xl opacity-75" />
          </div>
        </Link>

        {/* Gestión de Productos */}
        <Link to="/products" className="block">
          <div className="bg-gradient-to-br from-purple-300 to-purple-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Gestión de Productos</h3>
              <p className="text-sm">Administra el inventario de maquillaje.</p>
            </div>
            <FaBox className="text-4xl opacity-75" />
          </div>
        </Link>

        {/* Gestión de Órdenes */}
        <Link to="/orders-management" className="block">
          <div className="bg-gradient-to-br from-blue-300 to-blue-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Gestión de Órdenes</h3>
              <p className="text-sm">Supervisa todas las transacciones.</p>
            </div>
            <FaShoppingCart className="text-4xl opacity-75" />
          </div>
        </Link>

        <Link to="/product-tests" className="block">
          <div className="bg-gradient-to-br from-green-300 to-green-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Pruebas de Productos</h3>
              <p className="text-sm">Revisa los resultados de las pruebas.</p>
            </div>
            <FaChartLine className="text-4xl opacity-75" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardAdmin;