import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SupplierProfile = () => {
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('supplierData') || localStorage.getItem('userData') || localStorage.getItem('user') || '{}';
    const user = JSON.parse(userRaw);

    const handleSignOut = () => {
        localStorage.clear();
        navigate('/user/auth');
        toast.success('Signed out successfully');
    };

    return (
        <div className="bg-[#F8FAFC] text-slate-900 min-h-screen pb-40 font-sans">
            <main className="max-w-md mx-auto px-6 pt-10 space-y-10">
                
                {/* PROFILE HEADER */}
                <header className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-[2.2rem] bg-indigo-100 border-4 border-white shadow-xl overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" 
                                alt="Supplier"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter text-slate-950 leading-none mb-2">
                            {user.displayName || 'Vikram Khullar'}
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            SUPPLIER ID: SZ-SUPP-{(user._id || '42').slice(-6).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-indigo-100">
                                Platinum Partner
                            </span>
                        </div>
                    </div>
                </header>

                {/* 1. BUSINESS DETAILS SECTION */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Business Details</h3>
                        <span className="material-symbols-outlined text-slate-200">business_center</span>
                    </div>
                    
                    <div className="bg-white p-7 rounded-[2.8rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Shop Name</p>
                                <p className="text-[13px] font-black text-slate-900 tracking-tight">{user.supplierDetails?.shopName || 'Khullar Materials'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Owner Name</p>
                                <p className="text-[13px] font-black text-slate-900 tracking-tight">{user.displayName || 'Vikram Khullar'}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Registered Address</p>
                            <p className="text-[13px] font-black text-slate-900 tracking-tight leading-snug">
                                {user.supplierDetails?.address || 'Industrial Area Phase 2, Indore, MP 452010'}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">GST Number</p>
                                <p className="text-[13px] font-black text-slate-900 tracking-tight">{user.supplierDetails?.gst || '23AAAAA0000A1Z5'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">MSME Status</p>
                                <p className="text-[13px] font-black text-emerald-600 tracking-tight flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                                </p>
                            </div>
                        </div>
                        
                        <button className="w-full py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2 mt-2">
                            <span className="material-symbols-outlined text-sm">edit_document</span>
                            Business Verification (GST/MSME)
                        </button>
                    </div>
                </section>

                {/* 2. FINANCIAL PAYOUT DETAILS SECTION */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Financial Payouts</h3>
                        <span className="material-symbols-outlined text-slate-200">account_balance</span>
                    </div>
                    
                    <div className="bg-slate-900 text-white p-7 rounded-[2.8rem] shadow-2xl shadow-slate-900/20 space-y-6 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                        
                        <div className="space-y-1 relative z-10">
                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Linked Bank Account</p>
                            <p className="text-[15px] font-black text-white tracking-tight">HDFC Bank • XXXX9821</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Settlement Cycle</p>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Weekly Aggregator</span>
                            </div>
                            <button 
                                onClick={() => toast.success('Bank detail update form coming soon')}
                                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>

                        <div className="pt-4 relative z-10">
                            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white/60 uppercase tracking-widest flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                Settlement Management
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. PERFORMANCE METRICS SECTION */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Performance</h3>
                        <span className="material-symbols-outlined text-slate-200">insights</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm space-y-2">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <span className="material-symbols-outlined text-lg">star</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black tracking-tighter text-slate-950">4.9</h4>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Avg Rating • Top 2%</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm space-y-2">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <span className="material-symbols-outlined text-lg">leaderboard</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black tracking-tighter text-slate-950">#1</h4>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ranking • Regional</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. FACILITY TOUR SECTION */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Facility Visibility</h3>
                        <span className="material-symbols-outlined text-slate-200">videocam</span>
                    </div>
                    
                    <motion.div 
                        whileTap={{ scale: 0.98 }}
                        className="bg-white p-8 rounded-[2.8rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center space-y-4 hover:border-indigo-600 transition-all cursor-pointer group"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl">upload_file</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">Upload Facility Tour</h4>
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest max-w-[200px]">
                                Your video will be displayed on the Home Page under "Our Suppliers"
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Logout Action */}
                <div className="pt-4">
                    <button 
                        onClick={handleSignOut}
                        className="w-full py-5 bg-rose-50 border border-rose-100 rounded-[2rem] text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Logout Profile
                    </button>
                </div>

                <div className="text-center pb-12">
                    <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.6em]">SPINZYT SUPPLIER • ENTERPRISE HUB • v2.9.0</p>
                </div>
            </main>
        </div>
    );
};

export default SupplierProfile;
