import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { toast } from 'react-hot-toast';

const categories = ['lipstick', 'foundation', 'eyeshadow', 'other'] as const;

const CreateProduct: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('lipstick');
  const [stock, setStock] = useState(0);
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [durability, setDurability] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('El nombre del producto no puede estar vacío.');
      return;
    }
    if (!category || !categories.includes(category as typeof categories[number])) {
      toast.error('Por favor, selecciona una categoría válida.');
      return;
    }
    if (stock < 0) {
      toast.error('El stock no puede ser negativo.');
      return;
    }
    if (!warehouseLocation.trim()) {
      toast.error('La ubicación del almacén no puede estar vacía.');
      return;
    }
    if (durability < 1 || durability > 10) {
      toast.error('La durabilidad debe ser un número entre 1 y 10.');
      return;
    }

    try {
      await apiClient.post('/makeup-products', {
        name,
        category,
        stock,
        warehouse_location: warehouseLocation,
        durability_score: durability,
      });
      toast.success('Producto creado con éxito. ¡Añade más glamour!');
      navigate('/products'); 
    } catch (error) {
      toast.error('Error al crear el producto. Inténtalo de nuevo.');
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-pink-100"> 
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-8 font-serif">Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-6"> 
          <label className="block">
            <span className="text-gray-700 font-semibold">Nombre del Producto</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Labial Mágico Duradero"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              required
            />
          </label>

          {/* Categoría */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Categoría</span>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition bg-white"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </label>

          {/* Stock */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Stock Disponible</span>
            <input
              type="number"
              name="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="Cantidad de unidades"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              min={0}
              required
            />
          </label>

          {/* Ubicación en Almacén */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Ubicación en Almacén</span>
            <input
              type="text"
              name="warehouseLocation"
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              placeholder="Ej: Estante A3, Sección Cosméticos"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              required
            />
          </label>

          {/* Durabilidad */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Puntuación de Durabilidad (1-10)</span>
            <input
              type="number"
              name="durability"
              value={durability}
              onChange={(e) => setDurability(e.target.value === '' ? 1 : Number(e.target.value))}
              placeholder="Durabilidad"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              min={1}
              max={10}
              required
            />
          </label>

          {/* Botón de Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-800 transition-all duration-300 transform hover:scale-105"
          >
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;