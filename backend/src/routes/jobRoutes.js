import express from 'express';
import { 
    createJob, 
    getVendorJobs, 
    getAllActiveJobs, 
    applyToJob, 
    getVendorApplications,
    getAdminApplications,
    getAdminAllJobs,
    deleteJob
} from '../controllers/jobController.js';

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const router = express.Router();

router.post('/', createJob);
router.get('/admin/all', getAdminAllJobs);
router.get('/admin/applications', getAdminApplications);
router.get('/vendor', getVendorJobs); // Expected ?vendorId=
router.get('/active', getAllActiveJobs);
router.post('/apply', upload.single('resume'), applyToJob);
router.get('/vendor/:vendorId/applications', getVendorApplications);
router.delete('/:id', deleteJob);

export default router;
