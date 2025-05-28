import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders, type OrderAndTransaction } from '../api/orders';
import toast from 'react-hot-toast';

const DashboardClient: React.FC = () => {
  const { user } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState<OrderAndTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchPurchaseHistory(user.id);
    } else {
      setLoading(false);
      setError('No se pudo cargar el historial de compras: usuario no autenticado.');
      toast.error('Por favor, inicia sesión para ver tu historial de compras.');
    }
  }, [user?.id]);

  const fetchPurchaseHistory = async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const allOrders = await getOrders();
      const clientOrders = allOrders.filter(order => order.clientId === clientId);
      setPurchaseHistory(clientOrders);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar el historial de compras:', err);
      setError('Error al cargar tu historial de compras. Por favor, inténtalo de nuevo más tarde.');
      setLoading(false);
      toast.error('Error al cargar tu historial de compras.');
    }
  };

  if (loading) return (
    <p className="flex-1 p-8 text-center text-pink-700">Cargando historial de compras...</p>
  );

  if (error) return (
    <p className="flex-1 p-8 text-center text-red-600">{error}</p>
  );

  return (
    <div className="flex-1 p-8 bg-gray-100"> 
      <section className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-pink-700 mb-4 font-serif">¡Bienvenido a Tu Glam, {user?.name ?? user?.email}!</h2>
        <p className="text-gray-700 text-lg font-serif">Aquí puedes explorar tu historial de compras y descubrir más sobre tus productos favoritos.</p>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
        <h3 className="text-2xl font-bold text-center text-pink-600 mb-6">Tu Historial de Compras</h3>
        {purchaseHistory.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Aún no has realizado ninguna compra con GlamGiant. ¡Es hora de explorar nuestros productos y añadir un poco de brillo a tu vida!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-pink-100 text-pink-800 text-left uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-pink-200">ID de Orden</th>
                  <th className="py-3 px-6 border-b border-pink-200">Productos</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-right">Monto Total</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-center">Estado de Pago</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {purchaseHistory.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-pink-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                        <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {Array.isArray(order.products)
                        ? order.products.map(p => (typeof p === 'object' && p.name ? p.name : p)).join(', ')
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-6 text-right font-semibold text-pink-600">
                        ${Number(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-center capitalize">
                      {order.payment_status === 'Paid' && (
                        <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs font-semibold">Pagado</span>
                      )}
                      {order.payment_status === 'Refunded' && (
                        <span className="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs font-semibold">Reembolsado</span>
                      )}
                      {order.payment_status === 'Failed' && (
                        <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-xs font-semibold">Fallido</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardClient;