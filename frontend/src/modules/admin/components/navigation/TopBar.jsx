import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, User, Calendar, Home, ChevronRight, Globe, LifeBuoy } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { notificationApi } from '../../../../lib/api';
import toast from 'react-hot-toast';
import socket from '../../../../lib/socket';

export default function TopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathParts = location.pathname.split('/').filter(p => p !== '');
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getNotifications('66112c3f8e4b8a2e5c8b4568', 'admin');
            if (Array.isArray(data)) {
                setUnreadCount(data.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Fetch Notif Error:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Listen for real-time notifications
        socket.on('new_notification', (data) => {
            console.log('⚡ Real-time notification received:', data);
            if (data.role === 'admin') {
                setUnreadCount(prev => prev + 1);
                toast.success('New Labor Requisition!', {
                    icon: '🔔',
                    style: {
                        borderRadius: '16px',
                        background: '#0f172a',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }
                });
            }
        });

        return () => {
            socket.off('new_notification');
        };
    }, []);

    return (
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300">
            {/* Context Explorer (Breadcrumbs) */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-[0.2em] border-r border-slate-100 pr-5">
                    <Home size={12} className="text-slate-900" />
                    <ChevronRight size={10} />
                    <span className="text-slate-900 uppercase tracking-tighter">SPINZYT ADMIN</span>
                    {pathParts.slice(1).map((part, i) => (
                        <React.Fragment key={part}>
                            <ChevronRight size={10} />
                            <span className="text-slate-500 uppercase transition-colors hover:text-slate-900 cursor-pointer text-[9px] font-black">
                                {part.replace('-', ' ')}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
                <h1 className="text-[12px] font-black text-slate-900 uppercase tracking-tight tabular-nums leading-none">
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
                    <button 
                        onClick={() => navigate('/admin/notifications')}
                        className="w-9 h-9 flex items-center justify-center rounded-sm bg-slate-50 text-slate-400 hover:text-slate-900 transition-all relative border border-slate-100 group shadow-sm hover:shadow-md"
                    >
                        <Bell size={16} className={unreadCount > 0 ? "animate-bounce text-slate-900" : "group-hover:animate-shake"} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-white"></span>
                            </span>
                        )}
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
