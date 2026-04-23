import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNav from '../components/VendorBottomNav';
import socket from '../../../lib/socket';
import { orderApi } from '../../../lib/api';
import useNotificationStore from '../../../shared/stores/notificationStore';
import useVendorOrderStore from '../../../shared/stores/vendorOrderStore';

const VendorLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const { incomingRequest, setIncomingRequest, clearIncomingRequest } = useVendorOrderStore();
    const [acceptingId, setAcceptingId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(45);
    const { addNotification } = useNotificationStore();

    const vendorData = JSON.parse(localStorage.getItem('vendorData') || localStorage.getItem('user') || '{}');
    const vendorId = vendorData?._id || vendorData?.id || vendorData?.user?._id || vendorData?.user?.id;

    // Timer logic for incoming request
    useEffect(() => {
        let timer;
        if (incomingRequest) {
            setTimeLeft(45);
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        clearIncomingRequest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [incomingRequest, clearIncomingRequest]);

    // Socket Logic
    useEffect(() => {
        if (!vendorId) return;

        const handleNewOrder = async (data) => {
            setIncomingRequest({
                _id: data.orderId,
                orderId: data.displayId,
                items: [{ name: 'New Order Request', quantity: 1 }],
            });

            try {
                const fullDetail = await orderApi.getById(data.orderId);
                setIncomingRequest(fullDetail);
                addNotification('order_available', 'New Order Nearby', `Order ${data.displayId} is available.`, 'vendor');
            } catch (err) {
                console.error('Error fetching full order in layout', err);
            }
        };

        const handleNewNotification = (data) => {
            if (data.role === 'vendor' || data.recipient === vendorId) {
                addNotification(
                    data.notification.type || 'info',
                    data.notification.title,
                    data.notification.message,
                    'vendor'
                );
            }
        };

        socket.emit('join_room', 'vendors_pool');
        socket.emit('join_room', `user_${vendorId}`);

        socket.on('new_order_available', handleNewOrder);
        socket.on('new_notification', handleNewNotification);

        return () => {
            socket.off('new_order_available', handleNewOrder);
            socket.off('new_notification', handleNewNotification);
        };
    }, [vendorId, addNotification, setIncomingRequest]);

    const handleAccept = async (orderId) => {
        try {
            setAcceptingId(orderId);
            await orderApi.vendorAcceptOrder(orderId, vendorId);
            clearIncomingRequest();
            navigate(`/vendor/order/${orderId}`);
        } catch (err) {
            alert('Order already taken or error occurred.');
        } finally {
            setAcceptingId(null);
        }
    };

    const hideNavRoutes = ['/vendor/auth', '/vendor/otp', '/vendor/register', '/vendor/upload-documents', '/vendor/approval-pending'];
    const showNav = !hideNavRoutes.includes(currentPath);

    const hideHeaderRoutes = [
        ...hideNavRoutes,
        '/vendor/order/', // Hide on order details
        '/vendor/walkin',
        '/vendor/fulfillment',
        '/vendor/promotions',
        '/vendor/reviews'
    ];
    const showHeader = !hideHeaderRoutes.some(path => currentPath.startsWith(path));

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            {showHeader && <VendorHeader />}
            
            <main className="flex-1 pb-24">
                <Outlet />
            </main>

            {showNav && <VendorBottomNav />}

            {/* Global Incoming Request Modal */}
            <AnimatePresence>
                {incomingRequest && (
                    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0a0f18]/90 backdrop-blur-xl"
                            onClick={() => clearIncomingRequest()}
                        />
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 100 }}
                            className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-[5001] overflow-hidden"
                        >
                            <div className="h-2 bg-[#73e0c9]"></div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-100 text-rose-500 font-bold text-[10px] uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                        Expires in 00:{timeLeft.toString().padStart(2, '0')}
                                    </div>
                                    <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        {incomingRequest.orderId}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-[#73e0c9]/10 flex items-center justify-center text-[#73e0c9]">
                                        <span className="material-symbols-outlined text-3xl animate-bounce">notifications_active</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase">Incoming Request</h3>
                                </div>

                                <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 border border-slate-100">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                        <span>Status</span>
                                        <span className="text-[#73e0c9]">New Near You</span>
                                    </div>
                                    <div className="h-px bg-slate-200"></div>
                                    <p className="text-xs font-bold text-slate-600">Fresh order available in your service area. Review and accept to proceed.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => handleAccept(incomingRequest._id)}
                                        disabled={acceptingId === incomingRequest._id}
                                        className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                                    >
                                        {acceptingId === incomingRequest._id ? 'Accepting...' : 'Accept Order'}
                                    </button>
                                    <button
                                        onClick={() => clearIncomingRequest()}
                                        className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-widest"
                                    >
                                        Ignore
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorLayout;
