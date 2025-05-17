import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardTester from '../pages/DashboardTester';
import DashboardClient from '../pages/DashboardClient';
import DashboardEmployee from '../pages/DashboardEmployee';
import Products from '../pages/Products';
import Unauthorized from '../pages/Unauthorized';
import CreateProduct from '../pages/CreateProduct';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />

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
    <ProtectedRoute allowedRoles={['Admin']}>
      <CreateProduct />
    </ProtectedRoute>
  }
/>

    <Route path="/unauthorized" element={<Unauthorized />} />
  </Routes>

  
);

export default AppRoutes;
