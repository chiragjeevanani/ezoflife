import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Truck, 
  Zap, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Info, 
  ShieldCheck,
  Gem,
  Award,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import MetricRow from '../components/cards/MetricRow';
import { shippingConfigApi } from '@/lib/shippingApi';
import toast from 'react-hot-toast';

export default function PricingConfig() {
  const [searchParams] = useSearchParams();
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [expressSurcharge, setExpressSurcharge] = useState(99);
  const [normalLogisticsFee, setNormalLogisticsFee] = useState(50);
  const [essentialFee, setEssentialFee] = useState(20);
  const [heritageFee, setHeritageFee] = useState(150);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(500);

  // Refs for auto-scrolling
  const sectionRefs = {
    express: useRef(null),
    essential: useRef(null),
    heritage: useRef(null),
    rates: useRef(null)
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await shippingConfigApi.getConfig();
      setConfigs(data);
      
      const surcharge = data.find(c => c.key === 'express_surcharge');
      if (surcharge) setExpressSurcharge(surcharge.value);

      const normalFee = data.find(c => c.key === 'normal_logistics_fee');
      if (normalFee) setNormalLogisticsFee(normalFee.value);

      const eFee = data.find(c => c.key === 'essential_fee');
      if (eFee) setEssentialFee(eFee.value);

      const hFee = data.find(c => c.key === 'heritage_fee');
      if (hFee) setHeritageFee(hFee.value);

      const threshold = data.find(c => c.key === 'free_delivery_threshold');
      if (threshold) setFreeDeliveryThreshold(threshold.value);
    } catch (err) {
      toast.error('Failed to load system configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && sectionRefs[type]?.current) {
        sectionRefs[type].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sectionRefs[type].current.classList.add('ring-4', 'ring-primary/20');
        setTimeout(() => {
            sectionRefs[type].current.classList.remove('ring-4', 'ring-primary/20');
        }, 3000);
    }
  }, [searchParams, isLoading]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await Promise.all([
        shippingConfigApi.updateConfig('express_surcharge', Number(expressSurcharge)),
        shippingConfigApi.updateConfig('normal_logistics_fee', Number(normalLogisticsFee)),
        shippingConfigApi.updateConfig('essential_fee', Number(essentialFee)),
        shippingConfigApi.updateConfig('heritage_fee', Number(heritageFee)),
        shippingConfigApi.updateConfig('free_delivery_threshold', Number(freeDeliveryThreshold))
      ]);
      toast.success('Pricing policies updated successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to update policies');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = useMemo(() => [
    { label: 'Normal Logistics', value: `${normalLogisticsFee}%`, icon: Truck, color: 'text-blue-600' },
    { label: 'Express Uplift', value: `${expressSurcharge}%`, icon: Zap, color: 'text-amber-500' },
    { label: 'Essential Base', value: `${essentialFee}%`, icon: Sparkles, color: 'text-emerald-500' },
    { label: 'Heritage Premium', value: `${heritageFee}%`, icon: Gem, color: 'text-purple-500' },
    { label: 'Free Delivery At', value: `₹${freeDeliveryThreshold}`, icon: Award, color: 'text-rose-500' }
  ], [expressSurcharge, normalLogisticsFee, essentialFee, heritageFee, freeDeliveryThreshold]);

  if (isLoading) {
    return (
        <div className="h-full w-full flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Services & Pricing" 
        actions={[
          { label: 'Refresh Data', icon: RefreshCw, variant: 'secondary', onClick: fetchData },
          { label: isSaving ? 'Syncing...' : 'Save & Deploy', icon: Save, variant: 'primary', onClick: handleSave, disabled: isSaving }
        ]}
      />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
            {stats.map((stat, i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-xl font-black text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} bg-slate-50 p-2.5 rounded-sm border border-slate-100`}>
                        <stat.icon size={18} />
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        
        {/* Logistics Rates Section */}
        <div ref={sectionRefs.rates} className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm transition-all duration-500">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Edit Delivery Rates</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform-wide logistics configuration</p>
                    </div>
                </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Normal Logistics Fee (%)</label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">%</span>
                        <input 
                            type="number" 
                            value={normalLogisticsFee}
                            onChange={(e) => setNormalLogisticsFee(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all"
                        />
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic leading-relaxed">Calculated as a percentage of the total order value for standard timelines.</p>
                </div>

                <div ref={sectionRefs.express} className="space-y-4 transition-all duration-500">
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                        Express Surcharge (%) <Zap size={10} className="fill-amber-600" />
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">%</span>
                        <input 
                            type="number" 
                            value={expressSurcharge}
                            onChange={(e) => setExpressSurcharge(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-amber-50/30 border border-amber-100 rounded-sm text-sm font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                    <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest italic leading-relaxed">Additional percentage added for priority/express fulfillment.</p>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                        Free Delivery Threshold (₹) <Award size={10} className="fill-rose-600" />
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₹</span>
                        <input 
                            type="number" 
                            value={freeDeliveryThreshold}
                            onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-rose-50/30 border border-rose-100 rounded-sm text-sm font-bold text-slate-900 focus:bg-white focus:border-rose-500 outline-none transition-all"
                        />
                    </div>
                    <p className="text-[9px] text-rose-600 font-bold uppercase tracking-widest italic leading-relaxed">Orders above this value will qualify for 100% shipping waiver.</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Essential Fee Card */}
            <div ref={sectionRefs.essential} className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm transition-all duration-500">
                <div className="p-6 bg-emerald-50/30 border-b border-emerald-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center rounded-sm">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest">Essential Service Fee</h3>
                        <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-1">Standard care protocols</p>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">%</span>
                        <input 
                            type="number" 
                            value={essentialFee}
                            onChange={(e) => setEssentialFee(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-100">
                        <Info size={14} className="text-slate-400 mt-0.5" />
                        <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                            Applied to 'Essential' tier services as a processing percentage per order line.
                        </p>
                    </div>
                </div>
            </div>

            {/* Heritage Fee Card */}
            <div ref={sectionRefs.heritage} className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm transition-all duration-500">
                <div className="p-6 bg-purple-50/30 border-b border-purple-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-600 text-white flex items-center justify-center rounded-sm">
                        <Gem size={18} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-purple-900 uppercase tracking-widest">Heritage Service Fee</h3>
                        <p className="text-[9px] font-bold text-purple-600/60 uppercase tracking-widest mt-1">Premium handling & care</p>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">%</span>
                        <input 
                            type="number" 
                            value={heritageFee}
                            onChange={(e) => setHeritageFee(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-sm border border-slate-100">
                        <Award size={14} className="text-slate-400 mt-0.5" />
                        <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                            Applied to 'Heritage' tier services as a premium handling percentage.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Global Policy Card */}
        <div className="bg-slate-900 rounded-sm p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-3 text-white/40">
                        <ShieldCheck size={20} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Operational Protocol</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter leading-none italic">Pricing Integrity Policy</h3>
                    <p className="text-white/60 text-[10px] font-bold leading-relaxed uppercase tracking-widest">
                        Any changes to fees and surcharges are synchronized across the entire network in real-time. Please ensure accuracy before deploying new rates as they directly impact customer checkout values.
                    </p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-10 py-5 bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-3 group/btn"
                >
                    {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    DEPLOY ALL RATES
                    <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>

        {/* Vendor Overrides Section */}
        <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm">
                        <Layers size={18} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Vendor Overrides</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Custom fee structures for specific partners</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-800 transition-all">
                    Create New Override
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Vendor Name</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Tier</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Default Fee</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Override Fee</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { name: 'Sandeep Laundry', tier: 'Essential', default: '20%', override: '15', status: 'Active', color: 'emerald' },
                            { name: 'Premium Dry Clean', tier: 'Heritage', default: '150%', override: '120', status: 'Active', color: 'emerald' },
                            { name: 'City Wash Express', tier: 'Essential', default: '20%', override: '20', status: 'Default', color: 'slate' },
                            { name: 'Elite Care Labs', tier: 'Heritage', default: '150%', override: '180', status: 'Expired', color: 'rose' }
                        ].map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${item.tier === 'Heritage' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {item.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[11px] font-bold text-slate-400 tabular-nums line-through">{item.default}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[11px] font-black text-slate-900 tabular-nums">{item.override}%</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500`} />
                                        <span className={`text-[9px] font-black uppercase tracking-widest text-${item.color}-600`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </button>
                                        <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button className="text-slate-400 hover:text-rose-600 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Showing active fee overrides for strategic vendor partners</p>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30" disabled>
                        <ChevronRight size={14} className="rotate-180" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30" disabled>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
