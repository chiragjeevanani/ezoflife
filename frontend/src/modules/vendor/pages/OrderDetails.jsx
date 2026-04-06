import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useNotificationStore from '../../../shared/stores/notificationStore';

const OrderDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const addNotification = useNotificationStore((state) => state.addNotification);

    const orderId = id || 'EZ-8821';

    const [showReport, setShowReport] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const orderStages = useMemo(() => [
        { id: 1, label: 'Pickup', icon: 'photo_camera', status: 'completed' },
        { id: 2, label: 'Intake', icon: 'inventory_2', status: 'active', color: 'primary' },
        { id: 3, label: 'Processing', icon: 'local_laundry_service', status: 'pending' },
        { id: 4, label: 'Handover', icon: 'verified_user', status: 'pending' },
    ], []);

    const orderItems = useMemo(() => [
        { item: "Wash & Fold (per kg)", qty: "12.5 kg", price: "₹243" },
        { item: "Silk Blouse (Eco-Dry)", qty: "x 2", price: "₹130" },
        { item: "Cotton Shirts (Starch)", qty: "x 5", price: "₹125" },
    ], []);


    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-background font-body text-on-background min-h-[100dvh] flex flex-col overflow-x-hidden"
        >
            {/* Header */}
            <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-outline-variant/5">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-primary">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="font-headline font-black text-xl tracking-tight text-on-surface leading-none mb-1">Ez of Life</h1>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">#{orderId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/vendor/support')} className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full scale-90">help_outline</button>
                    <button 
                        onClick={() => setShowReport(true)}
                        className="material-symbols-outlined text-red-500 p-2 hover:bg-red-50 rounded-full scale-90"
                    >
                        report
                    </button>
                </div>
            </header>

            {/* Report Issue Modal */}
            <AnimatePresence>
                {showReport && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReport(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white rounded-t-[3rem] p-10 z-[201] shadow-2xl"
                        >
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                            <h3 className="text-2xl font-black tracking-tighter mb-2">Report Issue</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">What happened with order #{orderId}?</p>
                            
                            <div className="space-y-3 mb-8">
                                {[
                                    'Customer unreachable',
                                    'Fabric damage risk',
                                    'Incorrect weight/count',
                                    'Rider pickup issue',
                                    'Other'
                                ].map((reason) => (
                                    <button 
                                        key={reason}
                                        onClick={() => setReportReason(reason)}
                                        className={`w-full p-5 rounded-2xl flex justify-between items-center border-2 transition-all ${reportReason === reason ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'bg-slate-50 border-transparent text-slate-500 font-medium'}`}
                                    >
                                        <span className="text-sm">{reason}</span>
                                        {reportReason === reason && <span className="material-symbols-outlined text-sm">check_circle</span>}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => { setShowReport(false); /* Logic to send report */ }}
                                className="w-full py-5 bg-red-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-red-500/20"
                            >
                                Submit Report
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1 flex flex-col px-5 py-6 gap-6 overflow-y-auto pb-40">
                {/* Horizontal Status Stepper - More Compact */}
                <section className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center justify-between relative px-2">
                        {orderStages.map((stage, idx) => (
                            <React.Fragment key={stage.id}>
                                <div className="flex flex-col items-center gap-2 z-10">
                                    <p className="text-[6px] font-black text-primary uppercase tracking-widest opacity-40 mb-[-4px]">Step {stage.id} of 4</p>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                                        stage.status === 'completed' ? 'vendor-gradient text-white' : 
                                        stage.status === 'active' ? 'bg-primary/10 text-primary border-2 border-primary' : 
                                        'bg-surface-container-high text-on-surface-variant opacity-30 shadow-none'
                                    }`}>
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: stage.status !== 'pending' ? "'FILL' 1" : "'FILL' 0" }}>
                                            {stage.icon}
                                        </span>
                                    </div>

                                    <p className={`font-black text-[9px] uppercase tracking-tighter ${stage.status === 'pending' ? 'text-on-surface-variant opacity-30' : 'text-on-surface'}`}>
                                        {stage.label}
                                    </p>
                                </div>
                                {idx < orderStages.length - 1 && (
                                    <div className="flex-1 h-[2px] bg-outline-variant/10 relative -mt-6">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: stage.status === 'completed' ? '100%' : '0%' }}
                                            className="absolute inset-0 vendor-gradient"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* Customer & Info Card - Merged and Compact */}
                <section className="space-y-4">
                    <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-white shadow overflow-hidden">
                            <span className="material-symbols-outlined text-2xl text-on-surface-variant">person</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-headline font-black text-base tracking-tighter text-on-surface truncate">Rahul Sharma</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] uppercase font-black tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">Premier</span>
                                <div className="flex text-amber-500 scale-75 -ml-1">
                                    {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-outline-variant/5 active:scale-90 transition-all">
                                <span className="material-symbols-outlined text-lg">call</span>
                            </button>
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-outline-variant/5 active:scale-90 transition-all">
                                <span className="material-symbols-outlined text-lg">chat</span>
                            </button>
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden text-sm">
                        <div className="p-4 border-b border-outline-variant/5 bg-surface-container/30">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Order Items</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {orderItems.map((item, i) => (
                                <div key={item.item} className="flex justify-between items-center group">
                                    <div className="grow">
                                        <p className="font-bold text-on-surface leading-tight">{item.item}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">{item.qty}</p>
                                    </div>
                                    <p className="font-black text-on-surface tracking-tighter">₹{item.price.replace('₹', '')}</p>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                                <p className="font-black text-primary uppercase tracking-widest text-[10px]">Total Amount</p>
                                <p className="font-black text-2xl text-primary tracking-tighter">₹498</p>
                            </div>
                        </div>
                    </div>

                    {/* Compact Instructions */}
                    <div className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-amber-500 text-lg">assignment</span>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Special Note</h3>
                        </div>
                        <p className="text-xs font-medium text-on-surface-variant leading-relaxed italic bg-white/40 p-3 rounded-2xl border border-dashed border-outline-variant/10">
                            "Please use cold water for the silk items. Medium starch on cotton shirts."
                        </p>
                    </div>
                </section>
            </main>

            {/* Compact Floating Actions */}
            <div className="fixed bottom-6 left-0 right-0 z-[60] px-6">
                <div className="max-w-md mx-auto bg-surface/40 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/40 shadow-2xl flex items-center gap-3">
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl border border-outline-variant/10 text-on-surface-variant flex flex-col items-center justify-center gap-0.5 active:bg-surface-container transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">print</span>
                        <span className="text-[7px] font-black uppercase tracking-tighter">Label</span>
                    </motion.button>
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            addNotification('processing', 'Cleaning Complete', 'Your order #EZ-8821 has been processed and is being packed.', 'user');
                            addNotification('ready', 'Order Ready #EZ-8821', 'Pick up ready at Heritage Cleaners for final delivery.', 'rider');
                            navigate(`/vendor/rider-verification/${orderId}`);
                        }}
                        className="flex-1 h-14 rounded-2xl vendor-gradient text-white font-black text-sm uppercase tracking-[0.15em] shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                    >
                        Mark as Ready
                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    </motion.button>

                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetails;
