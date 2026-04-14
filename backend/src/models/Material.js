import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: 'Cleaning'
    },
    stock: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'package'
    },
    status: {
        type: String,
        enum: ['active', 'out_of_stock', 'discontinued'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
