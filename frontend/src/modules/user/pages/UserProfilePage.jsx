import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserHeader from '../components/UserHeader';

const UserProfilePage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const mainActions = [
    { title: 'Order History', desc: 'View past cleanings and receipts', icon: 'history', path: '/user/orders', color: 'primary' },
    { title: 'Payment Methods', desc: 'Manage cards and digital wallets', icon: 'payments', path: '/user/profile/payment', color: 'tertiary' },
    { title: 'Saved Addresses', desc: 'Manage pickup & delivery locales', icon: 'location_on', path: '/user/profile/addresses', color: 'secondary' },
    { title: 'Edit Profile', desc: 'Update name, email, and preferences', icon: 'person_edit', path: '/user/profile/edit', color: 'primary' }
  ];

  const secondaryActions = [
    { title: 'Help Center', icon: 'help_outline', path: '/user/support', color: 'primary' },
    { title: 'Privacy Policy', icon: 'security', path: '/user/privacy', color: 'tertiary' },
    { title: 'Terms & Conditions', icon: 'description', path: '/user/terms', color: 'secondary' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <UserHeader />
      
      <main className="pt-24 pb-44 px-6 max-w-2xl mx-auto w-full">
        {/* Profile Hero Section - More Compact */}
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-10 relative pt-4 ml-2"
        >
          <div className="flex flex-col gap-1">
            <span className="font-label text-[9px] uppercase tracking-[0.3em] text-primary-dim font-black opacity-60">Architect of Freshness</span>
            <h2 className="font-headline text-3xl font-black text-on-background leading-none tracking-tighter">
              Julian <span className="text-primary tracking-tighter">Mendoza</span>
            </h2>
          </div>
          
          <div className="mt-8 grid grid-cols-12 gap-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="col-span-8 bg-white border border-outline-variant/10 rounded-3xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden group"
            >
               <motion.span 
                 animate={{ rotate: [0, 10, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="material-symbols-outlined text-primary text-3xl" 
                 style={{ fontVariationSettings: "'FILL' 1" }}
               >
                 verified
               </motion.span>
               <div>
                 <p className="text-[9px] font-black font-headline uppercase tracking-widest text-on-surface-variant opacity-60 mb-0.5">Status Tier</p>
                 <p className="text-on-background font-black text-xl tracking-tighter">EZ Elite</p>
               </div>
               <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="col-span-4 bg-primary-gradient rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-xl shadow-primary/10"
            >
              <p className="text-on-primary font-black text-4xl tracking-tighter leading-none mb-1">12</p>
              <p className="text-on-primary font-black text-[8px] uppercase tracking-[0.2em] opacity-80 leading-tight">Elite Orders</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Profile Actions Grid - Compacted */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {mainActions.map((action, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -3, backgroundColor: '#ffffff' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="group bg-white/40 backdrop-blur-sm p-6 rounded-3xl hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer flex items-center justify-between border border-transparent hover:border-outline-variant/10"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-${action.color}/5 flex items-center justify-center text-${action.color} shadow-inner group-hover:bg-${action.color}/10 transition-colors`}>
                  <span className="material-symbols-outlined text-xl">{action.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-black text-lg tracking-tighter text-on-surface leading-none mb-1">{action.title}</h3>
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 leading-relaxed italic line-clamp-1">{action.desc}</p>
                </div>
              </div>
              <motion.span 
                 className="material-symbols-outlined text-outline-variant text-lg group-hover:text-primary transition-all opacity-0 group-hover:opacity-100"
              >
                chevron_right
              </motion.span>
            </motion.div>
          ))}
        </motion.div>

        {/* Support & Safety Section */}
        <motion.section 
          variants={itemVariants} 
          initial="hidden"
          animate="visible"
          className="mt-16 space-y-4 px-2"
        >
          <h4 className="font-headline font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant opacity-40 mb-6 font-black">Security & Care</h4>
          
          {secondaryActions.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ x: 5 }}
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between p-6 bg-white rounded-3xl group border border-outline-variant/5 shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className={`w-11 h-11 rounded-2xl bg-${item.color}/10 flex items-center justify-center text-${item.color}`}>
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <span className="font-black text-sm text-on-surface tracking-tight leading-none uppercase tracking-widest">{item.title}</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-xl group-hover:text-primary transition-colors">chevron_right</span>
            </motion.div>
          ))}

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
           Ez of life • Editorial Handling Systems • v1.0.4
        </p>
      </main>
    </motion.div>
  );
};

export default UserProfilePage;
