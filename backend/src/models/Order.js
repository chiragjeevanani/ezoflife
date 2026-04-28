import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    items: [
        {
            serviceId: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            unit: { type: String, default: 'pc' },
            clothCount: { type: Number, default: 0 }
        }
    ],
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Picked Up', 'In Progress', 'Ready', 'Out for Delivery', 'Payment Pending', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    pickupSlot: {
        date: { type: String },
        time: { type: String }
    },
    deliverySlot: {
        date: { type: String },
        time: { type: String }
    },
    pickupAddress: {
        type: String,
        required: true
    },
    pickupLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    dropAddress: {
        type: String,
        required: true
    },
    dropLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    orderId: {
        type: String,
        unique: true
    },
    specialInstructions: {
        type: String,
        default: ''
    },
    nearbyRiders: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            distance: String,
            name: String
        }
    ],
    pickupOtp: {
        type: String,
        default: null
    },
    deliveryOtp: {
        type: String,
        default: null
    },
    promoApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
        default: null
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    deliveryMode: {
        type: String,
        enum: ['Normal', 'Express'],
        default: 'Normal'
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    shipmentDetails: {
        shipmentId: String,
        orderId: String, // Shiprocket's internal order ID
        awbCode: String,
        courierName: String,
        labelUrl: String,
        isQC: { type: Boolean, default: false },
        lastStatus: String,
        pickupTokenNumber: String
    },
    deliveryShipmentDetails: {
        shipmentId: String,
        orderId: String,
        awbCode: String,
        courierName: String,
        labelUrl: String,
        lastStatus: String,
        pickupTokenNumber: String
    },
    logisticsHandshakes: [
        {
            phase: { 
                type: String, 
                enum: ['Collection', 'Inbound', 'Fulfillment', 'Reverse', 'Completion'],
                required: true
            },
            otp: String,
            isVerified: { type: Boolean, default: false },
            verifiedAt: Date,
            initiator: { type: String }, // Who has the OTP (e.g., 'Rider')
            verifier: { type: String }   // Who enters the OTP (e.g., 'Customer', 'Vendor')
        }
    ],
    riderDetails: {
        name: String,
        phone: String,
        photo: String
    },
    customerPhotos: [{ type: String }]
}, { timestamps: true });

// Pre-save hook to generate a unique readable order ID like #EZ-8291
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const random = Math.floor(1000 + Math.random() * 9000);
        this.orderId = `#EZ-${random}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
