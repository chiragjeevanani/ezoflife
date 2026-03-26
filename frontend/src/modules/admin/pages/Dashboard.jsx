import React from 'react';
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
  Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Bar, Line, LineChart
} from 'recharts';
import { mockAdminData } from '../data/mockData';
import MetricRow from '../components/cards/MetricRow';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import ChartPanel from '../components/cards/ChartPanel';
import ComparisonChart from '../components/charts/ComparisonChart';
import ProfessionalTooltip from '../components/common/ProfessionalTooltip';

export default function Dashboard() {
  const settlementColumns = [
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
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Dashboard" 
        actions={[
          { label: 'Weekly Performance Report', icon: Activity, variant: 'secondary' },
          { label: 'Operational Stats Feed', icon: Zap, variant: 'primary' }
        ]}
      />

      {/* Performance Metric Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-x divide-slate-100">
            <MetricRow label="Total Revenue" value="₹42,850" change="+12.2%" trend="up" icon={IndianRupee} currency="INR" />
            <MetricRow label="Total Orders" value="1,248" change="+8.1%" trend="up" icon={ShoppingCart} />
            <MetricRow label="Active Vendors" value="32" change="+2" trend="up" icon={Store} />
            <MetricRow label="Total Users" value="8,420" change="+14.2%" trend="up" icon={UsersIcon} />
            <MetricRow label="Avg. Delivery Time" value="14.2m" change="-2.4m" trend="up" icon={Clock} />
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
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
                    <LineChart data={mockAdminData.revenueFlow}>
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
                data={mockAdminData.orderStats}
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
            data={mockAdminData.payoutRequests}
            onAction={(row) => console.log('Auditing settlement row', row.id)}
        />
        
      </div>
    </div>
  );
}
