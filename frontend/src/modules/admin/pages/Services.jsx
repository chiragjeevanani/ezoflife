import React from 'react';
import { Sparkles, PlusCircle, Settings, IndianRupee, Layers, CheckCircle2, XCircle, RotateCw, Filter, Download, ArrowRight } from 'lucide-react';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import MetricRow from '../components/cards/MetricRow';

export default function Services() {
  const initialServices = useMemo(() => mockAdminData.services, []);
  const [data, setData] = React.useState(initialServices);

  const serviceStats = useMemo(() => [
    { label: 'Service Points', value: data.length.toString(), change: '+2', trend: 'up', icon: Sparkles },
    { label: 'Laundry Yield', value: '₹124.2K', change: '+12.4K', trend: 'up', icon: IndianRupee, currency: 'INR' },
    { label: 'Dry Clean Base', value: '08', change: '+1', trend: 'up', icon: Layers },
    { label: 'Network Avg Price', value: '₹420', change: '+18', trend: 'up', icon: Settings, currency: 'INR' }
  ], [data.length]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState(null);

  const [formData, setFormData] = React.useState({
    name: '',
    category: '',
    basePrice: '',
    unit: 'kg',
    tier: 'Essential',
    status: 'Active'
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
        status: service.status
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        category: '',
        basePrice: '',
        unit: 'kg',
        tier: 'Essential',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingService) {
      setData(data.map(s => s.name === editingService.name ? { ...formData, basePrice: Number(formData.basePrice) } : s));
    } else {
      setData([{ ...formData, basePrice: Number(formData.basePrice) }, ...data]);
    }
    setIsModalOpen(false);
    alert(`Service ${editingService ? 'updated' : 'created'} successfully!`);
  };

  const serviceColumns = useMemo(() => [
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
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5 tabular-nums leading-none">
                <Layers size={10} className="text-slate-300" /> {row.category}
              </span>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border ${row.tier === 'Heritage' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'} uppercase tracking-widest`}>
                {row.tier || 'Essential'}
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
          <button 
            onClick={() => openModal(row)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-sm text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all flex items-center gap-2"
          >
            <Settings size={11} className="group-hover:rotate-90 transition-transform duration-500" /> EDIT SERVICE
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
        {/* Service List */}
        <DataGrid 
          title="Master Service Registry"
          columns={serviceColumns}
          data={data}
          onAction={(row) => openModal(row)}
        />
      </div>
    </div>
  );
}
