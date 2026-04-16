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
        enum: ['Pending', 'Assigned', 'Picked Up', 'In Progress', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
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
    }
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
