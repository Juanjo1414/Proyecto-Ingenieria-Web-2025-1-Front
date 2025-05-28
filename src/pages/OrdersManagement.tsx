import React, { useEffect, useState } from 'react';
import { getOrders, type OrderAndTransaction } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

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

  // Solo el Admin puede acceder a esta página
  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <section className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Acceso Denegado</h2>
            <p>No tienes permisos para ver la gestión de órdenes.</p>
          </section>
        </main>
      </div>
    );
  }

  if (loading) return <p className="p-8">Cargando órdenes...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Gestión de Órdenes y Transacciones</h2>

        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Listado de Órdenes</h3>
          {orders.length === 0 ? (
            <p>No hay órdenes registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID de Orden</th>
                    <th className="py-2 px-4 border-b text-left">Cliente (ID)</th>
                    <th className="py-2 px-4 border-b text-left">Productos</th>
                    <th className="py-2 px-4 border-b text-left">Monto Total</th>
                    <th className="py-2 px-4 border-b text-left">Estado de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{order.id}</td>
                      <td className="py-2 px-4 border-b">
                        {typeof order.client === 'object' && order.client?.name ? order.client.name : order.clientId}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {Array.isArray(order.products)
                          ? order.products.map(p => (typeof p === 'object' && p.name ? p.name : p)).join(', ')
                          : 'N/A'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        ${Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">{order.payment_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersManagement;