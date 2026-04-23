import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SupplierDashboard from '../pages/SupplierDashboard';
import SupplierRateCard from '../pages/SupplierRateCard';
import SupplierFulfillmentPage from '../pages/SupplierFulfillmentPage';
import UserLayout from '../../user/layouts/UserLayout';
import SupplierLogistics from '../pages/SupplierLogistics';
import SupplierWallet from '../pages/SupplierWallet';
import SupplierProfile from '../pages/SupplierProfile';

const SupplierRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        {/* Main Hub */}
        <Route path="/dashboard" element={<SupplierDashboard />} />
        <Route path="/rates" element={<SupplierRateCard />} />
        <Route path="/fulfillment/:id" element={<SupplierFulfillmentPage />} />
        <Route path="/logistics" element={<SupplierLogistics />} />
        <Route path="/wallet" element={<SupplierWallet />} />
        <Route path="/profile" element={<SupplierProfile />} />
        
        {/* Default redirect to dashboard */}
        <Route path="*" element={<Navigate to="/supplier/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default SupplierRoutes;
