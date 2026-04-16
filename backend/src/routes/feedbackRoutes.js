import express from 'express';
const router = express.Router();
import { 
    submitFeedback,
    getVendorFeedbacks,
    getAllFeedbacks, 
    deleteFeedback 
} from '../controllers/feedbackController.js';

router.post('/submit', submitFeedback);
router.get('/vendor/:vendorId', getVendorFeedbacks);
router.get('/all', getAllFeedbacks);
router.delete('/:id', deleteFeedback);

export default router;
