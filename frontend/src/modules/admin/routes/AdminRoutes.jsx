import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Vendors from '../pages/Vendors';
import OnboardingApprovals from '../pages/OnboardingApprovals';
import Payouts from '../pages/Payouts';
import Services from '../pages/Services';
import Users from '../pages/Users';
import Analytics from '../pages/Analytics';
import AdminLogin from '../pages/AdminLogin';
import AdminOrderDetail from '../pages/AdminOrderDetail';
import AdminVendorDetail from '../pages/AdminVendorDetail';

// Simple Guard Component
const AdminGuard = ({ children }) => {
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Admin Routes */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route 
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<AdminOrderDetail />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/:id" element={<AdminVendorDetail />} />
        <Route path="/vendors/approvals" element={<OnboardingApprovals />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/services" element={<Services />} />
        <Route path="/users" element={<Users />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
