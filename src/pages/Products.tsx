import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, type Product } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar productos');
      setLoading(false);
      toast.error('Error al cargar productos.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) {
      try {
        await deleteProduct(id);
        toast.success('Producto eliminado exitosamente.');
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar el producto.');
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-product/${id}`);
  };

  if (loading) return <p className="p-8 text-center text-pink-700">Cargando productos...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="flex-1 p-8 bg-gray-100"> 
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-700 font-serif">Catálogo de Productos GlamGiant</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No hay productos registrados en el catálogo. ¡Es hora de crear algunos!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-xl shadow-md border border-pink-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-xl mb-2 text-pink-600">{product.name}</h3>
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-medium">Categoría:</span> <span className="capitalize">{product.category}</span>
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-medium">Stock:</span> {product.stock} unidades
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-medium">Ubicación:</span> {product.warehouse_location}
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Durabilidad:</span> <span className="font-bold text-pink-500">{product.durability_score}</span>/10
                </p>
              </div>
              <div className="mt-6 flex space-x-3 justify-end">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md transform hover:scale-105"
                  title="Editar Producto"
                >
                  <FaEdit className="text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-md transform hover:scale-105"
                  title="Eliminar Producto"
                >
                  <FaTrash className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;