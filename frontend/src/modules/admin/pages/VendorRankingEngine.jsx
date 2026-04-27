import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Download, ArrowUpRight, ArrowDownRight, 
    MoreVertical, Eye, Zap, ShieldAlert, RotateCcw, ShoppingBag,
    TrendingUp, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';

const VendorRankingEngine = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tierFilter, setTierFilter] = useState('All');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);

    // Sample Realistic Data
    const vendors = [
        { id: 1, rank: 1, name: 'Cloud Nine Laundry', tier: 'Heritage', rating: 4.9, orders: 1240, tat: '4.2h', cancel: '0.2%', score: 98, status: 'Boosted', lastUpdate: '2h ago' },
        { id: 2, rank: 2, name: 'Urban Wash Experts', tier: 'Heritage', rating: 4.8, orders: 850, tat: '5.1h', cancel: '0.5%', score: 92, status: 'Normal', lastUpdate: '5h ago' },
        { id: 3, rank: 3, name: 'Eco-Clean Hub', tier: 'Essential', rating: 4.7, orders: 2100, tat: '6.5h', cancel: '1.2%', score: 89, status: 'Normal', lastUpdate: '1d ago' },
        { id: 4, rank: 4, name: 'Swift Dry Cleaners', tier: 'Essential', rating: 4.2, orders: 420, tat: '12h', cancel: '4.5%', score: 65, status: 'Penalized', lastUpdate: '3h ago' },
        { id: 5, rank: 5, name: 'Royal Garment Care', tier: 'Heritage', rating: 4.6, orders: 670, tat: '4.8h', cancel: '0.8%', score: 85, status: 'Normal', lastUpdate: '2d ago' },
    ];

    const stats = [
        { label: 'Total Vendors', value: '124', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Boosted Vendors', value: '18', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Penalized Vendors', value: '4', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Avg Platform Rating', value: '4.62', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const handleEdit = (vendor) => {
        setSelectedVendor(vendor);
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Vendor Ranking Engine</h1>
                    <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">Algorithmic sorting and marketplace visibility control.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
                    >
                        <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls Section */}
            <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search vendor..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select className="flex-1 md:flex-none bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer outline-none">
                        <option>All Tiers</option>
                        <option>Heritage</option>
                        <option>Essential</option>
                    </select>
                    <select className="flex-1 md:flex-none bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer outline-none">
                        <option>All Cities</option>
                        <option>Mumbai</option>
                        <option>Delhi</option>
                    </select>
                    <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-100 transition-colors">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Main Data Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rank</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor Name</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tier</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Completed Orders</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Avg TAT</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Visibility</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-6 font-black text-indigo-600 text-lg">#{vendor.rank}</td>
                                    <td className="px-6 py-6">
                                        <p className="text-sm font-black text-slate-900 leading-none">{vendor.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Updated {vendor.lastUpdate}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            vendor.tier === 'Heritage' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            {vendor.tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-1.5 font-black text-sm">
                                            <span className="text-amber-500">★</span>
                                            {vendor.rating}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-black text-slate-700">{vendor.orders}</td>
                                    <td className="px-6 py-6 text-sm font-black text-slate-700">{vendor.tat}</td>
                                    <td className="px-6 py-6">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${vendor.score}%` }} />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1.5">{vendor.score} Score</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                                            vendor.status === 'Boosted' ? 'bg-emerald-50 text-emerald-600' :
                                            vendor.status === 'Penalized' ? 'bg-rose-50 text-rose-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                vendor.status === 'Boosted' ? 'bg-emerald-500' :
                                                vendor.status === 'Penalized' ? 'bg-rose-500' :
                                                'bg-slate-400'
                                            }`} />
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(vendor)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Performers */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Top 5 Performers</h4>
                        <TrendingUp size={18} className="text-emerald-500" />
                    </div>
                    <div className="space-y-6">
                        {vendors.slice(0, 3).map((v, idx) => (
                            <div key={v.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-black text-slate-200">0{idx + 1}</span>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{v.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{v.orders} Orders</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-600">{v.rating}★</p>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Perfect</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lowest TAT */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Lowest TAT Vendors</h4>
                        <Clock size={18} className="text-indigo-500" />
                    </div>
                    <div className="space-y-6">
                        {[...vendors].sort((a,b) => parseFloat(a.tat) - parseFloat(b.tat)).slice(0, 3).map((v, idx) => (
                            <div key={v.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-black text-sm">{v.tat.slice(0,1)}</div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{v.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{v.tat} Avg Turnaround</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={18} className="text-indigo-500" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* High Complaints */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">High Warning Vendors</h4>
                        <AlertCircle size={18} className="text-rose-500" />
                    </div>
                    <div className="space-y-6">
                        {vendors.filter(v => v.status === 'Penalized' || parseFloat(v.cancel) > 2).slice(0, 3).map((v) => (
                            <div key={v.id} className="flex items-center justify-between bg-rose-50/30 p-4 rounded-3xl border border-rose-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{v.name}</p>
                                        <p className="text-[10px] font-black text-rose-500 uppercase">{v.cancel} Cancel Rate</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black uppercase text-rose-600 underline">Resolve</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side Panel / Modal for Edit */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl p-8 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Ranking <span className="text-indigo-600">Control.</span></h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <RotateCcw size={18} />
                                </button>
                            </div>

                            {selectedVendor && (
                                <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pb-20">
                                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Editing Vendor</p>
                                        <h4 className="text-xl font-black text-slate-900">{selectedVendor.name}</h4>
                                        <div className="flex gap-2 mt-4">
                                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-600 tracking-widest">Rank #{selectedVendor.rank}</span>
                                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-600 tracking-widest">{selectedVendor.score} Score</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manual Boost Points</label>
                                            <input 
                                                type="number" 
                                                placeholder="+50 pts"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                                            />
                                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest ml-1">Positive influence on rank</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Penalty Points</label>
                                            <input 
                                                type="number" 
                                                placeholder="-20 pts"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all outline-none"
                                            />
                                            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-1">Negative influence on rank</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason / Internal Note</label>
                                            <textarea 
                                                rows="4"
                                                placeholder="e.g. Consistently low TAT or Manual boost for campaign..."
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest"
                                >
                                    Reset Score
                                </button>
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorRankingEngine;
