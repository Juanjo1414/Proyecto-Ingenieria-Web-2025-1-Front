import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client', // rol fijo por defecto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/users/register', form);
      toast.success('Registro exitoso, ahora puedes iniciar sesión');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      toast.error('Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">Registro</h2>

      <label className="block mb-4">
        <span className="text-gray-700">Nombre</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-pink-300 rounded px-3 py-2"
          placeholder="Tu nombre"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Correo electrónico</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-pink-300 rounded px-3 py-2"
          placeholder="correo@ejemplo.com"
        />
      </label>

      <label className="block mb-6">
        <span className="text-gray-700">Contraseña</span>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-pink-300 rounded px-3 py-2"
          placeholder="********"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-pink-600 text-white font-semibold py-3 rounded hover:bg-pink-700 transition"
      >
        Registrarse
      </button>

      <p className="text-sm mt-4 text-center">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="text-pink-600 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </form>
  );
};

export default Register;
