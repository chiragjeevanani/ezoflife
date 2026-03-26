import React from 'react';
import { Home, ChevronRight, PlusCircle, RefreshCw, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PageHeader({ title, showBack = false, actions = [] }) {
    const navigate = useNavigate();
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(p => p !== '');

    return (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 min-h-[44px]">
            <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <button onClick={() => navigate(-1)} className="p-1.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-400 hover:text-slate-900 transition-all">
                            <ChevronRight size={14} className="rotate-180" />
                        </button>
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-0.5 opacity-60">
                            <Home size={10} className="text-slate-400" />
                            <ChevronRight size={8} className="text-slate-300" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pathParts[0].replace('-', ' ')}</span>
                        </div>
                        <h1 className="text-sm font-bold text-slate-900 tracking-tighter uppercase leading-none">{title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={action.onClick}
                            className={`px-3 py-1.5 rounded-sm font-bold text-[9px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                                action.variant === 'primary' 
                                ? 'bg-slate-900 text-white hover:bg-black' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {action.icon && <action.icon size={13} />}
                            {action.label}
                        </button>
                    ))}
                    <div className="h-6 w-px bg-slate-100 mx-1" />
                    <button className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-sm transition-all relative group">
                        <RefreshCw size={13} className="group-active:animate-spin" />
                    </button>
                </div>
            </div>
        </div>
    );
}
