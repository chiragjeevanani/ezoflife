import express from 'express';
import { 
    createJob, 
    getVendorJobs, 
    getAllJobsForAdmin, 
    updateJobStatus, 
    getApprovedJobs, 
    deleteJob,
    updateJob 
} from '../controllers/jobController.js';
import localUpload from '../middleware/localUpload.js';
import { 
    submitApplication, 
    getAllApplications, 
    getVendorApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    deleteApplication
} from '../controllers/jobApplicationController.js';

const router = express.Router();

router.post('/', createJob);
router.get('/vendor', getVendorJobs);
router.get('/admin/all', getAllJobsForAdmin);
router.get('/approved', getApprovedJobs);
router.patch('/:id/status', updateJobStatus);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

// Applications
router.post('/apply', localUpload.single('resume'), submitApplication);
router.get('/admin/applications', getAllApplications);
router.get('/vendor/:vendorId/applications', getVendorApplications);
router.get('/:jobId/applications', getApplicationsForJob);
router.patch('/applications/:id/status', updateApplicationStatus);
router.delete('/applications/:id', deleteApplication);

export default router;
