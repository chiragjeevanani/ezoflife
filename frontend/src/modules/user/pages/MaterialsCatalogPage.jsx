import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { materialApi } from '../../../lib/api';

const MaterialsCatalogPage = () => {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await materialApi.getAll();
                setMaterials(data);
            } catch (error) {
                console.error('Fetch Materials Error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] pb-32 flex flex-col font-body">
            <header className="px-6 pt-12 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-slate-200"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </motion.button>
                    <h1 className="text-3xl font-black tracking-tighter italic leading-none">Global Catalog</h1>
                </div>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Live Inventory</p>
                    <p className="text-xs font-bold text-on-surface-variant opacity-70">Browse industrial materials and logistical resources available in our ecosystem.</p>
                </div>
            </header>

            <main className="px-6 flex-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="material-symbols-outlined text-4xl"
                        >
                            sync
                        </motion.div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Fetching Stores...</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-4"
                    >
                        {materials.map((item) => (
                            <motion.div
                                key={item._id}
                                variants={itemVariants}
                                className="bg-white p-5 rounded-[2rem] border border-black/5 shadow-sm flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-2xl">{item.icon || 'package'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-on-surface leading-none mb-1">{item.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/5 rounded-full">{item.category}</span>
                                            <span className="text-[9px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">{item.stock}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right px-2">
                                    <p className="text-sm font-black text-primary leading-none">₹{item.price}</p>
                                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1 italic">Industrial</p>
                                </div>
                            </motion.div>
                        ))}

                        {materials.length === 0 && (
                            <div className="text-center py-20 opacity-30">
                                <span className="material-symbols-outlined text-5xl mb-4">inventory_2</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">Catalog currently offline</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </main>

            {/* Visual Decor */}
            <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default MaterialsCatalogPage;
