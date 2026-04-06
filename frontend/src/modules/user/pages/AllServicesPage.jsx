import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AllServicesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const services = useMemo(() => [
    { id: 'wash_fold', title: 'Wash & Fold', desc: 'Everyday wear, scented & stacked', icon: 'local_laundry_service', color: 'primary', price: '₹99/kg' },
    { id: 'dry_clean', title: 'Dry Cleaning', desc: 'Suits, Silks & delicate fabrics', icon: 'dry_cleaning', color: 'tertiary', price: '₹149/pc' },
    { id: 'ironing', title: 'Premium Ironing', desc: 'Crisp finish, steam pressed', icon: 'iron', color: 'secondary', price: '₹15/pc' },
    { id: 'shoe_clean', title: 'Shoe Spa', desc: 'Deep clean & restoration', icon: 'checkroom', color: 'primary', price: '₹299/pair' },
    { id: 'bag_care', title: 'Bag Care', desc: 'Leather conditioning & cleaning', icon: 'work', color: 'tertiary', price: '₹499/pc' },
    { id: 'curtain_wash', title: 'Curtain Wash', desc: 'Dust removal & steam refresh', icon: 'window', color: 'secondary', price: '₹199/panel' },
    { id: 'carpet_wash', title: 'Carpet Wash', desc: 'Industrial grade deep cleaning', icon: 'layers', color: 'primary', price: '₹49/sqft' },
    { id: 'blanket_wash', title: 'Comforter Care', desc: 'Duvets, blankets & quilts', icon: 'bed', color: 'tertiary', price: '₹249/pc' }
  ], []);

  const filteredServices = useMemo(() => services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchQuery.toLowerCase())
  ), [services, searchQuery]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
  }), []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] pb-32"
    >
      <main className="max-w-4xl mx-auto px-6 pt-8">
        <motion.header 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-10"
        >
          <button 
            onClick={() => navigate('/user/home')}
            className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-6 opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-on-background leading-none tracking-tighter mb-4">
            Curated <br/><span className="text-primary tracking-tighter">Services.</span>
          </h1>
          <p className="text-xs font-bold text-on-surface-variant opacity-60 leading-relaxed max-w-[280px]">
            Every garment deserves a specialized touch. Browse our full suite.
          </p>
        </motion.header>

        {/* Search & Filter */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="relative flex items-center bg-white rounded-3xl px-6 py-4 shadow-sm border border-outline-variant/10 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <span className="material-symbols-outlined text-outline mr-3">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 p-0 text-md w-full placeholder:text-outline-variant font-semibold" 
              placeholder="Search for a specific care..." 
              type="text"
            />
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div 
                key={service.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/user/service-info', { state: { selectedService: service } })}
                className="bg-white rounded-[2.5rem] p-7 border border-outline-variant/10 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-${service.color}-container/50 flex items-center justify-center text-${service.color} group-hover:bg-${service.color} group-hover:text-white transition-colors`}>
                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-lg text-on-surface leading-tight mb-1">{service.title}</h3>
                    <p className="text-on-surface-variant text-[11px] font-bold opacity-60 leading-relaxed">{service.desc}</p>
                    <div className="mt-2 text-[10px] font-black text-primary uppercase tracking-widest">{service.price}</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredServices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center text-center opacity-40"
          >
            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
            <p className="font-black text-xs uppercase tracking-widest leading-relaxed">No services found matching <br/>"{searchQuery}"</p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
};

export default AllServicesPage;
