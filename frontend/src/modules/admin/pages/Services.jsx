import React from 'react';
import { Sparkles, PlusCircle, Settings, IndianRupee, Layers, CheckCircle2, XCircle, RotateCw, Filter, Download, ArrowRight } from 'lucide-react';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import MetricRow from '../components/cards/MetricRow';

export default function Services() {
  const serviceColumns = [
    { 
      header: 'Service Name', 
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3 transition-transform">
          <div className="w-8 h-8 rounded-sm bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
             <Sparkles size={14} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-[11px] uppercase tracking-tight leading-none mb-1">{val}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5 tabular-nums leading-none">
              <Layers size={10} className="text-slate-300" /> {row.category}
            </span>
          </div>
        </div>
      )
    },
    { 
      header: 'Base Price', 
      key: 'basePrice',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 tabular-nums text-xs tracking-widest leading-none mb-1">₹{val.toLocaleString()}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5 tabular-nums leading-none">
             PER {row.unit.toUpperCase()}
          </span>
        </div>
      )
    },
    { 
      header: 'Status', 
      key: 'status', 
      render: (val) => <StatusBadge status={val} /> 
    },
    { 
      header: 'Actions', 
      key: 'actions', 
      align: 'right',
      render: () => (
        <div className="flex items-center justify-end gap-2.5">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-sm text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all flex items-center gap-2">
            <Settings size={11} className="group-hover:rotate-90 transition-transform duration-500" /> EDIT SERVICE
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Services" 
        actions={[
          { label: 'Add New Service', icon: PlusCircle, variant: 'primary' }
        ]}
      />

      {/* Distribution Performance Index */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            <MetricRow label="Service Points" value="24" change="+2" trend="up" icon={Sparkles} />
            <MetricRow label="Laundry Yield" value="₹124.2K" change="+12.4K" trend="up" icon={IndianRupee} currency="INR" />
            <MetricRow label="Dry Clean Base" value="08" change="+1" trend="up" icon={Layers} />
            <MetricRow label="Network Avg Price" value="₹420" change="+18" trend="up" icon={Settings} currency="INR" />
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Service List */}
        <DataGrid 
          title="Master Service Registry"
          columns={serviceColumns}
          data={mockAdminData.services}
          onAction={(row) => console.log('Editing service', row.name)}
        />
      </div>
    </div>
  );
}
