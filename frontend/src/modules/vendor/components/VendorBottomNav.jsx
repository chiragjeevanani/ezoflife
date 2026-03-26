import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home', icon: 'home', path: '/vendor/dashboard' },
  { label: 'Sales', icon: 'payments', path: '/vendor/earnings' },
  { label: 'Menu', icon: 'tune', path: '/vendor/services' },
  { label: 'Bank', icon: 'account_balance', path: '/vendor/payouts' },
  { label: 'Profile', icon: 'person', path: '/vendor/profile' },
];

const VendorBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hideRoutes = [
    '/vendor/splash', 
    '/vendor/auth', 
    '/vendor/otp', 
    '/vendor/register', 
    '/vendor/upload-documents', 
    '/vendor/approval-pending'
  ];

  if (hideRoutes.some(route => location.pathname === route)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-8 pt-4 px-6 md:hidden">
      {/* Background overlay removed from nav to prevent click blocking */}
      <motion.div 
        layout
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="flex items-center bg-white border border-slate-100 p-1 rounded-full shadow-2xl shadow-blue-900/15 gap-0.5"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.path} 
              onClick={() => navigate(item.path)}
              className="relative focus:outline-none touch-none no-underline"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className={`relative flex items-center h-12 rounded-full overflow-hidden transition-all duration-300 ${isActive ? 'vendor-gradient text-white px-5 shadow-lg shadow-blue-900/20' : 'bg-transparent text-slate-400 opacity-60 px-4'}`}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </button>
          );
        })}
      </motion.div>
    </nav>
  );
};

export default VendorBottomNav;
