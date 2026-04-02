import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfileCreationPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    const handleGetLocation = () => {
        setIsLocating(true);
        // Mock GPS location fetch
        setTimeout(() => {
            setAddress('249 Editorial Ave, Pristine Heights, NY 10012');
            setIsLocating(false);
        }, 1500);
    };

    const isComplete = name.trim().length >= 3 && address.trim().length > 10;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] pb-10">
            <header className="px-6 pt-16 mb-10">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center text-primary mb-6"
                >
                    <span className="material-symbols-outlined text-[28px]">person_add</span>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black tracking-tighter leading-none italic mb-3"
                >
                    Final Touch
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-on-surface-variant text-sm font-semibold opacity-70"
                >
                    Complete your profile to unlock the flow.
                </motion.p>
            </header>

            <main className="px-6 max-w-md mx-auto">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Name Input */}
                    <motion.div variants={itemVariants}>
                        <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                        <div className="bg-white rounded-3xl p-5 border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-md font-black placeholder:text-outline-variant/40"
                            />
                        </div>
                    </motion.div>

                    {/* Address Input with GPS */}
                    <motion.div variants={itemVariants}>
                        <div className="flex justify-between items-center mb-3 px-1">
                            <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Home Address</label>
                            <button 
                                onClick={handleGetLocation}
                                disabled={isLocating}
                                className="flex items-center gap-1.5 text-primary text-[9px] font-black uppercase tracking-widest"
                            >
                                <span className={`material-symbols-outlined text-[14px] ${isLocating ? 'animate-spin' : ''}`}>my_location</span>
                                {isLocating ? 'Locating...' : 'Use GPS'}
                            </button>
                        </div>
                        <div className="bg-white rounded-[2rem] p-5 border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <textarea 
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Search or type your home address"
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-on-surface leading-normal placeholder:text-outline-variant/40 resize-none"
                            />
                        </div>
                        <p className="text-[9px] font-bold text-on-surface-variant opacity-50 mt-3 px-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[12px]">info</span>
                            This will be your default pickup location.
                        </p>
                    </motion.div>

                    {/* Completion Button */}
                    <motion.button 
                        variants={itemVariants}
                        whileTap={isComplete ? { scale: 0.98 } : {}}
                        onClick={() => isComplete && navigate('/user/home')}
                        disabled={!isComplete}
                        className={`w-full py-5 rounded-[2rem] transition-all duration-300 font-headline font-black uppercase tracking-[0.2em] text-xs shadow-xl ${
                            isComplete 
                            ? 'bg-primary-gradient text-on-primary shadow-primary/20' 
                            : 'bg-surface-container-high text-outline-variant opacity-50'
                        }`}
                    >
                        Launch Experience
                    </motion.button>
                </motion.div>
            </main>

            {/* Visual Accents */}
            <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="fixed top-1/2 -right-40 w-80 h-80 bg-tertiary/5 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
    );
};

export default ProfileCreationPage;
