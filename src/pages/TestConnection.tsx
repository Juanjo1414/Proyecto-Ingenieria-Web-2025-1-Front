import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient'; 
import toast from 'react-hot-toast';
import { FaPlug, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TestConnection: React.FC = () => {
  const [message, setMessage] = useState<string>('Intentando conectar con el backend...');
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const runTestConnection = async () => {
      try {
      
        const response = await apiClient.get('/'); 
        setMessage(JSON.stringify(response.data, null, 2)); 
        setIsError(false);
        toast.success('Conexión con el backend establecida. ¡Todo listo!');
      } catch (error) {
        console.error('Error al conectar con backend:', error);
        setMessage('Error al conectar con el backend. Por favor, verifica que el servidor esté funcionando.');
        setIsError(true);
        toast.error('Error de conexión con el backend.');
      }
    };

    runTestConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-4 text-center"> {/* Fondo degradado pastel */}
      <FaPlug className={`text-6xl mb-6 ${isError ? 'text-red-500' : 'text-blue-500'}`} />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Estado de Conexión al Backend</h1>
      
      <div className={`bg-white p-8 rounded-xl shadow-lg border-2 ${isError ? 'border-red-300' : 'border-green-300'} max-w-lg w-full`}>
        {isError ? (
          <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
        ) : (
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
        )}
        <pre className={`whitespace-pre-wrap break-words p-4 rounded-md text-left ${isError ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message}
        </pre>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Esta página muestra el estado de la conexión a tu servidor backend.
      </p>
    </div>
  );
};

export default TestConnection;