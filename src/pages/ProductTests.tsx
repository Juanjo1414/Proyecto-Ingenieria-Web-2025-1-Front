import React, { useEffect, useState } from 'react';
import {
  getProductTests,
  createProductTest,
  updateProductTest,
  deleteProductTest,
  type ProductTest,
  type CreateProductTestDto,
  type UpdateProductTestDto,
} from '../api/productTests';
import { getProducts, type Product } from '../api/products';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlusSquare } from 'react-icons/fa';

const ProductTests: React.FC = () => {
  const { user } = useAuth();
  const [productTests, setProductTests] = useState<ProductTest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        getProducts(),
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
    setSurvivalStatus(test.survival_status || false);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta prueba de producto? Esta acción es irreversible.')) {
      try {
        await deleteProductTest(id);
        toast.success('Prueba de producto eliminada exitosamente.');
        fetchData();
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
    if (!productId) {
      toast.error('Por favor, selecciona un producto.');
      return;
    }
    if (!reaction.trim()) {
      toast.error('La reacción no puede estar vacía.');
      return;
    }
    if (rating < 1 || rating > 10) {
      toast.error('La calificación debe ser entre 1 y 10.');
      return;
    }

    const testData = {
      testerId: user.id,
      productId,
      reaction,
      rating,
      survival_status: survivalStatus,
    };

    try {
      if (isEditing && currentTestId) {
        await updateProductTest(currentTestId, testData as UpdateProductTestDto);
        toast.success('Prueba de producto actualizada exitosamente. ¡Análisis completado!');
      } else {
        await createProductTest(testData as CreateProductTestDto);
        toast.success('Prueba de producto registrada exitosamente. ¡Cada detalle cuenta!');
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error al guardar prueba de producto:', err);
      const errorMessage = (err as any)?.response?.data?.message || 'Error al guardar la prueba de producto.';
      toast.error(errorMessage);
    }
  };

  if (loading) return <p className="flex-1 p-8 text-center text-pink-700">Cargando pruebas de productos...</p>;
  if (error) return <p className="flex-1 p-8 text-center text-red-600">{error}</p>;

  const canManageTests = user?.role === 'admin' || user?.role === 'employee' || user?.role === 'tester';

  if (!canManageTests) {
    return (
      <div className="flex-1 p-8 bg-gray-100">
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-700 font-serif">Acceso Denegado</h2>
          <p className="text-gray-700">No tienes permisos para ver las pruebas de productos. Si crees que esto es un error, contacta al administrador.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-700 font-serif">Gestión de Pruebas de Productos</h2>

      <button
        onClick={() => {
          if (showForm) {
            resetForm(); // Oculta y limpia
          } else {
            setShowForm(true); // Solo abre, no resetea
          }
        }}
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mb-8 mx-auto" // Centrar botón
      >
        <FaPlusSquare className="text-xl" />
        <span className="text-lg">{showForm ? 'Ocultar Formulario de Prueba' : 'Registrar Nueva Prueba'}</span>
      </button>

      {showForm && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-pink-100 mb-8">
          <h3 className="text-2xl font-bold text-center text-pink-600 mb-6">{isEditing ? 'Editar Registro de Prueba' : 'Registrar Nueva Prueba de Producto'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-gray-700 font-semibold">Producto Asociado</span>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition bg-white"
                required
              >
                <option value="">Selecciona un producto para la prueba</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700 font-semibold">Reacción Observada</span>
              <textarea
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                placeholder="Describe la reacción del sujeto de prueba (ej: irritación leve, sin efectos, piel suave)"
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                rows={3}
                required
              />
            </label>

            {/* Rating */}
            <label className="block">
              <span className="text-gray-700 font-semibold">Calificación del Tester (1-10)</span>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="1"
                max="10"
                className="mt-2 block w-full px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                required
              />
            </label>

            {/* Estado de Supervivencia */}
            <label className="flex items-center space-x-3 mt-4">
              <input
                type="checkbox"
                checked={survivalStatus}
                onChange={(e) => setSurvivalStatus(e.target.checked)}
                className="form-checkbox h-6 w-6 text-pink-600 rounded-md focus:ring-pink-400 transition"
              />
              <span className="text-gray-700 font-semibold text-lg">¿El sujeto de prueba sobrevivió?</span>
            </label>

            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
              >
                {isEditing ? 'Guardar Cambios de Prueba' : 'Registrar Prueba'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado de Pruebas */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
        <h3 className="text-2xl font-bold text-center text-pink-600 mb-6">Pruebas de Productos Registradas</h3>
        {productTests.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Aún no se han registrado pruebas de productos. ¡Es hora de experimentar!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-pink-100 text-pink-800 text-left uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-pink-200">Producto</th>
                  <th className="py-3 px-6 border-b border-pink-200">Tester</th>
                  <th className="py-3 px-6 border-b border-pink-200">Reacción</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-center">Calificación</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-center">Sobrevivió</th>
                  <th className="py-3 px-6 border-b border-pink-200 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {productTests.map((test) => (
                  <tr key={test.id} className="border-b border-gray-200 hover:bg-pink-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{test.product?.name || 'Producto Desconocido'}</span> <br />
                      <span className="text-xs text-gray-500">ID: {test.productId}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="font-medium">{test.tester?.name || test.tester?.email || 'Tester Desconocido'}</span> <br />
                      <span className="text-xs text-gray-500">ID: {test.testerId}</span>
                    </td>
                    <td className="py-3 px-6 text-left">{test.reaction}</td>
                    <td className="py-3 px-6 text-center">
                      <span className="font-bold text-pink-600">{test.rating}</span>/10
                    </td>
                    <td className="py-3 px-6 text-center">
                      {test.survival_status ? (
                        <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs font-semibold">Sí</span>
                      ) : (
                        <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-xs font-semibold">No</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(test)}
                          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 transform hover:scale-110"
                          title="Editar Prueba"
                        >
                          <FaEdit className="text-md" />
                        </button>
                        <button
                          onClick={() => handleDelete(test.id)}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors duration-200 transform hover:scale-110"
                          title="Eliminar Prueba"
                        >
                          <FaTrash className="text-md" />
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
    </div>
  );
};

export default ProductTests;