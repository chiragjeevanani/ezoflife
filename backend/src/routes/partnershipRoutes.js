import express from 'express';
import { submitPartnershipInquiry, getAllPartnershipInquiries } from '../controllers/partnershipController.js';

const router = express.Router();

router.post('/submit', submitPartnershipInquiry);
router.get('/all', getAllPartnershipInquiries);

export default router;
