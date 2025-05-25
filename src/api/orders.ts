import apiClient from './apiClient';
import {type  Product } from './products';
import {type  User } from './users'; 


export interface OrderAndTransaction {
  id: string;
  clientId: string;
  products: string[] | Product[];
  total_amount: number;
  payment_status: 'Paid' | 'Refunded' | 'Failed';
  client?: User; 
}

export interface CreateOrderDto {
  clientId: string;
  productIds: string[]; 
  total_amount: number;
  payment_status: 'Paid' | 'Refunded' | 'Failed';
}

export interface UpdateOrderDto {
  clientId?: string;
  productIds?: string[];
  total_amount?: number;
  payment_status?: 'Paid' | 'Refunded' | 'Failed';
}

// Obtener todas las órdenes
export async function getOrders(): Promise<OrderAndTransaction[]> {
  const response = await apiClient.get('/orders');
  return response.data;
}

// Obtener una orden por ID
export async function getOrderById(id: string): Promise<OrderAndTransaction> {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
}

// Crear una nueva orden
export async function createOrder(orderData: CreateOrderDto): Promise<OrderAndTransaction> {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
}

// Actualizar una orden
export async function updateOrder(id: string, orderData: UpdateOrderDto): Promise<OrderAndTransaction> {
  const response = await apiClient.patch(`/orders/${id}`, orderData);
  return response.data;
}

// Eliminar una orden
export async function deleteOrder(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
}