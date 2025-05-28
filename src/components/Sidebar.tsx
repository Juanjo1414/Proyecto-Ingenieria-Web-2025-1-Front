import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaBoxOpen, FaVials, FaUserTie, FaBars, FaUsers, FaShoppingCart, FaUserCircle, FaSignOutAlt, FaPlus, FaTimes } from 'react-icons/fa'; // Iconos adicionales, agregué FaTimes

interface SidebarProps {
    isExpanded: boolean; 
    toggleExpansion: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleExpansion }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

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
        <>
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleExpansion} 
                ></div>
            )}

            <aside
                className={`
                    fixed left-0 top-0 h-full bg-pink-600 text-white p-4 flex flex-col z-30
                    transition-all duration-300 ease-in-out shadow-lg

                    ${isExpanded ? 'w-64' : 'w-20'} /* Ancho fijo para expandido/contraído */

                    /* Comportamiento en pantallas pequeñas (móviles) */
                    ${isExpanded ? 'translate-x-0' : '-translate-x-full'} /* Se desliza completamente */
                    md:translate-x-0 /* Siempre visible en desktop */
                `}
            >
                <div className="flex items-center mb-8 px-2">
                    {isExpanded && <h1 className="text-xl font-bold cursor-default flex-grow">GlamGiant</h1>}
                    <button
                        onClick={toggleExpansion} 
                        className="text-white text-xl focus:outline-none md:hidden ml-auto p-2 rounded-md hover:bg-pink-600" 
                        aria-label="Cerrar sidebar"
                    >
                        {isExpanded ? <FaTimes /> : <FaBars />} 
                    </button>
                </div>

                <nav className="flex flex-col space-y-3 flex-grow">
                    {user?.role === 'admin' && (
                        <Link
                            to="/create-product"
                            className={`flex items-center px-3 py-2 rounded hover:bg-pink-600 transition-colors duration-200 ${location.pathname === '/create-product' ? 'bg-pink-800' : ''
                                }`}
                            title="Crear Producto"
                        >
                            <FaPlus className="text-lg" />
                            {isExpanded && <span className="ml-3">Crear Producto</span>}
                        </Link>
                    )}

                    {filteredLinks.map(({ to, label, icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center px-3 py-2 rounded hover:bg-pink-600 transition-colors duration-200 ${location.pathname === to ? 'bg-pink-800' : ''
                                }`}
                            title={label}
                        >
                            <span className="text-lg">{icon}</span>
                            {isExpanded && <span className="ml-3">{label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-pink-500/50 px-2">
                    {isExpanded && (
                        <div className="mb-4 text-sm text-pink-100">
                            Hola, <strong className="text-white">{user?.name ?? user?.email}</strong>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="bg-pink-800 w-full py-2 rounded hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <FaSignOutAlt />
                        {isExpanded && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;