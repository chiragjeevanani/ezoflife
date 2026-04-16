import mongoose from 'mongoose';

const specialistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rate: {
        type: String, // e.g., "₹600/shift"
        required: true
    },
    icon: {
        type: String, // Material symbol name or Lucide icon name
        default: 'person'
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Specialist = mongoose.model('Specialist', specialistSchema);
export default Specialist;
