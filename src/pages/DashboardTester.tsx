import React from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { FaVials, FaFlask, FaChartPie } from 'react-icons/fa';

const DashboardTester: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 p-8 bg-gray-100">
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-pink-700 mb-4 font-serif">¡Bienvenido, Tester {user?.name || user?.email}!</h2>
        <p className="text-gray-700 text-lg font-serif">Tu misión es crucial para GlamGiant Inc.. Aquí puedes registrar resultados de pruebas y contribuir a la calidad de nuestros productos, queremos que sepas que si no funciona en ti no es nuesro producto es por feo😊😁👍.</p>
      </section>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Registrar Nuevas Pruebas */}
        <Link to="/product-tests?form=new" className="block"> 
          <div className="bg-gradient-to-br from-pink-300 to-pink-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Registrar Nuevas Pruebas</h3>
              <p className="text-sm">Añade los resultados de tus últimas evaluaciones de productos.</p>
            </div>
            <FaVials className="text-4xl opacity-75" />
          </div>
        </Link>

        {/* Revisar Pruebas Anteriores */}
        <Link to="/product-tests" className="block">
          <div className="bg-gradient-to-br from-purple-300 to-purple-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Revisar Pruebas Anteriores</h3>
              <p className="text-sm">Consulta el historial de todas las pruebas realizadas.</p>
            </div>
            <FaFlask className="text-4xl opacity-75" />
          </div>
        </Link>

        {/* Estadísticas de Productos*/}
        <Link to="/products" className="block"> 
          <div className="bg-gradient-to-br from-blue-300 to-blue-400 text-white p-6 rounded-lg shadow-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold mb-2">Estadísticas de Productos</h3>
              <p className="text-sm">Analiza el rendimiento general de los productos.</p>
            </div>
            <FaChartPie className="text-4xl opacity-75" />
          </div>
        </Link>
      </div>

    </div>
  );
};

export default DashboardTester;