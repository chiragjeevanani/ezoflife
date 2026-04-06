import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const TermsConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#F8FAFC] text-[#1E293B] min-h-screen pb-32 font-sans">
            <VendorHeader title="Terms & Conditions" showBack={true} />

            <motion.main 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto px-6 py-8 space-y-8"
            >
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Acceptance of Terms</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            By using our vendor application, you agree to comply with our Terms & Conditions. If you do not agree to these terms, you should not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Vendor Responsibility</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            As a vendor, you are responsible for maintaining the accuracy of your profile information and for the quality of services provided to customers.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Order Fulfilment</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Orders should be accepted and fulfilled in a timely manner. Delays in service may affect your vendor rating on the platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Payment Settlements</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Payments for completed orders will be settled weekly. Spinzyt reserves the right to withhold payments in cases of disputes or non-compliance Tip.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                        Last Updated: March 24, 2026
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default TermsConditions;
