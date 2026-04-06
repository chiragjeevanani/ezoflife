import React, { useMemo } from 'react';
import { 
    Building2, 
    Mail, 
    Phone, 
    Calendar, 
    FileText, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    Download,
    Filter
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';

export default function B2BLeads() {
    const leads = useMemo(() => [
        { 
            id: 'B2B-001', 
            company: 'The Grand Regency Hotel', 
            contact: 'Sarah Jenkins', 
            email: 'sarah@regency.com', 
            requirement: 'Daily Linen & Towel Laundry (500kg+)', 
            status: 'New', 
            date: '2026-04-04' 
        },
        { 
            id: 'B2B-002', 
            company: 'Fit & Flow Gym Network', 
            contact: 'Mike Ross', 
            email: 'mike@fitflow.com', 
            requirement: 'Weekly Towel Wash (200 units)', 
            status: 'Contacted', 
            date: '2026-04-03' 
        },
        { 
            id: 'B2B-003', 
            company: 'Precision Med Labs', 
            contact: 'Dr. Anita', 
            email: 'admin@pmed.com', 
            requirement: 'Sterilized Apron Cleaning', 
            status: 'Quoted', 
            date: '2026-04-02' 
        },
        { 
            id: 'B2B-004', 
            company: 'Corporate Suites HSR', 
            contact: 'John Doe', 
            email: 'procurement@corpsuites.com', 
            requirement: 'Staff Uniforms (Dry Clean)', 
            status: 'Qualified', 
            date: '2026-04-01' 
        }
    ], []);

    const leadStats = useMemo(() => [
        { label: 'New Inquiries', value: '12', subValue: '+4 today', variant: 'slate' },
        { label: 'Active Negotiations', value: '28', variant: 'slate' },
        { label: 'Estimated Pipeline', value: '₹4.8M', variant: 'primary' },
        { label: 'Conversion Rate', value: '32.4%', variant: 'dark' }
    ], []);

    const leadColumns = useMemo(() => [
        { 
            header: 'Entity / Lead', 
            key: 'company',
            render: (val, row) => (
                <div className="flex items-center gap-3 transition-transform">
                    <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                        <Building2 size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[11px] uppercase tracking-tight leading-none mb-1">{val}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-1.5 tabular-nums leading-none">
                                {row.contact}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Primary Request', 
            key: 'requirement',
            render: (val) => (
                <div className="max-w-[250px]">
                    <p className="text-[10px] font-bold text-slate-600 line-clamp-1 italic uppercase tracking-tighter">"{val}"</p>
                </div>
            )
        },
        { 
            header: 'Lead Status', 
            key: 'status', 
            render: (val) => <StatusBadge status={val} /> 
        },
        { 
            header: 'Inbound Date', 
            key: 'date', 
            render: (val) => (
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest tabular-nums opacity-60 flex items-center gap-2">
                    <Calendar size={10} className="text-slate-200" /> {val}
                </span>
            )
        },
        { 
            header: 'Administrative Actions', 
            key: 'actions', 
            align: 'right',
            render: (val, row) => (
                <div className="flex items-center justify-end gap-2.5">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-sm text-[8px] font-black uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all flex items-center gap-2">
                        View Lead Profile <ArrowRight size={11} />
                    </button>
                </div>
            )
        }
    ], []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
            <PageHeader 
                title="B2B Leads Repository" 
                actions={[
                    { label: 'Export Leads (CSV)', icon: Download, variant: 'secondary' },
                    { label: 'Register Manual Lead', icon: Building2, variant: 'primary' }
                ]}
            />

            <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
                {/* Tactical Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {leadStats.map((stat, i) => (
                        <div key={i} className={`${stat.variant === 'dark' ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'} p-6 rounded-sm border flex flex-col gap-2 ${stat.variant === 'primary' ? 'text-primary' : ''}`}>
                            <span className={`text-[9px] font-black ${stat.variant === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest italic leading-none ${stat.variant === 'primary' ? 'opacity-60' : ''}`}>{stat.label}</span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-black ${stat.variant === 'dark' ? 'text-white' : 'text-slate-900'} tabular-nums italic leading-none`}>{stat.value}</span>
                                {stat.subValue && <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{stat.subValue}</span>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lead Registry */}
                <DataGrid 
                    title="Enterprise Inquiry Feed"
                    columns={leadColumns}
                    data={leads}
                    onAction={(row) => console.log('Opening lead', row.id)}
                />
            </div>
        </div>
    );
}
