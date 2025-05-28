import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useCart } from '../context/CartContext';

interface Product {
    id: string;
    name: string;
    category: string;
    stock: number;
    durability_score: number;
    price: number;
}

const TiendaCliente = () => {
    const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
        apiClient.get('/makeup-products')
            .then((res) => setProducts(res.data))
            .catch((err) => console.error('Error al cargar productos:', err));
    }, []);

    const { addToCart } = useCart();

    const handleAddToCart = (product: Product) => {
        addToCart({
            productId: product.id,
            name: product.name,
            quantity: 1,
            price: product.price
        });
        alert('Producto agregado al carrito');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-pink-600">Tienda GlamGiant 💄</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg p-4 shadow">
                        <h2 className="font-bold text-lg">{product.name}</h2>
                        <p className="text-sm text-gray-500 mb-1">Categoría: {product.category}</p>
                        <p className="text-sm">Stock: {product.stock}</p>
                        <p className="text-sm mb-2">Durabilidad: {product.durability_score}/10</p>
                        <p className="text-sm mb-2">
                            Precio: ${Number(product.price).toFixed(2)}
                        </p>
                        <button
                            className="w-full bg-pink-600 text-white py-1 rounded hover:bg-pink-700"
                            onClick={() => handleAddToCart(product)}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TiendaCliente;
