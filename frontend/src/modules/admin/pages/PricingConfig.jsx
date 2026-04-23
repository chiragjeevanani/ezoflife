import React, { useState, useEffect, useMemo } from 'react';
import { Truck, Zap, Save, RefreshCw, AlertCircle, TrendingUp, Clock, Info, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import MetricRow from '../components/cards/MetricRow';
import { adminApi } from '@/lib/api';
import { shippingConfigApi } from '@/lib/shippingApi';
import toast from 'react-hot-toast';

export default function PricingConfig() {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [expressSurcharge, setExpressSurcharge] = useState(99);
  const [normalLogisticsFee, setNormalLogisticsFee] = useState(50);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await shippingConfigApi.getConfig();
      setConfigs(data);
      
      // Map keys to state
      const surcharge = data.find(c => c.key === 'express_surcharge');
      if (surcharge) setExpressSurcharge(surcharge.value);

      const normalFee = data.find(c => c.key === 'normal_logistics_fee');
      if (normalFee) setNormalLogisticsFee(normalFee.value);
    } catch (err) {
      toast.error('Failed to load system configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await Promise.all([
        shippingConfigApi.updateConfig('express_surcharge', Number(expressSurcharge)),
        shippingConfigApi.updateConfig('normal_logistics_fee', Number(normalLogisticsFee))
      ]);
      toast.success('Delivery policies updated successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to update policies');
    } finally {
      setIsSaving(false);
    }
  };

  const deliveryStats = useMemo(() => [
    { label: 'Active Modes', value: '2', icon: Truck, color: 'text-blue-600' },
    { label: 'Express Uplift', value: `₹${expressSurcharge}`, icon: Zap, color: 'text-amber-500' },
    { label: 'Market Standard', value: '₹120', icon: Info, color: 'text-slate-400' },
    { label: 'System Health', value: 'PREMIUM', icon: ShieldCheck, color: 'text-emerald-500' }
  ], [expressSurcharge]);

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
        title="Delivery Management" 
        actions={[
          { label: 'Refresh Data', icon: RefreshCw, variant: 'secondary', onClick: fetchData },
          { label: isSaving ? 'Syncing...' : 'Save & Deploy', icon: Save, variant: 'primary', onClick: handleSave, disabled: isSaving }
        ]}
      />

      {/* Metrics Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto w-full flex overflow-x-auto no-scrollbar">
            {deliveryStats.map((stat, i) => (
                <div key={i} className="flex-1 min-w-[200px] p-6 border-r border-slate-100 last:border-0 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-xl font-black text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} bg-slate-50 p-2.5 rounded-xl`}>
                        <stat.icon size={20} />
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-8">
            {/* Global Logistics Section */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Platform Logistics Pricing</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global delivery fee configuration</p>
                    </div>
                </div>
                
                <div className="p-10 space-y-10">
                    {/* Normal Fee */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Normal Logistics Fee (₹)</label>
                            <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-tighter border border-slate-100">Standard</span>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-sm">₹</span>
                            </div>
                            <input 
                                type="number" 
                                value={normalLogisticsFee}
                                onChange={(e) => setNormalLogisticsFee(e.target.value)}
                                className="w-full pl-10 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-black text-slate-900 focus:bg-white focus:ring-4 ring-primary/5 focus:border-primary/20 transition-all outline-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Express Fee */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Express Surcharge (₹)</label>
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-tighter border border-amber-100">Most Used</span>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-sm">₹</span>
                            </div>
                            <input 
                                type="number" 
                                value={expressSurcharge}
                                onChange={(e) => setExpressSurcharge(e.target.value)}
                                className="w-full pl-10 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-base font-black text-slate-900 focus:bg-white focus:ring-4 ring-primary/5 focus:border-primary/20 transition-all outline-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <Info size={14} className="text-blue-500 mt-0.5" />
                        <p className="text-[10px] text-blue-600 font-bold leading-relaxed uppercase tracking-wider">
                            These logistics fees are applied based on the delivery urgency selected by the customer. Normal fee is the base cost, while Express surcharge is added on top.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-3 text-white/40">
                        <Zap size={20} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Protocol</span>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black tracking-tighter leading-none">Delivery Mode Logic</h3>
                        <p className="text-white/60 text-sm font-bold leading-relaxed">System handles logistics based on customer urgency. The following modes are currently active across the partner network.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group-hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-tight">Normal Mode</p>
                                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Vendor defined timeline • ₹{normalLogisticsFee} Fee</p>
                                </div>
                            </div>
                            <ShieldCheck size={16} className="text-emerald-400" />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-amber-500/10 rounded-3xl border border-amber-500/20 backdrop-blur-sm group-hover:border-amber-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-tight text-amber-500">Express Mode</p>
                                    <p className="text-[9px] font-bold text-amber-500/40 uppercase tracking-widest">Priority fulfillment • +₹{expressSurcharge} surcharge</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-black text-amber-500">₹{Number(normalLogisticsFee) + Number(expressSurcharge)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] space-y-6 shadow-sm">
               <div className="flex items-center gap-3 text-slate-400">
                  <AlertCircle size={20} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Compliance & Sync</h3>
               </div>
               <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                  Any changes to Express Surcharge will be applied immediately to all newly created carts. Vendors are responsible for fulfilling Express orders within their committed timelines.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
