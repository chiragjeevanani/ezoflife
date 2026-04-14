import express from 'express';
import { getNotifications, markAsRead, clearAll } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/clear', clearAll);

export default router;
