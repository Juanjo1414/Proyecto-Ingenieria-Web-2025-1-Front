import apiClient from './apiClient';

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  warehouse_location: string;
  durability_score: number;
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get('/makeup-products');
  return response.data;
}
