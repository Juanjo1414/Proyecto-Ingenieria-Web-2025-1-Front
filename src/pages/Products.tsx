import React, { useEffect, useState } from 'react';
import { getProducts, type Product } from '../api/products';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
  console.error('Error al cargar productos:', error);
  setError('Error al cargar productos');
  setLoading(false);
});
  }, []);

  if (loading) return <p className="p-8">Cargando productos...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Productos GlamGiant</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p>Categoría: {product.category}</p>
            <p>Stock: {product.stock}</p>
            <p>Ubicación: {product.warehouse_location}</p>
            <p>Durabilidad: {product.durability_score}/10</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
