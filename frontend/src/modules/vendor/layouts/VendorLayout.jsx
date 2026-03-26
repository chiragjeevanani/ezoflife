import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import VendorBottomNav from '../components/VendorBottomNav';

const VendorLayout = () => {
  const location = useLocation();

  const noNavPaths = [
    '/vendor/splash',
    '/vendor/auth',
    '/vendor/otp',
    '/vendor/register', 
    '/vendor/upload-documents', 
    '/vendor/approval-pending'
  ];
  
  const isOrderDetails = location.pathname.includes('/vendor/order/');
  const isRiderVerification = location.pathname.includes('/vendor/rider-verification/');
  
  const showNav = !noNavPaths.some(path => location.pathname === path) && !isOrderDetails && !isRiderVerification;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      
      {showNav && <VendorBottomNav />}
    </div>
  );
};

export default VendorLayout;
