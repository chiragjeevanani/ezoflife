import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  ShoppingBag, 
  Star, 
  IndianRupee, 
  MapPin, 
  MoreHorizontal, 
  UserCheck, 
  ShieldClose, 
  PieChart, 
  Activity, 
  ExternalLink, 
  ArrowUpRight,
  X,
  Lock,
  Mail,
  Smartphone,
  Hash,
  Home,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import MetricRow from '../components/cards/MetricRow';

import { authApi, adminApi } from '../../../lib/api';
import { useEffect } from 'react';
export default function Vendors() {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: '',
    mobile: '',
    email: '',
    gstNumber: '',
    password: '',
    address: ''
  });

  const [selectedVendorForView, setSelectedVendorForView] = useState(null);
  const [realVendors, setRealVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAllVendors();
      // Map backend fields to frontend table keys if necessary
      const mapped = (res || []).map(v => ({
        id: v._id,
        name: v.displayName || 'Unnamed Vendor',
        shop: v.shopDetails?.name || 'Main Hub',
        rating: '4.8', // Mock since not in schema yet
        orders: v.ordersCount || 0,
        revenue: '₹0',
        status: v.status || 'pending',
        email: v.email,
        phone: v.phone,
        gst: v.shopDetails?.gst,
        address: v.address || v.shopDetails?.address
      }));
      setRealVendors(mapped);
    } catch (err) {
      console.error('Fetch vendors error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const vendors = useMemo(() => realVendors.length > 0 ? realVendors : mockAdminData.vendors, [realVendors]);

  const vendorStats = useMemo(() => [
    { label: 'Network Avg Rating', value: '4.82', trend: 'up', change: '+0.04', icon: Star },
    { label: 'Total Partner Settlements', value: '₹1.42M', trend: 'up', change: '+122K', icon: IndianRupee, currency: 'INR' },
    { label: 'Active Hubs', value: '28', trend: 'up', change: '+3', icon: Store },
    { label: 'Fulfillment Velocity', value: '94.2%', trend: 'up', change: '+2.4%', icon: Activity }
  ], []);

  // ... columns ...
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
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedVendorForView(row); }}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-sm transition-all"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); alert('Edit logic coming soon'); }}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-all"
            title="Edit Vendor"
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); alert('Delete logic coming soon'); }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all"
            title="Delete Vendor"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ], []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const response = await authApi.registerVendor(vendorForm);
      if (response.vendor) {
        alert('Vendor registered successfully!');
        setShowRegisterModal(false);
        setVendorForm({ name: '', mobile: '', email: '', gstNumber: '', password: '', address: '' });
        fetchVendors(); // Refresh the list
      } else {
        alert(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      alert('Failed to connect to backend server');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Vendors" 
        actions={[
          { label: 'Register New Vendor', icon: UserCheck, variant: 'primary', onClick: () => setShowRegisterModal(true) }
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

      {/* Register Vendor Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-sm shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white text-slate-900 flex items-center justify-center rounded-sm">
                    <Store size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Register New Vendor</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Add a partner to your network</p>
                  </div>
                </div>
                <button onClick={() => setShowRegisterModal(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleRegister} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Vendor Name</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        required
                        type="text" 
                        placeholder="Enter shop or company name"
                        value={vendorForm.name}
                        onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all uppercase placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        required
                        type="tel" 
                        placeholder="Enter 10-digit mobile number"
                        value={vendorForm.mobile}
                        onChange={(e) => setVendorForm({...vendorForm, mobile: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all tabular-nums placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        required
                        type="email" 
                        placeholder="vendor@example.com"
                        value={vendorForm.email}
                        onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* GST Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">GST Number</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        required
                        type="text" 
                        placeholder="Enter GSTIN details"
                        value={vendorForm.gstNumber}
                        onChange={(e) => setVendorForm({...vendorForm, gstNumber: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all uppercase placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Create Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        required
                        type="password" 
                        placeholder="Set a strong password"
                        value={vendorForm.password}
                        onChange={(e) => setVendorForm({...vendorForm, password: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Empty space or full width Address */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Full Address</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-[1.125rem] text-slate-300" size={14} />
                      <textarea 
                        required
                        rows="3"
                        placeholder="Enter shop's complete physical address..."
                        value={vendorForm.address}
                        onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="flex-1 py-4 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] rounded-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isRegistering}
                    className={`flex-[2] py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm shadow-xl shadow-slate-900/20 hover:bg-black hover:translate-y-[-2px] transition-all active:scale-[0.98] ${isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isRegistering ? 'Processing...' : 'Register Vendor'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* View Vendor Modal */}
      <AnimatePresence>
        {selectedVendorForView && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-sm shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 text-white flex items-center justify-center rounded-sm">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Vendor Intelligence</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Complete profile analysis</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVendorForView(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Identity Card */}
                <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-sm">
                  <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded-sm text-2xl font-black">
                    {selectedVendorForView.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{selectedVendorForView.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedVendorForView.shop}</p>
                    <div className="mt-3 flex items-center gap-2">
                        <StatusBadge status={selectedVendorForView.status} />
                        <span className="text-[10px] font-bold text-slate-300">•</span>
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{selectedVendorForView.rating} RATING</span>
                    </div>
                  </div>
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Number</p>
                      <p className="text-sm font-black text-slate-900 tabular-nums">+91 {selectedVendorForView.phone}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-black text-slate-900 lowercase">{selectedVendorForView.email || 'Not Provided'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GSTIN Details</p>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{selectedVendorForView.gst || 'N/A'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                      <div className="flex items-center gap-1.5 text-green-600">
                         <CheckCircle2 size={12} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
                      </div>
                   </div>
                   <div className="col-span-2 space-y-1 border-t border-slate-100 pt-6">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Physical Business Address</p>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed uppercase">{selectedVendorForView.address || 'Address not registered'}</p>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setSelectedVendorForView(null)}
                    className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-black transition-all"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
