import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaUserCircle, FaLock } from 'react-icons/fa'; 

const Register: React.FC = () => { 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client', // rol fijo
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('El nombre no puede estar vacío.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@') || !form.email.includes('.')) {
      toast.error('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (!form.password.trim() || form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/register`, form);
      toast.success('Registro exitoso. ¡Bienvenido a GlamGiant! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || 'Error al registrar usuario.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4"> {/* Fondo degradado pastel */}
      <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-pink-200 animate-fadeIn"> {/* Contenedor estilizado */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-extrabold text-pink-700 mb-2 font-serif">Regístrate en GlamGiant</h2>
          <img src="/GGText.png" alt="GlamGiant Text" className="h-15 mb-2" />
          <p className="text-gray-700 text-sm font-serif mb-2 font-serif">💅Únete a nuestra comunidad pa quedar sexy como sebas💋</p>
        </div>

        {/* Campo Nombre */}
        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-2 block">Nombre Completo</span>
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-10 pr-3 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              placeholder="Tu nombre y apellido"
            />
            <FaUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
          </div>
        </label>

        {/* Campo Correo Electrónico */}
        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-2 block">Correo Electrónico</span>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-10 pr-3 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              placeholder="correo@ejemplo.com"
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
          </div>
        </label>

        {/* Campo Contraseña */}
        <label className="block mb-7">
          <span className="text-gray-700 font-semibold mb-2 block">Contraseña</span>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-10 pr-3 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              placeholder="********"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
          </div>
        </label>

        {/* Botón de Registro */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-pink-600 hover:to-pink-800 transition-all duration-300 transform hover:scale-105"
        >
          Registrarse
        </button>

        {/* Enlace para Iniciar Sesión */}
        <p className="text-center mt-8 text-md text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-pink-600 font-semibold hover:underline transition-colors duration-200">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;