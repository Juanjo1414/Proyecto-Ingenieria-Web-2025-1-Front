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

export async function getProductById(id: string): Promise<Product> {
  const response = await apiClient.get(`/makeup-products/${id}`);
  return response.data;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const response = await apiClient.put(`/makeup-products/${id}`, productData);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/makeup-products/${id}`);
}