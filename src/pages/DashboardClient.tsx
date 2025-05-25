import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
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
      const allOrders = await getOrders(); // <-- Aquí se obtienen TODAS las órdenes del backend
      const clientOrders = allOrders.filter(order => order.clientId === clientId);
      setPurchaseHistory(clientOrders);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar el historial de compras:', err);
      setError('Error al cargar tu historial de compras.');
      setLoading(false);
      toast.error('Error al cargar tu historial de compras.');
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <p className="text-center text-gray-700">Cargando historial de compras...</p>
      </main>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <p className="text-center text-red-600">{error}</p>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <section className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Cliente</h2>
          <p className="text-gray-700">Bienvenido Cliente, <strong>{user?.name ?? user?.email}</strong>. Aquí puedes ver tu historial de compras y más.</p>
        </section>

        <section className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Tu Historial de Compras</h3>
          {purchaseHistory.length === 0 ? (
            <p className="text-gray-600">Aún no has realizado ninguna compra.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID de Orden</th>
                    <th className="py-2 px-4 border-b text-left">Productos</th>
                    <th className="py-2 px-4 border-b text-left">Monto Total</th>
                    <th className="py-2 px-4 border-b text-left">Estado de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{order.id}</td>
                      <td className="py-2 px-4 border-b">
                        {Array.isArray(order.products)
                          ? order.products.map(p => (typeof p === 'object' && p.name ? p.name : p)).join(', ')
                          : 'N/A'}
                      </td>
                      <td className="py-2 px-4 border-b">${order.total_amount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b capitalize">{order.payment_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardClient;