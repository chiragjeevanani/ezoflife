import express from 'express';
import { requestOtp, verifyOtp, adminLogin, completeVendorProfile, getStatus, getUserProfile, updateUserProfile, registerVendor, vendorLogin } from '../controllers/authController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/admin-login', adminLogin);
router.post('/register-vendor', registerVendor);
router.post('/vendor-login', vendorLogin);
router.post('/complete-vendor-profile', upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
]), completeVendorProfile);

router.get('/get-status', getStatus);
router.get('/profile/:id', getUserProfile);
router.patch('/profile/update/:id', updateUserProfile);

export default router;
