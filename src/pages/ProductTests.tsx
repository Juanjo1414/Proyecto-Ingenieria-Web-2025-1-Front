import React, { useEffect, useState } from 'react';
import {
  getProductTests,
  createProductTest,
  updateProductTest,
  deleteProductTest,
  type ProductTest,
  type CreateProductTestDto,
  type UpdateProductTestDto,
} from '../api/productTests'; // Importa las nuevas funciones de API
import { getProducts, type Product } from '../api/products'; // Necesitas productos para el dropdown
import { useAuth } from '../context/AuthContext'; // Para obtener el ID del usuario logueado (testerId)
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlusSquare } from 'react-icons/fa'; // Iconos para acciones
import Sidebar from '../components/Sidebar'; // Asumiendo que esta página tendrá Sidebar

const ProductTests: React.FC = () => {
  const { user } = useAuth(); // Obtén el usuario logueado
  const [productTests, setProductTests] = useState<ProductTest[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // Para el selector de productos
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [productId, setProductId] = useState('');
  const [reaction, setReaction] = useState('');
  const [rating, setRating] = useState(1);
  const [survivalStatus, setSurvivalStatus] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsData, productsData] = await Promise.all([
        getProductTests(),
        getProducts(), // Obtener productos para el selector
      ]);
      setProductTests(testsData);
      setProducts(productsData);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar las pruebas de productos o productos.');
      setLoading(false);
      toast.error('Error al cargar datos.');
    }
  };

  const resetForm = () => {
    setProductId('');
    setReaction('');
    setRating(1);
    setSurvivalStatus(false);
    setIsEditing(false);
    setCurrentTestId(null);
    setShowForm(false);
  };

  const handleEdit = (test: ProductTest) => {
    setCurrentTestId(test.id);
    setProductId(test.productId);
    setReaction(test.reaction);
    setRating(test.rating);
    setSurvivalStatus(test.survival_status);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta prueba de producto?')) {
      try {
        await deleteProductTest(id);
        toast.success('Prueba de producto eliminada exitosamente.');
        fetchData(); // Recargar la lista
      } catch (err) {
        console.error('Error al eliminar prueba de producto:', err);
        toast.error('Error al eliminar la prueba de producto.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
        toast.error('No se pudo obtener el ID del tester. Por favor, inicia sesión de nuevo.');
        return;
    }

    const testData = {
      testerId: user.id, // El ID del usuario logueado es el testerId
      productId,
      reaction,
      rating,
      survival_status: survivalStatus,
    };

    try {
      if (isEditing && currentTestId) {
        await updateProductTest(currentTestId, testData as UpdateProductTestDto);
        toast.success('Prueba de producto actualizada exitosamente.');
      } else {
        await createProductTest(testData as CreateProductTestDto);
        toast.success('Prueba de producto creada exitosamente.');
      }
      resetForm();
      fetchData(); // Recargar la lista
    } catch (err) {
      console.error('Error al guardar prueba de producto:', err);
      toast.error('Error al guardar la prueba de producto.');
    }
  };

  if (loading) return <p className="p-8">Cargando pruebas de productos...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  // Roles que pueden ver/gestionar pruebas (según tu backend: admin, employee, tester)
  const canManageTests = user?.role === 'admin' || user?.role === 'employee' || user?.role === 'tester';

  if (!canManageTests) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar /> {/* Mantén el sidebar si es parte del layout general */}
        <main className="flex-1 p-8">
          <section className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Acceso Denegado</h2>
            <p>No tienes permisos para ver las pruebas de productos.</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Gestión de Pruebas de Productos</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition flex items-center mb-6"
        >
          <FaPlusSquare className="mr-2" /> {showForm ? 'Ocultar Formulario' : 'Nueva Prueba'}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Editar Prueba' : 'Registrar Nueva Prueba'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de Producto */}
              <label className="block">
                <span className="text-gray-700">Producto</span>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                  required
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </label>

              {/* Reacción */}
              <label className="block">
                <span className="text-gray-700">Reacción</span>
                <textarea
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  placeholder="Observaciones sobre la reacción del sujeto de prueba"
                  className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                  rows={3}
                  required
                />
              </label>

              {/* Rating */}
              <label className="block">
                <span className="text-gray-700">Calificación (1-10)</span>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  min="1"
                  max="10"
                  className="mt-1 block w-full border border-pink-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                  required
                />
              </label>

              {/* Estado de Supervivencia */}
              <label className="block flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={survivalStatus}
                  onChange={(e) => setSurvivalStatus(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-pink-600"
                />
                <span className="text-gray-700">¿El sujeto de prueba sobrevivió?</span>
              </label>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition flex-grow"
                >
                  {isEditing ? 'Guardar Cambios' : 'Registrar Prueba'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Listado de Pruebas</h3>
          {productTests.length === 0 ? (
            <p>No hay pruebas de productos registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Producto</th>
                    <th className="py-2 px-4 border-b text-left">Tester</th>
                    <th className="py-2 px-4 border-b text-left">Reacción</th>
                    <th className="py-2 px-4 border-b text-left">Calificación</th>
                    <th className="py-2 px-4 border-b text-left">Sobrevivió</th>
                    <th className="py-2 px-4 border-b text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productTests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        {test.product?.name || 'N/A'} (ID: {test.productId})
                      </td>
                      <td className="py-2 px-4 border-b">
                        {test.tester?.name || test.tester?.email || 'N/A'} (ID: {test.testerId})
                      </td>
                      <td className="py-2 px-4 border-b">{test.reaction}</td>
                      <td className="py-2 px-4 border-b">{test.rating}/10</td>
                      <td className="py-2 px-4 border-b">{test.survival_status ? 'Sí' : 'No'}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(test)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(test.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductTests;