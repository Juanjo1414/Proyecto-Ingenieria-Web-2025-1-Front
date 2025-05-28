// src/App.tsx
import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext'; 

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebarExpansion = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <p className="text-pink-600 text-2xl font-semibold">Cargando la experiencia GlamGiant...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AppRoutes />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isExpanded={isSidebarExpanded} toggleExpansion={toggleSidebarExpansion} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarExpanded ? 'ml-64' : 'ml-20'} /* Ajusta el margen izquierdo del contenido */
        `}
      >
        <Navbar toggleSidebar={toggleSidebarExpansion} isSidebarExpanded={isSidebarExpanded} />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>

      {/* Toaster para notificaciones */}
      <Toaster
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          className: 'font-sans', 
          duration: 3000, 
          style: {
            background: '#fff',
            color: '#333',
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: '#A78BFA', 
              secondary: '#fff',
            },
            style: {
              background: '#FCE7F3', 
              color: '#831843', 
              border: '1px solid #EC4899', 
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444', 
              secondary: '#fff',
            },
            style: {
              background: '#FEE2E2', 
              color: '#991B1B', 
              border: '1px solid #EF4444', 
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#DBEAFE', 
              color: '#1E40AF',
              border: '1px solid #60A5FA', 
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            },
          },
        }}
      />
    </div>
  );
};

export default App;