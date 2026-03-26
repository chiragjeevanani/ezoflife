import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddServicePage = () => {
    const navigate = useNavigate();
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('Per Kg');

    const icons = [
        'local_laundry_service', 'dry_cleaning', 'iron', 'bed', 'checkroom', 'opacity', 'sanitizer', 'soap'
    ];
    const [selectedIcon, setSelectedIcon] = useState(icons[0]);

    const handleAdd = () => {
        // Logic to add service
        navigate('/vendor/services');
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-32 font-sans"
        >
            <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#3D5AFE] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Add Service</h1>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="space-y-6">
                        {/* Icon Selection */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1">Select Icon</p>
                            <div className="grid grid-cols-4 gap-4">
                                {icons.map((icon) => (
                                    <button 
                                        key={icon}
                                        onClick={() => setSelectedIcon(icon)}
                                        className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all ${selectedIcon === icon ? 'bg-[#3D5AFE] text-white shadow-lg shadow-blue-400/20' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}
                                    >
                                        <span className="material-symbols-outlined text-[24px]">{icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1">Service Name</p>
                            <input 
                                type="text"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                placeholder="e.g. Premium Silk Clean"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#3D5AFE]/20 transition-all placeholder:text-slate-200"
                            />
                        </div>

                        {/* Price & Unit Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1">Price (₹)</p>
                                <input 
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#3D5AFE]/20 transition-all placeholder:text-slate-200"
                                />
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1">Unit</p>
                                <select 
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#3D5AFE]/20 transition-all"
                                >
                                    <option>Per Kg</option>
                                    <option>Per Piece</option>
                                    <option>Per Set</option>
                                    <option>Per Pair</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                        <button 
                            onClick={handleAdd}
                            className="w-full py-5 rounded-[2rem] bg-[#3D5AFE] text-white font-bold text-lg shadow-xl shadow-blue-400/20 hover:bg-[#304FFE] transition-all flex items-center justify-center gap-3"
                        >
                            Create Service
                        </button>
                    </div>
                </section>

                {/* Aesthetic Info Tip */}
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#3D5AFE] text-[20px] mt-1">info</span>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                        NEW SERVICES WILL BE VISIBLE TO CUSTOMERS IMMEDIATELY AFTER CREATION. ENSURE PRICING IS ACCURATE FOR YOUR REGION.
                    </p>
                </div>
            </main>
        </motion.div>
    );
};

export default AddServicePage;
