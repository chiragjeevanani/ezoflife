import express from 'express';
import { createAd, getActiveAd, getAllAds, toggleAdStatus, deleteAd } from '../controllers/adController.js';
import adUpload from '../middleware/adUpload.js';

const router = express.Router();

router.post('/', adUpload.single('media'), createAd);
router.get('/active', getActiveAd);
router.get('/all', getAllAds);
router.patch('/:id/toggle', toggleAdStatus);
router.delete('/:id', deleteAd);

export default router;
