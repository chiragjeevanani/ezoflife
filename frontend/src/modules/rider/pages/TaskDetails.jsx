import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useNotificationStore from '../../../shared/stores/notificationStore';

const TaskDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const addNotification = useNotificationStore((state) => state.addNotification);

    const [step, setStep] = useState(1); // 1: Navigation, 2: Verification, 3: Handoff
    const [checkedItems, setCheckedItems] = useState([]);
    const [photoUploaded, setPhotoUploaded] = useState(false);

    const task = useMemo(() => ({
        id: id || 'SZ-8821',
        type: 'Pickup',
        source: 'Heritage Cleaners',
        address: 'HSR Layout, Sector 7, Plot 42',
        instructions: 'Call shop manager at gate. Fragile silk saree in the batch.',
        items: [
            { id: 1, name: 'Premium Saree', count: 2 },
            { id: 2, name: 'Daily Wear Shirt', count: 8 },
            { id: 3, name: 'Trouser', count: 2 }
        ],
        contact: '+91 98822 11022'
    }), [id]);

    const handoffCode = useMemo(() => ['4', '2', '8', '1'], []);

    const handleToggleCheck = (itemId) => {
        setCheckedItems(prev => 
            prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]
        );
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-sans relative overflow-x-hidden">
            {/* Context Header */}
            <header className="bg-white px-6 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
                <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 rounded-full">
                    <span className="material-symbols-outlined text-slate-400">arrow_back</span>
                </button>
                <div className="text-center">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Trip ID: {task.id}</h1>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-sm text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        {task.type} Manifest
                    </span>
                </div>
                <button className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                    <span className="material-symbols-outlined text-[18px]">phone</span>
                </button>
            </header>

            <main className="px-6 py-8 space-y-8 max-w-xl mx-auto">
                {/* Step Indicator (Phase 2 Requirement) */}
                <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">{task.type === 'Pickup' ? 'Step 1 of 4' : 'Step 4 of 4'}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">Logistics Handshake</span>
                </div>
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${
                            (task.type === 'Pickup' && s === 1) || (task.type === 'Delivery' && s === 4) ? 'bg-emerald-600' : 
                            (task.type === 'Pickup' && s > 1) ? 'bg-slate-200' : 'bg-emerald-600/30'
                        }`} />
                    ))}
                </div>


                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.section 
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Location & Logistics</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-emerald-600 shadow-sm">
                                            <span className="material-symbols-outlined">distance</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-900 tracking-tight italic uppercase">{task.source}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-relaxed">
                                                {task.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-amber-600 text-sm">sticky_note_2</span>
                                            <span className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Operator Memo</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-amber-700/80 leading-relaxed italic uppercase">
                                            "{task.instructions}"
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full mt-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                                    <span className="material-symbols-outlined text-base">directions</span>
                                    Navigate with Maps
                                </button>
                            </div>
                            <button 
                                onClick={() => {
                                    addNotification('rider_assigned', 'Rider Arrived', 'Rider is at the pickup location. Preparing manifest verification.', 'user');
                                    addNotification('rider_assigned', 'Rider at Shop', 'Rider has arrived for order #SZ-8821 pickup.', 'vendor');
                                    setStep(2);
                                }}
                                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
                            >
                                Arrived at Location
                            </button>
                        </motion.section>
                    )}

                    {step === 2 && (
                        <motion.section 
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Content Verification</h3>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tabular-nums">
                                        {checkedItems.length}/{task.items.length} Checked
                                    </span>
                                </div>
                                
                                <div className="divide-y divide-slate-50">
                                    {task.items.map(item => (
                                        <div 
                                            key={item.id} 
                                            className="py-4 flex items-center justify-between"
                                            onClick={() => handleToggleCheck(item.id)}
                                        >
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{item.name}</h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.count} Units to confirm</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${checkedItems.includes(item.id) ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-200' : 'border-slate-100 bg-slate-50'}`}>
                                                {checkedItems.includes(item.id) && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Photo Verification Engine */}
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Mandatory Manifest Photo</p>
                                    <div 
                                        onClick={() => setPhotoUploaded(true)}
                                        className={`w-full aspect-[4/3] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${photoUploaded ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
                                    >
                                        <span className={`material-symbols-outlined text-4xl mb-4 ${photoUploaded ? 'text-emerald-600' : 'text-slate-300 animate-pulse'}`}>photo_camera</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {photoUploaded ? 'Photo Captured (Linked)' : 'Launch Cam-Scanner'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                disabled={checkedItems.length !== task.items.length || !photoUploaded}
                                onClick={() => {
                                    addNotification('pickup_complete', 'Pickup Logged', 'Rider has successfully picked up your laundry bag.', 'user');
                                    addNotification('pickup_complete', 'In-Transit to Shop', 'Order #SZ-8821 picked up and in-transit to your shop.', 'vendor');
                                    setStep(3);
                                }}
                                className={`w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all ${
                                    checkedItems.length === task.items.length && photoUploaded 
                                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 active:scale-95' 
                                    : 'bg-white border border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                                }`}
                            >
                                Verify & Lock Manifest
                            </button>
                        </motion.section>
                    )}

                    {step === 3 && (
                        <motion.section 
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-slate-900 p-8 rounded-[3rem] text-center text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <span className="material-symbols-outlined text-5xl text-emerald-500 mb-6 font-thin">key</span>
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-2">Handoff Protocol</h3>
                                <p className="text-[10px] opacity-60 font-bold uppercase tracking-[0.15em] mb-10 leading-relaxed italic">
                                    Operator must enter this code <br/> to confirm chain of custody.
                                </p>

                                <div className="flex justify-center gap-3 mb-10">
                                    {handoffCode.map((digit, i) => (
                                        <div key={i} className="w-14 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-2xl font-black tabular-nums">
                                            {digit}
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl">
                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Security Token Active</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    addNotification('at_shop', 'Landed at Shop', 'Order #SZ-8821 reached Heritage Cleaners. Processing starting soon.', 'user');
                                    addNotification('at_shop', 'Order Handover Complete', 'Rider delivered order #SZ-8821 to your facility.', 'vendor');
                                    navigate('/rider/dashboard');
                                }}
                                className="w-full py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all"
                            >
                                Finish & Sync Trip
                            </button>

                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default TaskDetails;
