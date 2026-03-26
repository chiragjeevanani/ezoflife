import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const VendorProfile = () => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: 'edit', label: 'Edit Profile', path: '/vendor/edit-profile' },
        { icon: 'location_on', label: 'Shop Address', path: '/vendor/register' },
        { icon: 'account_balance', label: 'Bank & Payouts', path: '/vendor/payouts' },
        { icon: 'receipt_long', label: 'Order History', path: '/vendor/order-history' },
        { icon: 'tune', label: 'Services & Pricing', path: '/vendor/services' },
        { icon: 'notifications', label: 'Notifications', path: '/vendor/notifications' },
        { icon: 'help_outline', label: 'Help & Support', path: '/vendor/support' },
    ];

    return (
        <div className="bg-[#F8FAFC] text-[#1E293B] min-h-screen pb-32 font-sans">
            <VendorHeader />

            <motion.main 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto px-6 py-6 space-y-6"
            >
                {/* Compact Profile Header */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 flex items-center gap-5">
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1G7gcHTDKYAyUsrelXEMf2w6RQyBCMwtQmyqi-a7ZPOQcRRYhe1gqMBSPUsXY8Ru16zqZWc8aMj-kve41JSGpk8PBMQSmPvwiBPyQnE-KlBH_j2zy2u_kqX_CmMYKy2-bOYW3G-i3PiCbE759VmmQXpJyL_cmmWYbnIEV-rZR8sjSexO93iameBgS7Rd19y8CQTrD4Ke46jtuCZrbKo6LTv7KtyX4330_FAPFGYdMldUrndR32fDYqOWnPk42gI1Zxydi6FSoas" alt="Vendor" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#3D5AFE] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="material-symbols-outlined text-white text-[12px]">verified</span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold tracking-tight text-slate-800 leading-none mb-1.5 truncate">Pristine Cleaners</h2>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">+91 98765 43210</p>
                        <div className="flex items-center gap-3">
                            <div className="flex text-amber-500 font-bold items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-[11px] text-slate-800">4.9</span>
                            </div>
                            <div className="w-[1px] h-3 bg-slate-200"></div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">214 Orders</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/vendor/edit-profile')} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#3D5AFE] transition-colors border border-slate-100/50">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                </div>

                {/* Compact Highlights */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Revenue</p>
                            <p className="text-base font-black text-slate-800 tracking-tight">₹1.2L</p>
                        </div>
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                            <span className="material-symbols-outlined text-[18px]">payments</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Uptime</p>
                            <p className="text-base font-black text-slate-800 tracking-tight">98%</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3D5AFE]">
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                        </div>
                    </div>
                </div>

                {/* Compact Menu List */}
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-50 shadow-sm">
                    {menuItems.map((item, i) => (
                        <button 
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-slate-300 group-hover:text-[#3D5AFE] transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-200 text-[18px] group-hover:text-[#3D5AFE] group-hover:translate-x-1 transition-all">chevron_right</span>
                        </button>
                    ))}
                </div>

                {/* Action Row */}
                <div className="flex gap-4">
                    <button className="flex-1 bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-red-50 hover:border-red-100 transition-all">
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-red-500 text-[18px]">logout</span>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-red-600 uppercase tracking-widest">Sign Out</span>
                    </button>
                    <button className="flex-1 bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-600 text-[18px]">dark_mode</span>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 uppercase tracking-widest">App Mode</span>
                    </button>
                </div>

                <div className="text-center pt-4">
                    <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.3em]">Version 2.0.4-gold</p>
                </div>
            </motion.main>
        </div>
    );
};

export default VendorProfile;
