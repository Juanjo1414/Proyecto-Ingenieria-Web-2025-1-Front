import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
   return (
    <> 
      <AppRoutes />
      <Toaster /> 
    </>
  );
};

export default App;
