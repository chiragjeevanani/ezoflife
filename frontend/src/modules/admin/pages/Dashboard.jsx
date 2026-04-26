import React, { useEffect, useState, useMemo } from 'react';
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
import { adminApi } from '../../../lib/api';
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
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        setLiveStats(res.stats);
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };
    fetchStats();
  }, []);

  const financialMetrics = useMemo(() => [
    { label: 'Total Orders', value: (liveStats?.totalOrders || 0).toLocaleString(), delta: 'Life-to-date', icon: ShoppingCart, color: 'white' },
    { label: 'Active Riders', value: liveStats?.activeRiders || 0, delta: 'Real-time Online', icon: Activity, color: 'emerald-400' },
    { label: 'Today Revenue', value: `₹${(liveStats?.todayRevenue || 0).toLocaleString()}`, delta: 'Since Midnight', icon: IndianRupee, color: 'white' },
    { label: 'Pending Issues', value: liveStats?.pendingIssues || 0, delta: 'Support Queue', icon: AlertCircle, color: 'rose-400' },
    { label: 'Delayed Orders', value: liveStats?.delayedOrders || 0, delta: 'Action Required', icon: Clock, color: 'amber-400' }
  ], [liveStats]);

  const healthStats = useMemo(() => [
    { label: 'Total Users', value: liveStats?.totalUsers || 0, icon: UsersIcon },
    { label: 'Active Vendors', value: liveStats?.activeVendors || 0, icon: Store },
    { label: 'API Latency', value: '38ms', icon: Cpu }
  ], [liveStats]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-x divide-slate-800 max-w-[1600px] mx-auto w-full relative z-10">
          {financialMetrics.map((metric, i) => (
            <div key={i} className="p-8 flex flex-col gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{metric.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black text-${metric.color || 'white'} tracking-tighter tabular-nums`}>{metric.value}</span>
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
        {/* Real-time statistics only for now to keep it clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-400 transition-all">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Platform Status</p>
                    <h4 className="text-xl font-black text-slate-900 uppercase">Operational</h4>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-sm flex items-center justify-center border border-emerald-100">
                    <Activity size={24} />
                </div>
            </div>
            {/* Add more live data cards here as needed */}
        </div>
      </div>
    </div>
  );
}
