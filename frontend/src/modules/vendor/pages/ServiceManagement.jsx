import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MASTER_SERVICES } from '../../../shared/data/sharedData';

const ServiceManagement = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState(
        MASTER_SERVICES.map(s => ({
            ...s,
            active: true // Default all to active for now
        }))
    );

    const toggleService = (idx) => {
        const newServices = [...services];
        newServices[idx].active = !newServices[idx].active;
        setServices(newServices);
    };

    const updatePrice = (idx, price) => {
        const newServices = [...services];
        newServices[idx].basePrice = price;
        setServices(newServices);
    };

    const handleUpdate = () => {
        // In a real app, save to backend
        localStorage.setItem('vendor_services_V001', JSON.stringify(services));
        alert('Services updated successfully!');
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
                    <h1 className="text-lg font-bold tracking-tight">Services</h1>
                </div>
                <button 
                    onClick={() => navigate('/vendor/services/add')}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#3D5AFE] text-white shadow-lg shadow-blue-400/20 hover:bg-[#304FFE] transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
                {/* Header Section */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#3D5AFE]">
                        <span className="material-symbols-outlined text-[24px]">trending_up</span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Manage Inventory</h2>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed font-body">Set service active/inactive status and update current pricing.</p>
                    </div>
                </section>

                {/* Service List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Offerings</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {services.map((service, idx) => (
                            <div key={service.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between gap-6 transition-all group">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${service.active ? 'bg-blue-50 text-[#3D5AFE]' : 'bg-slate-50 text-slate-300'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{service.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 tracking-tight truncate">{service.name}</h4>
                                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{service.unit}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="relative group/price">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 group-hover/price:text-[#3D5AFE] transition-colors">₹</span>
                                        <input 
                                            type="text"
                                            value={service.basePrice}
                                            onChange={(e) => updatePrice(idx, e.target.value)}
                                            className="w-20 pl-6 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-[#3D5AFE]/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div 
                                        onClick={() => toggleService(idx)}
                                        className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${service.active ? 'bg-green-100' : 'bg-slate-100'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full shadow-sm transition-all ${service.active ? 'right-0.5 bg-green-500' : 'left-0.5 bg-slate-300'}`}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="pt-8">
                    <button 
                        onClick={handleUpdate}
                        className="w-full py-5 rounded-[2rem] bg-[#3D5AFE] text-white font-bold text-lg shadow-xl shadow-blue-400/20 hover:bg-[#304FFE] transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                        Update Services
                    </button>
                    <p className="mt-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-60">Last updated: Today, 10:45 AM</p>
                </div>
            </main>
        </motion.div>
    );
};

export default ServiceManagement;
