import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VendorSplash = () => {
    const navigate = useNavigate();

    const loadingDots = useMemo(() => [0, 1, 2], []);

    React.useEffect(() => {
        const timer = setTimeout(() => navigate('/vendor/auth'), 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="vendor-gradient min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                className="flex flex-col items-center text-center z-10 px-8"
            >
                {/* Logo Icon */}
                <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl border border-white/30"
                >
                    <span className="material-symbols-outlined text-white text-[60px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_laundry_service</span>
                </motion.div>

                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-headline font-black text-white tracking-tighter leading-none mb-3"
                >
                    Spinzyt
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/70 font-bold uppercase tracking-[0.25em] text-[11px]"
                >
                    Vendor Partner Portal
                </motion.p>

                {/* Loading dots */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 flex gap-2"
                >
                    {loadingDots.map((i) => (
                        <motion.div 
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 bg-white rounded-full"
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default VendorSplash;
