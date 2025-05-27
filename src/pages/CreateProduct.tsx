import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { toast } from 'react-hot-toast';

const categories = ['lipstick', 'foundation', 'eyeshadow', 'other'] as const;

const CreateProduct: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('lipstick');
  const [stock, setStock] = useState(0);
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [durability, setDurability] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() || // Validamos que el nombre no esté vacío
      !description.trim() ||
      !category ||
      !categories.includes(category as typeof categories[number]) ||
      !warehouseLocation.trim() ||
      stock < 0 ||
      durability < 1 ||
      durability > 10
    ) {
      toast.error('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      await apiClient.post('/makeup-products', {
        name,
        description,
        category,
        stock,
        warehouse_location: warehouseLocation,
        durability_score: durability,
      });
      toast.success('Producto creado con éxito');
      navigate('/products');
    } catch (error) {
      toast.error('Error al crear el producto.');
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Crear Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value === '' ? 0 : Number(e.target.value))}
          placeholder="Stock"
          className="w-full px-4 py-2 border rounded"
          min={0}
          required
        />
        <input
          type="text"
          name="warehouseLocation"
          value={warehouseLocation}
          onChange={(e) => setWarehouseLocation(e.target.value)}
          placeholder="Ubicación en almacén"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          name="durability"
          value={durability}
          onChange={(e) => setDurability(e.target.value === '' ? 1 : Number(e.target.value))}
          placeholder="Durabilidad (1-10)"
          className="w-full px-4 py-2 border rounded"
          min={1}
          max={10}
          required
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
