import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserProfilePage = () => {
  const navigate = useNavigate();

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

  const mainActions = useMemo(() => [
    { title: 'Order History', desc: 'View past cleanings and receipts', icon: 'history', path: '/user/orders', color: 'primary' },
    { title: 'Payment Methods', desc: 'Manage cards and digital wallets', icon: 'payments', path: '/user/profile/payment', color: 'tertiary' },
    { title: 'Saved Addresses', desc: 'Manage pickup & delivery locales', icon: 'location_on', path: '/user/profile/addresses', color: 'secondary' },
    { title: 'Edit Profile', desc: 'Update name, email, and preferences', icon: 'person_edit', path: '/user/profile/edit', color: 'primary' }
  ], []);

  const secondaryActions = useMemo(() => [
    { title: 'Help Center', icon: 'help_outline', path: '/user/support', color: 'primary' },
    { title: 'Privacy Policy', icon: 'security', path: '/user/privacy', color: 'tertiary' },
    { title: 'Terms & Conditions', icon: 'description', path: '/user/terms', color: 'secondary' }
  ], []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <main className="pt-8 pb-44 px-6 max-w-2xl mx-auto w-full">
        {/* Compact Hero Section */}
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8 relative ml-1"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-label text-[8px] uppercase tracking-[0.3em] text-primary font-black opacity-50">Architect of Freshness</span>
            <h2 className="font-headline text-3xl font-black text-on-background leading-tight tracking-tighter">
              Julian <span className="text-primary">Mendoza</span>
            </h2>
          </div>
          
          <div className="mt-6 flex gap-3 h-[100px]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 bg-white border border-slate-300 rounded-3xl p-4 flex items-center gap-4 shadow-sm relative overflow-hidden group"
            >
               <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 transition-all border border-primary/10">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
               </div>
               <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-0.5">Elite Level</p>
                 <p className="text-on-background font-black text-lg tracking-tighter leading-none">Status: Elite</p>
               </div>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-[100px] bg-primary-gradient rounded-3xl flex flex-col items-center justify-center text-center shadow-lg shadow-primary/10 shrink-0"
            >
              <p className="text-on-primary font-black text-3xl tracking-tighter leading-none">12</p>
              <p className="text-on-primary font-black text-[7px] uppercase tracking-widest opacity-60 leading-none mt-1">Orders</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Compressed Actions Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-3"
        >
          {mainActions.map((action, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate(action.path)}
              className="bg-white p-4.5 rounded-[2rem] hover:shadow-md transition-all cursor-pointer flex items-center justify-between border border-slate-300 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-[1.2rem] bg-${action.color}/5 flex items-center justify-center text-${action.color} border border-${action.color}/10`}>
                  <span className="material-symbols-outlined text-xl">{action.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-black text-[15px] tracking-tight text-on-surface leading-none mb-0.5">{action.title}</h3>
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 leading-none italic truncate max-w-[180px]">{action.desc}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[16px]">chevron_right</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Support Section */}
        <motion.section 
          variants={itemVariants} 
          initial="hidden"
          animate="visible"
          className="mt-12 space-y-3"
        >
          <h4 className="font-headline text-[9px] uppercase tracking-[0.3em] text-on-surface-variant opacity-30 mb-4 px-2 font-black">Account Security</h4>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-300 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {secondaryActions.map((item, idx) => (
              <motion.div 
                key={idx}
                whileTap={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between px-6 py-5 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                   <span className={`material-symbols-outlined text-xl text-${item.color} opacity-60 group-hover:opacity-100`}>{item.icon}</span>
                   <span className="font-black text-[11px] text-on-surface uppercase tracking-widest">{item.title}</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-outline-variant opacity-40">chevron_right</span>
              </motion.div>
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(168, 56, 54, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/auth')}
            className="w-full mt-10 flex items-center justify-center gap-3 py-6 rounded-2xl border-2 border-error/10 text-error font-black text-sm uppercase tracking-widest transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Terminate Session
          </motion.button>
        </motion.section>

        {/* Footer info */}
        <p className="mt-16 text-center text-[10px] font-black text-on-surface-variant/20 uppercase tracking-[0.4em]">
           Spinzyt • Editorial Handling Systems • v1.0.4
        </p>
      </main>
    </motion.div>
  );
};

export default UserProfilePage;

