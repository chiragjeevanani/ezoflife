import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useNotificationStore from '../../../shared/stores/notificationStore';

const RiderDashboard = () => {
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(true);
    const notifications = useNotificationStore((state) => state.notifications);
    
    // Filter notifications for the 'rider' persona
    const riderBroadcasts = useMemo(() => 
        notifications.filter(n => n.persona === 'rider' && (n.type === 'ready' || n.type === 'assigned')),
    [notifications]);

    const initialTasks = useMemo(() => [
        { 
            id: 'SZ-8821', 
            type: 'Pickup', 
            vendor: 'Heritage Cleaners', 
            address: 'HSR Layout, Sector 7', 
            items: 12, 
            priority: 'Express', 
            status: 'Assigned',
            time: '12m'
        }, { 
            id: 'SZ-8824', 
            type: 'Delivery', 
            vendor: 'EcoWash Hub', 
            address: 'HSR Layout, Sector 2', 
            items: 8, 
            priority: 'Standard', 
            status: 'Delivered',
            time: '2h'
        }
    ], []);

    const stats = useMemo(() => [
        { label: 'Earnings', value: '₹842', icon: 'payments' },
        { label: 'Completed', value: '14', icon: 'task' },
        { label: 'Rating', value: '4.9', icon: 'grade' }
    ], []);

    const [activeTasks, setActiveTasks] = useState(initialTasks);

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-sans">
            {/* Real-time Status Header */}
            <header className="bg-white px-6 pt-6 pb-8 rounded-b-[2.5rem] shadow-sm border-b border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                            <span className="material-symbols-outlined text-xl">directions_bike</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Marcus V.</h1>
                            <div className="flex items-center gap-1.5 opacity-60">
                                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{isOnline ? 'Active on Fleet' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Toggle */}
                    <button 
                        onClick={() => setIsOnline(!isOnline)}
                        className={`w-14 h-8 rounded-full p-1 transition-all ${isOnline ? 'bg-emerald-600' : 'bg-slate-200'}`}
                    >
                        <motion.div 
                            layout
                            className="w-6 h-6 bg-white rounded-full shadow-md"
                            animate={{ x: isOnline ? 24 : 0 }}
                        />
                    </button>
                </div>

                {/* Dashboard Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">{stat.icon}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <p className="text-lg font-black text-slate-900 tabular-nums">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </header>

            <main className="px-6 py-8 space-y-8 max-w-xl mx-auto">
                {/* Logistics Feed */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Task Queue</h2>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{activeTasks.length + riderBroadcasts.length} Live Tasks</span>
                    </div>

                    <div className="space-y-4">
                        {/* Real-time Broadcast Notifications */}
                        <AnimatePresence>
                            {riderBroadcasts.map((notif) => (
                                <motion.div 
                                    key={notif.id}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-emerald-600 p-6 rounded-[2.5rem] shadow-xl shadow-emerald-600/30 text-white relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                                            <span className="material-symbols-outlined">radio</span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80">New Task Broadcast</span>
                                            <h4 className="text-sm font-black tracking-tight leading-tight mt-1">{notif.title}</h4>
                                            <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-widest line-clamp-1">{notif.message}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/rider/task/SZ-8821`)}
                                        className="w-full mt-6 py-3.5 bg-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                                    >
                                        Accept & Navigate
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {activeTasks.map((task) => (
                            <motion.div 
                                key={task.id}
                                layoutId={task.id}
                                onClick={() => navigate(`/rider/task/${task.id}`)}
                                className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-emerald-600 transition-all cursor-pointer overflow-hidden relative"
                            >
                                {/* Task Priority Bar */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${task.priority === 'Express' ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest ${task.type === 'Pickup' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                {task.type}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-900 uppercase">#{task.id}</span>
                                        </div>
                                        <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none italic uppercase">
                                            {task.vendor || task.customer}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Impact</p>
                                        <p className="text-[11px] font-black text-emerald-600 uppercase leading-none">+{task.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">near_me</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{task.address}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-emerald-600 text-sm">inventory_2</span>
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{task.items} Clean Articles</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10 flex items-center gap-2 transition-all active:scale-95">
                                        Details <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Offline Warning */}
                {!isOnline && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-slate-900 text-white rounded-[2rem] text-center border-t-4 border-emerald-500 shadow-2xl"
                    >
                        <span className="material-symbols-outlined text-3xl mb-3 text-emerald-500">wifi_off</span>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2">You are currently Offline</h3>
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-[0.1em] leading-relaxed">
                            Go online to start receiving task broadcasts <br/> for your current zone.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default RiderDashboard;
