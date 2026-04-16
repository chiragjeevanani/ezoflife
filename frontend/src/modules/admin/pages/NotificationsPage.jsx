import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCheck, Clock, Shield, Globe, ArrowRight } from 'lucide-react';
import { notificationApi } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getNotifications('66112c3f8e4b8a2e5c8b4568', 'admin');
            if (Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (error) {
            console.error('Fetch Notif Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const clearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear all notifications?')) return;
        try {
            await notificationApi.clearAll('66112c3f8e4b8a2e5c8b4568', 'admin');
            setNotifications([]);
            toast.success('Notification history cleared');
        } catch (error) {
            toast.error('Failed to clear history');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200">
                            <Bell size={24} />
                        </div>
                        Administrative Feed
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Real-time system signals and operational alerts
                    </p>
                </div>
                
                {notifications.length > 0 && (
                    <button 
                        onClick={clearHistory}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                    >
                        <Trash2 size={14} />
                        Clear History
                    </button>
                )}
            </div>

            {/* Notifications Grid */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div 
                            key={notif._id}
                            onClick={() => !notif.isRead && markRead(notif._id)}
                            className={`group relative p-6 rounded-[2rem] border transition-all cursor-pointer flex gap-6 items-start ${
                                notif.isRead 
                                ? 'bg-slate-50 border-slate-100 opacity-60 grayscale-[0.5]' 
                                : 'bg-white border-white shadow-xl shadow-slate-200/50 border-l-4 border-l-blue-600'
                            }`}
                        >
                            <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                                notif.isRead ? 'bg-slate-200 text-slate-500' : 'bg-blue-600 text-white'
                            }`}>
                                <Globe size={24} />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h4 className={`text-sm font-black tracking-tight uppercase ${notif.isRead ? 'text-slate-500' : 'text-slate-900'}`}>
                                        {notif.title}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                            <Clock size={12} />
                                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <p className={`text-[13px] font-bold leading-relaxed max-w-2xl ${notif.isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {notif.message}
                                </p>
                                
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        Type: {notif.type || 'SYSTEM'}
                                    </div>
                                    {!notif.isRead && (
                                        <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCheck size={14} />
                                            Mark as processing
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!notif.isRead && (
                                <div className="absolute top-6 right-8 w-3 h-3 bg-blue-600 rounded-full animate-ping opacity-20" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 py-32 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm">
                            <Bell size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-3">Quiet Feed</h3>
                        <p className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase max-w-[280px] leading-loose">
                            No operational alerts currently pending your attention.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
