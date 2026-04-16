import express from 'express';
import { 
    createJob, 
    getVendorJobs, 
    getAllJobsForAdmin, 
    updateJobStatus, 
    getApprovedJobs, 
    deleteJob 
} from '../controllers/jobController.js';
import { 
    submitApplication, 
    getAllApplications, 
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
router.delete('/:id', deleteJob);

// Applications
router.post('/apply', submitApplication);
router.get('/admin/applications', getAllApplications);
router.get('/:jobId/applications', getApplicationsForJob);
router.patch('/applications/:id/status', updateApplicationStatus);
router.delete('/applications/:id', deleteApplication);

export default router;
