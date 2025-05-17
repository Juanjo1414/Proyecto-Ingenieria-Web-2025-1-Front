import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardClient: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dashboard Cliente</h2>
          <p>Bienvenido Cliente, aquí puedes ver tu historial de compras y más.</p>
        </section>
      </main>
    </div>
  );
};

export default DashboardClient;
