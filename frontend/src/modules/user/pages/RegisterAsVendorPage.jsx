import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterAsVendorPage = () => {
  const navigate = useNavigate();

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }), []);

  const benefits = useMemo(() => [
    { title: 'Wider Reach', desc: 'Access 5000+ local customers in your zone.', icon: 'group' },
    { title: 'Logistics Handled', desc: 'Our riders handle all pickups and deliveries.', icon: 'local_shipping' },
    { title: 'Secure Payouts', desc: 'Direct bank settlements every 48 hours.', icon: 'payments' },
    { title: 'Easy Management', desc: 'Proprietary dashboard to track every order.', icon: 'dashboard_customize' }
  ], []);

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
          <h1 className="font-headline font-black text-lg tracking-tighter italic">Vendor Program</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-2xl mx-auto w-full">
        <motion.section 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Digitize Your<br/><span className="text-primary italic">Laundry Business.</span></h2>
          <p className="text-xs font-bold text-on-surface-variant opacity-60 px-8 leading-relaxed">Join the most advanced ecosystem for fabric care and scale your operations with Spinzyt.</p>
        </motion.section>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 mb-14"
        >
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="bg-white rounded-3xl p-6 flex items-center gap-5 border border-outline-variant/5 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">{benefit.icon}</span>
              </div>
              <div>
                <h3 className="font-black text-sm text-on-surface tracking-tight mb-0.5">{benefit.title}</h3>
                <p className="text-[10px] font-medium text-on-surface-variant leading-tight opacity-70">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hero CTA Section */}
        <motion.section 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-primary-gradient rounded-[3rem] p-10 text-center shadow-2xl shadow-primary/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <h3 className="text-white font-headline font-black text-2xl tracking-tighter mb-4 leading-tight">Ready to start?</h3>
          <p className="text-white/70 text-xs font-bold mb-8 italic">Onboarding takes less than 5 minutes.</p>
          
          <button 
            onClick={() => navigate('/vendor/auth')}
            className="w-full bg-white text-primary py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Apply as Vendor
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </motion.section>

        <p className="mt-12 text-center text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-30">Spinzyt Operations • Corporate Program</p>
      </main>
    </motion.div>
  );
};

export default RegisterAsVendorPage;

