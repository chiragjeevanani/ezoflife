import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../../shared/stores/notificationStore';

const UserHeader = () => {

  const navigate = useNavigate();
  
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 bg-surface/80 backdrop-blur-xl w-full flex justify-between items-center px-6 py-4 border-b border-outline-variant/10"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          onClick={() => navigate('/user/profile')}
          whileHover={{ scale: 1.1 }}
          className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-primary/10 cursor-pointer"
        >
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADXPjCofEw9WhYdZ0Uh1Mgmp-9pizrsC0BeCbtQIPdkkSaq57hyhMuMzMsNmIWAPJtCd56gpBJ0ClfDmIbY4vye9LEpgt6ujGRte7jo5gO5Xd17idnhF8zjO8D0-W3SoPqi47ObaXFojM6bcrO-jkynPd_bELDnO8r_kNur-cf_Gqk3-ySvFjb0JAA8SrJt7XBzetTvKe02YiNDOr4ppVlQDKt_NcwEUaHU9vyazqclWq8Cn6qk2ffnO8OmS265lNo02LwJ3Mqqdw" 
            alt="Avatar" 
          />
        </motion.div>
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/user/home')}>
          <span className="font-headline font-bold text-lg text-primary tracking-tight leading-none">Spinzyt</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-extrabold">Premium</span>
        </div>
      </div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/user/notifications')}
        className="w-10 h-10 flex items-center justify-center text-on-surface bg-surface-container rounded-full relative"
      >
        <span className="material-symbols-outlined text-2xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.button>

    </motion.header>
  );
};

export default UserHeader;
