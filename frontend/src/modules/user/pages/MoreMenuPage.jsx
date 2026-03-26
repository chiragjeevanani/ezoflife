import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserHeader from '../components/UserHeader';
import BottomNav from '../components/BottomNav';

const MoreMenuPage = () => {
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <main className="pt-24 pb-44 px-6 max-w-2xl mx-auto w-full">
        {/* Header Section - More Compact */}
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-10 ml-2 pt-4"
        >
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-primary font-black opacity-60 mb-1.5 block">Enterprise Mode</span>
          <h1 className="font-headline font-black text-3xl text-on-surface tracking-tighter leading-none">More</h1>
          <p className="text-[10px] font-bold text-on-surface-variant opacity-60 mt-2 max-w-[280px] uppercase tracking-widest leading-relaxed italic">
            Management, logistics, and partner ecosystems.
          </p>
        </motion.section>

        {/* Bento Grid for Primary Actions - Compacted */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4 mb-10"
        >
          {/* Help Center Card */}
          <motion.div 
            variants={itemVariants}
            className="col-span-2 bg-primary/5 rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:bg-white transition-all border border-primary/10 hover:border-outline-variant/10 shadow-sm"
          >
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>help_center</span>
              <h2 className="font-headline font-black text-2xl text-on-primary-container tracking-tighter leading-none mb-3">Help Center</h2>
              <p className="text-[10px] font-bold text-on-surface-variant opacity-60 leading-relaxed uppercase tracking-widest max-w-[200px]">Interactive guides & specialized assistance.</p>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all"></div>
          </motion.div>

          {/* FAQ Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer border border-outline-variant/10 min-h-[140px]"
          >
            <span className="material-symbols-outlined text-tertiary text-3xl mb-3">quiz</span>
            <div>
              <h3 className="font-headline font-black text-xl text-on-surface tracking-tighter leading-none mb-1">FAQ</h3>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 italic">Automated Answers</p>
            </div>
          </motion.div>

          {/* Register as Vendor Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-primary-gradient rounded-3xl p-6 flex flex-col justify-between hover:scale-101 transition-transform cursor-pointer shadow-xl shadow-primary/10 min-h-[140px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity pointer-events-none"></div>
            <span className="material-symbols-outlined text-on-primary text-3xl mb-3 relative z-10">storefront</span>
            <div className="relative z-10">
              <h3 className="font-headline font-black text-lg text-on-primary tracking-tighter leading-none mb-1 shadow-sm">Partner</h3>
              <p className="text-on-primary/70 text-[9px] font-bold uppercase tracking-widest leading-none mt-1">Scale as Vendor</p>
            </div>
          </motion.div>
        </motion.div>

        {/* List Section: Support & Settings - Optimized */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 px-2"
        >
          <h4 className="font-headline font-black text-[9px] uppercase tracking-[0.3em] text-on-surface-variant opacity-40 mb-4">Concierge Support</h4>
          
          <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm shadow-primary/5">
            {[
              { title: 'Contact Support', desc: "We're here 24/7", icon: 'support_agent', color: 'primary' },
              { title: 'Feedback', desc: "Share your thoughts", icon: 'rate_review', color: 'tertiary' }
            ].map((item, idx) => (
              <motion.button 
                key={idx}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(71, 95, 139, 0.02)' }}
                className={`w-full flex items-center justify-between p-6 text-left group transition-all ${idx === 0 ? 'border-b border-outline-variant/5' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-${item.color} shadow-inner border border-white/50 group-hover:bg-${item.color}/5 transition-colors`}>
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <span className="block font-black text-md text-on-surface tracking-tighter leading-none mb-1">{item.title}</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 leading-none italic">{item.desc}</span>
                  </div>
                </div>
                <motion.span whileHover={{ x: 5 }} className="material-symbols-outlined text-outline-variant text-[18px] group-hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                  chevron_right
                </motion.span>
              </motion.button>
            ))}
          </div>

          <h4 className="font-headline font-black text-[9px] uppercase tracking-[0.3em] text-on-surface-variant opacity-40 mb-4 mt-8 flex items-center gap-4">
            Legal & Policy
            <div className="flex-grow h-px bg-outline-variant/10"></div>
          </h4>

          <div className="bg-white/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-outline-variant/10">
            {[
              { icon: 'gavel', title: 'Terms of Service' },
              { icon: 'verified_user', title: 'Privacy Policy' }
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center justify-between p-6 hover:bg-white transition-all text-left group ${i === 0 ? 'border-b border-outline-variant/5' : ''}`}
              >
                <div className="flex items-center gap-5 text-on-surface opacity-80 group-hover:opacity-100">
                  <span className="material-symbols-outlined text-outline-variant text-lg">{item.icon}</span>
                  <span className="font-black text-[11px] uppercase tracking-widest">{item.title}</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant text-lg group-hover:text-primary transition-all">open_in_new</span>
              </button>
            ))}
          </div>

          {/* Terminate Section */}
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(168, 56, 54, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/auth')}
            className="w-full mt-10 py-6 rounded-2xl border-2 border-error/10 text-error font-black text-[10px] uppercase tracking-[.3em] shadow-sm transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Terminate Session
          </motion.button>

          <footer className="text-center py-12 space-y-2 relative z-10 opacity-30">
            <p className="text-[11px] font-black uppercase tracking-[.2em] text-on-surface-variant">Ez of life Logistics • v2.4.0-E</p>
            <p className="text-[9px] font-bold italic text-on-surface-variant uppercase tracking-widest">Handled with editorial care since 2026</p>
          </footer>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default MoreMenuPage;
