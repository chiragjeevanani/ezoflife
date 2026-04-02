import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierRateCard = () => {
    const navigate = useNavigate();
    const [rates, setRates] = useState([
        { id: 1, name: 'Eco-Friendly Detergent', unit: 'kg', baseRate: 120.00, inStock: true },
        { id: 2, name: 'Biodegradable Bags', unit: 'unit', baseRate: 1.50, inStock: true },
        { id: 3, name: 'Starch Concentrate', unit: 'L', baseRate: 85.00, inStock: false },
        { id: 4, name: 'Fabric Softener', unit: 'L', baseRate: 95.00, inStock: true },
    ]);
    const [isSaving, setIsSaving] = useState(false);
    const ADMIN_FEE = 1.15; // 15% Platform fee

    const handleRateChange = (id, newRate) => {
        setRates(prev => prev.map(item => item.id === id ? { ...item, baseRate: parseFloat(newRate) || 0 } : item));
    };

    const toggleStock = (id) => {
        setRates(prev => prev.map(item => item.id === id ? { ...item, inStock: !item.inStock } : item));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1200);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen">
            <header className="px-6 pt-16 mb-10 sticky top-0 bg-background/80 backdrop-blur-md z-20 pb-4 border-b border-outline-variant/10">
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface mb-8 border border-outline-variant/10 shadow-sm"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                </motion.button>
                
                <h1 className="text-3xl font-black tracking-tighter italic uppercase">Batch Rate Card</h1>
                <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest mt-1 opacity-60">Set Your Base Rates ( $R_b$ )</p>
            </header>

            <main className="px-6 pb-40 max-w-md mx-auto">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {rates.map(item => (
                        <motion.div 
                            key={item.id}
                            variants={itemVariants}
                            className={`bg-white/80 backdrop-blur-sm p-6 rounded-[2.5rem] border border-outline-variant/10 transition-all shadow-sm ${!item.inStock ? 'opacity-50 grayscale' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="font-headline font-black text-on-surface text-lg leading-tight">{item.name}</h4>
                                    <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest mt-1">Billed Per {item.unit}</p>
                                </div>
                                <button 
                                    onClick={() => toggleStock(item.id)}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                        item.inStock ? 'bg-primary border-primary text-white' : 'bg-surface-container-high border-outline-variant/10 text-on-surface/40'
                                    }`}
                                >
                                    {item.inStock ? 'In Stock' : 'Out OF Stock'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-on-surface/40 uppercase tracking-widest ml-1">Supplier Base ( $R_b$ )</p>
                                    <div className="bg-surface-container-low rounded-2xl p-3 border border-slate-300 flex items-center">
                                        <span className="text-on-surface/40 text-xs font-bold mr-2">₹</span>
                                        <input 
                                            type="number"
                                            value={item.baseRate}
                                            onChange={(e) => handleRateChange(item.id, e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-md font-black text-on-surface"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-on-surface/40 uppercase tracking-widest ml-1">Vendor Final Price</p>
                                    <div className="bg-primary/5 rounded-2xl p-3 border border-primary/20 flex items-center">
                                        <span className="text-primary text-xs font-bold mr-2">₹</span>
                                        <span className="text-md font-black text-primary">{(item.baseRate * ADMIN_FEE).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            {/* Sticky Save Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-background to-transparent z-30">
                <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-5.5 bg-primary text-on-primary font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                    {isSaving ? (
                        <>
                            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                            Syncing Rates...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            Commit Rates for Batch
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default SupplierRateCard;
