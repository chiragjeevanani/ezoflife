import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ShopDetails = () => {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#F8FAFC] text-[#1E293B] min-h-screen font-sans"
        >
            {/* Header */}
            <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Shop Profile</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                    <img 
                        src="https://lh3.googleusercontent.com/a/ACg8ocL_X_X_X_X_X_X_X_X_X_X_X=s96-c" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">
                {/* Compact Stepper */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3D5AFE] text-white flex items-center justify-center text-sm font-bold">1</div>
                        <span className="text-sm font-bold text-[#3D5AFE]">Shop Details</span>
                    </div>
                    <div className="flex-1 mx-4 h-[2px] bg-slate-200 relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '50%' }}
                            className="absolute inset-y-0 bg-[#3D5AFE]"
                        />
                    </div>
                    <div className="flex items-center gap-3 opacity-40">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">2</div>
                        <span className="text-sm font-medium text-slate-500">Verification</span>
                    </div>
                </div>

                {/* Form Progress Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
                    <section className="space-y-6">
                        {/* Shop Name */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Shop Name</label>
                            <input 
                                type="text"
                                placeholder="e.g. Pristine Cleaners"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:border-[#3D5AFE]/30 focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        {/* GST Number */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">GST Number (Optional)</label>
                            <input 
                                type="text"
                                placeholder="15-digit GSTIN"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:border-[#3D5AFE]/30 focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        {/* Address Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Store Location</label>
                                <button className="text-[#3D5AFE] text-[11px] font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">my_location</span>
                                    Current
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="w-full h-48 rounded-2xl bg-slate-200 overflow-hidden relative border border-slate-100">
                                    <img 
                                        src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+3D5AFE(-0.1278,51.5074)/-0.1278,51.5074,13/600x400?access_token=YOUR_MAPBOX_TOKEN_FALLBACK" 
                                        alt="Map"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                                </div>
                                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#3D5AFE]/10 rounded-full flex items-center justify-center text-[#3D5AFE]">
                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">241 Baker Street, London</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Click to refine location</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Services Offered</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 1, title: 'Wash & Fold', icon: 'local_laundry_service' },
                                { id: 2, title: 'Dry Cleaning', icon: 'dry_cleaning' },
                                { id: 3, title: 'Steam Press', icon: 'iron' },
                                { id: 4, title: 'Shoe Care', icon: 'checkroom' }
                            ].map((service) => (
                                <button 
                                    key={service.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${service.id === 1 ? 'bg-[#3D5AFE]/5 border-[#3D5AFE]/20 text-[#3D5AFE]' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${service.id === 1 ? 'text-[#3D5AFE]' : 'text-slate-400'}`}>
                                        {service.icon}
                                    </span>
                                    <span className="text-xs font-bold">{service.title}</span>
                                    {service.id === 1 && <span className="material-symbols-outlined text-[14px] ml-auto font-bold">check_circle</span>}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer Action */}
                <div className="space-y-4">
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/vendor/upload-documents')}
                        className="w-full py-5 rounded-2xl bg-[#3D5AFE] text-white font-bold text-lg shadow-xl shadow-[#3D5AFE]/20 flex items-center justify-center gap-3 hover:bg-[#304FFE] transition-all"
                    >
                        <span>Next Step</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </motion.button>
                    <p className="text-center text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                        Standard verification: 24h
                    </p>
                </div>
            </main>
        </motion.div>
    );
};

export default ShopDetails;
