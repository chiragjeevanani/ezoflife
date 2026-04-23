import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi, serviceApi } from '../../../lib/api';
import VendorHeader from '../components/VendorHeader';

const ServiceManagement = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const vendorDataRaw = localStorage.getItem('vendorData') || localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
    const vendorData = JSON.parse(vendorDataRaw);
    const vendorId = vendorData?._id || vendorData?.id || vendorData?.user?._id || vendorData?.user?.id;

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const masterRes = await serviceApi.getAll({ vendorId });
            const profileRes = await authApi.getProfile(vendorId);
            
            // Merge profile services with master if available, otherwise just use master
            const vendorServices = profileRes.shopDetails?.services || [];
            
            const merged = masterRes.map(ms => {
                const msId = String(ms._id || ms.id || '');
                const vs = vendorServices.find(v => String(v._id || v.id || '') === msId);
                
                const isGloballyActive = ms.status === 'Active';

                // If it's NOT a master service, it belongs to this vendor (filtered by backend)
                // Source of truth for vendor-owned services is the global status
                let activeState = false;
                if (ms.isMaster === false) {
                    activeState = isGloballyActive;
                } else {
                    activeState = vs ? vs.active : false;
                }

                return {
                    ...ms,
                    active: activeState,
                    basePrice: vs ? vs.basePrice : ms.basePrice
                };
            });
            
            setServices(merged);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (vendorId) {
            fetchConfig();
        } else {
            navigate('/vendor/auth');
        }
    }, [vendorId]);

    const toggleService = async (idx) => {
        const newServices = [...services];
        const target = newServices[idx];
        const newStatus = !target.active;
        
        console.log(`--- Toggling Service: ${target.name} to ${newStatus ? 'Active' : 'Inactive'} ---`);
        target.active = newStatus;
        setServices(newServices);

        // Immediate API Sync for better reliability
        const sId = target._id || target.id;
        try {
            if (target.vendorId || target.isMaster === false) {
                console.log(`Sending immediate sync for ${target.name}...`);
                await serviceApi.update(sId, { 
                    status: newStatus ? 'Active' : 'Inactive'
                });
                console.log(`Sync successful for ${target.name}`);
            }
        } catch (err) {
            console.error(`Failed to sync ${target.name}:`, err);
        }
    };

    const updatePrice = (idx, price) => {
        const newServices = [...services];
        newServices[idx].basePrice = Number(price);
        setServices(newServices);
    };

    const handleUpdate = async () => {
        console.log('--- Handle Update Triggered ---');
        if (!vendorId) {
            alert('Error: Vendor ID not found. Please log in again.');
            return;
        }

        try {
            setLoading(true);
            const profile = await authApi.getProfile(vendorId);
            
            // 1. Update Profile (Save local preferences)
            const updatedShopDetails = {
                ...(profile.shopDetails || {}),
                services: services
            };
            await authApi.updateProfile(vendorId, { shopDetails: updatedShopDetails });
            console.log('Profile updated successfully');

            // 2. Sync to Global Services collection
            // We sync ANY service that has been modified or belongs to a vendor
            const syncPromises = services.map(service => {
                const sId = service._id || service.id;
                console.log(`Checking sync for service: ${service.name} (isMaster: ${service.isMaster})`);
                
                // Allow syncing for anything that is not a strictly global master without vendorId
                // OR if it's explicitly a vendor-added service
                if (service.vendorId || service.isMaster === false) {
                    return serviceApi.update(sId, { 
                        status: service.active ? 'Active' : 'Inactive',
                        basePrice: Number(service.basePrice)
                    });
                }
                return null;
            }).filter(p => p !== null);

            if (syncPromises.length > 0) {
                console.log(`Sending ${syncPromises.length} sync requests...`);
                await Promise.all(syncPromises);
            }

            alert('Services updated successfully!');
            fetchConfig();
        } catch (error) {
            console.error('Update Services Error:', error);
            alert('Failed to update services: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };


    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-background text-on-background min-h-screen pb-32 font-body"
        >

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
                        <button 
                            onClick={() => navigate('/vendor/services/add')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            <span className="text-[10px] font-black uppercase tracking-wider">Add New</span>
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {services.map((service, idx) => {
                            const aggregatorFee = Math.round(service.basePrice * 0.15);
                            const netEarnings = service.basePrice - aggregatorFee;
                            const isPending = service.approvalStatus === 'Pending';

                            return (
                                <div key={service.id || service._id} className={`bg-white p-6 rounded-[2.5rem] border ${isPending ? 'border-amber-100 bg-amber-50/10' : 'border-slate-100'} shadow-sm flex flex-col gap-4 transition-all group overflow-hidden relative`}>
                                    {isPending && (
                                        <div className="absolute top-0 left-0 w-full px-4 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest text-center">
                                            Waiting for Admin Approval
                                        </div>
                                    )}
                                    <div className={`flex items-center justify-between ${isPending ? 'pt-4' : ''}`}>
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${service.active && !isPending ? 'bg-primary/5 text-primary' : 'bg-surface-container text-outline-variant/30'}`}>
                                                <span className="material-symbols-outlined text-[20px]">{service.icon}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-on-surface tracking-tight truncate">{service.name}</h4>
                                                <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mt-1">Unit: {service.unit}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${isPending ? 'text-amber-500' : (service.active ? 'text-emerald-600' : 'text-slate-300')}`}>
                                                {isPending ? 'Pending' : (service.active ? 'Active' : 'Inactive')}
                                            </span>
                                            <div 
                                                onClick={() => !isPending && toggleService(idx)}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isPending ? 'bg-slate-100 opacity-50 cursor-not-allowed' : (service.active ? 'bg-emerald-500 shadow-lg shadow-emerald-200 cursor-pointer' : 'bg-slate-200 shadow-inner cursor-pointer')}`}
                                            >
                                                <motion.div 
                                                    animate={{ x: (service.active && !isPending) ? 26 : 4 }}
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
