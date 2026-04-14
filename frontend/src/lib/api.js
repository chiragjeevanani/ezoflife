const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authApi = {
    requestOtp: async (phone, channel, mode, role) => {
        // Mock Credentials Bypass
        if (phone === '9999999999') {
            return { message: 'OTP sent successfully', mock: true };
        }
        try {
            const response = await fetch(`${BASE_URL}/auth/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, channel, mode, role })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    verifyOtp: async (phone, otp) => {
        // Mock Credentials Bypass
        if (phone === '9999999999' && otp === '123456') {
            return {
                user: {
                    _id: '66112c3f8e4b8a2e5c8b4568', // Consistent mock ID
                    phone: '9999999999',
                    displayName: 'Mock User',
                    role: 'User' // Default, will be overridden by local logic if needed
                },
                token: 'mock-jwt-token'
            };
        }
        try {
            const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    adminLogin: async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/admin-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Admin API Error:', error);
            throw error;
        }
    },
    registerVendor: async (vendorData) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/register-vendor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vendorData)
            });
            return await response.json();
        } catch (error) {
            console.error('Register Vendor Error:', error);
            throw error;
        }
    },
    vendorLogin: async (identifier, password) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/vendor-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Vendor Login Error:', error);
            throw error;
        }
    },
    completeVendorProfile: async (data) => {
        try {
            const isFormData = data instanceof FormData;
            const response = await fetch(`${BASE_URL}/auth/complete-vendor-profile`, {
                method: 'POST',
                headers: isFormData ? {} : { 'Content-Type': 'application/json' },
                body: isFormData ? data : JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Vendor API Error:', error);
            throw error;
        }
    },
    getStatus: async (phone) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/get-status?phone=${phone}`);
            return await response.json();
        } catch (error) {
            console.error('Status API Error:', error);
            throw error;
        }
    },
    getProfile: async (id) => {
        if (id === '66112c3f8e4b8a2e5c8b4568') {
            return {
                _id: '66112c3f8e4b8a2e5c8b4568',
                phone: '9999999999',
                displayName: 'Mock Professional',
                email: 'mock@ezlife.com',
                createdAt: new Date().toISOString(),
                location: { lat: 28.4595, lng: 77.0266 },
                riderDetails: {
                    address: '123 Mock Street, Gurgaon',
                    vehicleModel: 'Mock Racer',
                    plateNumber: 'MK-007'
                },
                supplierDetails: {
                    shopName: 'Mock Wash Hub',
                    address: 'Sector 44, Gurgaon'
                }
            };
        }
        try {
            const response = await fetch(`${BASE_URL}/auth/profile/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Get Profile Error:', error);
            throw error;
        }
    },
    updateProfile: async (id, data) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/profile/update/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Update failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Update Profile Error:', error);
            throw error;
        }
    }
};

export const adminApi = {
    getStats: async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/stats`);
            return await response.json();
        } catch (error) {
            console.error('Admin Stats Error:', error);
            throw error;
        }
    },
    getPendingApprovals: async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/pending-approvals`);
            return await response.json();
        } catch (error) {
            console.error('Admin Approvals Error:', error);
            throw error;
        }
    },
    getCustomers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/customers`);
            return await response.json();
        } catch (error) {
            console.error('Admin Customers Error:', error);
            throw error;
        }
    },
    approveVendor: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/admin/approve-vendor/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('Approve Vendor Error:', error);
            throw error;
        }
    },
    rejectVendor: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/admin/reject-vendor/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('Reject Vendor Error:', error);
            throw error;
        }
    },
    getAllVendors: async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/vendors`);
            return await response.json();
        } catch (error) {
            console.error('All Vendors Error:', error);
            throw error;
        }
    }
};

export const orderApi = {
    createOrder: async (orderData) => {
        try {
            const response = await fetch(`${BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            return await response.json();
        } catch (error) {
            console.error('Create Order Error:', error);
            throw error;
        }
    },
    getMyOrders: async (customerId) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/my?customerId=${customerId}`);
            return await response.json();
        } catch (error) {
            console.error('Get Orders Error:', error);
            throw error;
        }
    },
    getVendorOrders: async (vendorId) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/vendor?vendorId=${vendorId}`);
            return await response.json();
        } catch (error) {
            console.error('Get Vendor Orders Error:', error);
            throw error;
        }
    },
    updateOrderStatus: async (id, status) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/status/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            return await response.json();
        } catch (error) {
            console.error('Update Status Error:', error);
            throw error;
        }
    },
    getAllOrders: async () => {
        // Mock Admin Data
        return [
            { _id: '1', orderId: 'AD-MOCK-1', status: 'Assigned', totalAmount: 450, createdAt: new Date().toISOString(), customer: { displayName: 'John Doe' }, vendor: { shopDetails: { name: 'Main Laundry' } } },
            { _id: '2', orderId: 'AD-MOCK-2', status: 'In Progress', totalAmount: 1200, createdAt: new Date().toISOString(), customer: { displayName: 'Jane Smith' }, vendor: { shopDetails: { name: 'Central Dry Clean' } } },
            { _id: '3', orderId: 'AD-MOCK-3', status: 'Delivered', totalAmount: 300, createdAt: new Date().toISOString(), customer: { displayName: 'Bob Wilson' }, vendor: { shopDetails: { name: 'Quick Iron' } } }
        ];
    },
    getRiderTasks: async (riderId) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/rider/${riderId}`);
            return await response.json();
        } catch (error) {
            console.error('Get Rider Tasks Error:', error);
            throw error;
        }
    },
    acceptTask: async (orderId, riderId) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/accept/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ riderId })
            });
            return await response.json();
        } catch (error) {
            console.error('Accept Task Error:', error);
            throw error;
        }
    },
    getRiderStats: async (riderId) => {
        if (riderId === '66112c3f8e4b8a2e5c8b4568') {
            return {
                weeklyEarnings: 5420,
                tasksToday: 8,
                lifetimeRating: 4.92
            };
        }
        try {
            const response = await fetch(`${BASE_URL}/orders/rider-stats/${riderId}`);
            return await response.json();
        } catch (error) {
            console.error('Get Rider Stats Error:', error);
            throw error;
        }
    },
    getById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Get Order ID Error:', error);
            throw error;
        }
    },
    getPoolOrders: async (vendorId) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/pool?vendorId=${vendorId}`);
            return await response.json();
        } catch (error) {
            console.error('Pool API Error:', error);
            throw error;
        }
    },
    vendorAcceptOrder: async (orderId, vendorId) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/vendor-accept/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vendorId })
            });
            return await response.json();
        } catch (error) {
            console.error('Vendor Accept Error:', error);
            throw error;
        }
    },
    verifyPickupOtp: async (id, otp) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/verify-pickup/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Verification failed');
            }
            return await response.json();
        } catch (error) {
            console.error('OTP Verification Error:', error);
            throw error;
        }
    },
    verifyDeliveryOtp: async (id, otp) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/verify-delivery/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Verification failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Delivery OTP Error:', error);
            throw error;
        }
    }
};

export const notificationApi = {
    getNotifications: async (userId, role) => {
        try {
            const response = await fetch(`${BASE_URL}/notifications?userId=${userId}&role=${role}`);
            return await response.json();
        } catch (error) {
            console.error('Get Notifications Error:', error);
            throw error;
        }
    },
    markAsRead: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/notifications/${id}/read`, { method: 'PATCH' });
            return await response.json();
        } catch (error) {
            console.error('Mark Read Error:', error);
            throw error;
        }
    },
    clearAll: async (userId, role) => {
        try {
            const response = await fetch(`${BASE_URL}/notifications/clear?userId=${userId}&role=${role}`, { method: 'DELETE' });
            return await response.json();
        } catch (error) {
            console.error('Clear Notifications Error:', error);
            throw error;
        }
    }
};

export const serviceApi = {
    getAll: async (params = {}) => {
        try {
            const query = new URLSearchParams(params).toString();
            const url = `${BASE_URL}/services${query ? `?${query}` : ''}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Service API Error:', error);
            throw error;
        }
    },
    create: async (data) => {
        try {
            const response = await fetch(`${BASE_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Create Service Error:', error);
            throw error;
        }
    },
    update: async (id, data) => {
        try {
            const response = await fetch(`${BASE_URL}/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Update Service Error:', error);
            throw error;
        }
    },
    delete: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/services/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Delete Service Error:', error);
            throw error;
        }
    }
};

export const materialApi = {
    getAll: async () => {
        try {
            const response = await fetch(`${BASE_URL}/materials`);
            return await response.json();
        } catch (error) {
            console.error('Material API Error:', error);
            throw error;
        }
    },
    create: async (data) => {
        try {
            const response = await fetch(`${BASE_URL}/materials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Create Material Error:', error);
            throw error;
        }
    },
    update: async (id, data) => {
        try {
            const response = await fetch(`${BASE_URL}/materials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Update Material Error:', error);
            throw error;
        }
    },
    delete: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/materials/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Delete Material Error:', error);
            throw error;
        }
    }
};

export const ticketApi = {
    createTicket: async (ticketData) => {
        try {
            const response = await fetch(`${BASE_URL}/tickets/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData)
            });
            return await response.json();
        } catch (error) {
            console.error('Create Ticket Error:', error);
            throw error;
        }
    },
    getCustomerTickets: async (customerId) => {
        try {
            const response = await fetch(`${BASE_URL}/tickets/customer/${customerId}`);
            return await response.json();
        } catch (error) {
            console.error('Get Customer Tickets Error:', error);
            throw error;
        }
    },
    getTicketDetails: async (ticketId) => {
        try {
            const response = await fetch(`${BASE_URL}/tickets/${ticketId}`);
            return await response.json();
        } catch (error) {
            console.error('Get Ticket Details Error:', error);
            throw error;
        }
    },
    sendMessage: async (ticketId, messageData) => {
        try {
            const response = await fetch(`${BASE_URL}/tickets/${ticketId}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });
            return await response.json();
        } catch (error) {
            console.error('Send Message Error:', error);
            throw error;
        }
    },
    getAllTickets: async () => {
        try {
            const response = await fetch(`${BASE_URL}/tickets/admin/all`);
            return await response.json();
        } catch (error) {
            console.error('Get All Tickets Error:', error);
            throw error;
        }
    },
    updateTicketStatus: async (ticketId, status) => {
        try {
            const response = await fetch(`${BASE_URL}/tickets/admin/${ticketId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            return await response.json();
        } catch (error) {
            console.error('Update Ticket Status Error:', error);
            throw error;
        }
    }
};

