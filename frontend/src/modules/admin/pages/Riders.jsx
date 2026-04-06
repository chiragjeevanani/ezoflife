import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MoreVertical, 
  Search, 
  Filter, 
  ArrowRight,
  Bike
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import MetricRow from '../components/cards/MetricRow';
import StatusBadge from '../components/common/StatusBadge';
import DataGrid from '../components/tables/DataGrid';

const Riders = () => {
  const navigate = useNavigate();

  const riders = useMemo(() => [
    { id: 'RD-001', name: 'Marcus Chen', phone: '+91 98822 00112', zone: 'HSR Layout', status: 'Active', tasks: 3, rating: 4.8 },
    { id: 'RD-005', name: 'Rahul S.', phone: '+91 98221 55210', zone: 'Indiranagar', status: 'On-Duty', tasks: 1, rating: 4.9 },
    { id: 'RD-012', name: 'Vikram K.', phone: '+91 77102 99311', zone: 'Whitefield', status: 'Offline', tasks: 0, rating: 4.5 }
  ], []);

  const fleetStats = useMemo(() => [
    { label: 'Total Fleet', value: '48', change: '+4', trend: 'up', icon: Bike },
    { label: 'Online Now', value: '32', change: '+12.5%', trend: 'up', icon: Activity },
    { label: 'Avg. Pickup Time', value: '12.4m', change: '-2.1m', trend: 'up', icon: Clock },
    { label: 'Verification Status', value: '98%', change: '+0.4%', trend: 'up', icon: ShieldCheck }
  ], []);

  const columns = useMemo(() => [
    { 
      header: 'Rider Profile', 
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{val}</span>
            <span className="text-[9px] text-slate-400 font-bold tabular-nums uppercase tracking-widest">{row.id}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Operational Zone', 
      key: 'zone',
      render: (val) => (
        <div className="flex items-center gap-2">
          <MapPin size={10} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{val}</span>
        </div>
      )
    },
    { 
      header: 'Fulfillment Status', 
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    { 
      header: 'Active Trips', 
      key: 'tasks',
      render: (val) => (
        <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${val > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
            <span className="text-[10px] font-black tabular-nums">{val} Tasks</span>
        </div>
      )
    },
    { 
      header: 'Avg. Rating', 
      key: 'rating',
      render: (val) => (
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
          <span className="text-[10px] font-black tabular-nums">{val}</span>
        </div>
      )
    }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Fleet Management" 
        actions={[
          { label: 'Register New Rider', icon: Users, variant: 'primary' },
          { label: 'Live Map', icon: MapPin, variant: 'secondary' }
        ]}
      />

      <div className="bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            {fleetStats.map((stat, i) => (
                <MetricRow key={i} {...stat} />
            ))}
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Search Rider Fleet..." 
                     className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-sm text-[10px] font-bold uppercase tracking-widest outline-none focus:border-slate-900 transition-all w-64"
                   />
                </div>
                <button className="px-3 py-2 bg-white border border-slate-200 rounded-sm text-slate-400 hover:text-slate-900 transition-colors">
                   <Filter size={14} />
                </button>
             </div>
          </div>
          
          <DataGrid 
            columns={columns} 
            data={riders} 
            onAction={(row) => navigate(`/admin/riders/${row.id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Riders;
