import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaBoxOpen, FaVials, FaUserTie, FaBars, FaUsers, FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Importa FaUserCircle

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const links = [
        { to: '/admin/dashboard', label: 'Dashboard Admin', icon: <FaTachometerAlt />, roles: ['admin'] },
        { to: '/products', label: 'Productos', icon: <FaBoxOpen />, roles: ['admin', 'employee'] },
        { to: '/product-tests', label: 'Pruebas de Productos', icon: <FaVials />, roles: ['admin', 'tester'] },
        { to: '/users-management', label: 'Gestión de Usuarios', icon: <FaUsers />, roles: ['admin'] },
        { to: '/orders-management', label: 'Gestión de Órdenes', icon: <FaShoppingCart />, roles: ['admin'] },
        { to: '/tester/dashboard', label: 'Dashboard Tester', icon: <FaTachometerAlt />, roles: ['tester'] },
        { to: '/employee/dashboard', label: 'Dashboard Empleado', icon: <FaTachometerAlt />, roles: ['employee'] },
        { to: '/client/dashboard', label: 'Mi Cuenta', icon: <FaUserTie />, roles: ['client'] },
        { to: '/profile', label: 'Mi Perfil', icon: <FaUserCircle />, roles: ['admin', 'client', 'tester', 'employee'] },
    ];

    const handleLogout = () => {
        logout();
    };

    const filteredLinks = links.filter(link =>
        link.roles.some(role => role.toLowerCase() === (user?.role || '').toLowerCase())
    );

    return (
        <div className="flex">
            <aside
                className={`bg-pink-600 text-white h-screen p-5 transition-width duration-300 ${isOpen ? 'w-64' : 'w-16'
                    } flex flex-col md:w-64`}
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

                    {user?.role === 'admin' && (
                        <Link
                            to="/create-product"
                            className={`flex items-center px-3 py-2 rounded hover:bg-pink-700 transition ${location.pathname === '/create-product' ? 'bg-pink-800' : ''
                                }`}
                            title="Crear Producto"
                        >
                            <FaBoxOpen />
                            {isOpen && <span className="ml-3">Crear Producto</span>}
                        </Link>
                    )}

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