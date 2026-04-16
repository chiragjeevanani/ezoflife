import express from 'express';
import { 
    createPromotion, 
    getVendorPromotions, 
    togglePromotionStatus, 
    deletePromotion,
    getApplicablePromos
} from '../controllers/promotionController.js';

const router = express.Router();

router.post('/', createPromotion);
router.get('/vendor', getVendorPromotions);
router.get('/applicable', getApplicablePromos);
router.patch('/:id/toggle', togglePromotionStatus);
router.delete('/:id', deletePromotion);

export default router;
