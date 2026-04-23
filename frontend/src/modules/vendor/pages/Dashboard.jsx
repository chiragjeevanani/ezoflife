import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';
import { orderApi } from '../../../lib/api';
import useNotificationStore from '../../../shared/stores/notificationStore';
import socket from '../../../lib/socket';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Available');
    const [isOnline, setIsOnline] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const [poolOrders, setPoolOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState(null);
    const { fetchNotifications, addNotification } = useNotificationStore();

    const vendorDataRaw = localStorage.getItem('vendorData') || localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
    const vendorData = JSON.parse(vendorDataRaw);
    
    // Smart ID Extraction: Check root, then check nested .user object
    const vendorId = vendorData._id || vendorData.id || vendorData.user?._id || vendorData.user?.id;
    
    // Diagnostic log to see what exactly is in localStorage
    console.log('📊 [DEBUG] Dashboard Identity Context:', { 
        vendorId, 
        hasVendorData: !!localStorage.getItem('vendorData'),
        hasUser: !!localStorage.getItem('user'),
        dataKeys: Object.keys(vendorData)
    });

    const fetchAllData = async () => {
        try {
            await Promise.all([
                fetchOrders(),
                fetchPoolOrders(),
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
        }
    };

    const fetchPoolOrders = async () => {
        try {
            const res = await orderApi.getPoolOrders(vendorId);
            setPoolOrders(res);
        } catch (err) {
            console.error('Fetch pool orders error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!vendorId) return;

        fetchAllData();
        // Socket will connect automatically

        socket.on('pool_update', (data) => {
            if (data.action === 'removed') {
                setPoolOrders(prev => prev.filter(o => o._id !== data.orderId));
            } else {
                fetchPoolOrders();
            }
        });

        const interval = setInterval(fetchAllData, 1800000); // Polling as fallback (30 minutes)
        
        return () => {
            clearInterval(interval);
            socket.off('pool_update');
            // socket handled by singleton
        };
    }, [vendorId]);

    const categorizedOrders = useMemo(() => {
        return {
            'Available': allOrders.filter(o => o.status === 'Assigned'),
            'In Progress': allOrders.filter(o => ['Picked Up', 'In Progress'].includes(o.status)),
            'Ready': allOrders.filter(o => ['Ready', 'Out for Delivery', 'Delivered'].includes(o.status))
        };
    }, [allOrders]);

    const dailyEarnings = useMemo(() => {
        const today = new Date().setHours(0, 0, 0, 0);
        return allOrders
            .filter(o => new Date(o.createdAt).getTime() >= today && o.status === 'Delivered')
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    }, [allOrders]);

    const dashboardStats = useMemo(() => [
        { 
            label: 'Earnings Today', 
            value: `₹${dailyEarnings.toLocaleString()}`, 
            change: dailyEarnings > 0 ? 'Trending Up' : 'No sales yet', 
            trend: 'up', 
            variant: 'surface' 
        },
        { label: 'Process Queue', value: categorizedOrders['In Progress'].length.toString().padStart(2, '0'), subValue: `${categorizedOrders['Ready'].length} Ready for Delivery`, variant: 'primary' }
    ], [categorizedOrders, dailyEarnings]);

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

    const handleVendorAccept = async (orderId) => {
        try {
            setAcceptingId(orderId);
            await orderApi.vendorAcceptOrder(orderId, vendorId);
            fetchAllData(); // Refresh everything
            alert('Order Accepted! Riders notified for pickup.');
        } catch (err) {
            console.error('Accept error:', err);
            alert('Failed to accept order. It might have been taken by another vendor.');
        } finally {
            setAcceptingId(null);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-background text-on-background min-h-screen pb-32 font-body"
        >


            {/* Confirmation Modal for Mark as Ready */}
            <AnimatePresence>
                {selectedOrderForReady && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
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
                                <h3 className="text-2xl font-black text-on-surface tracking-tighter">Ready for Handover?</h3>
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
                
                {/* Available Pool Orders Section - New Broadcaster UI */}
                {poolOrders.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Nearby Requests (Broadcast)</h3>
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 hide-scrollbar">
                            <AnimatePresence>
                                {poolOrders.map((order) => (
                                    <motion.div 
                                        key={order._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="w-[320px] bg-white text-slate-900 rounded-[2.5rem] p-8 space-y-5 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden shrink-0 group"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                                        
                                        {/* Header: ID & Timer */}
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl uppercase tracking-[0.15em] border border-slate-200/50 shadow-sm">
                                                {order.orderId}
                                            </span>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/5 rounded-xl border border-rose-500/10">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest whitespace-nowrap">Expires in 00:45</p>
                                            </div>
                                        </div>

                                        {/* Title: Name & Express Badge */}
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between gap-3">
                                                <h4 className="text-xl font-black tracking-tight text-slate-900 truncate flex-1">{order.customer?.displayName || 'Guest User'}</h4>
                                                <span className={`px-2.5 py-1 ${order.isExpress ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500'} rounded-lg text-[8px] font-black uppercase tracking-widest`}>
                                                    {order.isExpress ? '⚡ Express' : 'Standard'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-primary">distance</span>
                                                {order.distance} KM Away • {order.address?.split(',')[0]}
                                            </p>
                                        </div>

                                        {/* Main Details Grid */}
                                        <div className="space-y-3 relative z-10 py-1">
                                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                                                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pickup Slot</p>
                                                    <p className="text-[11px] font-black text-slate-900 leading-tight mt-0.5">
                                                        {typeof order.pickupSlot === 'object' && order.pickupSlot?.time 
                                                            ? `${order.pickupSlot.date} | ${order.pickupSlot.time}` 
                                                            : order.pickupSlot || '3:00 PM - 4:00 PM'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                    <span className="material-symbols-outlined text-[18px] text-primary/60">local_laundry_service</span>
                                                    <div className="min-w-0">
                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Service</p>
                                                        <p className="text-[10px] font-black text-slate-900 truncate mt-1 leading-none">Full Wash</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                    <span className="material-symbols-outlined text-[18px] text-primary/60">inventory_2</span>
                                                    <div className="min-w-0">
                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Load</p>
                                                        <p className="text-[10px] font-black text-slate-900 truncate mt-1 leading-none">{order.items?.length || 1} Bag(s)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Info: Payment, Photos, Earnings */}
                                        <div className="pt-2 border-t border-slate-100 space-y-4 relative z-10">
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                                                    Payment After Delivery
                                                </div>
                                                <div className="flex items-center gap-1.5 text-primary">
                                                    <span className="material-symbols-outlined text-[14px]">photo_library</span>
                                                    2 Photos
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-[1.8rem] shadow-xl shadow-slate-900/10 mt-2">
                                                <div>
                                                    <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Estimated Earnings</p>
                                                    <p className="text-xl font-black text-white tracking-tighter mt-1 leading-none">₹{(order.totalAmount * 0.9).toFixed(0)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none">Order Value</p>
                                                    <p className="text-xs font-black text-white/40 line-through mt-1 leading-none">₹{order.totalAmount?.toFixed(0)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 relative z-10 pt-2">
                                            <button 
                                                onClick={() => handleVendorAccept(order._id)}
                                                disabled={acceptingId === order._id}
                                                className={`flex-[2] py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl transition-all ${
                                                    acceptingId === order._id ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-primary text-white hover:scale-[1.02] active:scale-[0.98]'
                                                }`}
                                            >
                                                {acceptingId === order._id ? 'Validating...' : 'Accept Order'}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setPoolOrders(prev => prev.filter(o => o._id !== order._id));
                                                }}
                                                className="flex-1 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                                            >
                                                Not Now
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}

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
                            onClick={() => navigate('/vendor/jobs')}
                            className="bg-white p-4 rounded-3xl border border-slate-300 shadow-sm flex flex-col items-center gap-2 hover:border-primary/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/5 flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined text-xl">work</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-center">Jobs</span>
                        </motion.button>
                    </div>
                </section>

                {/* Workflow */}
                <section className="space-y-6">
                    <div className="flex flex-col gap-4 px-1">
                        <div className="flex flex-col">
                            <h3 className="text-sm font-black text-on-background uppercase tracking-widest">Order Workflow</h3>
                            {categorizedOrders['In Progress'].length > 5 && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                                    <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest">Active Rush: High Throughput</span>
                                </div>
                            )}
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-[1.2rem] border border-slate-200 shadow-inner w-full sm:w-fit overflow-x-auto hide-scrollbar">
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
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <p className="text-xs text-on-surface-variant font-medium truncate">{order.customer?.displayName || 'Customer'}</p>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span className="text-[10px] font-black text-on-surface-variant opacity-60 uppercase">{order.items.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
                                            </div>
                                            
                                            {order.specialInstructions && (
                                                <div className="bg-amber-50 px-3 py-2 rounded-xl mb-3 border border-amber-100/50">
                                                    <p className="text-[10px] font-bold text-amber-700 leading-tight">
                                                        <span className="material-symbols-outlined text-[12px] align-middle mr-1">sticky_note_2</span>
                                                        {order.specialInstructions}
                                                    </p>
                                                </div>
                                            )}

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

                                    {activeTab === 'Ready' && (
                                        <div className="pt-2">
                                            <div className="bg-primary/5 rounded-[1.5rem] p-4 flex items-center justify-between border border-primary/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <span className="material-symbols-outlined text-primary text-xl animate-pulse">local_shipping</span>
                                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Searching</p>
                                                        <p className="text-[9px] font-bold text-on-surface-variant opacity-60 uppercase mt-1">Delivery Rider Nearby</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map(i => (
                                                        <motion.div 
                                                            key={i}
                                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                                            className="w-1 h-1 bg-primary rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
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
