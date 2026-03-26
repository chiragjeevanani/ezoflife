import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, MapPin, ShieldCheck, FileText, TrendingUp, Star, Package, CreditCard, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

export default function AdminVendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the specific vendor
  const vendor = {
    id: id || '#VEN-1024',
    name: 'Julian Cleaners',
    shop: 'Pristine Heights',
    status: 'Active',
    joinedDate: '12 Jan, 2026',
    address: 'Skyline Apts, Sector 4, HSR Layout, Bengaluru - 560102',
    rating: 4.8,
    totalOrders: 142,
    revenue: '₹42,800',
    pendingPayout: '₹12,450',
    docs: [
      { name: 'GST Certificate', status: 'Verified' },
      { name: 'Business License', status: 'Verified' },
      { name: 'Owner Aadhar', status: 'Verified' }
    ],
    services: [
      { name: 'Wash & Fold', price: '₹99/kg', status: 'Active' },
      { name: 'Dry Cleaning', price: '₹249/pc', status: 'Active' },
      { name: 'Steam Iron', price: '₹49/pc', status: 'Inactive' }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="font-bold text-slate-900 tracking-tight">Partner Profile <span className="text-slate-400 font-medium ml-1">{vendor.id}</span></h1>
          
          <div className="ml-auto flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
              vendor.status === 'Suspended' ? 'bg-rose-100 text-rose-700' : 
              'bg-amber-100 text-amber-700'
            }`}>
              {vendor.status}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Volume', value: vendor.totalOrders, icon: Package, color: 'text-blue-600' },
              { label: 'Avg Rating', value: vendor.rating, icon: Star, color: 'text-amber-500' },
              { label: 'Lifetime Revenue', value: vendor.revenue, icon: TrendingUp, color: 'text-emerald-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <stat.icon size={24} className={stat.color} />
              </div>
            ))}
          </div>

          {/* Business Info */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-slate-900">
              <Store size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Business Information</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Shop Name</label>
                  <p className="text-sm font-bold text-slate-900">{vendor.shop}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Owner Name</label>
                  <p className="text-sm font-medium text-slate-700">{vendor.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Joined Date</label>
                  <p className="text-sm font-medium text-slate-700">{vendor.joinedDate}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Shop Location</label>
                  <div className="flex gap-2 text-slate-700">
                    <MapPin size={16} className="shrink-0 mt-0.5" />
                    <p className="text-xs font-medium leading-relaxed">{vendor.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Offered Services */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-slate-900">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Service Catalog Implementation</span>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendor.services.map((service, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{service.name}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{service.price}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${service.status === 'Active' ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {service.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Documentation & Actions */}
        <div className="space-y-6">
          {/* Documentation */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
             <div className="flex items-center gap-2 text-slate-400 mb-2">
                <FileText size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">KYC Documents</span>
             </div>
             <div className="space-y-3">
                {vendor.docs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-sm">
                    <span className="text-[10px] font-bold text-slate-700">{doc.name}</span>
                    <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1">
                      <ShieldCheck size={10} /> {doc.status}
                    </span>
                  </div>
                ))}
             </div>
             <button className="w-full py-2 bg-slate-900 text-white rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
                View All Assets
             </button>
          </div>

          {/* Payout Info */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
             <div className="flex items-center gap-2 text-slate-400 mb-2">
                <CreditCard size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Settlement Balance</span>
             </div>
             <div className="text-center py-4 bg-emerald-50/50 rounded-sm">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-1">Available for Payout</p>
                <p className="text-2xl font-bold text-slate-900">{vendor.pendingPayout}</p>
             </div>
             <button className="w-full py-2.5 bg-emerald-600 text-white rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors">
                Authorize Payout
             </button>
          </div>

          {/* Governance Actions */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-sm p-5 space-y-4">
             <div className="flex items-center gap-2 text-rose-800 mb-2">
                <AlertTriangle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Compliance Override</span>
             </div>
             <div className="grid grid-cols-1 gap-2">
                <button className="w-full py-3 bg-white border border-rose-200 text-rose-600 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                  Suspend Partner Node
                </button>
                <p className="text-[9px] text-rose-400 text-center font-medium italic">Suspension will disable customer discovery.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
