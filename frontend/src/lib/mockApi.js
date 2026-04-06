import { mockAdminData } from '../modules/admin/data/mockData';
// We can add other mock data imports here as we find them

/**
 * Mock API layer to simulate backend responses.
 * These functions are synchronous now but can easily be made async.
 */
export const adminApi = {
  getDashboardStats: () => ({
    kpis: mockAdminData.kpis,
    revenueFlow: mockAdminData.revenueFlow,
    orderStats: mockAdminData.orderStats,
    payoutRequests: mockAdminData.payoutRequests
  }),
  getOrders: () => mockAdminData.recentOrders,
  getVendors: () => mockAdminData.vendors,
  getOnboardingRequests: () => mockAdminData.onboardingRequests,
  getPayouts: () => mockAdminData.payoutRequests,
  getServices: () => mockAdminData.services,
  getUsers: () => mockAdminData.users,
};

export const vendorApi = {
    // Will be populated as we refactor vendor modules
};

export const riderApi = {
    // Will be populated
};

export const userApi = {
    // Will be populated
};
