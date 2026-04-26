import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SupplierDashboard from '../pages/SupplierDashboard';
import SupplierSupplies from '../pages/SupplierSupplies';
import SupplierFulfillmentPage from '../pages/SupplierFulfillmentPage';
import SupplierLogistics from '../pages/SupplierLogistics';
import SupplierWallet from '../pages/SupplierWallet';
import SupplierLayout from '../layouts/SupplierLayout';
import SupplierProfile from '../pages/SupplierProfile';
import SupplierMorePage from '../pages/SupplierMorePage';

import SupplierAuth from '../pages/SupplierAuth';
import SupplierOtp from '../pages/SupplierOtp';

const SupplierRoutes = () => {
  return (
    <Routes>
      <Route element={<SupplierLayout />}>
        {/* Auth Flow */}
        <Route path="/auth" element={<SupplierAuth />} />
        <Route path="/otp" element={<SupplierOtp />} />

        {/* Main Hub */}
        <Route path="/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplies" element={<SupplierSupplies />} />
        <Route path="/fulfillment/:id" element={<SupplierFulfillmentPage />} />
        <Route path="/logistics" element={<SupplierLogistics />} />
        <Route path="/wallet" element={<SupplierWallet />} />
        <Route path="/profile" element={<SupplierProfile />} />
        <Route path="/more" element={<SupplierMorePage />} />
        
        {/* Default redirect to dashboard */}
        <Route path="*" element={<Navigate to="/supplier/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default SupplierRoutes;
