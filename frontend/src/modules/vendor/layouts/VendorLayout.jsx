import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorBottomNav from '../components/VendorBottomNav';
import socket from '../../../lib/socket';
import { orderApi } from '../../../lib/api';
import useNotificationStore from '../../../shared/stores/notificationStore';
import useVendorOrderStore from '../../../shared/stores/vendorOrderStore';

const VendorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { incomingRequest, setIncomingRequest, clearIncomingRequest } = useVendorOrderStore();
  const [acceptingId, setAcceptingId] = useState(null);
  const { addNotification } = useNotificationStore();

  const vendorData = JSON.parse(localStorage.getItem('vendorData') || '{}');
  const vendorId = vendorData?._id || vendorData?.id;

  const hasShowedToast = React.useRef(false);

  useEffect(() => {
    if (!vendorId) return;

    const handleNewOrder = async (data) => {
      console.log('Global Layout: New order available', data);
      
      setIncomingRequest({
        _id: data.orderId,
        orderId: data.displayId,
        items: [{ name: 'New Order Request', quantity: 1 }],
        specialInstructions: ''
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
        console.log('⚡ Vendor Socket: New notification received', data);
        if (data.role === 'vendor' || data.recipient === vendorId) {
            addNotification(
                data.notification.type || 'info',
                data.notification.title,
                data.notification.message,
                'vendor',
                { id: data.notification._id }
            );
        }
    };

    const joinRooms = () => {
      // Socket will connect automatically
      socket.emit('join_room', 'vendors_pool');
      if (vendorId) {
          socket.emit('join_room', `user_${vendorId}`);
      }
    };

    joinRooms();

    socket.on('new_order_available', handleNewOrder);
    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_order_available', handleNewOrder);
      socket.off('new_notification', handleNewNotification);
    };
  }, [vendorId]);

  const handleAccept = async (orderId) => {
    try {
      setAcceptingId(orderId);
      await orderApi.vendorAcceptOrder(orderId, vendorId);
      clearIncomingRequest();
      // Directly navigate to the order details page where address/phone are shown
      navigate(`/vendor/order/${orderId}`);
    } catch (err) {
      alert('Order already taken or error occurred.');
    } finally {
      setAcceptingId(null);
    }
  };

  const noNavPaths = [
    '/vendor/splash',
    '/vendor/auth',
    '/vendor/otp',
    '/vendor/register', 
    '/vendor/upload-documents', 
    '/vendor/approval-pending',
    '/vendor/walk-in',
    '/vendor/promotions',
    '/vendor/fulfillment'
  ];
  
  const isOrderDetails = location.pathname.includes('/vendor/order/');
  const isRiderVerification = location.pathname.includes('/vendor/rider-verification/');
  
  const showNav = !noNavPaths.some(path => location.pathname === path) && !isOrderDetails && !isRiderVerification;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

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
              className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border border-slate-100 relative z-[5001] overflow-hidden"
            >
              {/* Theme Bar */}
              <div className="h-2 bg-[#73e0c9]"></div>
              
              <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#73e0c9]/10 flex items-center justify-center text-[#73e0c9]">
                    <span className="material-symbols-outlined text-4xl animate-pulse">notifications_active</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">New Request</h3>
                    <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mt-1 text-[#73e0c9]">Immediate Acceptance</p>
                  </div>
                </div>

                {/* Details Card */}
                <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 space-y-6">
                  {/* Order ID & Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</span>
                    <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[11px] font-bold tracking-tight">
                      {incomingRequest.orderId}
                    </span>
                  </div>

                  {/* Primary Details */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm">
                      <span className="material-symbols-outlined text-3xl">local_laundry_service</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Service Type</p>
                      <h4 className="text-lg font-black text-slate-900 leading-none capitalize">
                        {incomingRequest.items[0]?.name || 'Loading...'}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="material-symbols-outlined text-[14px] text-[#73e0c9]">check_circle</span>
                        <p className="text-xs font-bold text-slate-600">
                          {incomingRequest.items.reduce((acc, i) => acc + i.quantity, 0)} कपड़े (Capacity)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions (Custom Note) */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-sm text-amber-500">sticky_note_2</span>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Special Instruction</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {incomingRequest.specialInstructions || '"No special notes from customer"'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleAccept(incomingRequest._id)}
                    disabled={acceptingId === incomingRequest._id}
                    className="w-full py-5 rounded-[1.5rem] bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 group"
                  >
                    {acceptingId === incomingRequest._id ? 'Processing...' : 'Accept Order'}
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => clearIncomingRequest()}
                    className="w-full py-4 rounded-[1.5rem] bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {showNav && <VendorBottomNav />}
    </div>
  );
};

export default VendorLayout;
