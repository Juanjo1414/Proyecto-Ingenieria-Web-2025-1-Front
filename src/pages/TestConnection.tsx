import React, { useEffect, useState } from 'react';
import { testConnection } from '../api/testApi';

const TestConnection: React.FC = () => {
  const [message, setMessage] = useState<string>('Cargando...');

  useEffect(() => {
    testConnection()
      .then(data => setMessage(JSON.stringify(data)))
      .catch(() => setMessage('Error al conectar con backend'));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Test conexión Backend</h2>
      <pre className="bg-gray-100 p-4 rounded">{message}</pre>
    </div>
  );
};

export default TestConnection;
