import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const VendorProfile = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.clear();
        navigate('/vendor/auth');
    };

    const menuItems = useMemo(() => [
        { icon: 'edit', label: 'Edit Profile', path: '/vendor/edit-profile' },
        { icon: 'location_on', label: 'Shop Address', onClick: () => navigate('/vendor/register', { state: { isEditing: true } }) },
        { icon: 'account_balance', label: 'Bank & Payouts', path: '/vendor/payouts' },
        { icon: 'receipt_long', label: 'Order History', path: '/vendor/order-history' },
        { icon: 'star', label: 'My Reviews', path: '/vendor/reviews' },
        { icon: 'tune', label: 'Services & Pricing', path: '/vendor/services' },
        { icon: 'notifications', label: 'Notifications', path: '/vendor/notifications' },
        { icon: 'help_outline', label: 'Help & Support', path: '/vendor/support' },
    ], []);

    const vendorData = JSON.parse(localStorage.getItem('vendorData') || '{}');
    const vendorName = vendorData.displayName || "Vendor Partner";
    const vendorPhone = vendorData.phone || "98765 43210";

    return (
        <div className="bg-background text-on-background min-h-screen pb-32 font-body">
            <VendorHeader />

            <motion.main 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto px-6 py-6 space-y-6"
            >
                {/* Compact Profile Header */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/10 flex items-center gap-5">
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-surface-container overflow-hidden border-2 border-white shadow-md">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1G7gcHTDKYAyUsrelXEMf2w6RQyBCMwtQmyqi-a7ZPOQcRRYhe1gqMBSPUsXY8Ru16zqZWc8aMj-kve41JSGpk8PBMQSmPvwiBPyQnE-KlBH_j2zy2u_kqX_CmMYKy2-bOYW3G-i3PiCbE759VmmQXpJyL_cmmWYbnIEV-rZR8sjSexO93iameBgS7Rd19y8CQTrD4Ke46jtuCZrbKo6LTv7KtyX4330_FAPFGYdMldUrndR32fDYqOWnPk42gI1Zxydi6FSoas" alt="Vendor" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 vendor-gradient w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="material-symbols-outlined text-white text-[12px]">verified</span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold tracking-tight text-on-surface leading-none mb-1.5 truncate">{vendorName}</h2>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">+91 {vendorPhone}</p>
                        <div className="flex items-center gap-3">
                            <div className="flex text-amber-500 font-bold items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-[11px] text-on-surface">4.9</span>
                            </div>
                            <div className="w-[1px] h-3 bg-outline-variant/10"></div>
                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">214 Orders</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/vendor/edit-profile')} className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/10">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                </div>

                {/* Compact Highlights */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-outline-variant/10 shadow-sm flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Revenue</p>
                            <p className="text-base font-black text-on-surface tracking-tight">₹1.2L</p>
                        </div>
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                            <span className="material-symbols-outlined text-[18px]">payments</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-outline-variant/10 shadow-sm flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Uptime</p>
                            <p className="text-base font-black text-on-surface tracking-tight">98%</p>
                        </div>
                        <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                        </div>
                    </div>
                </div>

                {/* Compact Menu List */}
                <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm">
                    {menuItems.map((item, i) => (
                        <button 
                            key={item.label}
                            onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                            className="w-full flex items-center justify-between p-4 px-5 hover:bg-surface-container transition-all border-b border-outline-variant/5 last:border-0 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-on-surface-variant/40 group-hover:text-primary transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                </div>
                                <span className="text-sm font-bold text-on-surface tracking-tight">{item.label}</span>
                            </div>
                            <span className="material-symbols-outlined text-outline-variant/30 text-[18px] group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                        </button>
                    ))}
                </div>

                {/* Action Row */}
                <div className="flex gap-4">
                    <button 
                        onClick={handleSignOut}
                        className="flex-1 bg-white border border-outline-variant/10 p-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-red-50 hover:border-red-100 transition-all"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-red-500 text-[18px]">logout</span>
                        <span className="text-xs font-bold text-on-surface-variant group-hover:text-red-600 uppercase tracking-widest">Sign Out</span>
                    </button>
                    <button className="flex-1 bg-white border border-outline-variant/10 p-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary text-[18px]">dark_mode</span>
                        <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-widest">App Mode</span>
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
