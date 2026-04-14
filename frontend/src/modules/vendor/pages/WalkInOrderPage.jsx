import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WalkInOrderPage = () => {
    const navigate = useNavigate();
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [items, setItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const services = useMemo(() => [
        { id: 'wash', title: 'Wash & Fold', price: 99, icon: 'local_laundry_service' },
        { id: 'wash_iron', title: 'Wash & Iron', price: 149, icon: 'dry_cleaning' },
        { id: 'iron', title: 'Steam Iron', price: 49, icon: 'iron' },
        { id: 'dry', title: 'Dry Clean', price: 299, icon: 'cleaning_services' },
        { id: 'heritage', title: 'Heritage Care', price: 749, icon: 'award_star' },
        { id: 'express', title: 'Express Fee', price: 200, icon: 'bolt' },
        { id: 'carpet', title: 'Carpet/Rug', price: 1299, icon: 'texture' },
        { id: 'curtain', title: 'Curtains', price: 499, icon: 'curtains' }
    ], []);

    const handlePhoneChange = (val) => {
        const cleanVal = val.replace(/\D/g, '');
        if (cleanVal.length <= 10) {
            setCustomerPhone(cleanVal);
        }
    };

    const addItem = () => {
        if (!selectedService) return;
        setItems([...items, { ...selectedService, id: Date.now(), tag: `T-${Math.floor(1000 + Math.random() * 9000)}` }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] pb-32 flex flex-col overflow-x-hidden">
            <header className="px-6 pt-4 flex items-center gap-4 mb-8">
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-slate-300"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </motion.button>
                <div>
                    <h1 className="text-2xl font-black tracking-tighter italic leading-none">Walk-In Hub</h1>
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">Direct Offline Order Entry</p>
                </div>
            </header>

            <main className="px-6 space-y-8 flex-1">
                {/* Customer Section */}
                <section className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Customer Identification</h2>
                    <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-lg">phone_iphone</span>
                        <input 
                            type="tel"
                            placeholder="Customer Mobile Number"
                            value={customerPhone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            maxLength={10}
                            className="w-full bg-white rounded-[2rem] pl-14 pr-6 py-5 text-sm font-bold border border-slate-300 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                    </div>
                </section>

                {/* Service Selection - Compact Scroll */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Select Service</h2>
                        <span className="text-[8px] font-black text-on-surface-variant opacity-30">Scroll for more →</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar px-1">
                        {services.map(s => (
                            <motion.button
                                key={s.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedService(s)}
                                className={`flex flex-col items-center justify-center p-4 min-w-[90px] h-[90px] rounded-3xl border transition-all ${selectedService?.id === s.id ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-white border-slate-200 text-on-surface opacity-80'}`}
                            >
                                <span className="material-symbols-outlined mb-1.5 text-xl">{s.icon}</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{s.title}</span>
                            </motion.button>
                        ))}
                    </div>
                    {selectedService && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={addItem}
                            className="w-full py-4 bg-surface-container text-primary font-black text-[10px] uppercase tracking-widest rounded-2xl border-2 border-primary/10 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            Confirm {selectedService.title}
                        </motion.button>
                    )}
                </section>

                {/* Item List / Tagging */}
                <section className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Item Queue ({items.length})</h2>
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {items.length > 0 ? items.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white p-5 rounded-[2rem] border border-slate-300 shadow-sm flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-black text-xs">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-on-surface leading-none mb-1">{item.title}</p>
                                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Tag: {item.tag}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-black text-on-surface">₹{item.price}</p>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="w-8 h-8 rounded-full bg-error/5 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="py-12 border-2 border-dashed border-slate-300 rounded-[2.5rem] flex flex-col items-center justify-center opacity-30 italic">
                                    <span className="material-symbols-outlined text-3xl mb-2">qr_code_2</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Add items to generate tags</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>

            {/* Sticky Order Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-300">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Estimated Total</p>
                        <p className="text-3xl font-black text-primary tracking-tighter leading-none">₹{total.toFixed(2)}</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={items.length === 0 || !customerPhone}
                        onClick={() => { setIsProcessing(true); setTimeout(() => navigate('/vendor/dashboard'), 2000); }}
                        className={`flex-[1.5] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-lg ${items.length > 0 && customerPhone ? 'bg-primary text-on-primary shadow-primary/20' : 'bg-surface-container text-on-surface-variant opacity-50 grayscale'}`}
                    >
                        {isProcessing ? (
                            <motion.span 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="material-symbols-outlined text-[18px]"
                            >
                                autorenew
                            </motion.span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                                <span className="whitespace-nowrap">Collect & Print</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default WalkInOrderPage;
