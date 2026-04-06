import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PartnershipInquiryPage = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const partnershipTypes = useMemo(() => ['Logistics', 'Supplies', 'Marketing', 'Technology'], []);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    }), []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] pb-24 flex flex-col overflow-x-hidden font-body">
            <header className="px-6 pt-4 flex items-center mb-8">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-outline-variant/10"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter italic leading-none">Partnerships</h1>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">Industrial & B2B Inquiries</p>
                    </div>
                </div>
            </header>

            <motion.main 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-6 max-w-md mx-auto w-full flex-grow"
            >
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.form 
                            key="form"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 ml-1">Company / Individual Name</label>
                                    <div className="bg-white rounded-3xl p-5 border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                        <input required type="text" placeholder="e.g. Acme Logistics" className="w-full bg-transparent border-none focus:ring-0 p-0 text-md font-black placeholder:text-outline-variant/40" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 ml-1">Contact Email</label>
                                    <div className="bg-white rounded-3xl p-5 border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                        <input required type="email" placeholder="partnership@company.com" className="w-full bg-transparent border-none focus:ring-0 p-0 text-md font-black placeholder:text-outline-variant/40" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 ml-1">Partnership Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {partnershipTypes.map(type => (
                                            <button type="button" key={type} className="px-5 py-4 border border-slate-300 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-primary/5 hover:border-primary/20 transition-all">
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 ml-1">Brief Proposal</label>
                                    <div className="bg-white rounded-3xl p-5 border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                        <textarea rows={4} placeholder="How can we grow together?" className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold placeholder:text-outline-variant/40 resize-none" />
                                    </div>
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-5.5 bg-primary-gradient text-on-primary font-headline font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30"
                            >
                                Submit Inquiry
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-12 text-center border border-outline-variant/10 shadow-2xl shadow-primary/10"
                        >
                            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8 text-success border border-success/20">
                                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter mb-4 italic italic-primary">Inquiry Received</h2>
                            <p className="text-on-surface-variant text-sm font-bold opacity-60 leading-relaxed mb-10">Our B2B team will review your proposal and reach out within 48 business hours.</p>
                            <button 
                                onClick={() => navigate('/user/home')}
                                className="bg-surface-container-high px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
                            >
                                Back to Terminal
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.main>

            <footer className="mt-12 text-center py-10 opacity-20">
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Spinzyt Partnerships HQ 2026</span>
            </footer>
        </div>
    );
};

export default PartnershipInquiryPage;

