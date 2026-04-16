import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['Flat', 'Percentage'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    usageLimit: {
        type: Number,
        default: 100
    },
    currentUsage: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Paused', 'Expired', 'Scheduled'],
        default: 'Active'
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;
