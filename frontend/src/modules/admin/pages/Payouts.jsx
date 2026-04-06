import React, { useMemo } from 'react';
import { CreditCard, IndianRupee, FileText, CheckCircle2, Clock, MoreHorizontal, Download, History, Calculator, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import MetricRow from '../components/cards/MetricRow';

export default function Payouts() {
  const payoutRequests = useMemo(() => mockAdminData.payoutRequests, []);

  const payoutStats = useMemo(() => [
    { label: 'Total Outstanding', value: '₹42,850', change: '+142K', trend: 'up', icon: IndianRupee, currency: 'INR' },
    { label: 'Settled Volume', value: '₹12.4M', change: '+1.2M', trend: 'up', icon: CreditCard, currency: 'INR' },
    { label: 'Processing Nodes', value: '06', change: '+2', trend: 'up', icon: Clock },
    { label: 'Commission Net', value: '₹1.18M', change: '+82K', trend: 'up', icon: Calculator, currency: 'INR' }
  ], []);

  const payoutColumns = useMemo(() => [
    { 
      header: 'Payout ID', 
      key: 'id',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-[11px] tracking-[0.2em] uppercase leading-none mb-1 group-hover:text-blue-600 transition-colors">{val}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] opacity-80 tabular-nums">{row.date} at 14:30 IST</span>
        </div>
      )
    },
    { 
      header: 'Partner Vendor', 
      key: 'vendor',
      render: (val, row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
             <span className="font-bold text-slate-800 text-[11px] uppercase tracking-tight">{val}</span>
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 tabular-nums">
             {row.shop} Registry
          </span>
        </div>
      )
    },
    { 
      header: 'Amount', 
      key: 'amount', 
      align: 'right', 
      render: (val) => (
        <div className="flex flex-col items-end">
          <span className="font-bold text-slate-900 tabular-nums text-xs tracking-widest">₹{val.toLocaleString()}</span>
          <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.2em] mt-1 opacity-100">
             COLLECTED
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
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2.5">
          {row.status === 'Pending' && (
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-sm text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:scale-105 transition-all flex items-center gap-2">
              <Zap size={11} className="animate-pulse" /> PROCESS PAYOUT
            </button>
          )}
          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-sm transition-all">
            <Download size={14} />
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Payouts" 
        actions={[
          { label: 'Export General Ledger', icon: History, variant: 'secondary' },
          { label: 'Review Payout Strategy', icon: Calculator, variant: 'primary' }
        ]}
      />

      {/* Strategic Performance Layer */}
      <div className="bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            {payoutStats.map((stat, i) => (
                <MetricRow key={i} {...stat} />
            ))}
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Payout List */}
        <DataGrid 
          title="Recent Payout Requests"
          columns={payoutColumns}
          data={payoutRequests}
          onAction={(row) => console.log('Viewing payout detail', row.id)}
        />
      </div>
    </div>
  );
}
