import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RiderWallet = () => {
    const navigate = useNavigate();

    const transactions = useMemo(() => [
        { id: 'TX-9921', order: 'SZ-8821', type: 'Delivery Incentive', amount: 45, time: '2h ago', status: 'Success' },
        { id: 'TX-9918', order: 'SZ-7712', type: 'Pickup Incentive', amount: 25, time: '4h ago', status: 'Success' },
        { id: 'TX-9890', order: 'Payout', type: 'Weekly Settlement', amount: -6200, time: 'Yesterday', status: 'In-Transit' }
    ], []);

    return (
        <div className="bg-slate-50 min-h-screen pb-40 font-sans">
            {/* Wallet Header */}
            <header className="bg-slate-900 px-6 pt-12 pb-16 rounded-b-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Available to Withdraw</p>
                        <h1 className="text-4xl font-black tracking-tighter tabular-nums flex items-baseline gap-2">
                            ₹842
                            <span className="text-sm opacity-40 font-bold uppercase tracking-widest italic">INR</span>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button className="flex-1 py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
                        Withdraw Earnings
                    </button>
                    <button className="flex-1 py-4 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/20 active:scale-95 transition-all">
                        Earning Policy
                    </button>
                </div>
            </header>

            <main className="px-6 -mt-8 space-y-8 max-w-xl mx-auto relative z-20">
                {/* Performance Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <span className="material-symbols-outlined text-emerald-600 mb-2">trending_up</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Forecast</p>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">₹12.4K</h4>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <span className="material-symbols-outlined text-blue-600 mb-2">verified</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Payouts</p>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight italic">₹1.2K</h4>
                    </div>
                </div>

                {/* Transaction Ledger */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Ledger</h2>
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest underline decoration-emerald-500 underline-offset-4">View All</span>
                    </div>

                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <div 
                                key={tx.id} 
                                className="bg-white/80 backdrop-blur-sm p-5 rounded-[2rem] border border-slate-50 flex items-center justify-between shadow-sm transition-all hover:translate-x-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        <span className="material-symbols-outlined text-sm">
                                            {tx.amount > 0 ? 'add_box' : 'eject'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{tx.type}</h4>
                                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-none">{tx.time} · {tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-base font-black tabular-nums tracking-tighter ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </p>
                                    <p className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] mt-1 italic">{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Insight */}
                <div className="p-6 bg-slate-900 rounded-[2.5rem] border-t-4 border-emerald-500 text-center">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Pro Fleet Tip</p>
                    <p className="text-[11px] text-white opacity-60 font-bold uppercase tracking-widest leading-relaxed">
                        Peak hour deliveries (6 PM - 9 PM) <br/> earn 1.5x Multiplier in your Current Zone.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RiderWallet;
