import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUserCircle, FaLock } from 'react-icons/fa';

const Login: React.FC = () => { 
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      toast.success(`Bienvenido, ${user.name || user.email}!`);

      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'tester':
          navigate('/tester/dashboard');
          break;
        case 'client':
          navigate('/client/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        default:
          navigate('/'); 
      }
    } catch (error) {
      toast.error('Error al iniciar sesión. Verifica tus credenciales y vuelve a intentarlo.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4"> 
      <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-pink-200 animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
          <img src="/GGlogo2.png" alt="GlamGiant Logo" className="h-20 " /> 
          <img src="/GGText.png" alt="GlamGiant Text" className="h-15 mb-2" /> 
          <p className="text-gray-700 text-sm font-serif">Dominando la belleza y la que soporte 💋💅✨</p>
        </div>

        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-2 block">Correo electrónico</span>
          <div className="relative">
            <input
              type="email"
              className="mt-1 block w-full pl-10 pr-3 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
            />
            <FaUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
          </div>
        </label>
        <label className="block mb-7">
          <span className="text-gray-700 font-semibold mb-2 block">Contraseña</span>
          <div className="relative">
            <input
              type="password"
              className="mt-1 block w-full pl-10 pr-3 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
          </div>
        </label>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-pink-600 hover:to-pink-800 transition-all duration-300 transform hover:scale-105"
        >
          Iniciar sesión
        </button>

        <p className="text-center mt-8 text-md text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-pink-600 font-semibold hover:underline transition-colors duration-200">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;