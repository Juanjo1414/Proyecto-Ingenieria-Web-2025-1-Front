import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register'; // Importamos el Register
import ProtectedRoute from './ProtectedRoute';
import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardTester from '../pages/DashboardTester';
import DashboardClient from '../pages/DashboardClient';
import DashboardEmployee from '../pages/DashboardEmployee';
import Products from '../pages/Products';
import Unauthorized from '../pages/Unauthorized';
import CreateProduct from '../pages/CreateProduct';
import EditProduct from '../pages/EditProduct';
import ProductTests from '../pages/ProductTests';
import UsersManagement from '../pages/UsersManagement';
import OrdersManagement from '../pages/OrdersManagement';
import UserProfile from '../pages/UserProfile';
import TiendaCliente from '../pages/TiendaCliente';
import CarritoCliente from '../pages/CarritoCliente';
import HistorialCliente from '../pages/HistorialCliente';


const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Rutas protegidas */}
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardAdmin />
        </ProtectedRoute>
      }
    />

    <Route
      path="/tester/dashboard"
      element={
        <ProtectedRoute allowedRoles={['tester']}>
          <DashboardTester />
        </ProtectedRoute>
      }
    />

    <Route
      path="/client/dashboard"
      element={
        <ProtectedRoute allowedRoles={['client']}>
          <DashboardClient />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employee/dashboard"
      element={
        <ProtectedRoute allowedRoles={['employee']}>
          <DashboardEmployee />
        </ProtectedRoute>
      }
    />

    <Route
      path="/products"
      element={
        <ProtectedRoute allowedRoles={['admin', 'employee']}>
          <Products />
        </ProtectedRoute>
      }
    />

    <Route
      path="/create-product"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CreateProduct />
        </ProtectedRoute>
      }
    />

    <Route
      path="/edit-product/:id"
      element={
        <ProtectedRoute allowedRoles={['admin', 'employee']}>
          <EditProduct />
        </ProtectedRoute>
      }
    />

    <Route
      path="/product-tests"
      element={
        <ProtectedRoute allowedRoles={['admin', 'employee', 'tester']}>
          <ProductTests />
        </ProtectedRoute>
      }
    />

    <Route
      path="/users-management"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UsersManagement />
        </ProtectedRoute>
      }
    />

    <Route
      path="/orders-management"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <OrdersManagement />
        </ProtectedRoute>
      }
    />

    <Route
      path="/client/store"
      element={
        <ProtectedRoute allowedRoles={['client']}>
          <TiendaCliente />
        </ProtectedRoute>
      }
    />

    <Route
      path="/client/cart"
      element={
        <ProtectedRoute allowedRoles={['client']}>
          <CarritoCliente />
        </ProtectedRoute>
      }
    />

    <Route
  path="/client/purchases"
  element={
    <ProtectedRoute allowedRoles={['client']}>
      <HistorialCliente />
    </ProtectedRoute>
  }
/>

    {/* Ruta para el perfil del usuario */}

    <Route
      path="/profile"
      element={
        <ProtectedRoute allowedRoles={['admin', 'client', 'tester', 'employee']}>
          <UserProfile />
        </ProtectedRoute>
      }
    />

    {/* Ruta para acceso no autorizado */}
    <Route path="/unauthorized" element={<Unauthorized />} />
  </Routes>
);

export default AppRoutes;
