import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct, type Product } from '../api/products';
import { toast } from 'react-hot-toast';

const categories = ['lipstick', 'foundation', 'eyeshadow', 'other'] as const;

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [durability, setDurability] = useState(0);
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          setError('ID de producto no proporcionado.');
          setLoading(false);
          toast.error('ID de producto no encontrado para editar.');
          return;
        }
        const productToEdit = await getProductById(id);
        setName(productToEdit.name);
        setCategory(productToEdit.category);
        setStock(productToEdit.stock);
        setDurability(productToEdit.durability_score);
        setWarehouseLocation(productToEdit.warehouse_location);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el producto para edición:', err);
        setError('Error al cargar el producto para edición. Por favor, inténtalo de nuevo.');
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

    if (!name.trim()) {
      toast.error('El nombre del producto no puede estar vacío.');
      return;
    }

    if (category && !categories.includes(category as typeof categories[number])) {
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
      await updateProduct(id, {
        name,
        category,
        stock,
        durability_score: durability,
        warehouse_location: warehouseLocation,
      });
      toast.success('Producto actualizado exitosamente. ¡El glamour perdura!');
      navigate('/products');
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      const errorMessage = (err as any)?.response?.data?.message || 'Error al actualizar el producto.';
      toast.error(errorMessage);
    }
  };

  if (loading) return <p className="p-8 text-center text-pink-700">Cargando producto para edición...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="flex-1 p-8 bg-gray-50"> 
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-8 font-serif">Editar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-6"> 
          {/* Nombre del Producto */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Nombre del Producto</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              required
            />
          </label>

          {/* Categoría */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Categoría</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition bg-white"
              required
            >
              <option value="">Selecciona una categoría</option> 
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
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              placeholder="Stock"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              min={0}
              required
            />
          </label>

          {/* Durabilidad */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Puntuación de Durabilidad (1-10)</span>
            <input
              type="number"
              value={durability}
              onChange={(e) => setDurability(Number(e.target.value))}
              placeholder="Durabilidad (1-10)"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              min={1}
              max={10}
              required
            />
          </label>

          {/* Ubicación en Almacén */}
          <label className="block">
            <span className="text-gray-700 font-semibold">Ubicación en Almacén</span>
            <input
              type="text"
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              placeholder="Ubicación en almacén"
              className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              required
            />
          </label>

          {/* Botón de Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-800 transition-all duration-300 transform hover:scale-105"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;