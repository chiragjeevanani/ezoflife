import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../../shared/stores/notificationStore';

const VendorHeader = () => {
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  // For vendor, we'll show their shop name/address or current operational area
  const shopAddress = userData.shopAddress || 'Select Shop Location';

  const handleProfileClick = () => {
    navigate('/vendor/profile');
  };

  return (
    <>
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 z-[100] bg-white/80 backdrop-blur-xl w-full flex justify-between items-center px-4 md:px-6 py-2.5 border-b border-slate-100 min-h-[64px]"
      >
        {/* 1. App Logo (Left) */}
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/vendor/dashboard')} className="cursor-pointer">
            <h1 className="font-headline font-black text-xl text-primary tracking-tighter leading-none uppercase">SPINZYT</h1>
          </div>
          
          <div className="h-6 w-px bg-slate-200" /> {/* Divider */}

          {/* 2. Current Address (Shop/Office) */}
          <div className="flex flex-col max-w-[150px] md:max-w-[200px] cursor-pointer group" onClick={() => setShowAddressModal(true)}>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-md transition-colors group-hover:bg-primary group-hover:text-white">SHOP</span>
              <span className="material-symbols-outlined text-slate-400 text-[14px] group-hover:text-primary transition-colors">expand_more</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 truncate leading-tight mt-0.5 group-hover:text-slate-900 transition-colors">
              {shopAddress}
            </p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* 3. Notification Bell */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/vendor/notifications')}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-full relative transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            )}
          </motion.button>

          {/* 4. Profile Icon */}
          <motion.div 
            onClick={handleProfileClick}
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer border border-slate-200"
          >
            {userData.avatar ? (
              <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-slate-500 text-[20px]">person</span>
            )}
          </motion.div>
        </div>
      </motion.header>
    </>
  );
};

export default VendorHeader;
