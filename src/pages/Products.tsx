



//------JARA ESTO DEL FILTRADO Y BUSQUEDA LO HICE MAS  GPETO QUE YO,
//  NO SE SI ES BUENA IDEA SI ALGO REVISE PRUEBE Y ME DICE SO 
// (se podria implementar esta misma logica en otros apartados aparte de los productos)------




import React, { useEffect, useState, useMemo } from 'react'; 
import { getProducts, deleteProduct, type Product } from '../api/products';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp } from 'react-icons/fa';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- Estados para Búsqueda, Filtrado y Paginación ---
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(10); // Este 10 es el número de productos por página
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar productos');
      setLoading(false);
      toast.error('Error al cargar los productos.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        toast.success('Producto eliminado exitosamente.');
        fetchProducts(); 
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar el producto.');
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-product/${id}`);
  };

  // --- Lógica de Búsqueda y Ordenación (usando useMemo para optimización) ---
  const sortedAndFilteredProducts = useMemo(() => {
    let filterableProducts = [...products];

    // Filtrado 
    if (searchTerm) {
      filterableProducts = filterableProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenación
    if (sortConfig !== null) {
      filterableProducts.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Comparación de cadenas (case-insensitive)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (aValue.toLowerCase() < bValue.toLowerCase()) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue.toLowerCase() > bValue.toLowerCase()) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
        }
        // Comparación de números
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
      });
    }

    return filterableProducts;
  }, [products, searchTerm, sortConfig]);

  // --- Lógica de Paginación ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedAndFilteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const requestSort = (key: keyof Product) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Product) => { // Aqui podriamos Modificar el icono cuando le metamos al diseño
    if (!sortConfig || sortConfig.key !== key) {
      return null; 
    }
    if (typeof products[0]?.[key] === 'string') {
        return sortConfig.direction === 'ascending' ? <FaSortAlphaDown className="ml-1" /> : <FaSortAlphaUp className="ml-1" />;
    }
    if (typeof products[0]?.[key] === 'number') {
        return sortConfig.direction === 'ascending' ? <FaSortNumericDown className="ml-1" /> : <FaSortNumericUp className="ml-1" />;
    }
    return null;
  };


  if (loading) return <p className="p-8">Cargando productos...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Productos GlamGiant</h2>

      {/* Controles de búsqueda y paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Búsqueda */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetear a la primera página (osea por default)
            }}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-200 pl-10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Paginación */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded shadow-md">
        {currentProducts.length === 0 && sortedAndFilteredProducts.length > 0 && (
            <p className="text-center text-gray-600 mb-4">No se encontraron resultados en esta página para tu búsqueda.</p>
        )}
        {sortedAndFilteredProducts.length === 0 && searchTerm !== '' && (
            <p className="text-center text-gray-600 mb-4">No se encontraron productos que coincidan con "{searchTerm}".</p>
        )}
        {products.length === 0 && !loading && (
            <p className="text-center text-gray-600 mb-4">No hay productos registrados.</p>
        )}

        {currentProducts.length > 0 && (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>
                  <div className="flex items-center">Nombre {getSortIcon('name')}</div>
                </th>
                <th className="py-2 px-4 border-b text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('category')}>
                  <div className="flex items-center">Categoría {getSortIcon('category')}</div>
                </th>
                <th className="py-2 px-4 border-b text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('stock')}>
                  <div className="flex items-center">Stock {getSortIcon('stock')}</div>
                </th>
                <th className="py-2 px-4 border-b text-left">Ubicación</th>
                <th className="py-2 px-4 border-b text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('durability_score')}>
                  <div className="flex items-center">Durabilidad {getSortIcon('durability_score')}</div>
                </th>
                <th className="py-2 px-4 border-b text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">{product.warehouse_location}</td>
                  <td className="py-2 px-4 border-b">{product.durability_score}/10</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
        )}
      </div>
    </div>
  );
};

export default Products;