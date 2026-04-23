import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { b2bOrderApi, authApi } from '../../../lib/api';
import toast from 'react-hot-toast';

const SupplierDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Incoming Orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('supplierData') || localStorage.getItem('userData') || localStorage.getItem('user') || '{}');
    const supplierId = user._id || user.id;

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await b2bOrderApi.getSupplierOrders(supplierId);
            setOrders(data);
        } catch (error) {
            console.error('Fetch Orders Error:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (supplierId) {
            fetchOrders();
        }
    }, [supplierId]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await b2bOrderApi.updateStatus(orderId, { status: newStatus, supplierId });
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error('Update Status Error:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }), []);
    const itemVariants = useMemo(() => ({
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }), []);

    const dashboardTabs = useMemo(() => ['Incoming Orders', 'History', 'Logistics'], []);

    return (
        <div className="bg-background text-on-surface min-h-screen pb-60 font-body">
            {/* Header */}
            <header className="px-6 pt-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-black/5 cursor-pointer">
                        <span className="material-symbols-outlined text-xl">inventory_2</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter italic text-on-surface uppercase leading-none">B2B Hub</h1>
                        <p className="text-[9px] font-black text-on-surface/40 uppercase tracking-widest mt-1">Material Supplier Portal</p>
                    </div>
                </div>
                <motion.div 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/supplier/profile')}
                    className="w-10 h-10 rounded-full bg-white border border-black/5 overflow-hidden shadow-sm cursor-pointer"
                >
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" alt="Supplier" className="w-full h-full object-cover" />
                </motion.div>
            </header>

            <main className="px-6 space-y-8 flex-1 max-w-xl mx-auto">
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm transition-all hover:shadow-md">
                        <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Active Orders</p>
                        <h2 className="text-2xl font-black text-on-surface tracking-tighter">{orders.filter(o => o.status !== 'Delivered').length} <span className="text-[10px] opacity-40">Orders</span></h2>
                        <span className="text-[9px] text-primary font-black uppercase mt-1.5 block flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">local_shipping</span>
                            Regional Logisitics Active
                        </span>
                    </div>
                    <div className="bg-primary text-on-primary p-5 rounded-3xl shadow-xl shadow-black/20 transition-all hover:scale-[1.02]">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Local Area</p>
                        <h2 className="text-3xl font-black tracking-tighter leading-none">{user.supplierDetails?.pincode || '452001'}</h2>
                        <p className="text-[9px] font-black uppercase mt-2.5 opacity-60">{user.supplierDetails?.city || 'Indore'}</p>
                    </div>
                </section>

                {/* Custom Tabs */}
                <div className="flex bg-white/30 p-1.5 rounded-full border border-black/5 mb-8 backdrop-blur-sm">
                    {dashboardTabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface/40 opacity-60'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'Incoming Orders' && (
                        <motion.div 
                            key="consol"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 mb-5 ml-1">Pincode Match Queue</h3>
                            {orders.length === 0 ? (
                                <div className="text-center py-10 opacity-40 italic">No incoming orders in your region yet.</div>
                            ) : (
                                orders.map(order => (
                                    <motion.div 
                                        key={order._id}
                                        variants={itemVariants}
                                        className="bg-white p-5 rounded-[2.5rem] border border-outline-variant/10 flex flex-col gap-4 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-headline font-black text-on-surface">{order.vendor?.displayName || 'Unknown Vendor'}</h4>
                                                <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mt-1">{order.b2bOrderId}</p>
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 border-y border-slate-50 py-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                                                    <span className="text-on-surface">x{item.quantity} {item.name}</span>
                                                    <span className="text-on-surface-variant italic">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-400 uppercase">Total Value</span>
                                                <span className="text-lg font-black text-on-surface">₹{order.totalAmount}</span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                {order.status === 'Pending' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order._id, 'Accepted')}
                                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-black/10"
                                                    >
                                                        Accept
                                                    </button>
                                                )}
                                                {order.status === 'Accepted' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order._id, 'Dispatched')}
                                                        className="px-4 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                                                    >
                                                        Mark Dispatched
                                                    </button>
                                                )}
                                                {order.status === 'Dispatched' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'History' && (
                        <motion.div 
                            key="history"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 mb-5 ml-1">Historical Shipments</h3>
                            {orders.filter(o => o.status === 'Delivered').map(ship => (
                                <div key={ship._id} className="bg-white/80 p-5 rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between shadow-sm backdrop-blur-sm">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h4 className="font-black text-on-surface">{ship.b2bOrderId}</h4>
                                            <span className="text-[9px] font-black text-on-surface/40 uppercase tracking-widest">({ship.items.length} items)</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest leading-none">Delivered • <span className="text-green-600 font-black">Settled</span></p>
                                    </div>
                                    <p className="text-lg font-black text-on-surface tracking-tight">₹{ship.totalAmount}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SupplierDashboard;
