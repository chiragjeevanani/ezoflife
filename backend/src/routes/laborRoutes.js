import express from 'express';
import { addSpecialist, getAllSpecialists, deleteSpecialist, createRequisition, getAllRequisitions, assignRequisition } from '../controllers/laborController.js';

const router = express.Router();

router.post('/add', addSpecialist);
router.get('/all', getAllSpecialists);
router.delete('/:id', deleteSpecialist);

// Requests
router.post('/request', createRequisition);
router.get('/requests', getAllRequisitions);
router.patch('/request/:id/assign', assignRequisition);

export default router;
