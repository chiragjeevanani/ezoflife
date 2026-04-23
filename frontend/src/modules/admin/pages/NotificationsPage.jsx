import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCheck, Clock, Shield, Globe, ArrowRight, Zap, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { notificationApi } from '../../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const adminRaw = localStorage.getItem('adminData') || localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
            const adminData = JSON.parse(adminRaw);
            const adminId = adminData._id || adminData.id || adminData.user?._id || adminData.user?.id;
            
            if (!adminId) return;

            const data = await notificationApi.getNotifications(adminId, 'admin');
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
            // Optimistic update
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const clearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear all notifications?')) return;
        try {
            const adminRaw = localStorage.getItem('adminData') || localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
            const adminData = JSON.parse(adminRaw);
            const adminId = adminData._id || adminData.id || adminData.user?._id || adminData.user?.id;

            if (!adminId) return;

            await notificationApi.clearAll(adminId, 'admin');
            setNotifications([]);
            toast.success('Notification history cleared');
        } catch (error) {
            toast.error('Failed to clear history');
        }
    };

    const getIcon = (type) => {
        const t = (type || '').toUpperCase();
        if (t.includes('JOB')) return <Zap className="text-amber-500" size={20} />;
        if (t.includes('ORDER')) return <Clock className="text-blue-500" size={20} />;
        if (t.includes('SECURITY')) return <Shield className="text-rose-500" size={20} />;
        return <Info className="text-slate-500" size={20} />;
    };

    const getColors = (type) => {
        const t = (type || '').toUpperCase();
        if (t.includes('JOB')) return 'bg-amber-50 border-amber-100';
        if (t.includes('ORDER')) return 'bg-blue-50 border-blue-100';
        if (t.includes('SECURITY')) return 'bg-rose-50 border-rose-100';
        return 'bg-slate-50 border-slate-200';
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Modern Dashboard Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Live Intelligence Feed</span>
                        </div>
                        
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-200 rotate-2">
                                <Bell size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Systems Log</h1>
                                <p className="text-slate-500 text-sm font-medium">Monitoring and operational alerts for the ezoflife ecosystem.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {notifications.length > 0 && (
                            <button 
                                onClick={clearHistory}
                                className="group flex items-center gap-2 px-6 py-3.5 bg-white text-slate-400 hover:text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 hover:border-rose-100 hover:bg-rose-50 shadow-sm"
                            >
                                <Trash2 size={14} className="group-hover:animate-bounce" />
                                Clear All Data
                            </button>
                        )}
                        <button 
                            onClick={fetchNotifications}
                            className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >
                            <Zap size={18} />
                        </button>
                    </div>
                </header>

                {/* Notifications Engine */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Feed...</span>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="grid gap-4">
                            <AnimatePresence mode="popLayout">
                                {notifications.map((notif, idx) => (
                                    <motion.div 
                                        key={notif._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => !notif.isRead && markRead(notif._id)}
                                        className={`group relative overflow-hidden p-6 rounded-[2.5rem] border transition-all duration-500 flex gap-6 items-start shadow-sm hover:shadow-xl hover:shadow-slate-200/50 ${
                                            notif.isRead 
                                            ? 'bg-white/40 border-slate-100 opacity-70 grayscale-[0.3]' 
                                            : 'bg-white border-white'
                                        }`}
                                    >
                                        {/* Status Glow */}
                                        {!notif.isRead && (
                                            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.2)]" />
                                        )}

                                        <div className={`w-14 h-14 shrink-0 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-6 ${getColors(notif.type)}`}>
                                            {getIcon(notif.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <h4 className={`text-sm font-black tracking-tight ${notif.isRead ? 'text-slate-500' : 'text-slate-900'}`}>
                                                        {notif.title}
                                                    </h4>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${notif.isRead ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}>
                                                        {notif.isRead ? 'Archived' : 'Active'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    <Clock size={12} className="opacity-50" />
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                    <span className="opacity-30">•</span>
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                            <p className={`text-[13px] font-bold leading-relaxed max-w-3xl mb-5 ${notif.isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {notif.message}
                                            </p>
                                            
                                            <div className="flex items-center flex-wrap gap-3">
                                                <div className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] border border-slate-100 group-hover:bg-white transition-all">
                                                    Event ID: {notif._id.slice(-6).toUpperCase()}
                                                </div>
                                                <div className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] border border-slate-100 group-hover:bg-white transition-all">
                                                    Scope: {notif.type || 'SYSTEM'}
                                                </div>
                                                
                                                {!notif.isRead && (
                                                    <motion.button 
                                                        whileHover={{ x: 5 }}
                                                        className="ml-auto flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest group-hover:underline"
                                                    >
                                                        Mark as Processing
                                                        <ArrowRight size={14} />
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Activity Indicator */}
                                        {!notif.isRead && (
                                            <div className="absolute top-8 right-8">
                                                <div className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600 m-auto"></span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] border border-slate-200 py-32 flex flex-col items-center justify-center text-center shadow-sm"
                        >
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 shadow-inner border border-slate-100 group">
                                <Shield size={40} className="text-slate-200 group-hover:text-slate-900 transition-colors duration-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-3">Workspace Clear</h3>
                            <p className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase max-w-[320px] leading-loose">
                                Your administrative queue is empty. <br/> All systems functional.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
