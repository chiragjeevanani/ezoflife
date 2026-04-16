import mongoose from 'mongoose';

const laborRequisitionSchema = new mongoose.Schema({
    vendorId: {
        type: String, // Or ObjectId if you have a Vendor model
        required: true
    },
    vendorName: {
        type: String,
        required: true
    },
    items: [{
        specialistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialist' },
        name: String,
        rate: String
    }],
    totalAmount: Number,
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    assignedAt: Date
}, { timestamps: true });

const LaborRequisition = mongoose.model('LaborRequisition', laborRequisitionSchema);
export default LaborRequisition;
