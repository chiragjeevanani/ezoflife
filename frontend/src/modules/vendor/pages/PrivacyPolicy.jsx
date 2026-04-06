import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#F8FAFC] text-[#1E293B] min-h-screen pb-32 font-sans">
            <VendorHeader title="Privacy Policy" showBack={true} />

            <motion.main 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto px-6 py-8 space-y-8"
            >
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Introduction</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Welcome to Spinzyt. This Privacy Policy details our practices regarding the collection, use, and disclosure of your information when you use our vendor application.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Data Collection</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            We collect personal information such as shop name, owner name, email address, and phone number to provide you with our services and for verification purposes.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Use of Information</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Your information is used to facilitate order processing, communicate with you about your account, and improve our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight">Data Security</h2>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            We implement industry-standard security measures to protect your information and ensure it is not accessed by unauthorized parties.
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

export default PrivacyPolicy;
