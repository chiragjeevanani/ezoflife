import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || { _id: 'PENDING', totalAmount: 0 };
  const bgRef = useRef(null);

  useEffect(() => {
    const blobs = bgRef.current?.querySelectorAll('.blob');
    if (blobs) {
      blobs.forEach((blob) => {
        gsap.to(blob, {
          x: 'random(-40, 40)',
          y: 'random(-40, 40)',
          duration: 'random(4, 8)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
    }
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }), []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background Animated Blobs */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div className="blob absolute top-[20%] left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="blob absolute bottom-[20%] right-[10%] w-48 h-48 bg-tertiary/10 rounded-full blur-2xl opacity-50"></div>
      </div>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md flex flex-col items-center text-center space-y-10 relative z-10"
      >
        {/* Success State Visual */}
        <motion.div 
          variants={itemVariants}
          className="relative flex items-center justify-center"
        >
          {/* Pulsing Outer Ring */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-44 h-44 bg-primary rounded-full blur-2xl -z-10"
          ></motion.div>
          
          {/* Success Icon Card */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 0 }}
            animate={{ rotate: 3 }}
            className="bg-primary-gradient w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/30"
          >
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
              className="material-symbols-outlined text-on-primary text-6xl" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Headline Group */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-none">Order Placed</h1>
          <p className="text-on-surface-variant text-sm font-bold opacity-70 max-w-[280px] mx-auto uppercase tracking-widest leading-relaxed">
            Your laundry is in professional hands. We're getting started!
          </p>
        </motion.div>

        {/* Order Information Bento Card */}
        <motion.div 
          variants={itemVariants} 
          className="w-full bg-white rounded-[2.5rem] p-8 space-y-6 shadow-sm border border-outline-variant/10"
        >
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-5">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black opacity-60">Order ID</span>
              <p className="font-headline font-black text-lg text-primary">#EZ-{order._id?.toString().slice(-6).toUpperCase() || '8829-01'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black opacity-60">Total Amount</span>
              <p className="font-headline font-black text-lg text-on-surface">₹{order.totalAmount || '899.00'}</p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-y-4 flex-col">
            <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '66%' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                className="bg-primary h-full rounded-full relative shadow-[0_0_10px_rgba(71,95,139,0.3)]"
              >
                <motion.div 
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-20 bg-white/20 skew-x-12"
                ></motion.div>
              </motion.div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-on-surface opacity-80">Searching for Rider...</p>
            </div>
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div variants={itemVariants} className="w-full space-y-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/tracking')}
            className="w-full bg-primary-gradient py-5 rounded-2xl text-on-primary font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            Track Order
          </motion.button>
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(71, 95, 139, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/home')}
            className="w-full py-4 text-primary font-black text-xs uppercase tracking-[0.2em] transition-colors"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.main>

      {/* Details Footer */}
      <footer className="mt-auto py-8 text-center relative z-10 w-full">
        <div className="flex items-center justify-center gap-2 text-on-surface-variant opacity-60">
          <span className="material-symbols-outlined text-lg">verified_user</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Secure Transaction • Delivery Insurance</span>
        </div>
      </footer>
    </motion.div>
  );
};

export default SuccessPage;

