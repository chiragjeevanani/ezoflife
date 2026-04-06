import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, Star, IndianRupee, MapPin, MoreHorizontal, UserCheck, ShieldClose, PieChart, Activity, ExternalLink, ArrowUpRight } from 'lucide-react';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import MetricRow from '../components/cards/MetricRow';

export default function Vendors() {
  const navigate = useNavigate();

  const vendors = useMemo(() => mockAdminData.vendors, []);

  const vendorStats = useMemo(() => [
    { label: 'Network Avg Rating', value: '4.82', trend: 'up', change: '+0.04', icon: Star },
    { label: 'Total Partner Settlements', value: '₹1.42M', trend: 'up', change: '+122K', icon: IndianRupee, currency: 'INR' },
    { label: 'Active Hubs', value: '28', trend: 'up', change: '+3', icon: Store },
    { label: 'Fulfillment Velocity', value: '94.2%', trend: 'up', change: '+2.4%', icon: Activity }
  ], []);

  const vendorColumns = useMemo(() => [
    { 
      header: 'Vendor Name', 
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-slate-900 border border-slate-800 flex items-center justify-center text-white text-[10px] font-bold transition-transform">
             {val.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-[11px] tracking-tight uppercase leading-none mb-1">{val}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1 tabular-nums">
              <MapPin size={10} /> {row.shop}
            </span>
          </div>
        </div>
      )
    },
    { 
      header: 'Rating', 
      key: 'rating',
      render: (val) => (
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-sm border border-amber-100 w-fit group-hover:bg-amber-100 transition-colors">
          <Star size={10} fill="currentColor" />
          <span className="text-[10px] font-bold tabular-nums tracking-widest">{val} <span className="opacity-40 text-[8px]">SCORE</span></span>
        </div>
      )
    },
    { 
      header: 'Total Orders', 
      key: 'orders',
      render: (val) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 tabular-nums text-xs">{val} <span className="text-[10px] opacity-20 ml-1">ORDERS</span></span>
          <span className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em] mt-0.5 leading-none tabular-nums">TOTAL COMPLETED</span>
        </div>
      )
    },
    { 
      header: 'Revenue', 
      key: 'revenue', 
      align: 'right', 
      render: (val) => <span className="font-bold text-slate-900 tabular-nums text-xs uppercase tracking-widest">{val}</span> 
    },
    { 
      header: 'Status', 
      key: 'status', 
      render: (val) => <StatusBadge status={val} /> 
    }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Vendors" 
        actions={[
          { label: 'View Health Stats', icon: Activity, variant: 'secondary' },
          { label: 'Register New Vendor', icon: UserCheck, variant: 'primary' }
        ]}
      />

      {/* High-Resolution Performance Metrics */}
      <div className="bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            {vendorStats.map((stat, i) => (
                <MetricRow key={i} {...stat} />
            ))}
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Vendor List */}
        <DataGrid 
          title="Master Vendor Registry"
          columns={vendorColumns}
          data={vendors}
          onAction={(row) => navigate(`/admin/vendors/${row.id}`)}
        />
      </div>
    </div>
  );
}
