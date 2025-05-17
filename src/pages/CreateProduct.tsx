import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const CreateProduct: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [durability, setDurability] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/makeup-products', {
        name,
        category,
        stock,
        durability_score: durability,
      });
      navigate('/products');
    } catch (error) {
      alert('Error al crear el producto.');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Crear Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Categoría"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="Stock"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          value={durability}
          onChange={(e) => setDurability(Number(e.target.value))}
          placeholder="Durabilidad"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-pink-600 text-white py-2 px-4 rounded w-full"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
