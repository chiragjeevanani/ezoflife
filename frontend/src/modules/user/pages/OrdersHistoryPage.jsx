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
      
      // Mock orders for demonstration
      const mockPastOrders = [
        {
          _id: 'mock_1',
          orderId: '#SPZ-9901',
          status: 'Delivered',
          totalAmount: 1250.00,
          createdAt: new Date('2024-04-12'),
          serviceTier: 'Heritage',
          items: [{ name: 'Premium Dry Clean' }, { name: 'Silk Saree Care' }],
          vendor: { displayName: 'Spinzyt Luxury Hub' }
        },
        {
          _id: 'mock_2',
          orderId: '#SPZ-8842',
          status: 'Cancelled',
          totalAmount: 450.00,
          createdAt: new Date('2024-04-05'),
          serviceTier: 'Essential',
          items: [{ name: 'Regular Wash' }, { name: 'Steam Iron' }],
          vendor: { displayName: 'City Express Laundry' }
        }
      ];

      console.log('✅ Received orders count:', data?.length || 0);
      setOrders([...(data || []), ...mockPastOrders]);
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
          <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-3 block opacity-40">Your Requests</span>
          <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-none mb-10 uppercase">My Orders</h2>
          
          <div className="flex gap-4 mb-2">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden ${
                activeTab === 'active' 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              Active Orders
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
              Past Orders
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
                      className="bg-white rounded-[2.5rem] p-8 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 mb-6"
                    >
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-3">
                            <motion.span 
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-2.5 h-2.5 rounded-full bg-primary"
                            ></motion.span>
                            <span className="text-primary font-black text-[10px] tracking-[0.2em] uppercase">{order.status || 'Processing'}</span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{order.orderId || `#${order._id?.slice(-6)}`}</h3>
                          <div className="flex items-center gap-2 mt-2 opacity-60">
                            <span className="material-symbols-outlined text-[14px]">storefront</span>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{order.vendor?.displayName || 'Spinzyt Partner'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-headline font-black text-slate-900 tracking-tighter leading-none">₹{order.totalAmount?.toFixed(2)}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Paid Online</p>
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="bg-slate-50 rounded-3xl p-5 mb-8 flex items-center justify-between border border-slate-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            <span className="material-symbols-outlined text-lg">schedule</span>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Expected Time</p>
                            <p className="text-[11px] font-black text-slate-900 mt-0.5">
                              {order.pickupSlot?.time || order.deliverySlot?.time || 'Today, 6:00 PM'}
                            </p>
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100" alt="rider" className="w-full h-full object-cover" />
                           </div>
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[8px] font-black text-white">
                              +1
                           </div>
                        </div>
                      </div>

                      {/* Progress Streamline */}
                      <div className="mb-10 px-1 relative z-10">
                        <div className="flex justify-between text-[8px] text-slate-400 font-black uppercase tracking-widest mb-4">
                          <span className={['Rider Assigned', 'Picked Up', 'At Shop', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-primary' : ''}>Assigned</span>
                          <span className={['Picked Up', 'At Shop', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-primary' : ''}>Picked</span>
                          <span className={['At Shop', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-primary' : ''}>Shop</span>
                          <span className={['Out for Delivery', 'Delivered'].includes(order.status) ? 'text-primary' : ''}>Delivery</span>
                        </div>
                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: 
                                order.status === 'Rider Assigned' ? '20%' : 
                                order.status === 'Picked Up' ? '40%' : 
                                order.status === 'Processing at Shop' || order.status === 'At Shop' ? '60%' : 
                                order.status === 'Out for Delivery' ? '80%' : 
                                order.status === 'Delivered' ? '100%' : '10%'
                            }}
                            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_20px_rgba(115,224,201,0.5)] rounded-full transition-all duration-1000" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.02, backgroundColor: '#000' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/user/tracking/${order._id || order.id}`)}
                          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">my_location</span>
                          Live Tracking
                        </motion.button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/user/verification')}
                            className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">photo_library</span>
                            View Articles
                          </motion.button>
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/user/chat/${order._id}`)}
                            className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                            Chat Support
                          </motion.button>
                        </div>
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
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-[2.5rem] p-8 flex flex-col group border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] mb-6 opacity-80 hover:opacity-100 transition-all"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${order.status === 'Cancelled' ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
                            <span className={`${order.status === 'Cancelled' ? 'text-rose-500' : 'text-emerald-500'} font-black text-[9px] tracking-[0.2em] uppercase`}>
                                {order.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{order.orderId || `#${order._id?.slice(-6)}`}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest mb-2 shadow-sm">
                            {order.serviceTier || (order.totalAmount > 1000 ? 'Heritage' : 'Essential')}
                          </span>
                          <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">₹{order.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 rounded-2xl p-5 mb-8 border border-slate-100/50">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="material-symbols-outlined text-[14px] text-slate-400">inventory_2</span>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Package Details</p>
                        </div>
                        <p className="text-[11px] font-bold text-slate-600 leading-relaxed line-clamp-1">{order.items?.map(i => i.name).join(', ') || 'Service Request Bundle'}</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const newCart = { 'dry-clean': 2, 'ironing': 5 };
                              localStorage.setItem('cart_quantities', JSON.stringify(newCart));
                              navigate('/user/cart');
                            }}
                            className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                          >
                            <span className="material-symbols-outlined text-sm">replay</span>
                            Reorder
                          </motion.button>
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.print()}
                            className="py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                            Download Invoice PDF
                          </motion.button>
                        </div>
                        
                        {order.status === 'Delivered' && (
                          <div className="grid grid-cols-1 gap-3 mt-3">
                            <motion.button 
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/user/chat/${order._id}`)}
                              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-200 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">chat_bubble</span>
                              Report Issue / Chat
                            </motion.button>
                            <motion.button 
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/user/feedback?orderId=${order._id}&vendorId=${order.vendor?._id || order.vendor}`)}
                              className="w-full py-4 bg-primary/10 text-primary rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-primary/20 hover:bg-primary/20 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              Rate Order
                            </motion.button>
                          </div>
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
