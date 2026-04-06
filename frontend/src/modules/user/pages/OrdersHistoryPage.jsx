import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersHistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

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

  const activeOrders = useMemo(() => [
    { 
      id: '#SZ-8291', 
      status: 'Processing', 
      detailStatus: 'Cleaning at Shop',
      date: 'Oct 24, 2026', 
      price: 899.00, 
      progress: 66,
      rider: 'Marcus Chen'
    }
  ], []);

  const pastOrders = useMemo(() => [
    { id: '#SZ-7104', status: 'Delivered', date: 'Oct 18, 2026', price: 749.00, desc: '2x Heavy Duty Wash, 1x Delicate Care Silk' },
    { id: '#SZ-6552', status: 'Delivered', date: 'Oct 05, 2026', price: 499.00, desc: 'Mixed Casual Load, Scented Finish' }
  ], []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <main className="pt-24 pb-44 px-6 max-w-2xl mx-auto w-full">
        {/* Editorial Header Section - Compacted */}
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-10 ml-2"
        >
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-primary font-black opacity-60 mb-1.5 block">Management Center</span>
          <h2 className="text-3xl font-black text-on-surface leading-none tracking-tighter mb-8">My Orders</h2>
          
          {/* Custom Modern Tabs - Compacted */}
          <div className="flex gap-2 p-1.5 bg-white rounded-full w-fit shadow-sm border border-outline-variant/5">
            <motion.button 
              layout
              onClick={() => setActiveTab('active')}
              className={`px-8 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${
                activeTab === 'active' 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'text-on-surface-variant opacity-60 hover:opacity-100'
              }`}
            >
              Active
            </motion.button>
            <motion.button 
              layout
              onClick={() => setActiveTab('past')}
              className={`px-8 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${
                activeTab === 'past' 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'text-on-surface-variant opacity-60 hover:opacity-100'
              }`}
            >
              Past
            </motion.button>
          </div>
        </motion.section>

        {/* Orders List - Optimized Spacing */}
        <div className="space-y-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'active' ? (
              <motion.div 
                key="active-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                {activeOrders.length > 0 ? (
                  activeOrders.map((order) => (
                    <motion.div 
                      key={order.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-primary/5 border border-outline-variant/10"
                    >
                      {/* Status Glow Accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <motion.span 
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-primary"
                            ></motion.span>
                            <span className="text-primary font-black text-[9px] tracking-[0.1em] uppercase leading-none mt-0.5">{order.detailStatus}</span>
                          </div>
                          <h3 className="text-xl font-black text-on-surface tracking-tighter leading-none">{order.id}</h3>
                          <div className="flex items-center gap-2 mt-1.5 opacity-50">
                            <span className="material-symbols-outlined text-[12px]">person</span>
                            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{order.rider} Assigned</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-headline font-black text-primary tracking-tighter leading-none">₹{order.price.toFixed(2)}</p>
                          {order.status === 'Processing' && (
                            <div className="mt-2 text-[8px] font-black text-error uppercase tracking-widest bg-error/5 px-2 py-1 rounded-lg animate-pulse">
                              Payment Pending
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Progress Streamline - BRD Granular Labels */}
                      <div className="mb-8 px-1 relative z-10">
                        <div className="flex justify-between text-[8px] text-on-surface-variant font-black uppercase tracking-widest opacity-50 mb-3">
                          <span className={order.progress >= 25 ? 'text-primary opacity-100' : ''}>Picked up</span>
                          <span className={order.progress >= 50 ? 'text-primary opacity-100' : ''}>At Shop</span>
                          <span className={order.progress >= 75 ? 'text-primary opacity-100' : ''}>Processed</span>
                          <span className={order.progress >= 100 ? 'text-primary opacity-100' : ''}>Arrival</span>
                        </div>
                        <div className="relative h-1.5 bg-surface-container-low rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${order.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                            className="absolute top-0 left-0 h-full bg-primary-gradient rounded-full"
                          >
                             <motion.div 
                                 animate={{ x: ['100%', '-100%'] }}
                                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                 className="absolute inset-0 bg-white/30 skew-x-12"
                             />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex gap-3 relative z-10">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/user/tracking')}
                          className="flex-[2] bg-primary-gradient text-on-primary py-4 rounded-2xl font-headline font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2.5 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                          Track Live
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/user/chat/${order.id.replace('#', '')}`)}
                          className="w-14 h-14 bg-primary/5 text-primary border border-primary/20 rounded-2xl hover:bg-primary/10 transition-colors shadow-inner flex items-center justify-center"
                          title="Contact Support"
                        >
                          <span className="material-symbols-outlined text-lg">support_agent</span>
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate('/user/verification')}
                          className="w-14 h-14 bg-surface-container-low rounded-2xl text-on-surface-variant hover:bg-surface-container transition-colors shadow-inner flex items-center justify-center"
                          title="View Articles (Pickup Photos)"
                        >
                          <span className="material-symbols-outlined text-lg">photo_library</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-40">
                    <span className="material-symbols-outlined text-5xl mb-4">shopping_basket</span>
                    <p className="text-xs font-black uppercase tracking-widest">No active orders</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="past-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                <motion.h4 variants={itemVariants} className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-30 px-4 flex items-center gap-4">
                  Archive
                  <div className="flex-grow h-px bg-outline-variant/10"></div>
                </motion.h4>

                {pastOrders.length > 0 ? (
                  pastOrders.map((order) => (
                    <motion.div 
                      key={order.id}
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                      className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 flex flex-col group border border-outline-variant/10 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[12px] text-outline-variant">check_circle</span>
                            <span className="text-on-surface-variant/50 font-black text-[9px] tracking-widest uppercase">Verified Delivery</span>
                          </div>
                          <h3 className="text-lg font-black text-on-surface tracking-tighter leading-none">{order.id}</h3>
                          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-on-surface-variant/40 tracking-tighter leading-none">₹{order.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="bg-surface-container-low/40 rounded-xl p-4 mb-6 border border-white/50">
                        <p className="text-[11px] font-bold text-on-surface-variant opacity-70 leading-relaxed italic line-clamp-1">{order.desc}</p>
                      </div>
                      <div className="flex gap-3">
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            // Mock Reorder logic: fill cart with base items
                            const newCart = { 'dry-clean': 2, 'ironing': 5 };
                            localStorage.setItem('cart_quantities', JSON.stringify(newCart));
                            navigate('/user/cart');
                          }}
                          className="flex-1 bg-surface-container text-on-surface py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-outline-variant/20 transition-all flex items-center justify-center gap-2 border border-outline-variant/10 shadow-inner"
                        >
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          Reorder
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.print()}
                          className="px-5 py-3.5 border border-outline-variant/20 text-on-surface-variant/60 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white transition-all shadow-sm flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          Invoice
                        </motion.button>

                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-40">
                    <span className="material-symbols-outlined text-5xl mb-4">archive</span>
                    <p className="text-xs font-black uppercase tracking-widest">No history found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
};

export default OrdersHistoryPage;
