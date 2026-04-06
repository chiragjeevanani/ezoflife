import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PromotionManagerPage = () => {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    
    const initialPromos = useMemo(() => [
        { id: 1, title: 'Happy Hour - Flat ₹100 Off', code: 'HAPPY100', type: 'Flat', usage: 42, limit: 100, status: 'Active', color: 'primary', mov: 500, expiry: 'Oct 30' },
        { id: 2, title: 'Bulk Dry Cleaning - 20% Off', code: 'BULK20', type: 'Perc', usage: 128, limit: 200, status: 'Active', color: 'tertiary', mov: 1200, expiry: 'Nov 15' },
        { id: 3, title: 'First Visit Special', code: 'WELCOME', type: 'Flat', usage: 0, limit: 500, status: 'Scheduled', color: 'secondary', mov: 0, expiry: 'Dec 01' }
    ], []);

    const promoStats = useMemo(() => [
        { label: 'Redemptions', value: '170+', icon: 'trending_up', color: 'emerald-400', variant: 'dark' },
        { label: 'Total Value', value: '₹4.2k', icon: 'payments', color: 'primary', variant: 'light' }
    ], []);

    const [promos, setPromos] = useState(initialPromos);
    const [editingPromo, setEditingPromo] = useState(null);

    const handleTogglePause = (id) => {
        setPromos(promos.map(p => 
            p.id === id 
                ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' } 
                : p
        ));
    };

    const openEdit = (promo) => {
        setEditingPromo(promo);
        setIsCreating(true);
    };

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] pb-32 flex flex-col overflow-x-hidden font-body">
            <header className="px-6 pt-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-slate-200"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter italic leading-none">Promotions</h1>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-40 mt-1">Campaign Center</p>
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setEditingPromo(null); setIsCreating(true); }}
                    className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                </motion.button>
            </header>

            <main className="px-6 space-y-8 flex-1">
                {/* Stats Summary Bento */}
                <section className="grid grid-cols-2 gap-4">
                    {promoStats.map((stat, i) => (
                        <div 
                            key={i} 
                            className={`${stat.variant === 'dark' ? 'bg-slate-900 text-white border border-white/5' : 'bg-white text-on-surface border border-slate-200'} p-6 rounded-[2.5rem] shadow-xl flex flex-col`}
                        >
                            <span className={`material-symbols-outlined text-${stat.color} text-lg mb-2`}>{stat.icon}</span>
                            <p className={`text-2xl font-black tracking-tighter leading-none mb-1 ${stat.variant === 'dark' ? 'text-white' : 'text-primary'}`}>{stat.value}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* Campaign List */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Campaigns</h2>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Active Stack ({promos.length})</span>
                    </div>
                    
                    <div className="space-y-4">
                        {promos.map(promo => (
                            <motion.div
                                key={promo.id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${promo.status === 'Active' ? 'bg-primary/5 text-primary border border-primary/10' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                                {promo.status}
                                            </div>
                                            {promo.mov > 0 && (
                                                <div className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                                                    MOV: ₹{promo.mov}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tighter leading-tight italic truncate max-w-[200px]">{promo.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-900 px-3 py-1 rounded-xl shadow-lg border border-white/10">
                                                <p className="text-[10px] font-black text-white font-mono tracking-widest uppercase">{promo.code}</p>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Expires {promo.expiry}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center relative mb-2">
                                            <span className="text-[9px] font-black text-primary tabular-nums">{Math.round((promo.usage / promo.limit) * 100)}%</span>
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-50" />
                                                <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="132" strokeDashoffset={132 - (132 * promo.usage / promo.limit)} className="text-primary transition-all duration-1000" />
                                            </svg>
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{promo.usage} / {promo.limit}</p>
                                    </div>
                                </div>

                                {/* Reducer Progress Bar */}
                                <div className="h-1 bg-slate-50 rounded-full overflow-hidden mb-6">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(promo.usage / promo.limit) * 100}%` }}
                                        className={`h-full ${promo.status === 'Active' ? 'bg-primary' : 'bg-slate-300'}`}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <motion.button 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleTogglePause(promo.id)}
                                        className={`flex-[2] py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                            promo.status === 'Active' ? 'bg-slate-50 text-slate-900 border border-slate-200' : 'bg-primary/5 text-primary border border-primary/10'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-sm">{promo.status === 'Active' ? 'pause_circle' : 'play_circle'}</span>
                                            {promo.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                                        </div>
                                    </motion.button>
                                    <motion.button 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openEdit(promo)}
                                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 border border-white/5"
                                    >
                                        Edit
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Modal Logic (Phase 2 Requirement) */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsCreating(false); setEditingPromo(null); }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-[3rem] p-10 relative z-10 shadow-2xl border border-white/20"
                        >
                            <h3 className="text-3xl font-black tracking-tighter italic leading-none mb-2">
                                {editingPromo ? 'Edit Protocol' : 'Deploy Coupon'}
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Campaign Logic Configuration</p>
                            
                            <div className="space-y-5">
                                <div className="space-y-1.5 px-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-primary ml-1 opacity-60">Internal Title</p>
                                    <input type="text" defaultValue={editingPromo?.title || ''} placeholder="HAPPY DIWALI" className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:bg-white focus:border-primary/10 transition-all font-body uppercase tracking-tight" />
                                </div>
                                <div className="space-y-1.5 px-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-primary ml-1 opacity-60">Discount Code</p>
                                    <input type="text" defaultValue={editingPromo?.code || ''} placeholder="DIWALI50" className="w-full bg-slate-900 border-2 border-white/10 text-white rounded-2xl px-5 py-4 text-[10px] font-black font-mono tracking-[0.3em] outline-none placeholder:text-slate-600 focus:border-primary transition-all uppercase" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1.5 px-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-primary ml-1 opacity-60">Min. Order</p>
                                        <input type="number" defaultValue={editingPromo?.mov || 0} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-xs font-black outline-none focus:bg-white focus:border-primary/10 transition-all tabular-nums" />
                                    </div>
                                    <div className="space-y-1.5 px-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-primary ml-1 opacity-60">Usage Limit</p>
                                        <input type="number" defaultValue={editingPromo?.limit || 500} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-xs font-black outline-none focus:bg-white focus:border-primary/10 transition-all tabular-nums" />
                                    </div>
                                </div>

                                <button onClick={() => { setIsCreating(false); setEditingPromo(null); }} className="w-full mt-6 py-5 bg-primary text-on-primary rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
                                    {editingPromo ? 'Save Configuration' : 'Activate Campaign'}
                                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                </button>

                                <button onClick={() => setIsCreating(false)} className="w-full py-4 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-slate-900 transition-colors">
                                    Discard Draft
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default PromotionManagerPage;


