import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';
import { orderApi } from '../../../lib/api';
import useNotificationStore from '../../../shared/stores/notificationStore';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Available');
    const [isOnline, setIsOnline] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchNotifications } = useNotificationStore();

    const vendorId = localStorage.getItem('userId') || '66112c3f8e4b8a2e5c8b4568';

    const fetchAllData = async () => {
        try {
            await Promise.all([
                fetchOrders(),
                fetchNotifications(vendorId, 'vendor')
            ]);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await orderApi.getVendorOrders(vendorId);
            setAllOrders(res);
        } catch (err) {
            console.error('Fetch orders error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    const categorizedOrders = useMemo(() => {
        return {
            'Available': allOrders.filter(o => o.status === 'Assigned'),
            'In Progress': allOrders.filter(o => ['Picked Up', 'In Progress'].includes(o.status)),
            'Ready': allOrders.filter(o => ['Ready', 'Out for Delivery', 'Delivered'].includes(o.status))
        };
    }, [allOrders]);

    const dashboardStats = useMemo(() => [
        { label: 'Earnings Today', value: '₹0', change: 'Keep it up!', trend: 'up', variant: 'surface' },
        { label: 'Process Queue', value: categorizedOrders['In Progress'].length.toString().padStart(2, '0'), subValue: `${categorizedOrders['Ready'].length} Ready for Delivery`, variant: 'primary' }
    ], [categorizedOrders]);

    const [selectedOrderForReady, setSelectedOrderForReady] = useState(null);

    const markAsReady = async (order) => {
        try {
            await orderApi.updateOrderStatus(order._id, 'Ready');
            fetchOrders(); // Refresh
            setSelectedOrderForReady(null);
            alert(`Order ${order.orderId} marked as READY. Return rider notified!`);
        } catch (err) {
            alert('Error updating status');
        }
    };

    const startProcessing = async (order) => {
        try {
            await orderApi.updateOrderStatus(order._id, 'In Progress');
            fetchOrders();
        } catch (err) {
            alert('Error starting process');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-background text-on-background min-h-screen pb-32 font-body"
        >
            <VendorHeader />

            {/* Confirmation Modal for Mark as Ready */}
            <AnimatePresence>
                {selectedOrderForReady && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center p-6 bg-black/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl space-y-8"
                        >
                            <div className="space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                                    <span className="material-symbols-outlined text-[24px]">task_alt</span>
                                </div>
                                <h3 className="text-2xl font-black text-on-surface tracking-tighter italic">Ready for Handover?</h3>
                                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest leading-loose">
                                    Confirming order <span className="text-primary">#{selectedOrderForReady.id}</span> will notify the next available rider for immediate pickup.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-xl">{selectedOrderForReady.icon}</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-on-surface">{selectedOrderForReady.title}</h4>
                                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{selectedOrderForReady.desc}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setSelectedOrderForReady(null)}
                                    className="flex-1 py-4 rounded-full bg-slate-100 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => markAsReady(selectedOrderForReady)}
                                    className="flex-[2] py-4 rounded-full bg-primary-gradient text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Confirm & Dispatch
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mobile Availability Bar */}
            <div className="md:hidden bg-white border-b border-slate-100 px-6 py-2 flex justify-between items-center sticky top-[73px] z-40">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-[10px] font-black text-on-surface uppercase tracking-widest leading-none mt-0.5">Shop Status: {isOnline ? 'Active' : 'Resting'}</span>
                </div>
                <button 
                    onClick={() => setIsOnline(!isOnline)}
                    className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${isOnline ? 'bg-green-500 text-white border-green-500' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                >
                    {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
            </div>

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-10">
                {/* Compact Stats */}
                <div className="grid grid-cols-2 gap-4">
                    {dashboardStats.map((stat, i) => (
                        <div 
                            key={i} 
                            className={`${stat.variant === 'primary' ? 'bg-primary-gradient text-on-primary shadow-xl shadow-primary/20' : 'bg-white text-on-surface border border-slate-300 shadow-sm'} p-5 rounded-3xl transition-all hover:scale-[1.02]`}
                        >
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${stat.variant === 'primary' ? 'opacity-80' : 'text-on-surface-variant'}`}>{stat.label}</p>
                            <h2 className={`text-${stat.variant === 'primary' ? '3xl' : '2xl'} font-black tracking-tighter leading-none`}>{stat.value}</h2>
                            {stat.subValue ? (
                                <p className="text-[9px] font-black uppercase mt-2.5 opacity-60">{stat.subValue}</p>
                            ) : (
                                <span className={`text-[9px] ${stat.trend === 'up' ? 'text-green-500' : 'text-rose-500'} font-black uppercase mt-1.5 block flex items-center gap-1`}>
                                    <span className="material-symbols-outlined text-[12px]">{stat.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Management Quick Actions */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-on-background uppercase tracking-[0.2em] ml-1 opacity-40">Management Center</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/vendor/walk-in')}
                            className="bg-white p-4 rounded-3xl border border-slate-300 shadow-sm flex flex-col items-center gap-2 hover:border-primary/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-center">Walk-In</span>
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/vendor/promotions')}
                            className="bg-white p-4 rounded-3xl border border-slate-300 shadow-sm flex flex-col items-center gap-2 hover:border-tertiary/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-tertiary/5 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-xl">campaign</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-center">Promos</span>
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/vendor/fulfillment')}
                            className="bg-white p-4 rounded-3xl border border-slate-300 shadow-sm flex flex-col items-center gap-2 hover:border-secondary/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-xl">inventory_2</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-center">Supply</span>
                        </motion.button>
                    </div>
                </section>

                {/* Workflow */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col">
                            <h3 className="text-sm font-black text-on-background uppercase tracking-widest italic">Order Workflow</h3>
                            {categorizedOrders['In Progress'].length > 5 && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                                    <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest">Active Rush: High Throughput</span>
                                </div>
                            )}
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-[1.5rem] border border-slate-200 shadow-inner">
                            {['Available', 'In Progress', 'Ready'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-white text-primary shadow-lg scale-[1.02]' : 'text-on-surface-variant/40'}`}
                                >
                                    {tab === 'In Progress' ? 'Active' : tab === 'Ready' ? 'Done' : 'New'}
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black tabular-nums transition-colors ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                        {categorizedOrders[tab].length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {categorizedOrders[activeTab].map((order) => (
                                <motion.div 
                                    key={order._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 cursor-pointer hover:border-[#3D5AFE]/20 transition-all"
                                >
                                    <div className="flex items-center gap-5" onClick={() => navigate(`/vendor/order/${order._id}`)}>
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-sm font-bold text-on-surface truncate">{order.items[0]?.name} {order.items.length > 1 ? `+${order.items.length - 1}` : ''}</h4>
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{order.orderId}</span>
                                            </div>
                                            <p className="text-xs text-on-surface-variant font-medium mb-3 truncate">{order.customer?.displayName || 'Customer'}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[14px] text-outline-variant">schedule</span>
                                                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{order.status}</span>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-outline-variant/30 text-[18px]">chevron_right</span>
                                    </div>

                                    {activeTab === 'Available' && (
                                         <div className="pt-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startProcessing(order);
                                                }}
                                                className="w-full py-3.5 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                                Accept Pickup
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'In Progress' && (
                                        <div className="pt-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrderForReady(order);
                                                }}
                                                className="w-full py-3.5 rounded-2xl bg-primary/5 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                Mark as Ready
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {categorizedOrders[activeTab].length === 0 && (
                                <div className="py-20 text-center opacity-30">
                                    <span className="material-symbols-outlined text-6xl mb-4">inventory_2</span>
                                    <p className="text-[11px] font-black uppercase tracking-widest">No orders in this flow.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </motion.div>
    );
};

export default Dashboard;
