import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierLogistics = () => {
    const navigate = useNavigate();

    const shipments = useMemo(() => [
        { id: 'SZ-4421', vendor: 'Spinzyt - HSR Layout', items: '50L Detergent, 200 Tags', status: 'In Transit', driver: 'Rahul S.', eta: '14 mins' },
        { id: 'SZ-4428', vendor: 'Spinzyt - Indiranagar', items: '100 Wooden Hangers', status: 'Picking Up', driver: 'Vikram K.', eta: '28 mins' },
        { id: 'SZ-4430', vendor: 'FabriCare - Whitefield', items: '3 Steam Specialists', status: 'Dispatched', driver: 'Manish P.', eta: 'Reached' }
    ], []);

    return (
        <div className="min-h-screen bg-background pb-40">
            <header className="px-6 pt-4 mb-4 z-20 pb-4">
                <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">Logistics</h1>
                <p className="text-[9px] font-black text-on-surface/40 uppercase tracking-[0.3em] mt-1">Fleet & Dispatch Control</p>
            </header>

            <main className="px-6 space-y-8 flex-1">
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm transition-all hover:shadow-md">
                        <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Active Drops</p>
                        <h2 className="text-2xl font-black text-on-surface tracking-tighter">08</h2>
                        <span className="text-[9px] text-primary font-black uppercase mt-1.5 block">↗ Live Requisition</span>
                    </div>
                    <div className="bg-primary p-5 rounded-3xl text-white shadow-xl shadow-black/20 transition-all hover:scale-[1.02]">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Avg. TAT</p>
                        <h2 className="text-3xl font-black tracking-tighter leading-none">42m</h2>
                        <p className="text-[9px] font-black uppercase mt-2.5 opacity-60">Within SLA Threshold</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40">Live Fulfillment Queue</h2>
                        <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Real-time Feed</span>
                    </div>
                    
                    <div className="space-y-4">
                        {shipments.map(ship => (
                            <motion.div 
                                key={ship.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/80 backdrop-blur-sm p-5 rounded-[2.5rem] border border-black/5 shadow-sm relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${ship.status === 'Dispatched' ? 'bg-primary' : 'bg-slate-400'}`}></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-black text-on-surface leading-none mb-1.5">{ship.vendor}</h3>
                                        <p className="text-[9px] font-bold text-on-surface/40 uppercase tracking-widest">{ship.items}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{ship.id}</p>
                                        <p className="text-[9px] font-bold text-on-surface/20 uppercase tracking-widest mt-0.5">{ship.eta}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500">{ship.driver}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-sm">Details</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SupplierLogistics;
