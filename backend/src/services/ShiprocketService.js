/**
 * Shiprocket Mock Service
 * Simulates Shiprocket logistics integration for development.
 */

class ShiprocketService {
    constructor() {
        this.apiKey = process.env.SHIPROCKET_API_KEY || 'MOCK_KEY_123';
        this.isMock = !process.env.SHIPROCKET_API_KEY;
    }

    /**
     * Simulates creating a return order in Shiprocket
     */
    async createReturnOrder(order, customer, isQC = true) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        console.log('\n========================================');
        console.log('🚀 [SHIPROCKET] RIDER ASSIGNED AUTOMATICALLY');
        console.log(`📦 Order ID: ${order.orderId}`);
        console.log(`📱 Rider SMS Sent to: +91 9876543210`);
        console.log(`🔑 SECURE PICKUP OTP: ${otp}`);
        console.log('========================================\n');

        await new Promise(r => setTimeout(r, 500));
        
        return {
            success: true,
            shipment_id: `SR-RET-${Math.floor(Math.random() * 1000000)}`,
            order_id: `ORD-${Math.floor(Math.random() * 1000000)}`,
            pickup_otp: otp,
            awb_code: `AWB${Math.floor(Math.random() * 1000000000)}`
        };
    }

    /**
     * Simulates checking courier serviceability
     */
    async checkServiceability(pincode, isQC = true) {
        return {
            success: true,
            data: {
                available_courier_companies: [
                    {
                        courier_company_id: 10,
                        courier_name: "EzOfLife Express (Mock)",
                        rate: 40
                    }
                ]
            }
        };
    }

    /**
     * Simulates AWB generation
     */
    async generateAWB(shipmentId, courierId) {
        return {
            success: true,
            response: {
                data: {
                    awb_code: `AWB${Math.floor(Math.random() * 1000000000)}`
                }
            }
        };
    }

    /**
     * Simulates Pickup Generation
     */
    async generatePickup(shipmentId) {
        return {
            success: true,
            response: {
                data: {
                    pickup_token_number: `TKN-${Math.floor(Math.random() * 1000000)}`
                }
            }
        };
    }

    /**
     * Simulates assigning a rider (Backward compatibility)
     */
    async assignRider(orderId) {
        return {
            success: true,
            rider: {
                name: "Rahul Kumar (Shiprocket)",
                phone: "9876543210",
                photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
            }
        };
    }

    /**
     * Simulates sending an OTP to the rider via SMS
     */
    async sendOtpToRider(riderPhone, otp, orderNumber) {
        console.log(`\n-----------------------------------------`);
        console.log(`[SHIPROCKET SMS] To Rider: ${riderPhone}`);
        console.log(`[SHIPROCKET SMS] Message: Pickup verification code for Order ${orderNumber} is: ${otp}`);
        console.log(`-----------------------------------------\n`);
        return { success: true };
    }

    /**
     * Simulates Forward Order (Vendor -> Customer)
     */
    async createForwardOrder(order, customer) {
        return this.createReturnOrder(order, customer, false);
    }
}

export default new ShiprocketService();
