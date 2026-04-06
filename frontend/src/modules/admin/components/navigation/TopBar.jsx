import React from 'react';
import { Search, Bell, Menu, User, Calendar, Home, ChevronRight, Globe, LifeBuoy } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function TopBar() {
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(p => p !== '');

    return (
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300">
            {/* Context Explorer (Breadcrumbs) */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-[0.2em] border-r border-slate-100 pr-5">
                    <Home size={12} className="text-slate-900" />
                    <ChevronRight size={10} />
                    <span className="text-slate-900 uppercase">SPINZYT ADMIN</span>
                    {pathParts.slice(1).map((part, i) => (
                        <React.Fragment key={part}>
                            <ChevronRight size={10} />
                            <span className="text-slate-400 uppercase transition-colors hover:text-slate-900 cursor-pointer">
                                {part.replace('-', ' ')}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
                <h1 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight tabular-nums leading-none">
                    {pathParts[pathParts.length - 1]?.replace('-', ' ') || 'Insights Dashboard'}
                </h1>
            </div>

            {/* Application Command Engine (Actions) */}
            <div className="flex items-center gap-4">
                {/* Search Orchestrator */}
                <div className="relative group hidden lg:block">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search records / entities..." 
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-sm text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-300 transition-all outline-none w-72 placeholder:text-slate-300"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-6 w-px bg-slate-200 mx-2" />
                    <button className="w-9 h-9 flex items-center justify-center rounded-sm bg-slate-50 text-slate-400 hover:text-slate-900 transition-all relative border border-slate-100 group">
                        <Bell size={16} className="group-hover:animate-shake" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                    </button>
                    
                    <button className="w-9 h-9 flex items-center justify-center rounded-sm bg-slate-50 text-slate-400 hover:text-slate-900 transition-all relative border border-slate-100 group">
                        <LifeBuoy size={16} />
                    </button>

                    <div className="flex items-center gap-3 pl-2 group cursor-pointer transition-all active:scale-98">
                        <div className="w-8 h-8 rounded-sm bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold transition-transform overflow-hidden border border-slate-200">
                             <img src="https://lh3.googleusercontent.com/a/ACg8ocL_X_X_X_X_X_X_X_X_X_X_X=s96-c" alt="Agent" className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden xl:flex flex-col">
                            <span className="text-[10px] font-bold text-slate-900 uppercase leading-none truncate">System Admin</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-80">PRO LEVEL</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
