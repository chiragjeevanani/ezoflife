import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../../../lib/api';
import toast from 'react-hot-toast';

const RiderSimulation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderApi.getById(id);
                setOrder(data);
            } catch (err) {
                toast.error('Order not found');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleVerify = async () => {
        if (otp.length !== 4) return toast.error('Enter 4-digit OTP');
        try {
            setVerifying(true);
            // Using the verifyPickupOtp endpoint from orderApi
            await orderApi.verifyPickupOtp(order._id, otp);
            toast.success('Pickup Successful! Order status updated.');
            setTimeout(() => navigate('/user/home'), 2000); // Back to home for testing
        } catch (err) {
            toast.error(err.message || 'Invalid OTP');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest opacity-30">Loading Simulator...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center font-body">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white text-slate-900 rounded-[3rem] p-10 shadow-2xl space-y-8"
            >
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">electric_moped</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Rider Simulator</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mock Shiprocket Handover</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
                        <span className="text-[11px] font-black text-slate-900">{order?.orderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                        <span className="text-[11px] font-black text-slate-900">{order?.customer?.displayName}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Enter OTP from Customer</p>
                        <div className="flex justify-center gap-3">
                            {[0, 1, 2, 3].map(i => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength="1"
                                    value={otp[i] || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val && !/^\d+$/.test(val)) return;
                                        const newOtp = otp.split('');
                                        newOtp[i] = val;
                                        setOtp(newOtp.join(''));
                                        if (val && i < 3) {
                                            const next = e.target.nextElementSibling;
                                            if (next) next.focus();
                                        }
                                    }}
                                    className="w-12 h-14 bg-white border-2 border-slate-200 rounded-xl text-center text-xl font-black text-slate-900 focus:border-primary outline-none transition-all"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleVerify}
                    disabled={verifying || otp.length < 4}
                    className="w-full py-5 rounded-[1.5rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all disabled:opacity-50"
                >
                    {verifying ? 'Verifying...' : 'Confirm Pickup'}
                </button>

                <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
                    This is a simulation page for development testing. In production, this would be the Shiprocket Rider App.
                </p>
            </motion.div>
        </div>
    );
};

export default RiderSimulation;
