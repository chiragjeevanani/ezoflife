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
    ShieldAlert,
    Layers,
    MessageSquare,
    Handshake,
    Bell,
    Briefcase,
    ClipboardList,
    Factory,
    Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
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
                { icon: MessageSquare, label: 'FAQ Manager', path: '/admin/faqs' },
                { icon: UserCircle, label: 'User Feedback', path: '/admin/feedback' },
                { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
                { icon: Rocket, label: 'Splash Ads', path: '/admin/ads' },
                { icon: Handshake, label: 'Partnerships', path: '/admin/partnerships' },
            ]
        },
        {
            group: 'Network', items: [
                { icon: Store, label: 'Vendors', path: '/admin/vendors' },
                { icon: ShieldCheck, label: 'Approvals', path: '/admin/vendors/approvals' },
                { icon: Factory, label: 'Suppliers', path: '/admin/suppliers' },
                { icon: Users, label: 'Users', path: '/admin/users' },
            ]
        },
        {
            group: 'Financials', items: [
                { icon: CreditCard, label: 'Payouts', path: '/admin/payouts' },
                { icon: ShieldCheck, label: 'B2B Settlements', path: '/admin/b2b-escrow' },
                { icon: Tags, label: 'Pricing Policy', path: '/admin/pricing' },
                { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
            ]
        },
        {
            group: 'Core Assets', items: [
                { icon: ClipboardList, label: 'Master Services', path: '/admin/master-services' },
                { icon: Package, label: 'Services', path: '/admin/services' },
                { icon: Layers, label: 'Material Catalog', path: '/admin/materials' },
                { icon: UserCircle, label: 'Labor Manager', path: '/admin/labor' },
                { icon: Briefcase, label: 'Career Center', path: '/admin/careers' },
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
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside 
                className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-[60] flex flex-col transition-all duration-300 
                    ${isCollapsed ? "w-20" : "w-64"} 
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
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

                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-sm hover:bg-slate-50 text-slate-400"
                    >
                        <ChevronLeft size={18} />
                    </button>
                </div>

                {/* Navigation Selection Engine */}
                <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto no-scrollbar">
                    {navItems.map((group) => (
                        <div key={group.group} className="space-y-1.5">
                            {(!isCollapsed || isMobileOpen) && (
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
                                            onClick={() => {
                                                navigate(item.path);
                                                setIsMobileOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 group relative ${
                                                isActive 
                                                  ? "bg-slate-900 text-white shadow-slate-200" 
                                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <item.icon size={16} className={`shrink-0 ${isActive ? "text-white" : "group-hover:text-slate-900 transition-colors"}`} />
                                            {(!isCollapsed || isMobileOpen) && (
                                                <span className={`font-bold text-[11px] uppercase tracking-[0.1em] flex-1 text-left whitespace-nowrap overflow-hidden transition-all ${
                                                    isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                                                }`}>
                                                    {item.label}
                                                </span>
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
                        onClick={() => {
                            localStorage.clear();
                            navigate('/user/auth');
                            setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group ${(isCollapsed && !isMobileOpen) && "justify-center"}`}
                    >
                        <LogOut size={16} />
                        {(!isCollapsed || isMobileOpen) && <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Logout</span>}
                    </button>
                </div>

                {/* Collapse Trigger (Floating) - Desktop Only */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-slate-900 text-white rounded-full hidden lg:flex items-center justify-center border-2 border-white z-50 hover:scale-110 transition-all"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>
        </>
    );
}
