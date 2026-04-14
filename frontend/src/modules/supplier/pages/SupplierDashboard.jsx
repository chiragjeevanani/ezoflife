import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Consolidation');

    const consolidationData = useMemo(() => [
        { id: 'B2B-001', item: 'Eco-Friendly Detergent', total: '450 kg', deadline: 'Fri, 18:00', status: 'In Review' },
        { id: 'B2B-002', item: 'Biodegradable Laundry Bags', total: '1,200 units', deadline: 'Sat, 12:00', status: 'Ready to Dispatch' },
        { id: 'B2B-003', item: 'Starch Concentrate', total: '150 L', deadline: 'Sun, 09:00', status: 'Pending Rates' },
    ], []);

    const historicalData = useMemo(() => [
        { id: 'SHP-998', date: 'Mar 25, 2026', total: '₹42,850', items: 12, status: 'Settled' },
        { id: 'SHP-992', date: 'Mar 18, 2026', total: '₹38,200', items: 8, status: 'Processing' },
    ], []);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }), []);

    const dashboardTabs = useMemo(() => ['Consolidation', 'History', 'Logistics'], []);

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
                        <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Weekly Volume</p>
                        <h2 className="text-2xl font-black text-on-surface tracking-tighter">1,800+ <span className="text-[10px] opacity-40">Units</span></h2>
                        <span className="text-[9px] text-primary font-black uppercase mt-1.5 block flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">trending_up</span>
                            14% growth
                        </span>
                    </div>
                    <div className="bg-primary text-on-primary p-5 rounded-3xl shadow-xl shadow-black/20 transition-all hover:scale-[1.02]">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Cycle Deadline</p>
                        <h2 className="text-3xl font-black tracking-tighter leading-none">2d 14h</h2>
                        <p className="text-[9px] font-black uppercase mt-2.5 opacity-60">Prepare Next Batch</p>
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
            <div className="fixed bottom-32 left-6 right-6 p-5 bg-white border border-outline-variant/10 rounded-[2.5rem] shadow-2xl z-20">
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
