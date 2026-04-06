import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  ShoppingCart, 
  Users as UsersIcon, 
  Clock, 
  Store, 
  ChevronRight,
  Activity,
  Zap,
  Cpu,
  Monitor,
  Calendar,
  Filter,
  Download,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Bar, Line, LineChart
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { mockAdminData } from '../data/mockData';
import MetricRow from '../components/cards/MetricRow';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import ChartPanel from '../components/cards/ChartPanel';
import ComparisonChart from '../components/charts/ComparisonChart';
import ProfessionalTooltip from '../components/common/ProfessionalTooltip';

export default function Dashboard() {
  const navigate = useNavigate();

  const financialMetrics = useMemo(() => [
    { label: 'Gross Merchandise (GMV)', value: '₹8,42,150', delta: '+14.2%', icon: TrendingUp, color: 'white' },
    { label: 'Platform Net Yield', value: '₹1,26,322', delta: '15% Fee Base', icon: null, color: 'sky-400' },
    { label: 'Logistics Disbursements', value: '₹64,280', delta: '12 Pending', icon: Clock, color: 'white' },
    { label: 'Vendor Settlements', value: '₹6,51,548', delta: 'Cycle: Weekly', icon: null, color: 'white' }
  ], []);

  const healthStats = useMemo(() => [
    { label: 'API Latency', value: '42ms', icon: Cpu },
    { label: 'Uptime', value: '99.98%', icon: Monitor },
    { label: 'Load', value: 'Low (12.4%)', icon: Activity }
  ], []);

  const alerts = useMemo(() => [
    { id: 'SZ-9283', title: 'DELAYED PICKUP (>2HR)', type: 'CRITICAL', desc: 'Assigned to Marcus Chen · Delay: 142m', icon: Clock, variant: 'rose', action: '/admin/orders', actionLabel: 'Intercept' },
    { id: 'SZ-7712', title: 'UNPAID DELIVERY DETECTED', type: 'DISPUTE', desc: 'COD Payment Missing · Handover Complete', icon: IndianRupee, variant: 'amber', action: '/admin/dispute-center', actionLabel: 'Resolve' }
  ], []);

  const revenueFlow = useMemo(() => mockAdminData.revenueFlow, []);
  const orderStats = useMemo(() => mockAdminData.orderStats, []);
  const payoutRequests = useMemo(() => mockAdminData.payoutRequests, []);

  const settlementColumns = useMemo(() => [
    { 
      header: 'Partner Vendor', 
      key: 'vendor',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-[11px] leading-tight uppercase tracking-tight">{val}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 opacity-60 tabular-nums">{row.shop}</span>
        </div>
      )
    },
    { 
      header: 'Settlement Amount', 
      key: 'amount', 
      align: 'right', 
      render: (val) => <span className="font-bold text-slate-900 tabular-nums text-xs">₹{val.toLocaleString()}</span> 
    },
    { 
      header: 'Workflow Status', 
      key: 'status', 
      render: (val) => <StatusBadge status={val} /> 
    },
    { 
      header: 'Audit Timestamp', 
      key: 'date', 
      render: (val) => <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase opacity-60 tabular-nums">{val}</span> 
    }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Dashboard" 
        actions={[
          { label: 'Weekly Performance Report', icon: Activity, variant: 'secondary' },
          { label: 'Operational Stats Feed', icon: Zap, variant: 'primary' }
        ]}
      />

      {/* Financial Performance Matrix (Phase 3 Requirement) */}
      <div className="bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(2,132,199,0.15),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-slate-800 max-w-[1600px] mx-auto w-full relative z-10">
          {financialMetrics.map((metric, i) => (
            <div key={i} className="p-8 flex flex-col gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{metric.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black text-${metric.color || 'white'} tracking-tighter italic tabular-nums`}>{metric.value}</span>
                <span className={`text-[10px] font-black text-${metric.color === 'white' ? 'emerald-400' : metric.color} flex items-center gap-1 uppercase tracking-widest`}>
                  {metric.icon && <metric.icon size={12} />} {metric.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Control: System Health (Phase 3 Requirement) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative"></div>
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Operational Health: Optimal</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex gap-6">
            <div className="flex gap-6">
              {healthStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <stat.icon size={12} className="text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}: <span className="text-slate-900">{stat.value}</span></span>
                </div>
              ))}
            </div>
            </div>
          </div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Live Sync: Active Protocol</p>
        </div>
      </div>


      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Real-time Alert Panel (BRD 3.2.C) */}
        <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-400" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Priority Operational Alerts</h3>
            </div>
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded-sm">2 Critical Issues</span>
          </div>
          <div className="divide-y divide-slate-100">
            {alerts.map((alert, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-sm bg-${alert.variant}-50 text-${alert.variant}-500 flex items-center justify-center border border-${alert.variant}-100`}>
                    <alert.icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black text-slate-900 uppercase">{alert.title}</span>
                      <span className={`px-1.5 py-0.5 bg-${alert.variant}-500 text-white text-[8px] font-black rounded-sm`}>{alert.type}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order #{alert.id} · {alert.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(alert.action)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all rounded-sm flex items-center gap-2"
                >
                  {alert.actionLabel} <ArrowRight size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Analytics Grid: Enterprise Dark Border Technique */}
        <div className="grid grid-cols-1 xl:grid-cols-2 bg-slate-200 gap-px border border-slate-200 transition-all rounded-sm overflow-hidden min-h-[400px]">
          <ChartPanel 
            key="revenue-chart"
            title="Revenue Over Time" 
            subtitle="Platform revenue growth analysis"
            actions={<button className="p-1 px-3 bg-slate-900 text-white rounded-[1px] text-[9px] font-bold uppercase tracking-widest">Refresh Data</button>}
            height={340}
          >
             <div className="w-full h-full p-4 overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueFlow}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <Tooltip content={<ProfessionalTooltip />} />
                        <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#0284c7" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
             </div>
          </ChartPanel>

          <ChartPanel 
            title="Orders vs Fulfillment Rate" 
            subtitle="Order volume and completion rate analysis"
            actions={<div className="flex gap-1.5"><Calendar size={12} className="text-slate-400" /><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Last 24 Hours</span></div>}
          >
             <ComparisonChart 
                data={orderStats}
                type="composed"
                metrics={[
                    { key: "orders", name: "Unit Volume", color: "#0f172a", type: "area" },
                    { key: "fulfillment", name: "Node Response", color: "#64748b", type: "bar" }
                ]}
                height={340}
             />
          </ChartPanel>
        </div>

        {/* Recent Payouts */}
        <DataGrid 
            title="Recent Payout Requests"
            columns={settlementColumns}
            data={payoutRequests}
            onAction={(row) => console.log('Auditing settlement row', row.id)}
        />
        
      </div>
    </div>
  );
}
