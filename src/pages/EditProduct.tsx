// src/pages/EditProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct, type Product } from '../api/products'; 
import { toast } from 'react-hot-toast';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [durability, setDurability] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          setError('ID de producto no proporcionado.');
          setLoading(false);
          return;
        }
        const productToEdit = await getProductById(id);
        setName(productToEdit.name);
        setCategory(productToEdit.category);
        setStock(productToEdit.stock);
        setDurability(productToEdit.durability_score);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el producto para edición:', err);
        setError('Error al cargar el producto.');
        toast.error('No se pudo cargar el producto para edición.');
        setLoading(false);
      }
    };

    fetchProduct(); 
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error('Error: ID de producto no proporcionado para actualizar.');
      return;
    }
    try {
      await updateProduct(id, {
        name,
        category,
        stock,
        durability_score: durability,
      });
      toast.success('Producto actualizado exitosamente!');
      navigate('/products'); 
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      toast.success('Producto actualizado exitosamente!');
    }
  };

  if (loading) return <p className="p-8">Cargando producto...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Categoría"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="Stock"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          value={durability}
          onChange={(e) => setDurability(Number(e.target.value))}
          placeholder="Durabilidad (1-10)"
          className="w-full px-4 py-2 border rounded"
          min="1"
          max="10"
          required
        />
        <button
          type="submit"
          className="bg-pink-600 text-white py-2 px-4 rounded w-full hover:bg-pink-700 transition"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditProduct;