import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RiderVerification = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [otp, setOtp] = useState(['', '', '', '']);

    const dialpadNumbers = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0], []);

    const handleNumberClick = (num) => {
        const emptyIdx = otp.findIndex(val => val === '');
        if (emptyIdx !== -1) {
            const newOtp = [...otp];
            newOtp[emptyIdx] = num;
            setOtp(newOtp);
        }
    };

    const handleDelete = () => {
        const lastIdx = otp.findLastIndex(val => val !== '');
        if (lastIdx !== -1) {
            const newOtp = [...otp];
            newOtp[lastIdx] = '';
            setOtp(newOtp);
        }
    };

    const handleConfirm = () => {
        if (otp.every(val => val !== '')) {
            navigate('/vendor/dashboard');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface font-body text-on-surface min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden"
        >
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between flex-shrink-0">
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-surface-container-low transition-colors rounded-full"
                >
                    <span className="material-symbols-outlined text-primary font-bold">arrow_back</span>
                </motion.button>
                <div className="text-center">
                    <h1 className="font-headline font-black text-lg tracking-tight text-on-surface leading-none mb-1">Rider Handover</h1>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">#{orderId || 'SZ-8821'}</p>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-between px-6 pb-6 overflow-hidden">
                {/* Rider Brief Card */}
                <section className="w-full bg-surface-container-low p-5 rounded-[2rem] border border-outline-variant/10 shadow-sm relative overflow-hidden flex items-center gap-5 mt-2">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-surface border-2 border-white shadow overflow-hidden">
                            <img 
                                className="w-full h-full object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHr9Vp1Xn-0mS-5V4X_mS-5V4X_mS-5V4X_mS-5V4X_mS-5V4X_mS" 
                                alt="Rider"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 vendor-gradient rounded-full flex items-center justify-center text-white border border-white text-[10px]">
                            <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-base font-black text-on-surface tracking-tight uppercase">Marcus V. S.</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">EXPRESS FLEET</span>
                            <span className="text-[9px] font-black text-on-surface-variant opacity-50 uppercase tracking-widest">KL-07-AW-221</span>
                        </div>
                    </div>
                </section>

                {/* OTP Entry */}
                <section className="text-center w-full mt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6">Enter Verification Code</p>
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, i) => (
                            <motion.div 
                                key={i}
                                animate={{ 
                                    scale: digit ? 1.05 : 1, 
                                    borderColor: digit ? "rgb(var(--md-sys-color-primary))" : "transparent" 
                                }}
                                className={`w-14 h-16 rounded-2xl flex items-center justify-center text-2xl font-black font-headline border-4 transition-all duration-300 ${
                                    digit ? 'bg-primary/5 text-primary' : 'bg-surface-container-high/40 text-on-surface-variant border-transparent'
                                }`}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span 
                                        key={digit || 'empty'}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                    >
                                        {digit || '·'}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Compact Dialpad */}
                <section className="grid grid-cols-3 gap-y-1 gap-x-4 max-w-xs w-full mt-4">
                    {dialpadNumbers.map((num) => (
                        <motion.button 
                            key={num}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleNumberClick(num)}
                            className="h-14 flex items-center justify-center rounded-full text-xl font-black text-on-surface hover:bg-surface-container-low transition-all active:scale-95"
                        >
                            {num}
                        </motion.button>
                    ))}
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDelete}
                        className="h-14 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors mx-auto"
                    >
                        <span className="material-symbols-outlined text-[20px] font-black">backspace</span>
                    </motion.button>
                </section>

                {/* Sticky Action Button */}
                <div className="w-full mt-6">
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        disabled={otp.some(v => v === '')}
                        className={`w-full h-14 rounded-2xl flex items-center justify-center gap-4 shadow-xl transition-all font-black text-xs uppercase tracking-widest ${
                            otp.every(v => v !== '') ? 'vendor-gradient text-white shadow-primary/30' : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed border border-outline-variant/10'
                        }`}
                    >
                        <span>Confirm Pickup</span>
                        <span className="material-symbols-outlined text-base">check_circle</span>
                    </motion.button>
                </div>
            </main>
        </motion.div>
    );
};

export default RiderVerification;
