import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Earnings = () => {
    const navigate = useNavigate();
    const [performanceFilter, setPerformanceFilter] = useState('Weekly');

    const performanceData = {
        'Daily': { labels: ['18', '19', '20', '21', '22', '23', '24'], values: [65, 40, 85, 30, 95, 60, 45], activeIdx: 6 },
        'Weekly': { labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], values: [45, 65, 55, 90, 45, 75, 30], activeIdx: 3 },
        'Monthly': { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], values: [60, 80, 55, 95, 70, 85], activeIdx: 5 }
    };

    const currentData = performanceData[performanceFilter];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-32 font-sans"
        >
            <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#3D5AFE] transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Earnings</h1>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
                    {['Daily', 'Weekly', 'Monthly'].map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setPerformanceFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${performanceFilter === filter ? 'bg-white text-[#3D5AFE] shadow-sm' : 'text-slate-400'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#3D5AFE] p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-400/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Earnings</p>
                        <h2 className="text-4xl font-bold tracking-tighter">₹12,840.40</h2>
                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Last Payout</p>
                                    <p className="text-sm font-bold">Mar 23 · ₹2,450</p>
                                </div>
                                <button onClick={() => navigate('/vendor/payouts')} className="px-5 py-2.5 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                                    History
                                </button>
                            </div>
                            <button 
                                onClick={() => navigate('/vendor/payouts')}
                                className="w-full py-4 bg-white text-[#3D5AFE] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Request Payout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trend Chart */}
                <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-10">
                    <div className="flex justify-between items-start px-2">
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-800 tracking-tight">Performance Trend</h3>
                            <p className="text-xs text-slate-400 font-medium font-body">Revenue growth analysis</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#3D5AFE]">
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                            <span className="text-lg font-black tracking-tight">+18.2%</span>
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-48 px-2">
                        {currentData.values.map((h, i) => (
                            <div key={i} className="flex flex-col items-center grow gap-4 group cursor-pointer h-full justify-end">
                                <div className="relative w-full max-w-[32px] overflow-hidden rounded-full h-full bg-slate-50">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${i === currentData.activeIdx ? 'vendor-gradient shadow-lg shadow-blue-400/30' : 'bg-[#3D5AFE]/5 group-hover:bg-[#3D5AFE]/10'}`}
                                    />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${i === currentData.activeIdx ? 'text-[#3D5AFE]' : 'text-slate-300'}`}>
                                    {currentData.labels[i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Payouts */}
                <section className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Payout History</h3>
                    <div className="space-y-3">
                        {[
                            { id: '#SETT-9821', date: 'Mar 23', amt: '₹2,450' },
                            { id: '#SETT-9740', date: 'Mar 16', amt: '₹1,820' },
                            { id: '#SETT-9655', date: 'Mar 09', amt: '₹3,105' },
                        ].map((payout, i) => (
                            <div key={payout.id} className="bg-white p-5 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm transition-all hover:bg-slate-50 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-green-500 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">payments</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800">{payout.id}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{payout.date}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-slate-700 tracking-tight">{payout.amt}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </motion.div>
    );
};

export default Earnings;
