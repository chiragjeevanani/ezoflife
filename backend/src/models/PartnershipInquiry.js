import mongoose from 'mongoose';

const partnershipInquirySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    partnershipType: {
        type: String,
        required: true
    },
    proposal: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PartnershipInquiry = mongoose.model('PartnershipInquiry', partnershipInquirySchema);
export default PartnershipInquiry;
