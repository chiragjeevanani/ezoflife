import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi, BASE_URL } from '../../../lib/api';

const RejectedServices = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [masterServices, setMasterServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user._id;

            // Fetch User Profile for latest service statuses
            const profile = await authApi.getProfile(userId);
            
            // Fetch Master Services for names/icons
            const msRes = await fetch(`${BASE_URL}/master-services`);
            const msData = await msRes.json();
            setMasterServices(msData);

            // Filter rejected services
            const rejected = (profile.shopDetails?.services || []).filter(s => s.status === 'rejected');
            setServices(rejected);
        } catch (err) {
            console.error('Fetch rejected services error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getServiceDetails = (id) => {
        const master = masterServices.find(m => (m._id || m.id) === id);
        return master || { name: `Service ${id.slice(-4)}`, icon: 'settings' };
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-40 font-sans">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md p-6 border-b border-black/5 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-headline font-black text-lg tracking-tighter uppercase">Rejected Requests</h1>
                <div className="w-10"></div>
            </header>

            <main className="pt-28 px-6 max-w-md mx-auto w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Catalog...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-slate-900 mb-2 uppercase">All Clear!</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No rejected service requests found. Your catalog is healthy.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-start gap-4">
                            <span className="material-symbols-outlined text-rose-500">info</span>
                            <p className="text-[10px] font-bold text-rose-950 leading-relaxed uppercase tracking-widest opacity-80">
                                The following services were rejected by Admin. Please review the reasons and contact support to re-apply.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {services.map((svc, idx) => {
                                    const details = getServiceDetails(svc.id);
                                    return (
                                        <motion.div 
                                            key={svc.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-2xl">{details.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">{details.name}</h4>
                                                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest italic">Rejected</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-slate-900 tabular-nums">₹{svc.vendorRate}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Rate</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-50 p-5 rounded-2xl border border-black/5">
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Rejection Reason</p>
                                                <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic uppercase tracking-tight">
                                                    "{svc.rejectionReason || 'Criteria for this service category not met at this location.'}"
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RejectedServices;
