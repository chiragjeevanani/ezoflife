import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SupplierLayout = () => {
  const location = useLocation();

  const noNavPaths = [
    '/supplier/auth',
    '/supplier/otp'
  ];

  const showNav = !noNavPaths.some(path => location.pathname === path);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-sans selection:bg-black/10 selection:text-black overflow-x-hidden">
      <main className="flex-1 w-full relative pb-32">
        <Outlet />
      </main>

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none pb-8 flex justify-center">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-2xl px-3 py-2 rounded-full shadow-[0_32px_64px_rgba(0,0,0,0.12)] pointer-events-auto flex justify-around items-center w-[95%] max-w-lg border border-black/5"
          >
            <NavItem icon="home" label="Home" path="/supplier/dashboard" active={location.pathname === '/supplier/dashboard'} />
            <NavItem icon="inventory_2" label="Supplies" path="/supplier/supplies" active={location.pathname === '/supplier/supplies'} />
            <NavItem icon="person" label="Profile" path="/supplier/profile" active={location.pathname === '/supplier/profile'} />
            <NavItem icon="menu" label="More" path="/supplier/more" active={location.pathname === '/supplier/more'} />
          </motion.div>
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, path, active }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`relative flex flex-col items-center justify-center rounded-full px-3 py-2.5 transition-colors duration-300 ${
        active ? 'text-white' : 'text-slate-400 hover:bg-slate-50'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="navBubbleSupplier"
          className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-black/5"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative z-10 material-symbols-outlined text-[22px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
        {icon}
      </span>
      <span className="relative z-10 font-bold text-[9px] mt-1 uppercase tracking-tighter">{label}</span>
    </button>
  );
};

export default SupplierLayout;
