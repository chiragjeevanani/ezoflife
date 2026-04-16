import express from 'express';
const router = express.Router();
import { 
    getAllFAQs, 
    createFAQ, 
    updateFAQ, 
    deleteFAQ 
} from '../controllers/faqController.js';

router.get('/', getAllFAQs);
router.post('/', createFAQ);
router.patch('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);

export default router;
