import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Download, Filter, FileText, PlusCircle, ExternalLink, User, Store, Calendar, ArrowRight } from 'lucide-react';
import { mockAdminData } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import DataGrid from '../components/tables/DataGrid';
import StatusBadge from '../components/common/StatusBadge';
import { orderApi } from '../../../lib/api';

export default function Orders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = useMemo(() => ['All', 'Assigned', 'In Progress', 'Ready', 'Delivered', 'Cancelled'], []);

  const fetchAllOrders = async () => {
    try {
      const res = await orderApi.getAllOrders();
      setAllOrders(res);
    } catch (err) {
      console.error('Fetch all orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return allOrders;
    return allOrders.filter(order => order.status === activeTab);
  }, [activeTab, allOrders]);

  const orderColumns = useMemo(() => [
    { 
      header: 'Order ID', 
      key: 'orderId',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-[11px] tracking-[0.1em] uppercase leading-none mb-1 group-hover:text-blue-600 transition-colors">{val}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-80 tabular-nums">Service Request</span>
        </div>
      )
    },
    { 
      header: 'Customer', 
      key: 'customer',
      render: (val) => (
        <div className="flex items-center gap-2 transition-transform">
          <div className="w-6 h-6 rounded-sm bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200 text-[8px] font-bold uppercase">
            {val?.displayName?.charAt(0) || 'U'}
          </div>
          <span className="font-bold text-slate-800 text-[10px] uppercase tracking-tight">{val?.displayName || 'Unknown'}</span>
        </div>
      )
    },
    { 
      header: 'Vendor', 
      key: 'vendor',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-slate-950 text-white flex items-center justify-center border border-slate-800 text-[8px] font-bold uppercase">
             <Store size={10} />
          </div>
          <span className="font-bold text-slate-700 text-[10px] uppercase tracking-tighter tabular-nums">{val?.shopDetails?.name || 'Unassigned'}</span>
        </div>
      )
    },
    { 
      header: 'Amount', 
      key: 'totalAmount', 
      align: 'right', 
      render: (val) => <span className="font-bold text-slate-900 tabular-nums text-xs">₹{val?.toLocaleString() || 0}</span> 
    },
    { 
      header: 'Status', 
      key: 'status', 
      render: (val) => <StatusBadge status={val} /> 
    },
    { 
      header: 'Date', 
      key: 'createdAt', 
      render: (val) => <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest tabular-nums opacity-60 flex items-center gap-2"><ArrowRight size={10} className="text-slate-200" /> {new Date(val).toLocaleDateString()}</span> 
    }
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <PageHeader 
        title="Orders" 
        actions={[
          { label: 'Export Order List', icon: FileText, variant: 'secondary' },
          { label: 'Create Manual Order', icon: PlusCircle, variant: 'primary' }
        ]}
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Navigation Filters */}
        <div className="flex bg-white p-1 rounded-sm w-fit border border-slate-200 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-sm text-[9px] font-bold uppercase tracking-[0.25em] transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white z-10 translate-y-[-1px]' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Order List */}
        <DataGrid 
          title={`${activeTab} Orders`}
          columns={orderColumns}
          data={filteredOrders}
          onAction={(row) => navigate(`/admin/orders/${row.id}`)}
        />
      </div>
    </div>
  );
}
