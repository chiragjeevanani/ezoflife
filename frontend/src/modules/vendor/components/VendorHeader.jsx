import React from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../../shared/stores/notificationStore';

const VendorHeader = ({ title = "SPINZYT", showBack = false }) => {
    const navigate = useNavigate();
    const notifications = useNotificationStore((state) => state.notifications);
    const unreadCount = notifications.filter(n => n.persona === 'vendor' && !n.read).length;

    const vendorDataRaw = localStorage.getItem('vendorData') || localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
    const vendorData = JSON.parse(vendorDataRaw);
    const vendorName = vendorData.displayName || (vendorData.user && vendorData.user.displayName) || "Vendor Partner";
    const vendorPhone = vendorData.phone || (vendorData.user && vendorData.user.phone) || "98765 43210";

    return (
        <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-outline-variant/10 min-h-[72px]">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                )}
                {!showBack && (
                    <div 
                        onClick={() => navigate('/vendor/profile')}
                        className="w-10 h-10 rounded-xl vendor-gradient flex items-center justify-center overflow-hidden cursor-pointer border border-outline-variant/5 text-white"
                    >
                        <span className="material-symbols-outlined text-xl">person</span>
                    </div>
                )}
                <div className="flex flex-col">
                    <h1 className="text-[14px] font-black tracking-tight text-on-surface leading-none mb-1 uppercase">
                        {title !== "SPINZYT" ? title : vendorName}
                    </h1>
                    <p className="text-[10px] font-bold tracking-widest text-primary flex items-center gap-1 leading-none">
                        <span className="material-symbols-outlined text-[12px]">smartphone</span>
                        +91 {vendorPhone}
                    </p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/vendor/notifications')}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-primary transition-colors relative"
            >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>
        </header>
    );
};


export default VendorHeader;
