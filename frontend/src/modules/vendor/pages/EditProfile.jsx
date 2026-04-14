import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const EditProfile = () => {
    const navigate = useNavigate();
    const initialFormData = useMemo(() => ({
        shopName: 'Pristine Cleaners',
        ownerName: 'Chirag Jeevanani',
        email: 'chirag@example.com',
        phone: '+91 98765 43210',
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    return (
        <div className="bg-[#F8FAFC] text-[#1E293B] min-h-screen pb-32 font-sans">
            <VendorHeader title="Edit Profile" showBack={true} />

            <motion.main 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto px-6 py-8"
            >
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-3xl bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                                <img 
                                    className="w-full h-full object-cover" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1G7gcHTDKYAyUsrelXEMf2w6RQyBCMwtQmyqi-a7ZPOQcRRYhe1gqMBSPUsXY8Ru16zqZWc8aMj-kve41JSGpk8PBMQSmPvwiBPyQnE-KlBH_j2zy2u_kqX_CmMYKy2-bOYW3G-i3PiCbE759VmmQXpJyL_cmmWYbnIEV-rZR8sjSexO93iameBgS7Rd19y8CQTrD4Ke46jtuCZrbKo6LTv7KtyX4330_FAPFGYdMldUrndR32fDYqOWnPk42gI1Zxydi6FSoas" 
                                    alt="Vendor" 
                                />
                            </div>
                            <button className="absolute -bottom-2 -right-2 bg-[#3D5AFE] text-white p-2 rounded-xl shadow-lg hover:bg-[#304FFE] transition-all">
                                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                            </button>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Store Avatar</p>
                    </div>

                    <div className="space-y-6">
                        {/* Input Group */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Shop Name</label>
                            <input 
                                type="text" 
                                value={formData.shopName}
                                onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Owner Name</label>
                            <input 
                                type="text" 
                                value={formData.ownerName}
                                onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                            <div className="relative">
                                <input 
                                    type="tel" 
                                    value={formData.phone}
                                    disabled
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-semibold text-slate-400 cursor-not-allowed"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-300">lock</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/vendor/profile')}
                        className="w-full py-5 rounded-2xl bg-[#3D5AFE] text-white font-bold text-lg shadow-xl shadow-[#3D5AFE]/20 flex items-center justify-center gap-3 hover:bg-[#304FFE] transition-all"
                    >
                        <span>Save Changes</span>
                        <span className="material-symbols-outlined text-[20px]">check</span>
                    </motion.button>
                </div>
            </motion.main>
        </div>
    );
};

export default EditProfile;
