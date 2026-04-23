import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, ShieldCheck, XCircle, MapPin, Calendar, FileText, CheckCircle2, ChevronRight, UserPlus, ShieldAlert, ArrowRight, RotateCw } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import PageHeader from '../components/common/PageHeader';

export default function OnboardingApprovals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const pending = await adminApi.getPendingApprovals();
      const mapped = pending.map(v => ({
        id: v._id,
        role: v.role,
        shop: v.role === 'Supplier' ? (v.supplierDetails?.businessName || v.displayName) : (v.shopDetails?.name || v.displayName),
        address: (v.role === 'Supplier' ? v.supplierDetails?.address : v.shopDetails?.address) || 'No Address Provided',
        date: new Date(v.createdAt).toLocaleDateString(),
        docs: v.role === 'Supplier' ? ['GST', 'Aadhar', 'Trade License'] : ['GST', 'Aadhar'],
        phone: v.phone
      }));
      setData(mapped);
    } catch (err) {
      console.error('Fetch Pending Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status, role) => {
    setIsProcessing(id);
    try {
      if (status === 'approved') {
        role === 'Supplier' ? await adminApi.approveSupplier(id) : await adminApi.approveVendor(id);
      } else {
        role === 'Supplier' ? await adminApi.rejectSupplier(id) : await adminApi.rejectVendor(id);
      }
      setData(v => v.filter(req => req.id !== id));
    } catch (err) {
      console.error('Action Error:', err);
      alert('Action failed. Try again.');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Vendor Approvals" 
        actions={[{ label: 'Add New Vendor', icon: UserPlus, variant: 'primary' }]}
      />

      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-xl p-8 rounded-sm shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest">Document Viewer: {selectedDoc}</h3>
                <button onClick={() => setSelectedDoc(null)}><XCircle size={18} /></button>
              </div>
              <div className="bg-slate-50 aspect-video rounded-sm border border-slate-100 flex items-center justify-center mb-6">
                 <div className="text-center p-8 border-2 border-dashed border-slate-200">
                    <FileText size={40} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Official {selectedDoc} Scan</p>
                 </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="w-full py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Close Preview</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
           <span className="px-3 py-1 bg-slate-900 text-white rounded-sm text-[9px] font-bold uppercase tracking-[0.2em]">
             {data.length} VENDORS PENDING
           </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((req) => (
            <div key={req.id} className="bg-white rounded-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-5 space-y-6 flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 relative">
                       <FileText size={20} />
                       <span className={`absolute -top-1 -right-1 px-1 py-0.5 rounded-full text-[6px] font-black uppercase text-white ${req.role === 'Supplier' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                         {req.role}
                       </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.25em] mb-1.5 leading-none">Ref: {req.id}</span>
                      <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight leading-none">{req.shop}</h3>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 mt-2">
                        <MapPin size={10} /> {req.address}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">{req.date}</span>
                </div>

                <div className="h-px bg-slate-50" />

                <div className="space-y-3">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em]">Proofs</span>
                  <div className="grid grid-cols-2 gap-2">
                    {req.docs.map((doc, idx) => (
                      <button key={idx} onClick={() => setSelectedDoc(doc)} className="flex items-center gap-2.5 p-3 bg-slate-25/50 border border-slate-100 rounded-sm hover:bg-slate-900 hover:text-white group transition-all">
                        <FileText size={12} className="text-slate-300 group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{doc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
                 <button onClick={() => handleAction(req.id, 'rejected', req.role)} disabled={!!isProcessing} className="flex-1 py-3 text-[9px] font-black uppercase tracking-widest bg-white border border-slate-200">Reject</button>
                 <button onClick={() => handleAction(req.id, 'approved', req.role)} disabled={!!isProcessing} className="flex-[2] py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                   {isProcessing === req.id ? <RotateCw size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                   {isProcessing === req.id ? 'Processing...' : `Approve ${req.role}`}
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
