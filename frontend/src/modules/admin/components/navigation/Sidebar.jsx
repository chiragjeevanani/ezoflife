import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Store,
    Truck,
    Monitor,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ShieldCheck,
    UserCircle,
    CreditCard,
    FileText,
    TrendingUp,
    Package,
    Tags,
    Star,
    Clock,
    HelpCircle,
    Home,
    Bike,
    ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState(null);

    const navItems = [
        {
            group: 'Operations', items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
                { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
                { icon: Bike, label: 'Fleet Management', path: '/admin/riders' },
                { icon: HelpCircle, label: 'Help Desk', path: '/admin/help-desk' },
            ]
        },
        {
            group: 'Network', items: [
                { icon: Store, label: 'Vendors', path: '/admin/vendors' },
                { icon: ShieldCheck, label: 'Approvals', path: '/admin/vendors/approvals' },
                { icon: Users, label: 'Users', path: '/admin/users' },
            ]
        },
        {
            group: 'Financials', items: [
                { icon: CreditCard, label: 'Payouts', path: '/admin/payouts' },
                { icon: Tags, label: 'Pricing Policy', path: '/admin/pricing' },
                { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
            ]
        },
        {
            group: 'Core Assets', items: [
                { icon: Package, label: 'Services', path: '/admin/services' },
                { icon: ShieldAlert, label: 'Dispute Center', path: '/admin/dispute-center' },
            ]
        },
        {
            group: 'Settings', items: [
                { icon: Settings, label: 'Settings', path: '/admin/settings' },
            ]
        }
    ];

    return (
        <aside className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 hidden lg:flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
            {/* Header / Brand */}
            <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100">
                {!isCollapsed ? (
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-slate-900 rounded-sm flex items-center justify-center">
                            <span className="text-white font-bold text-sm">E</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-[13px] tracking-tight text-slate-900 leading-none uppercase">SPINZYT</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Panel</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-center">
                        <div className="w-7 h-7 bg-slate-900 rounded-sm flex items-center justify-center">
                            <span className="text-white font-bold text-sm">E</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Selection Engine */}
            <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto no-scrollbar">
                {navItems.map((group) => (
                    <div key={group.group} className="space-y-1.5">
                        {!isCollapsed && (
                            <div className="px-3 mb-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
                                    {group.group}
                                </span>
                            </div>
                        )}
                        {group.items.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div key={item.label}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 group relative ${
                                            isActive 
                                              ? "bg-slate-900 text-white shadow-slate-200" 
                                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        <item.icon size={16} className={`shrink-0 ${isActive ? "text-white" : "group-hover:text-slate-900 transition-colors"}`} />
                                        {!isCollapsed && (
                                            <span className={`font-bold text-[11px] uppercase tracking-[0.1em] flex-1 text-left whitespace-nowrap overflow-hidden transition-all ${
                                                isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                                            }`}>
                                                {item.label}
                                            </span>
                                        )}
                                        {isActive && isCollapsed && (
                                            <div className="absolute left-0 w-1 h-6 bg-slate-900 rounded-r-full" />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Tactical Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <button
                    onClick={() => navigate('/user/auth')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group ${isCollapsed && "justify-center"}`}
                >
                    <LogOut size={16} className=" transition-transform" />
                    {!isCollapsed && <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Logout</span>}
                </button>
            </div>

            {/* Collapse Trigger (Floating) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white z-50 hover:scale-110 transition-all"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
}
