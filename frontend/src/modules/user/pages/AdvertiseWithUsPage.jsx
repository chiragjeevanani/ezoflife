import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdvertiseWithUsPage = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const campaignTypes = useMemo(() => ['Launch Boost', 'Retainer', 'One-Off'], []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

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

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] pb-24 flex flex-col overflow-x-hidden font-body">
            <header className="px-6 pt-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-outline-variant/10"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter italic leading-none">Advertise</h1>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">Sponsorships & Media Kit</p>
                    </div>
                </div>
            </header>

            <motion.main 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-6 max-w-md mx-auto w-full flex-grow"
            >
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-primary p-12 rounded-[3.5rem] text-on-primary shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col justify-end min-h-[300px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse"></div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block opacity-60">Reach 50k+ Active Users</span>
                            <h2 className="text-4xl font-black tracking-tighter italic leading-none mb-6">Drive Impact with Spinzyt</h2>
                            <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                                Download Media Kit
                                <span className="material-symbols-outlined text-sm">download</span>
                            </button>
                        </div>
                        <div className="absolute -left-6 -top-6 opacity-10 rotate-[-15deg]">
                            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>tv</span>
                        </div>
                    </div>
                </motion.section>

                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.form 
                            key="form"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleSubmit}
                            className="bg-white p-10 rounded-[3rem] border border-outline-variant/10 shadow-lg space-y-10"
                        >
                            <header>
                                <h3 className="text-2xl font-black tracking-tighter italic text-on-surface mb-2 leading-none">Campaign Inquiry</h3>
                                <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest leading-none">Brief our advertising team.</p>
                            </header>

                            <div className="space-y-6">
                                <div>
                                    <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 ml-1">Brand Name</label>
                                    <div className="bg-surface-container-low rounded-3xl p-5 border border-slate-300 shadow-sm focus-within:bg-white transition-all">
                                        <input required type="text" placeholder="e.g. Nike" className="w-full bg-transparent border-none focus:ring-0 p-0 text-md font-black placeholder:text-outline-variant/40" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 ml-1">Monthly Budget (₹)</label>
                                    <div className="bg-surface-container-low rounded-3xl p-5 border border-slate-300 shadow-sm focus-within:bg-white transition-all flex items-center">
                                        <span className="text-on-surface font-black mr-2 opacity-50">₹</span>
                                        <input required type="number" placeholder="50,000" className="w-full bg-transparent border-none focus:ring-0 p-0 text-md font-black placeholder:text-outline-variant/40" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 ml-1">Campaign Timeline</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {campaignTypes.map(type => (
                                            <button type="button" key={type} className="px-5 py-4 border border-slate-300 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-primary/5 hover:border-primary/20 transition-all text-left">
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-5 bg-primary-gradient text-on-primary font-headline font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30"
                            >
                                Request Proposal
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
                            <h2 className="text-3xl font-black tracking-tighter mb-4 italic italic-primary leading-none">Campaign Slated</h2>
                            <p className="text-on-surface-variant text-sm font-bold opacity-60 leading-relaxed mb-10">Our advertising specialists will draft a tailored proposal and contact your team within 24 hours.</p>
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
        </div>
    );
};

export default AdvertiseWithUsPage;

