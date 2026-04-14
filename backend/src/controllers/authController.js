import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const requestOtp = async (req, res) => {
    try {
        const { phone, channel, mode, role } = req.body; // role: 'Customer', 'Vendor', etc.

        if (!phone || !role) {
            return res.status(400).json({ message: 'Phone number and role are required' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Find User
        let user = await User.findOne({ phone });

        // Admin Protection: Disable Signup for Admin
        if (role === 'Admin' && mode === 'signup') {
            return res.status(403).json({ message: 'Admin registration is disabled. Contact super-admin.' });
        }

        // Logic Separation
        if (mode === 'login') {
            if (!user) {
                return res.status(404).json({ message: 'Account not found. Please signup first.' });
            }
            // Role Mismatch Protection
            if (user.role !== role) {
                return res.status(403).json({ message: `This account is registered as a ${user.role}. Access denied.` });
            }
        }

        if (mode === 'signup' && user) {
            return res.status(400).json({ message: `Account already exists as ${user.role}. Please login.` });
        }

        // If Signup and user not found, create a new record with the specific role
        if (!user) {
            user = new User({ phone, role });
        }

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Terminal Logging (as requested)
        console.log('\n----------------------------------------');
        console.log(`📡 [${channel || 'SYSTEM'}] OTP Request`);
        console.log(`📱 Phone: +91 ${phone}`);
        console.log(`🔑 OTP: ${otp}`);
        console.log('----------------------------------------\n');

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Request OTP Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ message: 'Phone and OTP are required' });
        }

        const user = await User.findOne({ phone });

        if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, phone: user.phone },
            process.env.JWT_SECRET || 'ezoflife_secret_key_2026',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                phone: user.phone,
                role: user.role,
                displayName: user.displayName,
                status: user.status,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (err) {
        console.error('Verify OTP Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Complete Vendor Profile
export const completeVendorProfile = async (req, res) => {
    try {
        const { phone, shopName, address, gst } = req.body;
        // Multipart text fields are strings, need parsing for JSON objects/arrays
        const location = req.body.location ? JSON.parse(req.body.location) : null;
        const services = req.body.services ? JSON.parse(req.body.services) : [];

        const user = await User.findOne({ phone, role: 'Vendor' });
        if (!user) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Handle File Uploads from Cloudinary
        const documentFiles = [];
        if (req.files) {
            if (req.files.idCard) {
                documentFiles.push({ type: 'Government ID', url: req.files.idCard[0].path });
            }
            if (req.files.businessProof) {
                documentFiles.push({ type: 'Business proof', url: req.files.businessProof[0].path });
            }
        }

        user.shopDetails = {
            name: shopName,
            address: address,
            gst: gst,
            services: services
        };
        user.location = location;
        user.documents = documentFiles; // Store Cloudinary URLs
        user.isProfileComplete = true;
        user.status = 'pending'; 
        await user.save();

        res.status(200).json({ message: 'Profile completed successfully. Pending approval.', user });
    } catch (err) {
        console.error('Complete Profile Error:', err);
        res.status(500).json({ message: 'Error completing profile' });
    }
};

// Get User Status
export const getStatus = async (req, res) => {
    try {
        const { phone } = req.query;
        if (!phone) return res.status(400).json({ message: 'Phone is required' });

        const user = await User.findOne({ phone, role: 'Vendor' });
        if (!user) return res.status(404).json({ message: 'Vendor not found' });

        res.status(200).json({ 
            status: user.status, 
            isProfileComplete: user.isProfileComplete 
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching status' });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hardcoded admin for now as per user request to not change too much
        // In a real app, we would find the user in DB and compare hashed passwords
        if (email === 'admin@ezoflife.com' && password === 'admin123') {
            let user = await User.findOne({ phone: 'ADMIN_SYSTEM', role: 'Admin' });
            if (!user) {
                user = new User({ phone: 'ADMIN_SYSTEM', role: 'Admin', displayName: 'System Admin' });
                await user.save();
            }

            const token = jwt.sign(
                { id: user._id, role: user.role, phone: user.phone },
                process.env.JWT_SECRET || 'ezoflife_secret_key_2026',
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                message: 'Admin login successful',
                token,
                user: {
                    id: user._id,
                    phone: user.phone,
                    role: user.role,
                    displayName: user.displayName
                }
            });
        }

        return res.status(401).json({ message: 'Invalid admin credentials' });
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Profile Management
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Surgical update: only change fields that are sent in the request
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
};

// Admin registering a vendor
export const registerVendor = async (req, res) => {
    try {
        const { name, mobile, email, gstNumber, password, address } = req.body;

        if (!name || !mobile || !email || !password) {
            return res.status(400).json({ message: 'Name, mobile, email and password are required' });
        }

        // Check if vendor already exists
        const existingUser = await User.findOne({ $or: [{ phone: mobile }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Vendor with this mobile or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new User({
            displayName: name,
            phone: mobile,
            email,
            password: hashedPassword,
            role: 'Vendor',
            status: 'approved', // Admin registered vendors are auto-approved
            address: address, // Main user address
            shopDetails: {
                name: name,
                address: address,
                gst: gstNumber,
                services: []
            },
            isProfileComplete: true
        });

        await newVendor.save();

        res.status(201).json({
            message: 'Vendor registered successfully',
            vendor: {
                id: newVendor._id,
                name: newVendor.displayName,
                email: newVendor.email,
                phone: newVendor.phone
            }
        });
    } catch (err) {
        console.error('Register Vendor Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Vendor login with password
export const vendorLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or phone

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email/Phone and password are required' });
        }

        const user = await User.findOne({ 
            $or: [{ email: identifier }, { phone: identifier }],
            role: 'Vendor'
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'approved') {
            return res.status(403).json({ message: `Your account status is: ${user.status}. Access denied.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, phone: user.phone },
            process.env.JWT_SECRET || 'ezoflife_secret_key_2026',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Vendor login successful',
            token,
            user: {
                id: user._id,
                phone: user.phone,
                email: user.email,
                role: user.role,
                displayName: user.displayName,
                status: user.status,
                isProfileComplete: user.isProfileComplete,
                shopDetails: user.shopDetails
            }
        });
    } catch (err) {
        console.error('Vendor Login Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
