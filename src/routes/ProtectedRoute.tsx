import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Verifica que el rol esté comparando correctamente
  const userRoleLower = user.role.toLowerCase();
  const allowed = allowedRoles.some(role => role.toLowerCase() === userRoleLower);

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};



export default ProtectedRoute;
