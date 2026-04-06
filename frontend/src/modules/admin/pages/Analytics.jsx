import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Users, Zap, Calendar, Download, Filter, Target, Activity, Cpu, Monitor, IndianRupee, Star, ShieldCheck } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import MetricRow from '../components/cards/MetricRow';
import ChartPanel from '../components/cards/ChartPanel';

export default function Analytics() {
  const COLORS = useMemo(() => ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'], []);

  const revenueFlow = useMemo(() => mockAdminData.revenueFlow, []);
  const orderStats = useMemo(() => mockAdminData.orderStats, []);
  const marketSegmentation = useMemo(() => [
    { name: 'Laundry', value: 400 },
    { name: 'Dry Clean', value: 300 },
    { name: 'Ironing', value: 300 },
    { name: 'Premium', value: 200 },
  ], []);

  const performanceKPIs = useMemo(() => [
    { label: 'Fulfillment KPI', value: '99.8%', delta: '↗ +0.02', variant: 'emerald' },
    { label: 'Network Latency', value: '42ms', delta: 'STABLE', variant: 'slate' },
    { label: 'System Faults', value: '00', delta: 'OPTIMAL', variant: 'rose' },
    { label: 'Avg Order Value', value: '₹482', delta: '↗ +12%', variant: 'blue' }
  ], []);

  const operationalStats = useMemo(() => [
    { label: 'Active Riders', value: '142' },
    { label: 'Active Vendors', value: '32' },
    { label: 'Tasks / Rider', value: '14.2' },
    { label: 'Handshake KPI', value: '98%', variant: 'emerald' }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-25/50 pb-20">
      <PageHeader 
        title="Analytics" 
        actions={[
          { label: 'Export Data Report', icon: Download, variant: 'secondary' },
          { label: 'Set Goals', icon: Target, variant: 'primary' }
        ]}
      />

      {/* Analytics Performance Layer */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            <MetricRow label="Monthly Growth" value="12.42%" change="+1.2%" trend="up" icon={TrendingUp} />
            <MetricRow label="User Satisfaction" value="4.8/5" change="+0.2" trend="up" icon={Star} />
            <MetricRow label="Daily Growth" value="₹12.4K" change="-1.2K" trend="up" icon={IndianRupee} />
            <MetricRow label="Overall Compliance" value="100%" trend="up" icon={ShieldCheck} />
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPanel 
            title="Revenue Overview" 
            subtitle="Platform revenue trend analysis"
          >
            <div className="h-full w-full p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} />
                  <Tooltip contentStyle={{ borderRadius: '1px', border: '1px solid #f1f5f9', fontWeight: 'black', textTransform: 'uppercase' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAnalytics)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>

          <ChartPanel 
            title="Orders by Category" 
            subtitle="Operational yield segmentation"
          >
            <div className="h-full w-full p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1px', border: '1px solid #f1f5f9' }} />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[1, 1, 0, 0]} barSize={24}>
                    {orderStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartPanel>
        </div>

        {/* Platform Performance Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-sm flex flex-col gap-8 shadow-sm">
               <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-2">
                     <Activity size={14} className="text-slate-900" />
                     <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Operational Global Pulse</h3>
                  </div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10">MISSION CRITICAL</span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {performanceKPIs.map((kpi, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className={`text-[8px] font-black text-${kpi.variant === 'slate' ? 'primary' : kpi.variant}-500 uppercase tracking-widest opacity-60`}>{kpi.label}</span>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-900 tabular-nums leading-none tracking-tighter italic">{kpi.value}</span>
                        <span className={`text-[9px] text-${kpi.variant === 'slate' ? 'slate-300' : 'emerald-500'} font-bold mb-0.5 uppercase`}>{kpi.delta}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-50">
                  {operationalStats.map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">{stat.label}</span>
                      <span className={`text-xl font-black ${stat.variant === 'emerald' ? 'text-emerald-500' : 'text-slate-900'} tabular-nums leading-none tracking-tighter italic`}>{stat.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            <ChartPanel title="Market Segmentation" subtitle="Category yield breakdown" height={325}>
               <div className="h-full w-full p-2">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={marketSegmentation}
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {marketSegmentation.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-[-20px] pb-4">
                    {marketSegmentation.map((cat, i) => (
                        <div key={cat.name} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{cat.name}</span>
                        </div>
                    ))}
                 </div>
               </div>
            </ChartPanel>
        </div>

      </div>
    </div>
  );
}
