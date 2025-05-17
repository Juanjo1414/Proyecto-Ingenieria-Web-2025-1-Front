import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);
    
    // Redirigir según el rol del usuario
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'tester') {
      navigate('/tester/dashboard');
    } else if (user.role === 'client') {
      navigate('/client/dashboard');
    } else if (user.role === 'employee') {
      navigate('/employee/dashboard');
    } else {
      navigate('/');
    }
  } catch (error) {
    alert('Error al iniciar sesión. Verifica tus credenciales.');
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">GlamGiant Login</h2>
      <label className="block mb-4">
        <span className="text-gray-700">Correo electrónico</span>
        <input
          type="email"
          className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="correo@ejemplo.com"
        />
      </label>
      <label className="block mb-6">
        <span className="text-gray-700">Contraseña</span>
        <input
          type="password"
          className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="********"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-pink-600 text-white font-semibold py-3 rounded hover:bg-pink-700 transition"
      >
        Iniciar sesión
      </button>
    </form>
  );
};

export default Login;
