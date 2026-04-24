import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderApi } from '../../../lib/api';

const OrderDetails = () => {
    const navigate = useNavigate();
    const { id: order_Id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showReport, setShowReport] = useState(false);
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderApi.getById(order_Id);
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [order_Id]);

    const orderStages = useMemo(() => {
        if (!order) return [];
        const status = order.status;
        return [
            { id: 1, label: 'Pickup', icon: 'photo_camera', status: ['Assigned', 'Picked Up', 'In Progress', 'Ready', 'Out for Delivery', 'Delivered'].includes(status) ? 'completed' : 'pending' },
            { id: 2, label: 'Intake', icon: 'inventory_2', status: ['Picked Up', 'In Progress', 'Ready', 'Out for Delivery', 'Delivered'].includes(status) ? 'completed' : 'pending' },
            { id: 3, label: 'Processing', icon: 'local_laundry_service', status: status === 'In Progress' ? 'active' : ['Ready', 'Out for Delivery', 'Delivered'].includes(status) ? 'completed' : 'pending' },
            { id: 4, label: 'Handover', icon: 'verified_user', status: status === 'Ready' || status === 'Out for Delivery' ? 'active' : ['Delivered'].includes(status) ? 'completed' : 'pending' },
        ];
    }, [order]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    if (!order) return <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center"><div><h2 className="text-xl font-black mb-2">Order Not Found</h2><button onClick={() => navigate(-1)} className="text-primary font-bold">Go Back</button></div></div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-[#F8FAFC] font-body text-slate-900 min-h-[100dvh] flex flex-col overflow-x-hidden"
        >
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-primary">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="font-headline font-black text-xl tracking-tight text-slate-900 leading-none mb-1">Order Details</h1>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Reference #{order.orderId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {order.status}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-6 py-6 gap-6 overflow-y-auto pb-40">
                
                {/* 1. OPERATIONAL DATA ACCESS (CORE METRICS) */}
                <section className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                            <span className="text-xs font-black text-slate-900">{order.pickupSlot?.time || 'ASAP'}</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">OTP Status</p>
                        <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-sm ${order.isVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {order.isVerified ? 'verified' : 'pending_actions'}
                            </span>
                            <span className={`text-xs font-black ${order.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {order.isVerified ? 'VERIFIED' : 'PENDING'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* 2. CLOTHES INVENTORY & NOTE */}
                <section className="space-y-4">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clothes Inventory</h3>
                            <div className="bg-primary text-white px-2.5 py-1 rounded-lg text-[10px] font-black">
                                {order.items?.reduce((acc, item) => acc + (item.clothCount || 0), 0)} ARTICLES
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-xl">local_laundry_service</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-slate-900">{item.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {item.quantity} {item.unit || 'unit'} • {item.clothCount || 0} Clothes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900 tracking-tight text-sm">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Valuation</p>
                                <p className="text-2xl font-black text-primary tracking-tighter">₹{order.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Note */}
                    {(order.specialInstructions || order.customerNote) && (
                        <div className="bg-amber-50/50 p-6 rounded-[2.5rem] border border-amber-100 flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                <span className="material-symbols-outlined text-xl">sticky_note_2</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Customer Note</p>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                                    "{order.specialInstructions || order.customerNote}"
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* 3. PICKUP EVIDENCE & PHOTOS */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Evidence</h3>
                        <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-2 py-1 rounded-lg">High Res</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {order.pickupPhotos?.length > 0 ? (
                            order.pickupPhotos.map((url, i) => (
                                <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-200 shadow-inner group relative">
                                    <img src={url} alt="Evidence" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-10 bg-white rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 grayscale opacity-40">
                                <span className="material-symbols-outlined text-4xl">no_photography</span>
                                <p className="text-[9px] font-black uppercase tracking-widest">No pickup photos attached</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. CUSTOMER LOGISTICS */}
                <section className="bg-slate-900 rounded-[2.5rem] p-6 shadow-xl space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white">Logistics Details</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-slate-400">
                                <span className="material-symbols-outlined text-xl">person</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white">{order.customer?.displayName || 'Customer'}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{order.customer?.phone}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-slate-400">
                                <span className="material-symbols-outlined text-xl">home</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-300 leading-relaxed line-clamp-2">{order.pickupAddress}</p>
                                <button 
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`)}
                                    className="mt-3 bg-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-xs">directions</span>
                                    Navigate
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Actions */}
            <div className="fixed bottom-6 left-0 right-0 z-[60] px-6">
                <div className="max-w-md mx-auto bg-white/40 backdrop-blur-2xl p-3 rounded-[2.5rem] border border-white/40 shadow-2xl flex items-center gap-3">
                    {order.status === 'Picked Up' && (
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                                try {
                                    await orderApi.updateOrderStatus(order._id, 'In Progress');
                                    window.location.reload();
                                } catch (err) { alert('Error starting processing'); }
                            }}
                            className="flex-1 h-16 rounded-[1.8rem] bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl"
                        >
                            Start Processing
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                        </motion.button>
                    )}
                    {order.status === 'In Progress' && (
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                                try {
                                    await orderApi.updateOrderStatus(order._id, 'Ready');
                                    window.location.reload();
                                } catch (err) { alert('Error marking as ready'); }
                            }}
                            className="flex-1 h-16 rounded-[1.8rem] bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                        >
                            Mark as Ready
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                        </motion.button>
                    )}
                    {order.status === 'Ready' && (
                        <div className="flex-1 h-16 rounded-[1.8rem] bg-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-slate-200">
                            Waiting for Rider
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-ping"></span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetails;
