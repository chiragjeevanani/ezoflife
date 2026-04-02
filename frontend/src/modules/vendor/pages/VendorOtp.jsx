import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VendorOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleNumber = (n) => {
        const idx = otp.findIndex(v => v === '');
        if (idx !== -1) {
            const next = [...otp]; next[idx] = String(n); setOtp(next);
        }
    };
    const handleDelete = () => {
        const last = otp.findLastIndex(v => v !== '');
        if (last !== -1) {
            const next = [...otp]; next[last] = ''; setOtp(next);
        }
    };

    return (
        <div className="bg-surface min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-4 flex-shrink-0">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/vendor/auth')} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-primary">arrow_back</span>
                </motion.button>
            </div>

            {/* Content — fills remaining height */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-between px-6 pb-6 overflow-hidden"
            >
                {/* Top Section: icon + title + OTP boxes */}
                <div className="flex flex-col items-center w-full gap-5 mt-2">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-16 h-16 vendor-gradient rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-primary/30"
                    >
                        <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>sms</span>
                    </motion.div>

                    {/* Title */}
                    <div className="text-center">
                        <h1 className="font-headline font-black text-2xl tracking-tighter text-on-surface mb-1">Verify your number</h1>
                        <p className="text-on-surface-variant font-medium text-sm">We sent a 4-digit code to <strong className="text-primary">+91 98765 43210</strong></p>
                    </div>

                    {/* OTP Boxes */}
                    <div className="flex gap-3">
                        {otp.map((digit, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: digit ? 1.06 : 1,
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black font-headline border-4 transition-all duration-300 ${
                                    digit
                                        ? 'bg-primary/5 text-primary border-primary shadow-md shadow-primary/10'
                                        : 'bg-surface-container-high/40 text-on-surface-variant border-slate-300'
                                }`}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={digit || 'dot'}
                                        initial={{ y: 8, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -8, opacity: 0 }}
                                        className="inline-block"
                                    >
                                        {digit || '·'}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Resend */}
                    <p className="text-on-surface-variant text-sm">
                        Didn't receive it? <button className="text-primary font-black">Resend OTP</button>
                    </p>
                </div>

                {/* Dialpad */}
                <div className="w-full max-w-xs grid grid-cols-3 gap-y-1 gap-x-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '·', 0, 'del'].map((key) => (
                        key === 'del' ? (
                            <motion.button
                                key="del"
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.88 }}
                                onClick={handleDelete}
                                className="h-14 mx-auto w-full rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
                            >
                                <span className="material-symbols-outlined text-[22px]">backspace</span>
                            </motion.button>
                        ) : (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.88 }}
                                onClick={() => key !== '·' && handleNumber(key)}
                                className="h-14 mx-auto w-full rounded-full font-headline font-black text-xl text-on-surface hover:bg-surface-container-low transition-all"
                            >
                                {key}
                            </motion.button>
                        )
                    ))}
                </div>

                {/* Confirm Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/vendor/dashboard')}
                    disabled={otp.some(v => v === '')}
                    className={`w-full max-w-xs h-14 rounded-2xl font-headline font-black text-base shadow-2xl transition-all flex items-center justify-center gap-3 ${
                        otp.every(v => v !== '')
                            ? 'vendor-gradient text-white shadow-primary/30'
                            : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                    }`}
                >
                    Verify & Enter
                    <span className="material-symbols-outlined">check_circle</span>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default VendorOtp;
