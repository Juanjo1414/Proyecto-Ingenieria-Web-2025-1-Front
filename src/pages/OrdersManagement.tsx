import React, { useEffect, useState } from 'react';
import { getOrders, type OrderAndTransaction } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OrdersManagement: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderAndTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('Error al cargar órdenes.');
      setLoading(false);
      toast.error('Error al cargar las órdenes.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex-1 p-8 bg-gray-100"> 
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-700 font-serif">Acceso Denegado</h2>
          <p className="text-gray-700">No tienes permisos para ver la gestión de órdenes. Esta sección es exclusiva para administradores.</p>
        </section>
      </div>
    );
  }

  if (loading) return <p className="flex-1 p-8 text-center text-pink-700">Cargando órdenes...</p>;
  if (error) return <p className="flex-1 p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="flex-1 p-8 bg-gray-100"> 
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-700 font-serif">Gestión de Órdenes y Transacciones</h2>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
        <h3 className="text-2xl font-bold text-center text-pink-600 mb-6">Listado Detallado de Órdenes</h3>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No hay órdenes registradas en el sistema. ¡El negocio aún no ha despegado!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-pink-100 text-pink-800 text-left uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-pink-200">ID de Orden</th>
                  <th className="py-3 px-6 border-b border-pink-200">Cliente</th>
                  <th className="py-3 px-6 border-b border-pink-200">Productos</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-right">Monto Total</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-center">Estado de Pago</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-pink-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                        <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {typeof order.client === 'object' && order.client?.name ? (
                        <>
                          <span className="font-medium">{order.client.name}</span> <br />
                          <span className="text-xs text-gray-500">({order.client.email})</span>
                        </>
                      ) : (
                        `ID: ${order.clientId}`
                      )}
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
      </div>
    </div>
  );
};

export default OrdersManagement;