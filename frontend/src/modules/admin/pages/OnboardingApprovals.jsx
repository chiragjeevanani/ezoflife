import React from 'react';
import { FileCheck, ShieldCheck, XCircle, MapPin, Calendar, FileText, CheckCircle2, ChevronRight, UserPlus, ShieldAlert, ArrowRight } from 'lucide-react';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';

export default function OnboardingApprovals() {
  const handleAction = (id, status) => {
    // Save status to localStorage to persist across panels
    localStorage.setItem(`vendorStatus_${id}`, status);
    alert(`Vendor ${id} has been ${status === 'approved' ? 'Approved' : 'Rejected'}.`);
    // In a real app, we would refresh data here
    window.location.reload(); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Vendor Approvals" 
        actions={[
          { label: 'Add New Vendor', icon: UserPlus, variant: 'primary' }
        ]}
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
           <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-sm bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                 <ShieldAlert size={14} />
              </span>
              <div className="flex flex-col">
                 <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none mb-1">Pending Review</h2>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-80 leading-none">Review pending registration requests</p>
              </div>
           </div>
           <span className="px-3 py-1 bg-slate-900 text-white rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] tabular-nums">
             {mockAdminData.onboardingRequests.length} VENDORS PENDING
           </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAdminData.onboardingRequests.map((req, i) => (
            <div key={req.id} className="bg-white rounded-sm border border-slate-200 overflow-hidden group hover:border-slate-900 transition-all flex flex-col hover: hover: origin-center">
              <div className="p-5 space-y-6 flex-1">
                {/* Vendor Details */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                       <FileText size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.25em] leading-none mb-1.5 tabular-nums">Ref: {req.id}</span>
                      <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight leading-none">{req.shop}</h3>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5 mt-2 tabular-nums">
                        <MapPin size={10} className="text-slate-300" /> {req.address}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.25em] leading-none mb-1">Audit Log Date</span>
                    <span className="text-[10px] font-bold text-slate-600 tabular-nums uppercase">{req.date}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-50" />

                {/* Document Verification */}
                <div className="space-y-3">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.25em] opacity-80">Submitted Documents</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {req.docs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2 bg-slate-25/50 border border-slate-100 rounded-sm group/doc hover:bg-slate-900 hover:border-slate-900 transition-all cursor-pointer">
                        <div className="w-5 h-5 rounded-sm bg-white border border-slate-100 text-slate-400 flex items-center justify-center group-hover/doc:bg-white/10 group-hover/doc:text-white transition-colors">
                           <CheckCircle2 size={10} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 group-hover/doc:text-white uppercase tracking-[0.15em] leading-none tabular-nums">{doc} Verified</span>
                        <ArrowRight size={10} className="ml-auto text-slate-200 group-hover/doc:text-white/40 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Actions */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3 transition-colors">
                 <button 
                  onClick={() => handleAction(req.id, 'rejected')}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
                >
                   <XCircle size={13} /> Reject
                 </button>
                 <button 
                  onClick={() => handleAction(req.id, 'approved')}
                  className="flex-[2] py-2.5 bg-slate-900 text-white rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                   <ShieldCheck size={13} /> Approve Vendor
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
