import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as loginApi } from '../api/auth';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name?: string; // si el token tiene este campo

}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setToken(token);
      try {
        const parsedUser = JSON.parse(userData);
        console.log('User logged in:', parsedUser); // Verifica que role esté aquí
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        setUser(null);
      }
    }
  }, []);


  const login = async (email: string, password: string) => {
    const { token } = await loginApi(email, password); // Llamada a la API para obtener el token
    setToken(token);
    localStorage.setItem('token', token);


    // Decodificar el token para obtener los datos del usuario
    const decoded = jwtDecode<JwtPayload>(token);
    console.log('Decoded user data:', decoded); // Verifica el contenido del token
    const user: User = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,  // Si el token tiene este campo
    };

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Guardar usuario en localStorage
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
