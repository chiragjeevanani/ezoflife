import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const t = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(t);
        }
    }, [timer]);

    const handleInput = (index, value) => {
        if (value.length > 1) value = value[value.length - 1];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const next = document.getElementById(`otp-${index + 1}`);
            if (next) next.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            if (prev) {
                prev.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleVerify = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Redirect to Supplier Dashboard
            navigate('/supplier/dashboard');
        }, 1500);
    };

    const isComplete = useMemo(() => otp.every(v => v !== ''), [otp]);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    }), []);

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] flex flex-col items-center justify-center px-6">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-outline-variant/10 text-center"
            >
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                </div>

                <h1 className="font-headline font-black text-3xl mb-3 tracking-tighter uppercase italic text-primary">B2B Verify</h1>
                <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest leading-loose mb-10 opacity-60">
                    The 6-digit code has been sent to your registered partner channel.
                </p>

                <div className="flex gap-2.5 justify-center mb-10">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            id={`otp-${i}`}
                            type="tel"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInput(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className="w-10 h-14 md:w-12 md:h-16 bg-surface-container-low border border-slate-300 focus:ring-2 focus:ring-primary/20 rounded-xl text-center text-xl font-black text-on-surface outline-none transition-all"
                        />
                    ))}
                </div>

                <motion.button
                    whileTap={isComplete ? { scale: 0.98 } : {}}
                    onClick={handleVerify}
                    disabled={!isComplete || isLoading}
                    className={`w-full font-headline font-black py-5.5 rounded-2xl shadow-xl tracking-[0.2em] uppercase text-[10px] transition-all duration-300 mb-8 ${isComplete ? 'bg-primary text-on-primary shadow-primary/20' : 'bg-surface-container-high text-on-surface/20 cursor-not-allowed opacity-40'}`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                            Authenticating...
                        </div>
                    ) : 'Verify Partnership'}
                </motion.button>

                <div className="flex flex-col gap-4">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                        {timer > 0 ? (
                            `Resend available in ${timer}s`
                        ) : (
                            <button onClick={() => setTimer(30)} className="text-primary underline underline-offset-4">Resend Secure Token</button>
                        )}
                    </p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest hover:text-on-surface transition-colors"
                    >
                        Change Auth Method / Account
                    </button>
                </div>
            </motion.div>

            <div className="mt-12 text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-20">
                Authorized Supplier Portal Access
            </div>
        </div>
    );
};

export default SupplierOtp;
