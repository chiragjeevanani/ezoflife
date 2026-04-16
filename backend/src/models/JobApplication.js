import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantEmail: {
        type: String,
        required: true
    },
    applicantPhone: {
        type: String,
        required: true
    },
    resumeLink: {
        type: String
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
