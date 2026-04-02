import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Consolidation');

    const consolidationData = [
        { id: 'B2B-001', item: 'Eco-Friendly Detergent', total: '450 kg', deadline: 'Fri, 18:00', status: 'In Review' },
        { id: 'B2B-002', item: 'Biodegradable Laundry Bags', total: '1,200 units', deadline: 'Sat, 12:00', status: 'Ready to Dispatch' },
        { id: 'B2B-003', item: 'Starch Concentrate', total: '150 L', deadline: 'Sun, 09:00', status: 'Pending Rates' },
    ];

    const historicalData = [
        { id: 'SHP-998', date: 'Mar 25, 2026', total: '₹42,850', items: 12, status: 'Settled' },
        { id: 'SHP-992', date: 'Mar 18, 2026', total: '₹38,200', items: 8, status: 'Processing' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32 font-body">
            {/* Header */}
            <header className="px-6 pt-12 pb-8 bg-white border-b border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter italic text-on-surface uppercase">B2B Hub</h1>
                        <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest">Material Supplier Portal</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10">
                        <p className="text-[9px] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Weekly Volume</p>
                        <h2 className="text-xl font-black">1,800+ <span className="text-xs font-medium text-on-surface/40">Units</span></h2>
                    </div>
                    <div className="flex-1 bg-primary text-on-primary p-4 rounded-3xl shadow-xl shadow-primary/20">
                        <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Cycle Deadline</p>
                        <h2 className="text-xl font-black">2d 14h</h2>
                    </div>
                </div>
            </header>

            <main className="px-6 pt-8 max-w-md mx-auto">
                {/* Custom Tabs */}
                <div className="flex bg-white/50 p-1 rounded-full border border-outline-variant/10 mb-8 backdrop-blur-sm">
                    {['Consolidation', 'History', 'Logistics'].map(tab => (
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
                    {activeTab === 'Consolidation' && (
                        <motion.div 
                            key="consol"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 mb-5 ml-1">Weekly Consolidation Queue</h3>
                            {consolidationData.map(order => (
                                <motion.div 
                                    key={order.id}
                                    variants={itemVariants}
                                    onClick={() => navigate(`/supplier/fulfillment/${order.id}`)}
                                    className="bg-white p-5 rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all shadow-sm"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h4 className="font-headline font-black text-on-surface">{order.item}</h4>
                                            <span className="text-[8px] font-black text-on-surface uppercase tracking-widest bg-surface-container-high px-2 py-0.5 rounded-full border border-outline-variant/10">{order.total}</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest leading-none">Deadline: {order.deadline} • <span className="text-primary font-black">{order.status}</span></p>
                                    </div>
                                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-sm">arrow_forward_ios</span>
                                </motion.div>
                            ))}
                            <button 
                                onClick={() => navigate('/supplier/rates')}
                                className="w-full mt-6 py-5 bg-white border border-outline-variant/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-surface-container-low transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
                            >
                                <span className="material-symbols-outlined text-sm">edit_note</span>
                                Update Batch Rates
                            </button>
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
                            {historicalData.map(ship => (
                                <div key={ship.id} className="bg-white/80 p-5 rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between shadow-sm backdrop-blur-sm">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h4 className="font-black text-on-surface">{ship.id}</h4>
                                            <span className="text-[9px] font-black text-on-surface/40 uppercase tracking-widest">({ship.items} items)</span>
                                        </div>
                                        <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest leading-none">{ship.date} • <span className={ship.status === 'Settled' ? 'text-green-600 font-black' : 'text-primary font-black'}>{ship.status}</span></p>
                                    </div>
                                    <p className="text-lg font-black text-on-surface tracking-tight">{ship.total}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Logistics Timeline Preview fixed at bottom */}
            <div className="fixed bottom-24 left-6 right-6 p-5 bg-white border border-outline-variant/10 rounded-[2.5rem] shadow-2xl z-20">
                <div className="flex items-center justify-between mb-4 px-1">
                    <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest leading-none">Next Batch Dispatch</p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none underline underline-offset-4">Sun Night</p>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    />
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;
