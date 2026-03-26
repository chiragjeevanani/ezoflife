import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalPending = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending'); // pending, approved, rejected

    useEffect(() => {
        // Mocking current vendor as V001
        const checkStatus = () => {
            const savedStatus = localStorage.getItem('vendorStatus_V001');
            if (savedStatus) {
                setStatus(savedStatus);
                if (savedStatus === 'approved') {
                    setTimeout(() => navigate('/vendor/dashboard'), 1500);
                }
            }
        };

        const interval = setInterval(checkStatus, 2000);
        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface font-body text-on-surface min-h-screen flex flex-col items-center justify-center p-8 px-6 text-center"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
                className="max-w-2xl bg-surface-container-low p-12 lg:p-16 rounded-[2.5rem] border border-white shadow-2xl relative overflow-hidden group"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-80 h-80 vendor-gradient opacity-10 blur-3xl rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full -ml-32 -mb-32"></div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Animated Pulsing Icon */}
                    <div className="relative mb-12 flex flex-col items-center">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute inset-0 vendor-gradient rounded-full blur-2xl"
                        />
                        <div className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-2xl relative ${status === 'rejected' ? 'bg-error' : 'vendor-gradient shadow-primary/40'}`}>
                            <span className="material-symbols-outlined text-[56px] animate-pulse">
                                {status === 'approved' ? 'check_circle' : status === 'rejected' ? 'cancel' : 'pending_actions'}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-display-sm font-extrabold font-headline tracking-tighter text-on-surface mb-4 lg:mb-6 leading-none">
                        {status === 'approved' ? 'Application Approved!' : status === 'rejected' ? 'Application Rejected' : 'Application Under Review'}
                    </h2>
                    <p className="text-body-lg text-on-surface-variant font-medium max-w-md leading-relaxed mb-12 opacity-80">
                        {status === 'approved' 
                            ? 'Great news! Your account has been verified. Redirecting you to your business dashboard now...' 
                            : status === 'rejected' 
                            ? 'We regret to inform you that your application does not meet our current requirements. Please contact support for more details.'
                            : 'Fantastic! Your details are safely with our verification team. We prioritize speed and security for all our vendor partners.'}
                    </p>

                    {/* Verification Progress Box */}
                    <div className="w-full bg-surface-container-high rounded-3xl p-8 border border-outline-variant/5 mb-12 flex flex-col lg:flex-row items-center gap-8 justify-around shadow-inner">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                                <span className="material-symbols-outlined text-[28px]">verified</span>
                            </div>
                            <p className="text-label-md uppercase tracking-widest font-extrabold text-primary">Identity Verified</p>
                        </div>
                        <div className="w-px h-12 bg-outline-variant/20 hidden lg:block"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center text-on-surface-variant border border-outline-variant/10 relative overflow-hidden">
                                {status === 'pending' && (
                                    <motion.div 
                                        className="absolute inset-x-0 bottom-0 bg-primary/20"
                                        animate={{ height: ['0%', '100%', '0%'] }}
                                        transition={{ repeat: Infinity, duration: 4 }}
                                    />
                                )}
                                <span className={`material-symbols-outlined text-[28px] ${status === 'pending' ? 'animate-bounce-subtle' : ''}`}>
                                    {status === 'approved' ? 'done_all' : 'business'}
                                </span>
                            </div>
                            <p className="text-label-md uppercase tracking-widest font-extrabold text-on-surface-variant opacity-60">
                                {status === 'approved' ? 'Business Verified' : 'Business Check'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 w-full max-w-xs">
                        <AnimatePresence mode="wait">
                            {status === 'pending' ? (
                                <motion.div 
                                    key="pending"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full py-5 bg-surface-container-high text-on-surface-variant font-headline text-lg font-extrabold rounded-2xl border border-outline-variant/10 flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                                    Waiting for Approval
                                </motion.div>
                            ) : status === 'approved' ? (
                                <motion.div 
                                    key="approved"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full py-5 vendor-gradient text-on-primary font-headline text-lg font-extrabold rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">rocket_launch</span>
                                    Opening Dashboard...
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="rejected"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full py-5 bg-error text-on-error font-headline text-lg font-extrabold rounded-2xl shadow-2xl flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">warning</span>
                                    Access Denied
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            className="w-full py-5 bg-surface border border-outline-variant/10 text-on-surface-variant font-headline text-lg font-bold rounded-2xl hover:bg-surface-container transition-all"
                        >
                            Contact Support
                        </motion.button>
                    </div>

                    <p className="mt-12 text-label-md text-on-surface-variant font-bold uppercase tracking-widest flex items-center gap-3 opacity-60">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {status === 'pending' ? 'ETC: 2h 45m' : 'Status Updated Just Now'}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ApprovalPending;
