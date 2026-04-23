import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SHIPROCKET_URL = 'https://apiv2.shiprocket.in/v1/external';

class ShiprocketService {
    constructor() {
        this.token = null;
        this.tokenExpiry = null;
    }

    async authenticate() {
        try {
            // Check for missing credentials -> Trigger Mock Mode
            if (!process.env.SHIPROCKET_EMAIL || process.env.SHIPROCKET_EMAIL === 'your_email_here') {
                console.log('⚠️ [SHIPROCKET] Running in MOCK MODE (No credentials found)');
                return 'MOCK_TOKEN_12345';
            }

            // Check if token exists and is still valid
            if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
                return this.token;
            }
            const response = await axios.post(`${SHIPROCKET_URL}/auth/login`, {
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD
            });

            this.token = response.data.token;
            // Set expiry for safety (23 hours)
            this.tokenExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000);
            return this.token;
        } catch (error) {
            console.error('❌ [SHIPROCKET_AUTH_ERROR]:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with Shiprocket');
        }
    }

    async createReturnOrder(orderData, customer, isQC = false) {
        try {
            const token = await this.authenticate();
            
            if (token === 'MOCK_TOKEN_12345') {
                return { shipment_id: '100001', order_id: 'SR-MOCK-001', status: 'NEW' };
            }

            const payload = {
                order_id: orderData.orderId,
                order_date: new Date().toISOString().split('T')[0],
                channel_id: process.env.SHIPROCKET_CHANNEL_ID || '',
                pickup_customer_name: customer.displayName || 'Customer',
                pickup_address: orderData.pickupAddress,
                pickup_city: customer.city || 'Indore',
                pickup_state: customer.state || 'Madhya Pradesh',
                pickup_country: 'India',
                pickup_pincode: customer.pincode || '',
                pickup_email: customer.email || '',
                pickup_phone: customer.phone,
                
                shipping_customer_name: 'EzOfLife Hub',
                shipping_address: 'Spinzyt Processing Center',
                shipping_address_2: 'Talawali Chanda',
                shipping_city: 'Indore',
                shipping_pincode: '452010',
                shipping_country: 'India',
                shipping_state: 'Madhya Pradesh',
                shipping_email: 'admin@ezoflife.com',
                shipping_phone: '9898989898',
                
                order_items: orderData.items.map(item => ({
                    name: item.name,
                    sku: item.serviceId,
                    units: item.quantity,
                    selling_price: item.price
                })),
                payment_method: 'Prepaid',
                sub_total: orderData.totalAmount,
                length: 10, breadth: 10, height: 10, weight: 0.5,
                is_qc: isQC ? 1 : 0
            };

            const response = await axios.post(`${SHIPROCKET_URL}/orders/create/return`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('❌ [SHIPROCKET_CREATE_RETURN_ERROR]:', error.response?.data || error.message);
            throw error;
        }
    }

    async createForwardOrder(orderData, customer) {
        try {
            const token = await this.authenticate();
            
            if (token === 'MOCK_TOKEN_12345') {
                return { shipment_id: '200001', order_id: 'SR-FWD-MOCK-001', status: 'NEW' };
            }

            const payload = {
                order_id: `${orderData.orderId}-DEL`,
                order_date: new Date().toISOString().split('T')[0],
                pickup_location: "Primary", // Vendor/Hub Location Name in Shiprocket
                billing_customer_name: customer.displayName || 'Customer',
                billing_last_name: "",
                billing_address: orderData.dropAddress,
                billing_city: customer.city || 'Indore',
                billing_pincode: customer.pincode || '',
                billing_state: customer.state || 'Madhya Pradesh',
                billing_country: "India",
                billing_email: customer.email || '',
                billing_phone: customer.phone,
                shipping_is_billing: true,
                order_items: orderData.items.map(item => ({
                    name: item.name,
                    sku: item.serviceId,
                    units: item.quantity,
                    selling_price: item.price
                })),
                payment_method: "Prepaid",
                sub_total: orderData.totalAmount,
                length: 10, breadth: 10, height: 10, weight: 0.5
            };

            const response = await axios.post(`${SHIPROCKET_URL}/orders/create/adhoc`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('❌ [SHIPROCKET_CREATE_FORWARD_ERROR]:', error.response?.data || error.message);
            throw error;
        }
    }

    async checkServiceability(pincode, isQC = false) {
        try {
            const token = await this.authenticate();

            // Mock Response
            if (token === 'MOCK_TOKEN_12345') {
                return { 
                    data: { 
                        available_courier_companies: [
                            { courier_company_id: 1, courier_name: 'MOCK-Express (QC-Enabled)' }
                        ] 
                    } 
                };
            }

            const response = await axios.get(`${SHIPROCKET_URL}/courier/serviceability/`, {
                params: {
                    pickup_postcode: pincode,
                    delivery_postcode: '452010', // Hub Pincode
                    weight: 0.5,
                    cod: 0,
                    is_return: 1,
                    qc_check: isQC ? 1 : 0
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data;
        } catch (error) {
            console.error('❌ [SHIPROCKET_SERVICEABILITY_ERROR]:', error.response?.data || error.message);
            throw error;
        }
    }

    async generateAWB(shipmentId, courierId) {
        try {
            const token = await this.authenticate();

            // Mock Response
            if (token === 'MOCK_TOKEN_12345') {
                return { response: { data: { awb_code: 'MOCK-AWB-12345' } } };
            }

            const response = await axios.post(`${SHIPROCKET_URL}/courier/assign/awb`, {
                shipment_id: shipmentId,
                courier_id: courierId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data;
        } catch (error) {
            console.error('❌ [SHIPROCKET_AWB_ERROR]:', error.response?.data || error.message);
            throw error;
        }
    }

    async generatePickup(shipmentId) {
        try {
            const token = await this.authenticate();

            // Mock Response
            if (token === 'MOCK_TOKEN_12345') {
                return { response: { data: { pickup_token_number: 'MOCK-TOKEN-999' } } };
            }

            const response = await axios.post(`${SHIPROCKET_URL}/courier/generate/pickup`, {
                shipment_id: [shipmentId]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data;
        } catch (error) {
            console.error('❌ [SHIPROCKET_PICKUP_ERROR]:', error.response?.data || error.message);
            throw error;
        }
    }
}

export default new ShiprocketService();
