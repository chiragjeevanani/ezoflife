import express from 'express';
import { uploadMedia, getMediaHistory, getLatestMedia, submitInquiry, getAllInquiries } from '../controllers/mediaController.js';
import localUpload from '../middleware/localUpload.js';

const router = express.Router();

router.post('/upload', localUpload.single('media'), uploadMedia);
router.get('/history', getMediaHistory);
router.get('/latest', getLatestMedia);

// Ad Inquiries
router.post('/inquiry', submitInquiry);
router.get('/inquiries', getAllInquiries);

export default router;
