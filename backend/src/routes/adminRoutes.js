console.log('--- ADMIN ROUTES MODULE LOADED ---');
import express from 'express';
import { 
    getPendingApprovals, 
    approveVendor, 
    rejectVendor, 
    getDashboardStats,
    getAllVendors,
    getCustomers,
    deleteVendor,
    registerCustomer,
    updateVendorServiceStatus,
    uploadVendorDocument,
    getAllSuppliers,
    approveSupplier,
    rejectSupplier,
    updateSupplier,
    deleteSupplier,
    getSystemConfig,
    updateSystemConfig
} from '../controllers/adminController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/config', getSystemConfig);
router.post('/config', updateSystemConfig);
router.get('/stats', getDashboardStats);
router.get('/vendors', getAllVendors);
router.post('/vendors/:id/documents', upload.single('file'), uploadVendorDocument);
router.get('/vendors/:id', async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const vendor = await User.findById(req.params.id).select('-otp -otpExpiry');
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.patch('/vendors/:vendorId/services/:serviceId/status', updateVendorServiceStatus);
router.delete('/vendors/:id', deleteVendor);
router.get('/customers', getCustomers);
router.post('/register-customer', registerCustomer);
router.get('/pending-approvals', getPendingApprovals);
router.post('/approve-vendor/:id', approveVendor);
router.post('/reject-vendor/:id', rejectVendor);

// Supplier Management
router.get('/suppliers', getAllSuppliers);
router.patch('/suppliers/:id/approve', approveSupplier);
router.patch('/suppliers/:id/reject', rejectSupplier);
router.patch('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Diagnostic Route
router.get('/diagnostic', async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const allUsers = await User.find({}, 'role phone').lean();
        const uniqueRoles = [...new Set(allUsers.map(u => u.role))];
        
        // Find users with role 'User' (which is not in enum) and fix them
        const invalidUsers = allUsers.filter(u => u.role === 'User');
        if (invalidUsers.length > 0) {
            await User.updateMany({ role: 'User' }, { $set: { role: 'Customer' } });
        }

        res.json({ 
            status: 'ok', 
            uniqueRolesInDB: uniqueRoles,
            fixedInvalidRoles: invalidUsers.length,
            totalUsers: allUsers.length
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

export default router;
