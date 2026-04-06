import React, { useMemo, useState } from 'react';
import { ShieldAlert, IndianRupee, Image, History, ArrowRight, User, CheckCircle2, XCircle, AlertCircle, Search, ExternalLink } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import MetricRow from '../components/cards/MetricRow';
import StatusBadge from '../components/common/StatusBadge';

export default function DisputeCenter() {
  const disputes = useMemo(() => [
    { id: 'DSP-9921', orderId: 'SZ-8815', vendor: 'Heritage Cleaners', amount: 1420, issue: 'Damaged Silk Saree', status: 'Pending', severity: 'High' },
    { id: 'DSP-9918', orderId: 'SZ-7712', vendor: 'EcoWash Hub', amount: 420, issue: 'Payment Missing', status: 'In Review', severity: 'Medium' }
  ], []);

  const disputeStats = useMemo(() => [
    { label: 'Open Disputes', value: '12', change: '+2', trend: 'up', icon: ShieldAlert },
    { label: 'Refund Vol (7d)', value: '₹12.4K', change: '+1.2K', trend: 'up', icon: IndianRupee, currency: 'INR' },
    { label: 'Avg Resolution', value: '4.2h', change: '-0.5h', trend: 'up', icon: History },
    { label: 'Vendor Penalties', value: '08', change: '+1', trend: 'up', icon: AlertCircle }
  ], []);

  const [selectedDispute, setSelectedDispute] = useState(disputes[0]);

  const custodyLogs = useMemo(() => [
    { time: '10:14 AM', event: 'Order Picked up from Customer', desc: 'Rider: Marcus Chen · Photo Linked' },
    { time: '11:20 AM', event: 'Arrived at Heritage Cleaners', desc: 'Received by: Shop Manager (Verified)' },
    { time: '02:40 PM', event: 'Processing Marked: In Progress', desc: 'Wash Type: Delicates (Heritage Grade)' },
    { time: '04:15 PM', event: 'Customer Flagged Damage', desc: 'Ticket #T-8821 via Mobile App' }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Dispute Center" 
        actions={[
          { label: 'Settlement Policy', icon: IndianRupee, variant: 'secondary' },
          { label: 'Open Investigation', icon: Search, variant: 'primary' }
        ]}
      />

      <div className="bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            {disputeStats.map((stat, i) => (
                <MetricRow key={i} {...stat} />
            ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto w-full">
        {/* List of Disputes */}
        <div className="xl:col-span-1 space-y-4">
           <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Investigation Queue</span>
              <span className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em]">{disputes.length} CASES</span>
           </div>
           {disputes.map(dsp => (
             <div 
               key={dsp.id} 
               onClick={() => setSelectedDispute(dsp)}
               className={`p-6 bg-white border border-slate-200 rounded-sm cursor-pointer transition-all hover:translate-y-[-2px] relative overflow-hidden group ${selectedDispute.id === dsp.id ? 'border-slate-900 bg-slate-50 shadow-xl' : 'hover:border-slate-400'}`}
             >
                {dsp.severity === 'High' && <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-bl-sm"></div>}
                <div className="flex justify-between items-start mb-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-400 tabular-nums uppercase leading-none">{dsp.id}</span>
                      <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight italic">Order #{dsp.orderId}</h4>
                   </div>
                   <StatusBadge status={dsp.status} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-4 truncate">{dsp.issue}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                   <span className="text-[12px] font-black text-slate-950 tabular-nums">₹{dsp.amount.toLocaleString()}</span>
                   <button className="text-[9px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all underline underline-offset-4">
                     Review Evidence <ArrowRight size={10} />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Investigation Details */}
        <div className="xl:col-span-2 space-y-6">
           {selectedDispute ? (
             <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded-sm">
                         <ShieldAlert size={28} />
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">{selectedDispute.id} · Investigation Case</h2>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{selectedDispute.vendor} · AT-LOD-9201</span>
                            <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-sm text-[8px] font-black text-rose-600 uppercase tracking-widest">High Severity Issue</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-2.5">
                      <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-slate-100 transition-all">Reject Claim</button>
                      <button className="px-6 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm shadow-xl shadow-slate-950/20 hover:bg-black transition-all">Approve Refund</button>
                   </div>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                   {/* Operational Timeline */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                         <History size={16} className="text-slate-900" />
                         <h3 className="text-[11px] font-black uppercase tracking-widest">Chain of Custody Log</h3>
                      </div>
                      <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                         {[
                           { time: '10:14 AM', event: 'Order Picked up from Customer', desc: 'Rider: Marcus Chen · Photo Linked' },
                           { time: '11:20 AM', event: 'Arrived at Heritage Cleaners', desc: 'Received by: Shop Manager (Verified)' },
                           { time: '02:40 PM', event: 'Processing Marked: In Progress', desc: 'Wash Type: Delicates (Heritage Grade)' },
                           { time: '04:15 PM', event: 'Customer Flagged Damage', desc: 'Ticket #T-8821 via Mobile App' }
                         ].map((log, i) => (
                           <div key={i} className="relative group">
                              <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-slate-900 rounded-full group-hover:scale-150 transition-all"></div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block tabular-nums">{log.time}</span>
                              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">{log.event}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none opacity-60 tabular-nums">{log.desc}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Visual Evidence (BRD 3.2.G) */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-3">
                            <Image size={16} className="text-slate-900" />
                            <h3 className="text-[11px] font-black uppercase tracking-widest">Visual Evidence Strip</h3>
                         </div>
                         <button className="text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-2">Expand <ExternalLink size={10} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         {[1, 2].map(i => (
                           <div key={i} className="bg-slate-50 border border-slate-100 aspect-square rounded-sm overflow-hidden group cursor-pointer relative">
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                 <Search size={24} className="text-white scale-75 group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="w-full h-full p-4 border-2 border-dashed border-slate-200 m-2 flex items-center justify-center opacity-40">
                                 <Image size={32} />
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="bg-amber-50 border border-amber-100 p-6 rounded-sm space-y-4">
                         <div className="flex items-center gap-3">
                            <AlertCircle size={16} className="text-amber-600" />
                            <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Dispute Summary</h4>
                         </div>
                         <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-widest opacity-80">
                           Customer claims a permanent stain on the border. Pre-wash photo link shows no visible damage. 
                           Vendor claim: Item already had damage when received.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-[600px] flex flex-col items-center justify-center opacity-10">
                <ShieldAlert size={128} className="mb-8" />
                <p className="text-2xl font-black uppercase tracking-[0.5em]">System Idle</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
