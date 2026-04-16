import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderApi } from '../../../lib/api';

const OrdersHistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('user') || '{}');
  const userId = userData._id || userData.id || localStorage.getItem('userId');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching orders for UserID:', userId);
      const data = await orderApi.getMyOrders(userId);
      console.log('✅ Received orders count:', data?.length || 0);
      setOrders(data || []);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('📦 OrdersHistoryPage Mounted. UserID:', userId);
    if (!userId) {
      console.warn('⚠️ No UserID found in local storage. Fetch aborted.');
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [userId]);

  const activeOrders = useMemo(() => 
    orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)), 
  [orders]);

  const pastOrders = useMemo(() => 
    orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status)), 
  [orders]);

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <main className="pt-24 pb-44 px-6 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
             <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-6"
            />
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Syncing with server...</p>
            <p className="text-[10px] opacity-20 mt-4">Session: {userId || 'Guest'}</p>
          </div>
        ) : (
          <>
        <motion.section 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-12"
        >
          <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-3 block opacity-40">Account Dashboard</span>
          <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-none mb-10 uppercase">Your Orders</h2>
          
          <div className="flex gap-4 mb-2">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden ${
                activeTab === 'active' 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              Active Requests
              {activeTab === 'active' && activeOrders.length > 0 && (
                <span className="ml-2 bg-primary text-on-primary px-2 py-0.5 rounded-full text-[8px]">{activeOrders.length}</span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === 'past' 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              Order History
            </button>
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
                      key={order._id || order.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-primary/5 border border-outline-variant/10"
                    >
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <motion.span 
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-primary"
                            ></motion.span>
                            <span className="text-primary font-black text-[9px] tracking-[0.1em] uppercase leading-none mt-0.5">{order.status}</span>
                          </div>
                          <h3 className="text-xl font-black text-on-surface tracking-tighter leading-none">{order.orderId || `#${order._id.slice(-6)}`}</h3>
                          <div className="flex items-center gap-2 mt-1.5 opacity-50">
                            <span className="material-symbols-outlined text-[12px]">person</span>
                            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{order.rider?.displayName || 'Assigning Rider...'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-headline font-black text-primary tracking-tighter leading-none">₹{order.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>



                      {/* Progress Streamline */}
                      <div className="mb-8 px-1 relative z-10">
                        <div className="flex justify-between text-[8px] text-on-surface-variant font-black uppercase tracking-widest opacity-50 mb-3">
                          <span className={order.status !== 'Pending' ? 'text-primary opacity-100' : ''}>Picked up</span>
                          <span className={['In Progress', 'Ready', 'Delivered'].includes(order.status) ? 'text-primary opacity-100' : ''}>At Shop</span>
                          <span className={['Ready', 'Delivered'].includes(order.status) ? 'text-primary opacity-100' : ''}>Processed</span>
                          <span className={['Delivered'].includes(order.status) ? 'text-primary opacity-100' : ''}>Arrival</span>
                        </div>
                        <div className="relative h-1.5 bg-surface-container-low rounded-full overflow-hidden shadow-inner">
                          <div className={`absolute top-0 left-0 h-full bg-primary-gradient rounded-full transition-all duration-1000 w-[${
                            order.status === 'Picked Up' ? '25%' : 
                            order.status === 'In Progress' ? '50%' : 
                            order.status === 'Ready' ? '75%' : 
                            order.status === 'Delivered' ? '100%' : '5%'
                          }]`} />
                        </div>
                      </div>

                      <div className="flex gap-3 relative z-10">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/user/tracking/${order._id || order.id.replace('#', '')}`)}
                          className="flex-[2] bg-primary-gradient text-on-primary py-4 rounded-2xl font-headline font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2.5 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                          Track Live
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/user/chat/${order._id}`)}
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
                      key={order._id || order.id}
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
                          <h3 className="text-lg font-black text-on-surface tracking-tighter leading-none">{order.orderId || `#${order._id.slice(-6)}`}</h3>
                          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-on-surface-variant/40 tracking-tighter leading-none">₹{order.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="bg-surface-container-low/40 rounded-xl p-4 mb-6 border border-white/50">
                        <p className="text-[11px] font-bold text-on-surface-variant opacity-70 leading-relaxed italic line-clamp-1">{order.items?.map(i => i.name).join(', ')}</p>
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
                        {order.status === 'Delivered' && (
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/user/feedback?orderId=${order._id}&vendorId=${order.vendor?._id || order.vendor}`)}
                            className="bg-primary/20 text-primary px-5 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">star</span>
                            Rate
                          </motion.button>
                        )}
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
        </>
        )}
      </main>
    </motion.div>
  );
};

export default OrdersHistoryPage;
