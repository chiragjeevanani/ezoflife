import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MASTER_SERVICES } from '../../../shared/data/sharedData';
import VendorHeader from '../components/VendorHeader';

const ServiceManagement = () => {
    const navigate = useNavigate();
    const initialServices = useMemo(() => MASTER_SERVICES.map(s => ({
        ...s,
        active: true // Default all to active for now
    })), []);

    const [services, setServices] = useState(initialServices);

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
            className="bg-background text-on-background min-h-screen pb-32 font-body"
        >
            <VendorHeader title="Services" showBack={true} />

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
                {/* Header Section */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[24px]">trending_up</span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-on-surface tracking-tight">Manage Inventory</h2>
                        <p className="text-xs text-on-surface-variant font-medium leading-relaxed font-body">Set service active/inactive status and update current pricing.</p>
                    </div>
                </section>

                {/* Service List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[11px] font-bold text-on-background uppercase tracking-widest">Active Offerings</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {services.map((service, idx) => {
                            const aggregatorFee = Math.round(service.basePrice * 0.15);
                            const netEarnings = service.basePrice - aggregatorFee;

                            return (
                                <div key={service.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4 transition-all group overflow-hidden relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${service.active ? 'bg-primary/5 text-primary' : 'bg-surface-container text-outline-variant/30'}`}>
                                                <span className="material-symbols-outlined text-[20px]">{service.icon}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-on-surface tracking-tight truncate">{service.name}</h4>
                                                <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mt-1">Unit: {service.unit}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${service.active ? 'text-emerald-600' : 'text-slate-300'}`}>
                                                {service.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <div 
                                                onClick={() => toggleService(idx)}
                                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${service.active ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-slate-200 shadow-inner'}`}
                                            >
                                                <motion.div 
                                                    animate={{ x: service.active ? 26 : 4 }}
                                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1 italic opacity-60">Base Rate (₹)</label>
                                            <div className="relative group/price">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 group-focus-within/price:text-primary transition-colors">₹</span>
                                                <input 
                                                    type="number"
                                                    value={service.basePrice}
                                                    onChange={(e) => updatePrice(idx, e.target.value)}
                                                    className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-black text-slate-900 focus:bg-white focus:border-primary/20 transition-all outline-none shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 rounded-[1.5rem] p-4 flex flex-col justify-center border border-white/10 shadow-xl">
                                            <div className="flex justify-between items-center mb-1.5 opacity-60">
                                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Fee</span>
                                                <span className="text-[8px] font-black text-rose-400">-₹{aggregatorFee}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-black text-white uppercase tracking-[0.25em]">Net Yield</span>
                                                <span className="text-md font-black text-emerald-400 tabular-nums">₹{netEarnings}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Profit Margin Indicator (Phase 2 Requirement) */}
                                    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((netEarnings / service.basePrice) * 100, 100)}%` }}
                                            className="h-full bg-emerald-500 opacity-60"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </section>

                <div className="pt-8">
                    <button 
                        onClick={handleUpdate}
                        className="w-full py-5 rounded-[2rem] vendor-gradient text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-[20px]">check</span>
                        Update Services
                    </button>
                    <p className="mt-6 text-center text-[10px] font-bold text-on-background uppercase tracking-widest">Last updated: Today, 10:45 AM</p>
                </div>
            </main>
        </motion.div>
    );
};

export default ServiceManagement;
