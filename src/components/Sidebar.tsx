import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaBoxOpen, FaVials, FaUserTie, FaBars } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const links = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, roles: ['Admin'] },
        { to: '/products', label: 'Productos', icon: <FaBoxOpen />, roles: ['Admin', 'Employee'] },
        { to: '/tester/dashboard', label: 'Pruebas', icon: <FaVials />, roles: ['Tester'] },
        { to: '/client/dashboard', label: 'Mi Cuenta', icon: <FaUserTie />, roles: ['Client'] },
    ];

    const handleLogout = () => {
        logout();
    };

    const filteredLinks = links.filter(link => link.roles.includes(user?.role ?? ''));

    return (
        <div className="flex">
            <aside
                className={`bg-pink-600 text-white h-screen p-5 transition-width duration-300 ${isOpen ? 'w-64' : 'w-16'
                    } flex flex-col md:w-64`}  // Aquí aseguramos que en pantallas grandes esté siempre abierto
            >
                <div className="flex justify-between items-center mb-8">
                    {isOpen && <h1 className="text-lg font-bold cursor-default">GlamGiant</h1>}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                        aria-label="Toggle sidebar"
                    >
                        <FaBars />
                    </button>
                </div>


                <nav className="flex flex-col space-y-3 flex-grow">

                    <Link
                        to="/create-product"
                        className={`flex items-center px-3 py-2 rounded hover:bg-pink-700 transition ${location.pathname === '/create-product' ? 'bg-pink-800' : ''
                            }`}
                        title="Crear Producto"
                    >
                        <FaBoxOpen />
                        {isOpen && <span className="ml-3">Crear Producto</span>}
                    </Link>
                    
                    {filteredLinks.map(({ to, label, icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center px-3 py-2 rounded hover:bg-pink-700 transition ${location.pathname === to ? 'bg-pink-800' : ''
                                }`}
                            title={isOpen ? label : undefined}
                        >
                            <span className="text-lg">{icon}</span>
                            {isOpen && <span className="ml-3">{label}</span>}
                        </Link>

                        
                    ))}
                </nav>

                

                <div className="mt-auto pt-10">
                    {isOpen && (
                        <div className="mb-4">
                            Hola, <strong>{user?.name ?? user?.email}</strong>
                        </div>
                    )}

                    

                    <button
                        onClick={handleLogout}
                        className="bg-pink-800 w-full py-2 rounded hover:bg-pink-700 transition"
                    >
                        Cerrar sesión
                    </button>

                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
