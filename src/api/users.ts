import apiClient from './apiClient';


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'tester' | 'employee';
  purchase_history?: string[]; 
  test_subject_status?: boolean;
  allergic_reactions?: string;
}

// Interfaz para crear un nuevo usuario 
export interface CreateUserDto {
  email: string;
  name: string;
  password?: string;
  role?: 'admin' | 'client' | 'tester' | 'employee';
  test_subject_status?: boolean;
  allergic_reactions?: string;
}

// Interfaz para actualizar un usuario
export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  role?: 'admin' | 'client' | 'tester' | 'employee';
  test_subject_status?: boolean;
  allergic_reactions?: string;
}

// Obtener todos los usuarios
export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get('/users');
  return response.data;
}

// Obtener un usuario por ID
export async function getUserById(id: string): Promise<User> {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
}

// Crear un nuevo usuario
export async function createUser(userData: CreateUserDto): Promise<User> {
  const response = await apiClient.post('/users', userData);
  return response.data;
}

// Actualizar un usuario
export async function updateUser(id: string, userData: UpdateUserDto): Promise<User> {
  const response = await apiClient.patch(`/users/${id}`, userData);
  return response.data;
}

// Eliminar un usuario
export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
}