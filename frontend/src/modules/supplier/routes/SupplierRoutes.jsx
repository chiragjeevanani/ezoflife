import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import SupplierAuth from '../pages/SupplierAuth';
import SupplierOtp from '../pages/SupplierOtp';
import SupplierDashboard from '../pages/SupplierDashboard';
import SupplierRateCard from '../pages/SupplierRateCard';
import SupplierFulfillmentPage from '../pages/SupplierFulfillmentPage';

const SupplierRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<SupplierAuth />} />
      <Route path="/otp" element={<SupplierOtp />} />
      <Route path="/dashboard" element={<SupplierDashboard />} />
      <Route path="/rates" element={<SupplierRateCard />} />
      <Route path="/fulfillment/:id" element={<SupplierFulfillmentPage />} />
      
      {/* Default redirect to auth */}
      <Route path="*" element={<Navigate to="/supplier/auth" replace />} />
    </Routes>
  );
};

export default SupplierRoutes;
