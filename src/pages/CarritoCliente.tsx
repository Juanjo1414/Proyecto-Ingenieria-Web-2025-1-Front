import apiClient from '../api/apiClient';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios'; // Importa AxiosError

const CarritoCliente = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total_amount = cart.reduce(
    (acc, item) => acc + Number(item.quantity) * Number(item.price ?? 0),
    0
  );

  const handleComprar = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const payload = {
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      console.log('Cart:', cart);
      console.log('Payload enviado:', payload);
      const response = await apiClient.post('/user-purchases', payload);
      console.log('Respuesta del backend:', response.data);
      clearCart();
      alert('¡Compra realizada con éxito!');
      navigate('/client/dashboard');
    } catch (err) {
      const error = err as AxiosError; // Tipa el error como AxiosError
      console.error('Error al finalizar compra:', error.response?.data || error.message);
      const errorMessage =
        (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? (error.response.data as { message?: string }).message
          : undefined) ||
        error.message ||
        'Error desconocido';
      alert('Error al procesar la compra: ' + errorMessage);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <div>
          <ul className="space-y-4 mb-4">
            {cart.map((item) => (
              <li key={item.productId} className="flex justify-between items-center bg-white p-4 rounded shadow">
                <div>
                  <strong>{item.name}</strong> — Cantidad: {item.quantity} — Precio unitario: ${item.price}
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <p className="font-bold mb-4">Total: ${total_amount.toFixed(2)}</p>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleComprar}
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default CarritoCliente;