import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const VendorOrderHistory = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('active');

    const activeOrders = useMemo(() => [
        { id: '#SZ-8821', status: 'Processing', date: 'Mar 23, 2026', price: 498, progress: 50 },
        { id: '#SZ-8824', status: 'Ready', date: 'Mar 23, 2026', price: 650, progress: 80 },
    ], []);

    const completedOrders = useMemo(() => [
        { id: '#SZ-8810', status: 'Delivered', date: 'Mar 21, 2026', price: 375, desc: '2x Wash & Fold, 1x Eco Dry Clean' },
        { id: '#SZ-8799', status: 'Delivered', date: 'Mar 18, 2026', price: 850, desc: 'Heavy Duty Wash, 4 kg · Starch on Cotton' },
        { id: '#SZ-8780', status: 'Delivered', date: 'Mar 14, 2026', price: 210, desc: 'Express Ironing — 8 shirts' },
    ], []);

    return (
        <div className="bg-[#F8FAFC] text-[#1E293B] min-h-screen pb-32 font-sans">
            <VendorHeader title="Archive" showBack={true} />

            <motion.main 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="max-w-xl mx-auto px-6 py-8"
            >
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-full w-fit mb-10 border border-slate-200 ml-auto mr-auto">
                    {[{ key: 'active', label: 'Active' }, { key: 'completed', label: 'Completed' }].map(({ key, label }) => (
                        <motion.button 
                            key={key}
                            onClick={() => setTab(key)}
                            whileTap={{ scale: 0.95 }}
                            className={`px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${tab === key ? 'bg-white text-[#3D5AFE] shadow-sm' : 'text-slate-400 opacity-60 hover:opacity-100'}`}
                        >
                            {label}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'active' ? (
                        <motion.div key="active" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                            {activeOrders.map((order) => (
                                <motion.div key={order.id} whileHover={{ y: -5 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group cursor-pointer" onClick={() => navigate(`/vendor/order/${order.id.replace('#', '')}`)}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3D5AFE]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <motion.span animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#3D5AFE]"></motion.span>
                                                <span className="text-[#3D5AFE] font-bold text-[10px] tracking-widest uppercase">{order.status}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{order.id}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">{order.date}</p>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-800 tracking-tighter">₹{order.price}</p>
                                    </div>
                                    <div className="mb-6">
                                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${order.progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-y-0 left-0 bg-[#3D5AFE] rounded-full" />
                                        </div>
                                    </div>
                                    <button className="w-full py-4 text-[#3D5AFE] font-bold text-xs uppercase tracking-widest border border-[#3D5AFE]/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#3D5AFE]/5 transition-all">
                                        Details
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="completed" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 px-2 text-center">{completedOrders.length} completed orders</p>
                            {completedOrders.map((order, i) => (
                                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }} className="bg-white rounded-3xl p-8 border border-slate-50 shadow-sm opacity-90">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-[18px] text-slate-300">check_circle</span>
                                                <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Delivered</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{order.id}</h3>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{order.date}</p>
                                        </div>
                                        <p className="text-xl font-bold text-slate-300 tracking-tighter">₹{order.price}</p>
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 bg-slate-50 p-4 rounded-xl leading-relaxed italic">{order.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.main>
        </div>
    );
};

export default VendorOrderHistory;
