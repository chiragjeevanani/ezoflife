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
                        <h1 className="font-headline font-black text-xl tracking-tight text-on-surface leading-none mb-1">Spinzyt</h1>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">#{order.orderId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/vendor/support')} className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full scale-90">help_outline</button>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-5 py-6 gap-6 overflow-y-auto pb-40">
                {/* Horizontal Status Stepper */}
                <section className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center justify-between relative px-2">
                        {orderStages.map((stage, idx) => (
                            <React.Fragment key={stage.id}>
                                <div className="flex flex-col items-center gap-2 z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                                        stage.status === 'completed' ? 'bg-primary text-white' : 
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
                                            className="absolute inset-0 bg-primary"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* Customer Info Card */}
                <section className="space-y-4">
                    <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                            <span className="material-symbols-outlined text-2xl text-primary font-black">person</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-headline font-black text-base tracking-tighter text-on-surface truncate">
                                {order.customer?.displayName || 'Customer'}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                                {order.customer?.phone || '+91 --- --- ----'}
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <a href={`tel:${order.customer?.phone}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-outline-variant/5 active:scale-90 transition-all">
                                <span className="material-symbols-outlined text-lg">call</span>
                            </a>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <span className="material-symbols-outlined text-[#73e0c9]">map</span>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Logistics Details</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Pickup */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-[#73e0c9] text-xl">upload</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[8px] font-black text-[#73e0c9] uppercase tracking-widest mb-1">Pickup From</p>
                                    <p className="text-xs font-bold leading-relaxed opacity-90 mb-3">{order.pickupAddress}</p>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-white/20 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">directions</span>
                                        Open Maps
                                    </a>
                                </div>
                            </div>

                            {/* Divider Line */}
                            <div className="ml-5 h-8 border-l-2 border-dashed border-white/10"></div>

                            {/* Drop */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-rose-400 text-xl">download</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Delivery To</p>
                                    <p className="text-xs font-bold leading-relaxed opacity-90 mb-3">{order.dropAddress}</p>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.dropAddress)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-white/20 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">directions</span>
                                        Open Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shiprocket Section (Only if exists) */}
                    {order.shipmentDetails && (
                        <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/20 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary">Shipment Tracking</h3>
                                </div>
                                <span className="px-3 py-1 bg-primary text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                                    {order.shipmentDetails.lastStatus || 'Pending'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/50 p-4 rounded-2xl border border-white">
                                    <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">AWB Code</p>
                                    <p className="text-xs font-black text-on-surface tracking-tight">{order.shipmentDetails.awbCode || 'Generating...'}</p>
                                </div>
                                <div className="bg-white/50 p-4 rounded-2xl border border-white">
                                    <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Shipment ID</p>
                                    <p className="text-xs font-black text-on-surface tracking-tight">{order.shipmentDetails.shipmentId}</p>
                                </div>
                            </div>

                            <div className="bg-white/50 p-4 rounded-2xl border border-white flex items-center justify-between">
                                <div>
                                    <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Courier Partner</p>
                                    <p className="text-xs font-black text-on-surface">{order.shipmentDetails.courierName || 'Auto-Assigning'}</p>
                                </div>
                                {order.shipmentDetails.pickupTokenNumber && (
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Pickup Token</p>
                                        <p className="text-xs font-black text-primary">{order.shipmentDetails.pickupTokenNumber}</p>
                                    </div>
                                )}
                                {order.shipmentDetails.isQC && !order.shipmentDetails.pickupTokenNumber && (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[7px] font-black uppercase tracking-widest">QC Enabled</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Delivery (Drop-off) Shiprocket Section */}
                    {order.deliveryShipmentDetails && (
                        <div className="bg-emerald-500/5 p-6 rounded-[2.5rem] border border-emerald-500/20 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 text-xl">rebase_edit</span>
                                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600">Delivery Shipment (Drop-off)</h3>
                                </div>
                                <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                                    {order.deliveryShipmentDetails.lastStatus || 'Ready'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/50 p-4 rounded-2xl border border-white">
                                    <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">AWB Code</p>
                                    <p className="text-xs font-black text-on-surface tracking-tight">{order.deliveryShipmentDetails.awbCode || 'Generating...'}</p>
                                </div>
                                <div className="bg-white/50 p-4 rounded-2xl border border-white">
                                    <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Shipment ID</p>
                                    <p className="text-xs font-black text-on-surface tracking-tight">{order.deliveryShipmentDetails.shipmentId}</p>
                                </div>
                            </div>

                            <div className="bg-white/50 p-4 rounded-2xl border border-white flex items-center justify-between">
                                <div>
                                    <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Courier Partner</p>
                                    <p className="text-xs font-black text-on-surface">{order.deliveryShipmentDetails.courierName || 'Auto-Assigning'}</p>
                                </div>
                                {order.deliveryShipmentDetails.pickupTokenNumber && (
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Pickup Token</p>
                                        <p className="text-xs font-black text-emerald-600">{order.deliveryShipmentDetails.pickupTokenNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Items Table */}
                    <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden text-sm">
                        <div className="p-4 border-b border-outline-variant/5 bg-surface-container/30">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Order Items</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="grow">
                                        <p className="font-bold text-on-surface leading-tight">{item.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                                            {item.quantity} {item.unit || 'unit'} {item.clothCount > 0 ? `(${item.clothCount} Clothes)` : ''}
                                        </p>
                                    </div>
                                    <p className="font-black text-on-surface tracking-tighter">₹{item.price}</p>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                                <p className="font-black text-primary uppercase tracking-widest text-[10px]">Total Amount</p>
                                <p className="font-black text-2xl text-primary tracking-tighter">₹{order.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200/50 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-amber-600 text-lg">description</span>
                                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-amber-700">Special Instructions</h3>
                            </div>
                            <p className="text-xs font-bold text-amber-900 leading-relaxed italic">
                                "{order.specialInstructions}"
                            </p>
                        </div>
                    )}
                </section>
            </main>

            {/* Actions */}
            <div className="fixed bottom-6 left-0 right-0 z-[60] px-6">
                <div className="max-w-md mx-auto bg-surface/40 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/40 shadow-2xl flex items-center gap-3">
                    {order.status === 'Picked Up' && (
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                                try {
                                    await orderApi.updateOrderStatus(order._id, 'In Progress');
                                    window.location.reload();
                                } catch (err) { alert('Error starting processing'); }
                            }}
                            className="flex-1 h-14 rounded-2xl bg-black text-white font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3"
                        >
                            Start Processing
                            <span className="material-symbols-outlined text-lg">play_arrow</span>
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
                            className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3"
                        >
                            Mark as Ready
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetails;
