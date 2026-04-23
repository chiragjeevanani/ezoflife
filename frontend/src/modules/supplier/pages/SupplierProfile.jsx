import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SupplierProfile = () => {
    const navigate = useNavigate();
    const userRaw = localStorage.getItem('supplierData') || localStorage.getItem('userData') || localStorage.getItem('user') || '{}';
    const user = JSON.parse(userRaw);

    const handleOptionClick = (label) => {
        if (label === 'Logout Session') {
            localStorage.clear();
            navigate('/supplier/auth');
        } else {
            // Placeholder for other options
            alert(`${label} settings are coming soon.`);
        }
    };

    const profileOptions = useMemo(() => [
        { icon: 'business_center', label: 'Business Details', sub: `Tax ID: ${user.supplierDetails?.gst || 'GSTIN-88229'}`, color: 'bg-slate-900' },
        { icon: 'verified_user', label: 'Identity Verification', sub: 'Completed: Nov 2025', color: 'bg-emerald-500' },
        { icon: 'stars', label: 'Supplier Rating', sub: 'Platinum Partner (4.9/5)', color: 'bg-amber-400' },
        { icon: 'help', label: 'Help & Support', sub: '24/7 Dedicated Assistance', color: 'bg-indigo-500' },
        { icon: 'logout', label: 'Logout Session', sub: `Account: SZ-SUPP-${(user._id || '42').slice(-2).toUpperCase()}`, color: 'bg-slate-100', iconColor: 'text-slate-900' }
    ], [user]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-40">
            {/* Header with Back Button */}
            <header className="px-6 pt-6 flex items-center justify-between z-10 relative">
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 border border-black/5"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </motion.button>
            </header>

            <main className="px-6 relative">
                {/* Identity Section */}
                <section className="flex flex-col items-center text-center mt-4 mb-12">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden p-1 bg-white">
                            <div className="w-full h-full rounded-full overflow-hidden">
                                <img 
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300" 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </div>
                        <motion.div 
                            whileTap={{ scale: 0.9 }}
                            className="absolute bottom-1 right-1 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </motion.div>
                    </div>
                    
                    <h2 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">
                        {user.displayName || 'Vikram Khullar'}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">
                        Authorized Materials Lead
                    </p>
                </section>

                {/* Menu List */}
                <section className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 ml-4">Enterprise Account</h3>
                    <div className="space-y-4">
                        {profileOptions.map((opt, i) => (
                            <motion.div
                                key={opt.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleOptionClick(opt.label)}
                                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl ${opt.color} flex items-center justify-center ${opt.iconColor || 'text-white'} shadow-lg shadow-black/5`}>
                                        <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-black text-slate-900 leading-none mb-1.5">{opt.label}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{opt.sub}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-200 text-lg group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SupplierProfile;
