import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';

const Earnings = () => {
    const navigate = useNavigate();
    const [performanceFilter, setPerformanceFilter] = useState('Weekly');

    const performanceData = useMemo(() => ({
        'Daily': { labels: ['18', '19', '20', '21', '22', '23', '24'], values: [65, 40, 85, 30, 95, 60, 45], activeIdx: 6 },
        'Weekly': { labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], values: [45, 65, 55, 90, 45, 75, 30], activeIdx: 3 },
        'Monthly': { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], values: [60, 80, 55, 95, 70, 85], activeIdx: 5 }
    }), []);

    const payoutHistory = useMemo(() => [
        { id: '#SETT-9821', date: 'Mar 23', amt: '₹2,450' },
        { id: '#SETT-9740', date: 'Mar 16', amt: '₹1,820' },
        { id: '#SETT-9655', date: 'Mar 09', amt: '₹3,105' },
    ], []);

    const currentData = useMemo(() => performanceData[performanceFilter], [performanceFilter, performanceData]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-background text-on-background min-h-screen pb-32 font-body"
        >
            <VendorHeader title="Earnings" showBack={true} />
            
            {/* Filter Tabs - Custom for this page */}
            <div className="flex justify-center mt-6">
                <div className="flex bg-surface-container p-1 rounded-full border border-outline-variant/10">
                    {['Daily', 'Weekly', 'Monthly'].map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setPerformanceFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${performanceFilter === filter ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant opacity-60'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="vendor-gradient p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Earnings</p>
                        <h2 className="text-4xl font-bold tracking-tighter">₹12,840.40</h2>
                        <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                                    <span>Gross Revenue</span>
                                    <span className="tabular-nums italic text-slate-200">₹15,106.35</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-rose-300">
                                    <span>Platform Fee (15%)</span>
                                    <span className="tabular-nums">-₹2,265.95</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] pt-2 border-t border-white/5">
                                    <span className="text-emerald-300">Net Shop Yield</span>
                                    <span className="tabular-nums text-white">₹12,840.40</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => navigate('/vendor/payouts')}
                                    className="w-full py-4 bg-white text-primary rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Instant Settlement
                                </button>
                                <button className="w-full py-3 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5">
                                    Download Tax Invoice (GST)
                                </button>
                            </div>
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
                        <div className="flex items-center gap-1.5 text-primary">
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
                                        className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${i === currentData.activeIdx ? 'vendor-gradient shadow-lg shadow-primary/30' : 'bg-primary/5 group-hover:bg-primary/10'}`}
                                    />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${i === currentData.activeIdx ? 'text-primary' : 'text-on-surface-variant/40'}`}>
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
                        {payoutHistory.map((payout, i) => (
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
