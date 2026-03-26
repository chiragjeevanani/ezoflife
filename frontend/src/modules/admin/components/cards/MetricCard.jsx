import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const MetricCard = ({ label, value, delta, isPositive, icon: Icon, sparklineData = [] }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 pb-2 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:border-blue-500/20 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isPositive ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'} duration-500`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-80">{label}</h4>
        <p className="text-3xl font-bold text-slate-800 tracking-tighter tabular-nums leading-none">
          {value}
        </p>
      </div>

      {/* Mini Sparkline Background */}
      <div className="absolute -bottom-2 left-0 right-0 h-16 opacity-10 group-hover:opacity-30 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData.length ? sparklineData : [10, 25, 15, 30, 20, 35, 25].map(v => ({ value: v }))}>
            <defs>
              <linearGradient id={`color-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#3b82f6' : '#ef4444'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={isPositive ? '#3b82f6' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? '#3b82f6' : '#ef4444'} 
                fill={`url(#color-${label})`} 
                strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default MetricCard;
