import express from 'express';
const router = express.Router();
import * as materialController from '../controllers/materialController.js';

// All roles can view (Vendors for fulfillment, Admins for config)
// But only Admins should modify
router.get('/', materialController.getAllMaterials);
router.post('/', materialController.createMaterial);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

export default router;
