import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi, serviceApi } from '../../../lib/api';
import VendorHeader from '../components/VendorHeader';

const ServiceManagement = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    // Extremely Robust Identity Extraction
    const getVendorId = () => {
        const keys = ['user', 'vendorData', 'userData', 'auth_user', 'vendor'];
        for (const key of keys) {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) continue;
                const data = JSON.parse(raw);
                const id = data?._id || data?.id || data?.user?._id || data?.user?.id || data?.uid;
                if (id) return id;
            } catch (e) { continue; }
        }
        return null;
    };

    const vendorId = getVendorId();

    const fetchConfig = async () => {
        if (!vendorId) return;
        try {
            setLoading(true);
            const masterRes = await serviceApi.getAll({ vendorId }); // These are custom services with vendorId
            const profileRes = await authApi.getProfile(vendorId);
            const registrationServices = profileRes.shopDetails?.services || [];
            
            // Filter registration services to only show those that are already APPROVED
            // (As per your request: Registration wali admin approve karega tabhi dikhengi)
            const approvedRegistrationServices = registrationServices.filter(s => s.status === 'approved');
            
            const mergedMap = new Map();

            // 1. Process Registration Services (Lowest priority or initial state)
            approvedRegistrationServices.forEach(s => {
                const id = s.id || s._id;
                mergedMap.set(id, {
                    ...s,
                    id: id,
                    _id: id,
                    isFromRegistration: true,
                    approvalStatus: 'Approved',
                    active: s.active ?? true,
                    basePrice: s.basePrice || s.vendorRate || 0
                });
            });

            // 2. Process Master Services (Higher priority - real database items)
            masterRes.forEach(s => {
                const id = s._id || s.id;
                mergedMap.set(id, {
                    ...s,
                    id: id,
                    _id: id,
                    isFromRegistration: false,
                    approvalStatus: s.approvalStatus || 'Pending',
                    active: s.status === 'Active',
                    basePrice: s.basePrice || 0
                });
            });
            
            setServices(Array.from(mergedMap.values()));
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'My Services | Spinzyt';
        if (vendorId) {
            fetchConfig();
        } else {
            console.error('⚠️ [DEBUG] No Vendor ID found in any storage key.');
        }
    }, [vendorId]);

    const toggleService = async (idx) => {
        const newServices = [...services];
        const target = newServices[idx];
        
        // SECURITY: Block toggle if not approved
        if (target.approvalStatus !== 'Approved') {
            alert('This service is waiting for Admin approval. You cannot activate it yet.');
            return;
        }

        const newStatus = !target.active;
        console.log(`--- Toggling Service: ${target.name} to ${newStatus ? 'Active' : 'Inactive'} ---`);
        target.active = newStatus;
        setServices(newServices);

        // Immediate API Sync for better reliability
        const sId = target._id || target.id;
        try {
            // Only sync custom services via the main serviceApi
            if (!target.isFromRegistration) {
                await serviceApi.update(sId, { 
                    status: newStatus ? 'Active' : 'Inactive'
                });
            } else {
                // Registration services are synced via profile update in handleUpdate
                console.log('Registration service state updated locally.');
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
            
            // Map services to match the User model schema (vendorRate, status, etc.)
            const mappedServicesForProfile = services.map(s => ({
                id: s._id || s.id,
                name: s.name,
                vendorRate: Number(s.basePrice),
                adminRate: Number(s.basePrice), // Fallback
                status: s.approvalStatus === 'Approved' ? 'approved' : 'pending',
                icon: s.icon,
                normalTime: s.normalTime || '',
                expressTime: s.expressTime || ''
            }));

            // 1. Update Profile (Save local preferences)
            const updatedShopDetails = {
                ...(profile.shopDetails || {}),
                services: mappedServicesForProfile
            };
            await authApi.updateProfile(vendorId, { shopDetails: updatedShopDetails });
            console.log('Profile updated successfully');

            // 2. Sync to Global Services collection
            const syncPromises = services.map(service => {
                const sId = service._id || service.id;
                
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

            <main className="max-w-xl mx-auto px-6 pt-10 space-y-12">
                {/* PAGE HEADER */}
                <header className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase leading-none">My Services.</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Shop Command Center</p>
                </header>
                {/* 1. OPERATIONAL HUB (WALK-IN, SUPPLIES, LABOR) */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Hub</h3>
                        <span className="material-symbols-outlined text-slate-300 text-sm">hub</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* WALK-IN ORDER HUB */}
                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            onClick={() => navigate('/vendor/walk-in')}
                            className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/20 transition-all duration-700"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Manual Entry Hub</p>
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Walk-In Order Hub</h2>
                                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-[200px]">Create orders for customers at your shop. No pickup rider needed.</p>
                                </div>
                                <div className="w-16 h-16 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-3xl">add_shopping_cart</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/vendor/material-request')}
                                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-primary/20 transition-all group"
                            >
                                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Submit Supplies</span>
                            </motion.button>
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/vendor/labor-request')}
                                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-indigo-100 transition-all group"
                            >
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">engineering</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Request Labor</span>
                            </motion.button>
                        </div>
                    </div>
                </section>

                {/* 2. SERVICE INVENTORY & RATE CARD */}
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
                                      <div className="space-y-4">
                        {services.map((service, idx) => {
                            const aggregatorFee = Math.round(service.basePrice * 0.15);
                            const netEarnings = service.basePrice - aggregatorFee;
                            const isPending = service.approvalStatus === 'Pending';

                            return (
                                <div key={service.id || service._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${service.active && !isPending ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-300'}`}>
                                                <span className="material-symbols-outlined text-xl">{service.icon || 'local_laundry_service'}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 tracking-tight">{service.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {isPending ? (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-lg">
                                                            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                                                            <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest leading-none">Waiting for Admin Approval</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${service.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{service.active ? 'Accepting Orders' : 'Offline'}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            onClick={() => !isPending && toggleService(idx)}
                                            className={`w-12 h-6 rounded-full relative transition-all duration-300 shadow-inner ${isPending ? 'bg-slate-100 cursor-not-allowed' : (service.active ? 'bg-emerald-500' : 'bg-slate-200 cursor-pointer')}`}
                                        >
                                            <motion.div 
                                                animate={{ x: (service.active && !isPending) ? 26 : 4 }}
                                                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Rate (₹)</p>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
                                                <input 
                                                    type="number"
                                                    value={service.basePrice || 0}
                                                    onChange={(e) => updatePrice(idx, e.target.value)}
                                                    className="w-full pl-8 pr-4 py-3 bg-slate-50 rounded-2xl text-[13px] font-black text-slate-900 focus:bg-white border-2 border-transparent focus:border-primary/20 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 rounded-2xl p-4 flex flex-col justify-center shadow-lg">
                                            <div className="flex justify-between items-center opacity-40">
                                                <span className="text-[7px] font-black text-white uppercase tracking-widest">Net Yield</span>
                                                <span className="text-[7px] font-black text-emerald-400">85%</span>
                                            </div>
                                            <p className="text-lg font-black text-emerald-400 tracking-tighter leading-none mt-1">₹{netEarnings}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <button 
                        onClick={handleUpdate}
                        className="w-full py-5 rounded-3xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-lg">sync_saved_locally</span>
                        Update Rate Card
                    </button>
                </section>

                {/* 3. PROMOTION MANAGER */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marketing & Offers</h3>
                        <span className="material-symbols-outlined text-slate-300 text-sm">campaign</span>
                    </div>

                    <motion.div 
                        whileHover={{ scale: 1.01 }}
                        onClick={() => navigate('/vendor/promotions')}
                        className="bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-950/20 relative overflow-hidden cursor-pointer border border-white/5"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center text-white border border-white/10 backdrop-blur-md">
                                <span className="material-symbols-outlined text-3xl">celebration</span>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-white tracking-tight uppercase">Promotion Manager</h2>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Active Offers • Manage Now</p>
                            </div>
                            <div className="ml-auto">
                                <span className="material-symbols-outlined text-white/40">chevron_right</span>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] pt-10">Spinzyt Partner Hub v2.0</p>
            </main>
        </motion.div>
    );
};

export default ServiceManagement;
