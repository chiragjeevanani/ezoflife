import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const PayoutSettings = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white text-[#1E293B] min-h-screen pb-32 font-sans overflow-x-hidden">
            <VendorHeader title="Bank & Payouts" showBack={true} />

            {/* Hero Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#3D5AFE] px-6 py-10 text-white relative flex flex-col items-center text-center"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                
                <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Available for Settlement</p>
                <h2 className="text-4xl font-bold tracking-tighter mb-8">₹12,840.40</h2>
                
                <div className="flex items-center gap-12">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span className="text-sm font-bold">Verified</span>
                        </div>
                    </div>
                    <div className="w-[1px] h-6 bg-white/20"></div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Next Cycle</p>
                        <p className="text-sm font-bold">Oct 27, 2026</p>
                    </div>
                </div>
            </motion.section>

            <motion.main 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto px-6 py-12 space-y-14"
            >
                {/* Bank Account Section */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#3D5AFE]">Linked Bank Account</h3>
                        <button className="text-[11px] font-black text-slate-300 hover:text-[#3D5AFE] transition-colors uppercase tracking-widest">Update Details</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {[
                            { label: 'Beneficiary', value: 'Pristine Cleaners Pvt. Ltd.', icon: 'account_circle' },
                            { label: 'Account number', value: 'SBIN •••• •••• 7781', icon: 'credit_card' },
                            { label: 'IFSC Code', value: 'SBIN0001235', icon: 'verified' },
                            { label: 'Bank Name', value: 'State Bank of India', icon: 'account_balance' }
                        ].map((field, i) => (
                            <div key={i} className="space-y-2 group">
                                <div className="flex items-center gap-2 text-slate-300 mb-1 group-hover:text-[#3D5AFE] transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">{field.icon}</span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">{field.label}</p>
                                </div>
                                <p className="text-base font-bold text-slate-800 tracking-tight pl-6">{field.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Policies Section */}
                <section className="space-y-8">
                    <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#3D5AFE]">Payout Cycles & Policies</h3>
                    </div>
                    <div className="space-y-10">
                        <div className="flex gap-6 group">
                            <span className="text-3xl font-black text-slate-100 group-hover:text-[#3D5AFE]/10 transition-colors">01</span>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-800">Weekly Settlements</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">All earnings from completed orders are automatically settled to your bank account every <span className="text-slate-600 font-bold">Friday morning</span>.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 group">
                            <span className="text-3xl font-black text-slate-100 group-hover:text-[#3D5AFE]/10 transition-colors">02</span>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-800">Release Threshold</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">A minimum balance of <span className="text-slate-600 font-bold">₹500</span> is required for the system to initiate an automatic release. Smaller balances are carried forward.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Actions */}
                <section className="pt-12 border-t border-slate-100 flex flex-col items-center gap-8">
                    <div className="text-center space-y-2">
                        <h4 className="text-base font-bold text-slate-800 tracking-tight">Financial Support Needed?</h4>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Get in touch with our treasury team for payout discrepancies or bank updates.</p>
                    </div>
                    <button className="px-10 py-4 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-slate-100 transition-all border border-slate-100">
                        Connect with Helpdesk
                    </button>
                    <div className="flex items-center gap-2 opacity-20">
                        <span className="material-symbols-outlined text-sm">security</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">Secured by AES-256 Vault Encryption</span>
                    </div>
                </section>
            </motion.main>
        </div>
    );
};

export default PayoutSettings;
