import React, { useMemo } from 'react';
import { IndianRupee, ShieldCheck, Zap, Truck, Save, RefreshCw, AlertCircle, TrendingUp, Settings2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import MetricRow from '../components/cards/MetricRow';
import { mockAdminData } from '../data/mockData';

export default function PricingConfig() {
  const initialGlobalFees = useMemo(() => ({
    essentialFee: 15,
    heritageFee: 25,
    expressSurcharge: 20,
    freeDeliveryLimit: 1499
  }), []);

  const initialVendorOverrides = useMemo(() => [
    { id: 'V-8821', name: 'CleanTech Solutions', category: 'Heritage', override: 22 },
    { id: 'V-8824', name: 'EcoWash Hub', category: 'Essential', override: 12 }
  ], []);

  const pricingStats = useMemo(() => [
    { label: 'Avg Commission', value: '18.2%', change: '+0.4%', trend: 'up', icon: TrendingUp },
    { label: 'Express Yield', value: '₹24.5K', change: '+2.1K', trend: 'up', icon: Zap, currency: 'INR' },
    { label: 'Logistics Subsidy', value: '₹8.2K', change: '-500', trend: 'down', icon: Truck, currency: 'INR' },
    { label: 'Pricing Integrity', value: '100%', trend: 'up', icon: ShieldCheck }
  ], []);

  const [globalFees, setGlobalFees] = React.useState(initialGlobalFees);
  const [vendorOverrides, setVendorOverrides] = React.useState(initialVendorOverrides);

  const handleSave = () => {
    alert('Global Pricing Policy Updated & Synced with Registry.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Pricing Policy" 
        actions={[
          { label: 'Reset to Defaults', icon: RefreshCw, variant: 'secondary' },
          { label: 'Save & Sync', icon: Save, variant: 'primary', onClick: handleSave }
        ]}
      />

      {/* Pricing Pulse */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            {pricingStats.map((stat, i) => (
                <MetricRow key={i} {...stat} />
            ))}
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Global Aggregator Fees */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Global Aggregator Fees</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Essential Tier Fee (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={globalFees.essentialFee}
                        onChange={(e) => setGlobalFees({...globalFees, essentialFee: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider opacity-60">
                    Applied to all standard wash, fold & daily wear services.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Heritage Tier Fee (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={globalFees.heritageFee}
                        onChange={(e) => setGlobalFees({...globalFees, heritageFee: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider opacity-60">
                    Reserved for premium dry cleaning, silk & heritage care.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-blue-600 text-white flex items-center justify-center">
                  <Truck size={16} />
                </div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Logistics & Express Config</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Express Surcharge (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={globalFees.expressSurcharge}
                        onChange={(e) => setGlobalFees({...globalFees, expressSurcharge: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Free Delivery Threshold (₹)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={globalFees.freeDeliveryLimit}
                        onChange={(e) => setGlobalFees({...globalFees, freeDeliveryLimit: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">INR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info / Tips */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-sm shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-blue-400" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Policy Impact</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest opacity-80">
                  Changes to global fees will take effect immediately for all new orders. Active orders will follow the policy at time of booking.
                </p>
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Avg Order Value</span>
                    <span className="text-[11px] font-black tabular-nums">₹1,240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Net Margin</span>
                    <span className="text-[11px] font-black tabular-nums text-emerald-400">14.2%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-sm space-y-6">
               <div className="flex items-center gap-3">
                  <Settings2 size={18} className="text-slate-900" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Vendor Specific Overrides</h3>
               </div>
               <div className="space-y-3">
                  {vendorOverrides.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-900 leading-none mb-1">{v.name}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{v.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-900">{v.override}%</span>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Manual Override</p>
                      </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-3 bg-slate-100 text-slate-500 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                 Configure Overrides
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
