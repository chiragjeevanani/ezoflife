import express from 'express';
import { requestHandshake, verifyHandshake } from '../controllers/logisticsController.js';

const router = express.Router();

router.post('/request', requestHandshake);
router.post('/verify', verifyHandshake);

export default router;
