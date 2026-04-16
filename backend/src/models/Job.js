import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [String],
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    salary: {
        type: String,
        default: 'Negotiable'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Closed'],
        default: 'Pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creatorRole: {
        type: String,
        enum: ['Admin', 'Vendor'],
        required: true
    },
    isDirectAdminPost: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
