import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DeliveryVerificationPage = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const packageStats = useMemo(() => [
    { label: 'Total Weight', val: '6.4 kg' },
    { label: 'Service Type', val: 'Premium' },
    { label: 'Items Count', val: '18 pcs' }
  ], []);

  const pickupPhotos = useMemo(() => [
    "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=200&auto=format&fit=crop&sig=1",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=200&auto=format&fit=crop&sig=2",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=200&auto=format&fit=crop&sig=3",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=200&auto=format&fit=crop&sig=4"
  ], []);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-verify when complete (BRD M3 Requirement)
    if (newOtp.every(digit => digit !== '')) {
      setTimeout(() => {
        navigate('/user/payment', { state: { amount: 1248 } });
      }, 800);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }), []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col font-body"
    >
      <main className="flex-1 pt-28 pb-32 px-6 max-w-5xl mx-auto w-full">
        {/* Editorial Header Section */}
        <motion.section 
          variants={itemVariants}
          className="py-8 ml-2"
        >
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary font-black mb-2 opacity-60">Order #SZ-92834</p>
          <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-background leading-none">
            Delivery<br/><span className="text-primary">Verification</span>
          </h2>
        </motion.section>

        {/* Bento Grid Layout for Photo Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Pickup Card (Phase 1 M2 Requirement) */}
          <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-sm border border-outline-variant/5">
            <div className="flex justify-between items-center">
              <span className="font-headline font-black text-xl text-on-surface tracking-tight">Pickup Photos</span>
              <span className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant text-[10px] font-black uppercase tracking-widest rounded-full">Step 1 of 4</span>
            </div>
            
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-inner bg-surface-container">
                <img alt="Main Pickup" className="w-full h-full object-cover" src={pickupPhotos[0]} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {pickupPhotos.slice(1).map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:border-primary transition-all">
                    <img alt={`Pickup ${i+1}`} className="w-full h-full object-cover opacity-80" src={url} />
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed opacity-70">Review the photos taken during pickup to verify item count and condition.</p>
          </motion.div>

          {/* Delivery State Card */}
          <motion.div variants={itemVariants} className="bg-primary/5 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-sm border-2 border-primary/10">
            <div className="flex justify-between items-center">
              <span className="font-headline font-black text-xl text-primary tracking-tight">Delivery State</span>
              <span className="px-4 py-1.5 bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">Final</span>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
              <img alt="Delivery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://images.unsplash.com/photo-1521334885634-940428987349?q=80&w=2070&auto=format&fit=crop" />
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-5xl">zoom_in</span>
              </div>
            </div>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed opacity-70">
              Your garments have been sanitized and neatly packaged for your arrival.
            </p>
          </motion.div>
        </div>

        {/* Package Details Bento */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[2.5rem] p-10 mb-12 shadow-sm border border-outline-variant/10 group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
          <h3 className="font-headline font-black text-2xl mb-10 flex items-center gap-3 tracking-tighter">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            Package Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {packageStats.map((stat, i) => (
              <div key={i}>
                <p className="text-[10px] font-black text-on-surface-variant mb-2 uppercase tracking-widest opacity-50">{stat.label}</p>
                <p className="font-headline font-black text-3xl text-primary leading-none tracking-tighter">{stat.val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final Confirmation OTP Section */}
        <motion.section 
          variants={itemVariants}
          className="max-w-md mx-auto text-center py-6"
        >
          <h4 className="font-headline font-black text-2xl tracking-tighter mb-3">Final Confirmation OTP</h4>
          <p className="text-xs font-bold text-on-surface-variant opacity-60 px-8 leading-relaxed mb-10">
            Review your clothes, then provide the OTP to the rider to complete the delivery.
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            {otp.map((val, i) => (
              <motion.input 
                key={i}
                ref={otpRefs[i]}
                whileFocus={{ scale: 1.05 }}
                className={`w-14 h-18 text-center text-3xl font-black rounded-2xl bg-white border-2 transition-all ${
                  val ? 'border-primary text-primary' : 'border-outline-variant/20 text-on-surface-variant'
                } focus:border-primary focus:ring-0`}
                maxLength="1"
                type="tel"
                value={val}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                placeholder="•"
              />
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/payment')}
            className="w-full py-6 bg-primary-gradient text-on-primary font-headline font-black text-xl rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            Confirm Delivery
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </motion.button>
          
          <button className="mt-8 text-primary font-black text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            Resend Verification Code
          </button>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default DeliveryVerificationPage;

