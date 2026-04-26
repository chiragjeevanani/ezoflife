import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterAsSupplierPage = () => {
  const navigate = useNavigate();

  const benefits = [
    'More Earnings',
    'Daily Orders',
    'Business Growth',
    'Easy Settlements'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col font-body pb-32"
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md p-6 border-b border-outline-variant/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-black text-lg tracking-tighter uppercase">Supplier Program</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-2xl mx-auto w-full flex flex-col items-center">
        <motion.section 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>factory</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-6 text-on-surface">Become a<br/><span className="text-primary italic">Supplier</span></h2>
        </motion.section>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[3rem] p-10 w-full border border-outline-variant/5 shadow-[0_40px_80px_rgba(0,0,0,0.03)] mb-12"
        >
          <div className="space-y-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                  <span className="material-symbols-outlined text-sm font-black">check</span>
                </div>
                <span className="text-lg font-black text-on-surface tracking-tight">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-sm bg-primary text-on-primary py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          Apply Now
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </motion.button>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-30">Spinzyt Partner Ecosystem • 2026</p>
      </main>
    </motion.div>
  );
};

export default RegisterAsSupplierPage;
