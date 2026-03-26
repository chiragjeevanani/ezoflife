import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UserRoutes from './modules/user/routes/userRoutes'
import VendorRoutes from './modules/vendor/routes/VendorRoutes'
import AdminRoutes from './modules/admin/routes/AdminRoutes'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Module Routes */}
        <Route path="/user/*" element={<UserRoutes />} />
        
        {/* Vendor Module Routes */}
        <Route path="/vendor/*" element={<VendorRoutes />} />

        {/* Admin Module Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Root Redirect to user splash */}
        <Route path="/" element={<Navigate to="/user" replace />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
