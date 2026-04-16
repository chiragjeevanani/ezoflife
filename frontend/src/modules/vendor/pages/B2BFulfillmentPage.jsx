import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { materialApi, laborApi } from '../../../lib/api';
import toast from 'react-hot-toast';

const B2BFulfillmentPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('supplies');
    const [cart, setCart] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);

    const [liveSupplies, setLiveSupplies] = useState([]);
    const [liveLabor, setLiveLabor] = useState([]);

    const supplies = useMemo(() => liveSupplies.map(m => ({
        id: m._id,
        title: m.name,
        price: m.price,
        icon: m.icon || 'fluid_med'
    })), [liveSupplies]);

    const fetchMaterials = async () => {
        try {
            const [materialsData, laborData] = await Promise.all([
                materialApi.getAll(),
                laborApi.getAll()
            ]);
            setLiveSupplies(materialsData);
            setLiveLabor(laborData.map(l => ({
                id: l._id,
                title: l.name,
                rate: l.rate,
                icon: l.icon || 'person'
            })));
        } catch (error) {
            console.error('Fetch Data Error:', error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const labor = liveLabor;

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    const addToCart = (item) => {
        setCart([...cart, { ...item, cartId: Date.now() }]);
    };

    const removeFromCart = (cartId) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] pb-44 flex flex-col overflow-x-hidden">
            <header className="px-6 pt-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-slate-300"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter leading-none">Fulfillment</h1>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">Industrial Logistics Hub</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface border border-slate-200">
                        <span className="material-symbols-outlined">shopping_basket</span>
                    </div>
                    {cart.length > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-on-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white"
                        >
                            {cart.length}
                        </motion.span>
                    )}
                </div>
            </header>

            <main className="px-6 space-y-8 flex-1">
                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-white rounded-full w-full shadow-sm border border-slate-300">
                    <button 
                        onClick={() => setActiveTab('supplies')}
                        className={`flex-1 py-3.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${
                            activeTab === 'supplies' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant opacity-60'
                        }`}
                    >
                        Materials
                    </button>
                    <button 
                        onClick={() => setActiveTab('labor')}
                        className={`flex-1 py-3.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${
                            activeTab === 'labor' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant opacity-60'
                        }`}
                    >
                        Skilled Labor
                    </button>
                </div>

                <div className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Available Resources</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {(activeTab === 'supplies' ? supplies : labor).map(item => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white p-6 rounded-[2.5rem] border border-slate-300 shadow-sm flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary/5 transition-colors">
                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-on-surface leading-none mb-1">{item.title}</h3>
                                        <p className="text-[11px] font-black text-primary tracking-tight leading-none opacity-80">{item.price ? `₹${item.price}` : item.rate}</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => addToCart(item)}
                                    className="w-12 h-12 rounded-2xl border border-primary/20 bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Request Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-300 z-[50]">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Estimated Requisition</p>
                            <p className="text-3xl font-black text-primary tracking-tighter leading-none">
                                {total > 0 ? `₹${total}` : `${cart.length} Unit(s)`}
                            </p>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            disabled={isRequesting}
                            onClick={async () => { 
                                try {
                                    setIsRequesting(true);
                                    const vendorData = JSON.parse(localStorage.getItem('vendorData') || '{}');
                                    
                                    const requisitionData = {
                                        vendorId: vendorData._id || vendorData.id || 'v1',
                                        vendorName: vendorData.displayName || 'Spinzyt Partner',
                                        items: cart.map(item => ({
                                            specialistId: item.id,
                                            name: item.title,
                                            rate: item.rate || `₹${item.price}`
                                        })),
                                        totalAmount: total
                                    };

                                    await laborApi.createRequisition(requisitionData);
                                    toast.success('Labor Request Placed! Admin notified.');
                                    setCart([]);
                                    setTimeout(() => navigate('/vendor/dashboard'), 1500);
                                } catch (error) {
                                    toast.error('Failed to place request');
                                } finally {
                                    setIsRequesting(false);
                                }
                            }}
                            className="flex-[2] py-5 bg-primary text-on-primary rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                        >
                            {isRequesting ? (
                                <motion.span 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    className="material-symbols-outlined"
                                >
                                    sync
                                </motion.span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                    Place Requisition
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default B2BFulfillmentPage;
