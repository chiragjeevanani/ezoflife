import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SupplierProfile = () => {
    const navigate = useNavigate();

    const profileOptions = useMemo(() => [
        { icon: 'business', label: 'Business Details', sub: 'Tax ID: GSTIN-88229', color: 'bg-primary' },
        { icon: 'shield_person', label: 'Identity Verification', sub: 'Completed: Nov 2025', color: 'bg-green-500' },
        { icon: 'star', label: 'Supplier Rating', sub: 'Platinum Partner (4.9/5)', color: 'bg-amber-400' },
        { icon: 'logout', label: 'Logout Session', sub: 'Account: SZ-SUPP-42', color: 'bg-on-surface/10' }
    ], []);

    return (
        <div className="min-h-screen bg-background pb-40">
            <header className="px-6 pt-4 mb-4">
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-black/5"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </motion.button>
            </header>

            <main className="px-6 space-y-10">
                <section className="flex flex-col items-center text-center">
                    <div className="relative group mb-4">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <motion.div 
                            whileTap={{ scale: 0.9 }}
                            className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </motion.div>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter italic uppercase text-on-surface">Vikram Khullar</h2>
                    <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-[0.3em] mt-1">Authorized Materials Lead</p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 ml-2">Enterprise Account</h3>
                    <div className="space-y-4">
                        {profileOptions.map((opt, i) => (
                            <motion.div
                                key={opt.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-5 rounded-[2.5rem] border border-black/5 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl ${opt.color} flex items-center justify-center ${opt.label === 'Logout Session' ? 'text-on-surface' : 'text-white'} shadow-lg shadow-black/5`}>
                                        <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-on-surface leading-none mb-1">{opt.label}</p>
                                        <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">{opt.sub}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-on-surface/20 text-md group-hover:text-primary transition-colors">arrow_forward_ios</span>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SupplierProfile;
