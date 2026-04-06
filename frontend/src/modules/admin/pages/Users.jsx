import React, { useMemo } from 'react';
import { Users as UsersIcon, UserPlus, Mail, ShoppingBag, IndianRupee, MoreHorizontal, ShieldAlert, UserCheck, Activity, Star, Zap, Target } from 'lucide-react';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import MetricRow from '../components/cards/MetricRow';

export default function Users() {
  const users = useMemo(() => mockAdminData.users, []);

  const userStats = useMemo(() => [
    { label: 'Total Registered Users', value: '1,240', change: '+142', trend: 'up', icon: UsersIcon },
    { label: 'Retention Rate', value: '84.2%', change: '+2.4%', trend: 'up', icon: Target },
    { label: 'Daily Active Users', value: '124', change: '+18', trend: 'up', icon: Activity },
    { label: 'Conversion Rate', value: '4.8%', change: '+0.2%', trend: 'up', icon: Zap }
  ], []);

  const userColumns = useMemo(() => [
    { 
      header: 'Customer', 
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400">
             <img src="https://lh3.googleusercontent.com/a/ACg8ocL_X_X_X_X_X_X_X_X_X_X_X=s96-c" alt={val} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-[11px] uppercase tracking-tight leading-none mb-1">{val}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5 tabular-nums leading-none">
              <Mail size={10} className="text-slate-300" /> {row.email}
            </span>
          </div>
        </div>
      )
    },
    { 
      header: 'Order Stats', 
      key: 'orders',
      render: (val) => (
        <div className="flex flex-col gap-1.5">
           <div className="flex items-center gap-1.5">
              <ShoppingBag size={10} className="text-slate-400" />
              <span className="font-bold text-slate-900 tabular-nums text-xs">{val} <span className="text-[10px] opacity-20 ml-1 uppercase leading-none tracking-widest">ORDERS COMPLETED</span></span>
           </div>
           <div className="w-20 h-1 bg-slate-50 border border-slate-100 rounded-sm relative overflow-hidden">
              <div className="h-full bg-slate-900" style={{ width: `${Math.min(val * 5, 100)}%` }} />
           </div>
        </div>
      )
    },
    { 
      header: 'Total Spent', 
      key: 'spent', 
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
        <div className="flex items-center justify-end gap-2.5">
          <button className={`p-2 rounded-sm border transition-all ${row.status === 'Active' ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'}`}>
            {row.status === 'Active' ? <ShieldAlert size={13} /> : <UserCheck size={13} />}
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Users" 
        actions={[
          { label: 'Register New User', icon: UserPlus, variant: 'primary' }
        ]}
      />

      {/* Engagement Intelligence Layer */}
      <div className="bg-white border-b border-slate-200 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 divide-x divide-slate-100 max-w-[1600px] mx-auto w-full">
            {userStats.map((stat, i) => (
                <MetricRow key={i} {...stat} />
            ))}
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* User Index */}
        <DataGrid 
          title="Master User Index"
          columns={userColumns}
          data={users}
          onAction={(row) => console.log('Viewing user detail', row.id)}
        />
      </div>
    </div>
  );
}
