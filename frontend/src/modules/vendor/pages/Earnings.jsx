import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../components/VendorHeader';
import { orderApi, authApi } from '../../../lib/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Earnings = () => {
    const navigate = useNavigate();
    const [performanceFilter, setPerformanceFilter] = useState('Weekly');
    const [orders, setOrders] = useState([]);
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(true);

    const vendorDataRaw = localStorage.getItem('vendorData') || localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
    const localVendor = JSON.parse(vendorDataRaw);
    const vendorId = localVendor?._id || localVendor?.id || localVendor?.user?._id || localVendor?.user?.id;

    useEffect(() => {
        const fetchData = async () => {
            if (!vendorId) return;
            try {
                setLoading(true);
                const [ordersData, profileData] = await Promise.all([
                    orderApi.getVendorOrders(vendorId),
                    authApi.getProfile(vendorId)
                ]);
                setOrders(ordersData);
                setVendorData(profileData);
            } catch (err) {
                console.error('Error fetching earnings data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [vendorId]);

    const stats = useMemo(() => {
        const orderList = Array.isArray(orders) ? orders : [];
        const totalGross = orderList.reduce((sum, order) => sum + (Number(order.totalAmount || 0)), 0);
        const platformFee = totalGross * 0.15;
        const netYield = totalGross - platformFee;
        return { totalGross, platformFee, netYield };
    }, [orders]);

    const handleDownloadInvoice = () => {
        console.log('--- Starting Invoice Generation ---');
        try {
            const dataToUse = vendorData || localVendor;
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(22);
            doc.setTextColor(61, 90, 254);
            doc.text('TAX INVOICE', 105, 20, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });

            // Vendor Info
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text('VENDOR DETAILS', 20, 45);
            doc.setFontSize(10);
            doc.text(`Name: ${dataToUse.shopDetails?.shopName || dataToUse.displayName || 'Vendor'}`, 20, 52);
            doc.text(`Vendor ID: ${vendorId || 'N/A'}`, 20, 57);
            doc.text(`Address: ${dataToUse.shopDetails?.address || 'N/A'}`, 20, 62);

            // Summary Box
            doc.setFillColor(248, 250, 252);
            doc.rect(20, 75, 170, 40, 'F');
            doc.setFontSize(12);
            doc.text('FINANCIAL SUMMARY', 25, 85);
            doc.setFontSize(10);
            doc.text(`Gross Revenue: INR ${stats.totalGross.toLocaleString()}`, 25, 95);
            doc.text(`Platform Fee (15%): -INR ${stats.platformFee.toLocaleString()}`, 25, 102);
            doc.setFontSize(11);
            doc.text(`NET SHOP YIELD: INR ${stats.netYield.toLocaleString()}`, 25, 110);

            // Orders Table
            console.log(`Preparing table with ${orders?.length} orders...`);
            if (Array.isArray(orders) && orders.length > 0) {
                const tableData = orders.map(o => [
                    o.orderId || 'N/A',
                    o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A',
                    o.status || 'N/A',
                    `INR ${o.totalAmount || 0}`
                ]);

                autoTable(doc, {
                    startY: 125,
                    head: [['Order ID', 'Date', 'Status', 'Amount']],
                    body: tableData,
                    theme: 'grid',
                    headStyles: { fillColor: [61, 90, 254] }
                });
            } else {
                doc.text('No orders found for this period.', 20, 130);
            }

            console.log('Saving PDF...');
            doc.save(`Invoice_${vendorId || 'Export'}_${Date.now()}.pdf`);
            console.log('PDF saved successfully!');
        } catch (error) {
            console.error('Invoice Generation Failed:', error);
            alert('Could not generate PDF: ' + error.message);
        }
    };

    const deliveredOrders = useMemo(() => {
        return (Array.isArray(orders) ? orders : [])
            .filter(o => o.status === 'Delivered' || o.status === 'Completed' || o.status === 'Ready')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [orders]);

    const weeklyTotal = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return deliveredOrders
            .filter(o => new Date(o.createdAt) >= oneWeekAgo)
            .reduce((sum, o) => sum + (Number(o.totalAmount || 0) * 0.85), 0);
    }, [deliveredOrders]);

    if (loading) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#F8FAFC] text-slate-900 min-h-screen pb-32 font-body"
        >
            <header className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-50 flex items-center gap-4">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full">
                    <span className="material-symbols-outlined text-primary">arrow_back</span>
                </motion.button>
                <h1 className="text-xl font-black tracking-tight">Earnings & History</h1>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-6 space-y-8">
                {/* 1. WEEKLY TOTAL HIGHLIGHT */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all"></div>
                    
                    <div className="relative z-10 space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Weekly Earnings</p>
                            </div>
                            <h2 className="text-5xl font-black tracking-tighter">₹{weeklyTotal.toLocaleString()}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Last 7 Days (Net Yield)</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gross Rev</p>
                                <p className="text-sm font-black text-slate-200">₹{stats.totalGross.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Platform Fee</p>
                                <p className="text-sm font-black text-rose-300">-15%</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleDownloadInvoice}
                            className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            Download Statement
                        </button>
                    </div>
                </div>

                {/* 2. DELIVERED ORDERS RECORD */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivered Orders Record</h3>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                            {deliveredOrders.length} Completed
                        </div>
                    </div>

                    <div className="space-y-3">
                        {deliveredOrders.length > 0 ? (
                            deliveredOrders.map((order) => (
                                <div key={order._id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm transition-all hover:border-primary/20 cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                            <span className="material-symbols-outlined text-2xl">verified</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.orderId}</p>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-slate-900 tracking-tight leading-none">₹{(Number(order.totalAmount || 0) * 0.85).toFixed(0)}</p>
                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">Net Earned</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center opacity-30">
                                <span className="material-symbols-outlined text-5xl mb-3">history_edu</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">No delivered orders yet</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </motion.div>
    );
};

export default Earnings;
