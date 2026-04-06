import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  useEffect(() => {
    // Subtle map pan effect on mount
    if (mapRef.current) {
      gsap.fromTo(mapRef.current, 
        { scale: 1.1, x: -20 }, 
        { scale: 1, x: 0, duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" }
      );
    }
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }), []);

  const timelineSteps = useMemo(() => [
    { label: 'Pickup', time: '10:20 AM', icon: 'photo_camera', status: 'completed', stepNum: 'Step 1 of 4' },
    { label: 'Shop Intake', time: '11:15 AM', icon: 'inventory_2', status: 'completed', stepNum: 'Step 2 of 4' },
    { label: 'Processing', time: '12:10 PM', icon: 'local_laundry_service', status: 'active', stepNum: 'Step 3 of 4' },
    { label: 'Handover', time: 'Pending', icon: 'verified_user', status: 'pending', stepNum: 'Step 4 of 4' }
  ], []);


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      {/* Header */}
      <header className="fixed top-0 z-50 bg-white/70 backdrop-blur-xl w-full flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/user/home')}
            className="material-symbols-outlined text-on-surface-variant"
          >
            arrow_back
          </motion.button>
          <h1 className="font-headline font-black text-xl text-primary tracking-tighter">Order #SZ-8821</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/user/notifications')}
            className="material-symbols-outlined p-2.5 bg-surface-container-low rounded-full text-primary"
          >
            notifications
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-white shadow-sm">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1p7APs6JFSwjyHDasWjzWEXhUFLgeNDv9tSakP3bwMduoW7-t8RPNtifrzxcmh8EfjGiQsfovNBz_iB5f5OS2M24dCfKfqL-sBNd3JyZygtbUox3v3CrFSWlP9VmaGLix217O80RYzeb2b_boPw-VnuXF_nJON0ipIhT9zqDEHZlK_wWiTgoysxNeCyr67hOeQLpN5ArZMYDyqq_l35IqBHW6Y4Ylp1j_EBoNRyBLnB0PJsdJBRbyjppfuJwFaov3DW4laxdkOsg" alt="User" />
          </div>
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-grow pt-24 pb-36 px-6 max-w-5xl mx-auto w-full space-y-8"
      >
        {/* Map Section */}
        <motion.section 
          variants={itemVariants}
          className="relative w-full h-[380px] md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 bg-surface-container-high group"
        >
          <div ref={mapRef} className="w-full h-full">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF7e8jeY2LD4d2hKiUogAbVuYWLcVpG7wZrf3GKLK5s3M0QB7kMbs6rcWZ6eeQ9x0wLAL9apbjAXddI6jx0pEbibzP6BtwgSf0UUW-zo8d919_y5iNbXE0e38_GSZ0ScKtAxV-Ctu47Vg2KbYmpABWbgFSD31steTynOyYgwobtwmAczqUD5nCXyb7lFwSO1H0R9s6NJ6c3yH_lJaQUsVkd4nTROLWIku9gmw_LEtB406W2MF5zGxp4C3t9RbCbgpIHv57SLdZXDM" 
              alt="Map" 
            />
          </div>
          
          {/* Rider Overlay Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 left-6 right-6 glass-effect p-5 rounded-[2rem] flex items-center justify-between border border-white/40 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img className="w-14 h-14 rounded-full border-2 border-primary-container object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrN5YW63I8izRD-Niwm8BJbeJytTIKirCpOi_nLy2ou1CUdHPCydM0EBXMx6X4qMhr33uet0O9nb00EJm_bjZQAUDGLEfRgQxC4S4s8_SeRw41Q_gRimQXYU-zieqyxXBRSEiUvwC4JmXDoYatZT2oJTXrvvxrncJiLkzbW_pPRnOXI6l24gBrSYo2rvw8tGXvnye4L2Jd-Lymp0NLDDWtelTfo6WK2oBe0xXInzcuLBZ4tGnlgy3zrgXstf-H3ThZc5RFMOsuFfs" alt="Rider" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-1 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>electric_moped</span>
                </motion.div>
              </div>
              <div>
                <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-black opacity-60">Your Rider</p>
                <h3 className="font-black text-md text-on-surface">Marcus Chen</h3>
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-black">4.9 • 2.1km away</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.9 }} className="bg-primary text-on-primary w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-xl">call</span>
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }} 
                onClick={() => navigate('/user/chat/SZ-8821')}
                className="bg-surface-container-high text-primary w-11 h-11 rounded-2xl flex items-center justify-center border border-outline-variant/10 shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.section>

        {/* Status Timeline */}
        <motion.section variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline font-black text-2xl text-primary tracking-tighter leading-none mb-2">Live Updates</h2>
              <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Estimated delivery: 12:45 PM</p>
            </div>
            <button 
              onClick={() => navigate('/user/chat/SZ-8821')}
              className="text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              Help
              <span className="material-symbols-outlined text-xs">support_agent</span>
            </button>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative flex justify-between items-start px-2">
            {/* Base Progress Line */}
            <div className="absolute h-[2px] left-8 right-8 bg-surface-container-highest top-6 -translate-y-1/2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '66.6%' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 1.5 }}
                className="h-full bg-primary relative"
              >
                <motion.div 
                   animate={{ x: ['-100%', '100%'] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-white/30 skew-x-12"
                />
              </motion.div>
            </div>

            {/* Steps */}
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center gap-4 z-10 w-20">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 * idx, type: "spring" }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors border-2 ${
                    step.status === 'completed' ? 'bg-primary text-on-primary border-primary' : 
                    step.status === 'active' ? 'bg-white text-primary border-primary animate-pulse' : 
                    'bg-surface-container-low text-on-surface-variant border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: step.status !== 'pending' ? "'FILL' 1" : "'FILL' 0" }}>
                    {step.icon}
                  </span>
                </motion.div>
                <div className="text-center">
                  <p className="text-[7px] font-black text-primary uppercase tracking-widest opacity-50 block mb-1">{step.stepNum}</p>
                  <p className={`font-black text-[10px] uppercase tracking-tighter leading-tight ${step.status === 'pending' ? 'text-on-surface-variant opacity-40' : 'text-on-surface'}`}>
                    {step.label}
                  </p>
                  <p className="text-[9px] font-bold text-on-surface-variant opacity-60 mt-0.5">{step.time}</p>
                </div>

              </div>
            ))}
          </div>
        </motion.section>

        {/* Info Cards Bento */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col justify-between group">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Service Package</span>
              <h3 className="font-headline font-black text-2xl text-primary tracking-tighter mt-2 leading-none">Premium Wash & Fold</h3>
            </div>
            <div className="mt-10 flex gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">Weight</span>
                <span className="font-headline font-black text-xl text-on-surface leading-none mt-1">12.5 kg</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase tracking-widest">Detergent</span>
                <span className="font-headline font-black text-xl text-on-surface leading-none mt-1">Hypo</span>
              </div>
            </div>
          </div>

          <div className="bg-primary p-8 rounded-[2.5rem] text-on-primary flex flex-col justify-between relative overflow-hidden shadow-xl shadow-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Delivery Address</span>
              <h3 className="font-headline font-black text-xl mt-3 leading-tight tracking-tight">221B Baker Street, NW1 6XE</h3>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-10 relative z-10 cursor-pointer">
              <button className="w-full bg-white text-primary py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10">
                Modify Drop-off
              </button>
            </motion.div>
          </div>
        </motion.section>
      </motion.main>
    </motion.div>
  );
};

export default OrderTrackingPage;

