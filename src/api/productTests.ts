import apiClient from './apiClient';

// Define la interfaz para una prueba de producto
export interface ProductTest {
  id: string;
  testerId: string;
  productId: string;
  reaction: string;
  rating: number; // 1-10
  survival_status: boolean;
  tester?: { id: string; name: string; email: string }; 
  product?: { id: string; name: string; category: string };
}

// Define la interfaz para crear una prueba (campos necesarios para el POST)
export interface CreateProductTestDto {
  testerId: string;
  productId: string;
  reaction: string;
  rating: number;
  survival_status: boolean;
}

// Define la interfaz para actualizar una prueba (campos opcionales para el PATCH)
export interface UpdateProductTestDto {
  testerId?: string;
  productId?: string;
  reaction?: string;
  rating?: number;
  survival_status?: boolean;
}

// Función para obtener todas las pruebas de productos
export async function getProductTests(): Promise<ProductTest[]> {
  const response = await apiClient.get('/products-tests');
  return response.data;
}

// Función para obtener una prueba de producto por ID
export async function getProductTestById(id: string): Promise<ProductTest> {
  const response = await apiClient.get(`/products-tests/${id}`);
  return response.data;
}

// Función para crear una nueva prueba de producto
export async function createProductTest(data: CreateProductTestDto): Promise<ProductTest> {
  const response = await apiClient.post('/products-tests', data);
  return response.data;
}

// Función para actualizar una prueba de producto existente
export async function updateProductTest(id: string, data: UpdateProductTestDto): Promise<ProductTest> {
  const response = await apiClient.patch(`/products-tests/${id}`, data);
  return response.data;
}

// Función para eliminar una prueba de producto
export async function deleteProductTest(id: string): Promise<void> {
  await apiClient.delete(`/products-tests/${id}`);
}