import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PlusCircle, Settings, IndianRupee, Layers, CheckCircle2, XCircle, RotateCw, Filter, Download, ArrowRight, Trash2 } from 'lucide-react';
import { serviceApi } from '../../../lib/api';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import MetricRow from '../components/cards/MetricRow';

export default function Services() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All' or 'Pending'

  const fetchServices = async () => {
    try {
      setLoading(true);
      const services = await serviceApi.getAll();
      setData(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const serviceStats = useMemo(() => [
    { label: 'Service Points', value: data.length.toString(), change: '+2', trend: 'up', icon: Sparkles },
    { label: 'Laundry Yield', value: '₹124.2K', change: '+12.4K', trend: 'up', icon: IndianRupee, currency: 'INR' },
    { label: 'Dry Clean Base', value: '08', change: '+1', trend: 'up', icon: Layers },
    { label: 'Network Avg Price', value: '₹420', change: '+18', trend: 'up', icon: Settings, currency: 'INR' }
  ], [data.length]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Laundry',
    basePrice: '',
    unit: 'kg',
    tier: 'Essential',
    status: 'Active',
    image: '',
    description: ''
  });

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        category: service.category,
        basePrice: service.basePrice,
        unit: service.unit,
        tier: service.tier || 'Essential',
        status: service.status,
        image: service.image || '',
        description: service.description || ''
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        category: 'Laundry',
        basePrice: '',
        unit: 'kg',
        tier: 'Essential',
        status: 'Active',
        image: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
        const payload = { 
            ...formData, 
            basePrice: Number(formData.basePrice)
        };
        if (editingService) {
            await serviceApi.update(editingService._id, payload);
        } else {
            await serviceApi.create(payload);
        }
        await fetchServices();
        setIsModalOpen(false);
        alert(`Service ${editingService ? 'updated' : 'created'} successfully!`);
    } catch (error) {
        console.error('Error saving service:', error);
        alert('Failed to save service');
    }
  };

  const handleApprove = async (id) => {
    try {
        await serviceApi.update(id, { approvalStatus: 'Approved', status: 'Inactive' });
        await fetchServices();
        alert('Service approved successfully!');
    } catch (error) {
        console.error('Error approving service:', error);
        alert('Failed to approve service');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
        try {
            await serviceApi.delete(id);
            await fetchServices();
            alert('Service deleted successfully');
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service');
        }
    }
  };


  const serviceColumns = useMemo(() => [
    { 
      header: 'Service Name', 
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3 transition-transform">
          <div className="w-10 h-10 rounded-sm bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center group-hover:border-slate-900 transition-all">
             {row.image ? (
               <img src={row.image} alt={val} className="w-full h-full object-cover" />
             ) : (
               <Sparkles size={14} className="text-slate-400" />
             )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 text-[11px] uppercase tracking-tight leading-none">{val}</span>
                {!row.isMaster && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-sm text-[7px] font-black uppercase tracking-tighter border border-amber-100">Vendor</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5 tabular-nums leading-none">
                <Layers size={10} className="text-slate-300" /> {row.category}
              </span>
            </div>
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
      header: 'Approval', 
      key: 'approvalStatus', 
      render: (val) => <StatusBadge status={val} /> 
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
      render: (val, row) => (
        <div className="flex items-center justify-end gap-2.5">
          {row.approvalStatus === 'Pending' && (
            <button 
              onClick={() => handleApprove(row._id)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-sm text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={11} /> APPROVE
            </button>
          )}
          <button 
            onClick={() => openModal(row)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-sm text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all flex items-center gap-2 group"
          >
            <Settings size={11} className="group-hover:rotate-90 transition-transform duration-500" /> EDIT
          </button>
          <button 
            onClick={() => handleDelete(row._id)}
            className="px-4 py-2 bg-white border border-red-200 text-red-500 rounded-sm text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center gap-2 group"
          >
            <Trash2 size={11} className="group-hover:scale-110 transition-transform" /> DELETE
          </button>
        </div>
      )
    }

  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Services" 
        actions={[
          { label: 'Add New Service', icon: PlusCircle, variant: 'primary', onClick: () => openModal() }
        ]}
      />

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden border border-slate-200"
          >
            <form onSubmit={handleSave} className="flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{editingService ? 'Edit Configuration' : 'Create Master Service'}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Registry Update Protocol</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Service Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none cursor-pointer"
                    >
                      <option value="Laundry">Laundry</option>
                      <option value="Dry Cleaning">Dry Cleaning</option>
                      <option value="Ironing">Ironing</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Base Price (₹)</label>
                    <input 
                      required
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Unit</label>
                    <input 
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Tier Assignment</label>
                    <div className="flex gap-2">
                      {['Essential', 'Heritage'].map(t => (
                        <button 
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, tier: t })}
                          className={`flex-1 py-2.5 rounded-sm text-[9px] font-black uppercase tracking-widest border transition-all ${formData.tier === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Image URL (Live Preview)</label>
                  <input 
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                  />
                  {formData.image && (
                    <div className="mt-2 w-20 h-20 rounded-sm border border-slate-200 overflow-hidden bg-slate-100">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                   )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Service Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe the service details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] bg-white border border-slate-200 rounded-sm hover:bg-slate-100 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-sm shadow-xl shadow-slate-900/10 hover:bg-black transition-all"
                >
                  {editingService ? 'Commit Configuration' : 'Register Service'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Distribution Performance Index */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            {serviceStats.map((stat, i) => (
                <MetricRow key={i} {...stat} />
            ))}
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Tabs for Filtering */}
        <div className="flex gap-8 border-b border-slate-200 mb-6 font-bold text-[10px] uppercase tracking-[0.2em]">
            <button 
                onClick={() => setActiveTab('All')}
                className={`pb-4 px-2 transition-all relative ${activeTab === 'All' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                All Services ({data.length})
            </button>
            <button 
                onClick={() => setActiveTab('Pending')}
                className={`pb-4 px-2 transition-all relative ${activeTab === 'Pending' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Pending Approvals ({data.filter(s => s.approvalStatus === 'Pending').length})
                {data.filter(s => s.approvalStatus === 'Pending').length > 0 && (
                    <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full inline-block animate-pulse" />
                )}
            </button>
        </div>

        {/* Service List */}
        {loading ? (
            <div className="p-20 flex items-center justify-center bg-white border border-slate-200 rounded-sm animate-pulse">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Registry...</span>
                </div>
            </div>
        ) : (
            <DataGrid 
                title={activeTab === 'Pending' ? "Approval Queue" : "Master Service Registry"}
                columns={serviceColumns}
                data={data.filter(s => activeTab === 'All' ? true : s.approvalStatus === 'Pending')}
                onAction={(row) => openModal(row)}
            />
        )}
      </div>

    </div>
  );
}
