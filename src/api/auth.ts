import apiClient from './apiClient';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'tester' | 'client' | 'employee';
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

