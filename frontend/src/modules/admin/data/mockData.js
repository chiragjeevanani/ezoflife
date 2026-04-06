import { MASTER_SERVICES } from '../../../shared/data/sharedData';

export const mockAdminData = {
  kpis: [
    { label: 'Total Revenue', value: '₹1,42,840', delta: '+12.5%', isPositive: true },
    { label: 'Active Orders', value: '142', delta: '+8.2%', isPositive: true },
    { label: 'Vendors Online', value: '28', delta: '-2.4%', isPositive: false },
    { label: 'Total Users', value: '1,240', delta: '+18.2%', isPositive: true },
    { label: 'Pending Approvals', value: '6', delta: 'New', isPositive: true },
  ],
  
  revenueFlow: [
    { name: '00:00', revenue: 4200, previousValue: 3800, period: 'Shift A', insight: 'Early morning node low throughput' },
    { name: '04:00', revenue: 2800, previousValue: 3100, period: 'Shift A', insight: 'Downtime maintenance period' },
    { name: '08:00', revenue: 15600, previousValue: 12400, period: 'Shift B', insight: 'Morning peak service initiation' },
    { name: '12:00', revenue: 24800, previousValue: 21500, period: 'Shift B', insight: 'Maximum network capacity utilization' },
    { name: '16:00', revenue: 32000, previousValue: 28400, period: 'Shift C', insight: 'Sustained throughput' },
    { name: '20:00', revenue: 28400, previousValue: 25600, period: 'Shift C', insight: 'Evening fulfillment ramp-down' },
    { name: '23:59', revenue: 35040, previousValue: 31000, period: 'Shift C', insight: 'Final settlement run cycle' },
  ],
  
  orderStats: [
    { name: 'Mon', orders: 45, fulfillment: 42, previousValue: 40 },
    { name: 'Tue', orders: 52, fulfillment: 48, previousValue: 55 },
    { name: 'Wed', orders: 48, fulfillment: 46, previousValue: 48 },
    { name: 'Thu', orders: 61, fulfillment: 58, previousValue: 50 },
    { name: 'Fri', orders: 75, fulfillment: 70, previousValue: 72 },
    { name: 'Sat', orders: 94, fulfillment: 88, previousValue: 85 },
    { name: 'Sun', orders: 82, fulfillment: 78, previousValue: 80 },
  ],
  
  recentOrders: [
    { id: '#SZ-8821', user: 'Julian Mendoza', vendor: 'Pristine Cleaners', service: 'Wash & Fold', amount: 498.00, status: 'In Progress', date: '10:45 AM' },
    { id: '#SZ-8824', user: 'Sarah Smith', vendor: 'EcoDry Express', service: 'Dry Cleaning', amount: 850.00, status: 'Ready', date: '09:30 AM' },
    { id: '#SZ-8815', user: 'Mike Ross', vendor: 'IronMasters', service: 'Ironing Only', amount: 320.00, status: 'Delivered', date: 'Yesterday' },
    { id: '#SZ-8812', user: 'Rachel Zane', vendor: 'Pristine Cleaners', service: 'Wash & Fold', amount: 1200.00, status: 'Cancelled', date: 'Yesterday' },
  ],
  
  vendors: [
    { id: '#VEN-1024', name: 'Julian Cleaners', shop: 'Pristine Heights', status: 'Active', orders: 142, revenue: '₹42,800', rating: 4.8 },
    { id: '#VEN-1025', name: 'EcoDry Express', shop: 'Metro Central', status: 'Active', orders: 88, revenue: '₹28,500', rating: 4.6 },
    { id: '#VEN-1026', name: 'IronMasters', shop: 'Koregaon Park', status: 'Suspended', orders: 15, revenue: '₹4,200', rating: 3.2 },
    { id: '#VEN-1027', name: 'FreshSpin', shop: 'Model Colony', status: 'Pending', orders: 0, revenue: '₹0', rating: 0.0 },
  ],
  
  onboardingRequests: [
    { id: '#REG-4291', name: 'Amit Shah', shop: 'Reliable Laundry', address: 'Baner, Pune', date: '25 Mar, 2026', docs: ['GST', 'Aadhar', 'Rent Agreement'] },
    { id: '#REG-4292', name: 'Priya Verma', shop: 'Quick Wash', address: 'Hinjewadi, Pune', date: '24 Mar, 2026', docs: ['PAN', 'Aadhar'] },
  ],
  
  payoutRequests: [
    { id: '#PAY-9281', vendor: 'Pristine Cleaners', shop: 'Pristine Heights', amount: 12450.00, status: 'Pending', date: '25 Mar' },
    { id: '#PAY-9280', vendor: 'EcoDry Express', shop: 'Metro Central', amount: 8200.00, status: 'Paid', date: '20 Mar' },
    { id: '#PAY-9275', vendor: 'IronMasters', shop: 'Koregaon Park', amount: 3100.00, status: 'Paid', date: '15 Mar' },
  ],
  
  services: MASTER_SERVICES.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    unit: s.unit,
    basePrice: s.basePrice,
    status: 'Active'
  })),
  
  users: [
    { id: '#USR-5521', name: 'Julian Mendoza', email: 'julian@example.com', orders: 12, spent: '₹14,500', status: 'Active' },
    { id: '#USR-5522', name: 'Sarah Smith', email: 'sarah@example.com', orders: 8, spent: '₹8,200', status: 'Active' },
    { id: '#USR-5523', name: 'Mike Ross', email: 'mike@example.com', orders: 1, spent: '₹320', status: 'Inactive' },
  ]
};
