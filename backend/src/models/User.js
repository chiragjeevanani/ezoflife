import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['Customer', 'Vendor', 'Rider', 'Admin', 'Supplier'],
        default: 'Customer'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() {
            return this.role === 'Vendor' ? 'pending' : 'approved';
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    shopDetails: {
        name: { type: String, default: '' },
        address: { type: String, default: '' },
        gst: { type: String, default: '' },
        services: [mongoose.Schema.Types.Mixed]

    },
    location: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    },
    riderDetails: {
        address: { type: String, default: '' },
        vehicleModel: { type: String, default: '' },
        plateNumber: { type: String, default: '' }
    },
    documents: [
        {
            type: { type: String },
            url: { type: String }
        }
    ],
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    displayName: {
        type: String,
        default: ''
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
