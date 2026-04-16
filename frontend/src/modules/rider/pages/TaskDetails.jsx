import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderApi } from '../../../lib/api';

const TaskDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const riderData = JSON.parse(localStorage.getItem('riderData') || '{}');
    const riderId = riderData.id || riderData._id || localStorage.getItem('userId');

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1); 
    const [checkedItems, setCheckedItems] = useState([]);
    const [photoUploaded, setPhotoUploaded] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await orderApi.getById(id);
                setTask(data);
            } catch (err) {
                console.error('Error fetching task details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleAccept = async () => {
        try {
            setLoading(true);
            await orderApi.acceptTask(task._id, riderId);
            const data = await orderApi.getById(id);
            setTask(data);
        } catch (err) {
            alert('Accept Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCheck = (itemId) => {
        setCheckedItems(prev => 
            prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]
        );
    };

    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = [useRef(), useRef(), useRef(), useRef()];

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length < 4) return;

        try {
            setLoading(true);
            if (task.status === 'Out for Delivery') {
                await orderApi.verifyDeliveryOtp(task._id, fullOtp);
            } else {
                await orderApi.verifyPickupOtp(task._id, fullOtp);
            }
            navigate('/rider/dashboard');
        } catch (err) {
            alert('Verification Failed: ' + (err.message || 'Incorrect OTP'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Manifest...</p>
        </div>
    );

    if (!task || !task._id) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">search_off</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Task Not Found</p>
            <p className="text-[8px] text-slate-300 mt-2 uppercase tracking-widest">{id}</p>
            <button onClick={() => navigate(-1)} className="mt-6 text-emerald-600 font-black text-[10px] uppercase tracking-widest">Return to Dashboard</button>
        </div>
    );

    const isAcceptedByMe = task.rider === riderId || (task.rider?.id || task.rider?._id) === riderId;

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-sans relative overflow-x-hidden">
            {/* Context Header */}
            <header className="bg-white px-6 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
                <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 rounded-full">
                    <span className="material-symbols-outlined text-slate-400">arrow_back</span>
                </button>
                <div className="text-center">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Trip ID: {task.orderId || task._id.slice(-6).toUpperCase()}</h1>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-sm text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        {task.status === 'Picked Up' ? 'Delivery' : 'Pickup'} Manifest
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
                                            <p className="text-sm font-black text-slate-900 tracking-tight italic uppercase">{task.customer?.displayName}</p>
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

                            {!isAcceptedByMe ? (
                                <button 
                                    onClick={handleAccept}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Accept Task Now
                                </button>
                            ) : (
                                <button 
                                    onClick={() => {
                                        setStep(2);
                                    }}
                                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
                                >
                                    Arrived at Location
                                </button>
                            )}
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
                                    {task.items?.map((item, idx) => {
                                        const itemId = item._id || idx;
                                        const isKg = item.unit === 'kg';
                                        const targetCount = isKg ? item.clothCount : item.quantity;
                                        const unitName = isKg ? 'Clothes' : 'Units';

                                        return (
                                            <div 
                                                key={itemId} 
                                                className="py-4 flex items-center justify-between"
                                                onClick={() => handleToggleCheck(itemId)}
                                            >
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{item.name}</h4>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {targetCount} {unitName} to confirm {isKg && `(${item.quantity} kg)`}
                                                    </p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${checkedItems.includes(itemId) ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-200' : 'border-slate-100 bg-slate-50'}`}>
                                                    {checkedItems.includes(itemId) && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
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
                                    Ask customer for the secret code <br/> to confirm chain of custody.
                                </p>

                                <div className="flex justify-center gap-3 mb-10">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={otpRefs[i]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            className="w-14 h-16 bg-white/10 border border-white/20 rounded-2xl text-center text-2xl font-black tabular-nums outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    ))}
                                </div>

                                <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl">
                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Awaiting Security Token</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleVerifyOtp}
                                disabled={otp.join('').length < 4 || loading}
                                className="w-full py-5 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                                {loading ? 'Securing...' : 'Verify OTP & Complete Pickup'}
                            </button>

                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default TaskDetails;
