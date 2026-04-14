import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useNotificationStore from '../../../shared/stores/notificationStore';
import { orderApi } from '../../../lib/api';
import { socket, connectSocket, disconnectSocket } from '../../../lib/socket';

const RiderDashboard = () => {
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(true);
    const { notifications, dismissOrderNotification, fetchNotifications, addNotification } = useNotificationStore();
    const [activeTasks, setActiveTasks] = useState([]);
    const [riderStats, setRiderStats] = useState({
        earnings: '₹0',
        completed: '0',
        rating: '0'
    });

    const riderData = JSON.parse(localStorage.getItem('riderData') || '{}');
    const riderId = riderData.id || riderData._id || localStorage.getItem('userId');
    
    console.log('--- RIDER DASHBOARD DEBUG ---');
    console.log('Current Rider ID:', riderId);
    console.log('Rider Data:', riderData);

    // Fetch Live Data
    const fetchData = useCallback(async () => {
        try {
            const [tasks, stats] = await Promise.all([
                orderApi.getRiderTasks(riderId),
                orderApi.getRiderStats(riderId),
                fetchNotifications(riderId, 'rider')
            ]);
            setActiveTasks(tasks || []);
            setRiderStats(stats);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    }, [riderId, fetchNotifications]);

    useEffect(() => {
        fetchData();
        connectSocket(riderId);
        
        if (riderId) {
            console.log('🔗 [SOCKET_ROOM] Joining room:', `user_${riderId}`);
            socket.emit('join_room', `user_${riderId}`);
        }

        socket.on('new_pickup_broadcast', (data) => {
            console.log('--- LOGISTICS BROADCAST RECEIVED ---', data);
            addNotification('pickup_available', 'New Pickup Task Available', `Pickup: ${data.pickupAddress}`, 'rider', {
                orderId: data.mongoOrderId,
                displayId: data.orderId,
                customer: data.customerName,
                from: data.pickupAddress,
                to: data.dropAddress,
                dist: data.distance,
                pay: data.earnings
            });
        });

        socket.on('rider_pool_update', (data) => {
            console.log('--- POOL UPDATE RECEIVED ---', data);
            if (data.action === 'removed') {
                fetchNotifications(riderId, 'rider');
                fetchData();
            }
        });

        // Polling as fallback (30 minutes)
        const interval = setInterval(fetchData, 1800000);
        
        return () => {
            clearInterval(interval);
            socket.off('new_pickup_broadcast');
            socket.off('rider_pool_update');
            disconnectSocket();
        };
    }, [riderId, fetchData, fetchNotifications]);
    

    const handleAcceptTask = async (notif) => {
        try {
            if (notif.orderId) {
                await orderApi.acceptTask(notif.orderId, riderId);
                dismissOrderNotification(notif.orderId);
            }
            fetchData(); // Refresh tasks
            navigate(`/rider/task/${notif.orderId || 'EZ-8821'}`);
        } catch (err) {
            alert('Claim Failed: ' + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('riderToken');
        localStorage.removeItem('riderData');
        localStorage.removeItem('userId');
        navigate('/rider/login');
    };

    // Filter notifications for the 'rider' persona
    const riderBroadcasts = useMemo(() => {
        const filtered = notifications.filter(n => n.persona === 'rider' && ['ready', 'assigned', 'order_placed', 'order_available', 'pickup_available'].includes(n.type));
        console.log('--- RIDER BROADCASTS FILTERED ---', { total: notifications.length, riderCount: filtered.length, items: filtered });
        return filtered;
    }, [notifications]);

    const stats = useMemo(() => [
        { label: 'Earnings', value: riderStats.earnings, icon: 'payments' },
        { label: 'Completed', value: riderStats.completed, icon: 'task' },
        { label: 'Rating', value: riderStats.rating, icon: 'grade' }
    ], [riderStats]);

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
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase italic">
                                {riderData.displayName || 'Fleet Member'}
                            </h1>
                            <div className="flex items-center gap-1.5 opacity-60">
                                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{isOnline ? 'Active on Fleet' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
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
                        {/* Logout Button */}
                        <button 
                            onClick={handleLogout}
                            className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center hover:bg-rose-100 transition-all"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined text-rose-500 text-lg">logout</span>
                        </button>
                    </div>
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
                                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    className="bg-emerald-600 rounded-[2.5rem] shadow-2xl shadow-emerald-500/40 text-white relative overflow-hidden"
                                >
                                    {/* Glass Decor */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    
                                    <div className="p-8 space-y-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <span className="material-symbols-outlined animate-bounce">radio</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">New Task</p>
                                                    <h4 className="text-sm font-black tracking-tight leading-tight">{notif.displayId || 'Broadcast'}</h4>
                                                </div>
                                            </div>
                                            <div className="text-right bg-black/20 px-3 py-1 rounded-lg">
                                                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Earnings</p>
                                                <p className="text-sm font-black italic">₹{notif.pay || '0.00'}</p>
                                            </div>
                                        </div>

                                        {/* Logistics Details */}
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Customer</p>
                                                    <p className="text-xs font-bold leading-none">{notif.customer || 'Loading...'}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Pickup</p>
                                                    <p className="text-[10px] font-bold leading-tight line-clamp-2">{notif.from || '---'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Drop (Shop)</p>
                                                    <p className="text-[10px] font-bold leading-tight line-clamp-2 text-emerald-100 italic">{notif.to || '---'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-white/10 p-3 rounded-2xl flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm opacity-60">near_me</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{notif.dist || '0.0'} km away</span>
                                            </div>
                                            <button 
                                                onClick={() => handleAcceptTask(notif)}
                                                className="px-8 py-4 bg-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {activeTasks.length > 0 ? activeTasks.map((task) => (
                            <motion.div 
                                key={task._id}
                                layoutId={task._id}
                                onClick={() => navigate(`/rider/task/${task._id}`)}
                                className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-emerald-600 transition-all cursor-pointer overflow-hidden relative"
                            >
                                {/* Task Priority Bar */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${task.status === 'Ready' ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest ${task.status === 'Assigned' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                {task.status}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-900 uppercase">{task.orderId}</span>
                                        </div>
                                        <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none italic uppercase">
                                            {task.customer?.displayName || 'Direct Order'}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fee</p>
                                        <p className="text-[11px] font-black text-emerald-600 uppercase leading-none">₹{(task.totalAmount * 0.05).toFixed(0)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">near_me</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{task.address}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-emerald-600 text-sm">inventory_2</span>
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{task.items?.length || 0} Clean Articles</span>
                                    </div>
                                    {!task.rider ? (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleAcceptTask({ orderId: task._id, title: 'Direct Order' }); }}
                                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 flex items-center gap-2 transition-all active:scale-95"
                                        >
                                            Accept Task <span className="material-symbols-outlined text-xs">check_circle</span>
                                        </button>
                                    ) : (
                                        <button className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10 flex items-center gap-2 transition-all active:scale-95">
                                            Details <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-10 opacity-40">
                                <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">No Active Assignments</p>
                            </div>
                        )}
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
