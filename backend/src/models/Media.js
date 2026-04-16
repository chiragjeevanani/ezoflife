import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        default: 'PDF'
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);
export default Media;
