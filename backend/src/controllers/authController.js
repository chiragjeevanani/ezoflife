import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock OTP Generator - Hardcoded to 123456 for Testing
const generateOTP = () => '123456';

export const requestOtp = async (req, res) => {
    try {
        const { phone, channel, mode, customerType } = req.body; 
        const requestedRole = req.body.role || 'Customer'; // Capitalized

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Find User
        let user = await User.findOne({ phone });

        // Admin Protection: Disable Signup for Admin
        if (requestedRole === 'Admin' && mode === 'signup') {
            return res.status(403).json({ message: 'Admin registration is disabled.' });
        }

        // UNIFIED LOGIN LOGIC
        if (mode === 'login') {
            if (!user) {
                return res.status(404).json({ message: 'Account not found. Please signup first.' });
            }
        }

        if (mode === 'signup' && user) {
            return res.status(400).json({ message: `Account already exists as ${user.role}. Please login.` });
        }

        // If Signup and user not found, create as Customer by default
        if (!user) {
            user = new User({ 
                phone, 
                role: 'Customer',
                customerType: customerType || 'individual'
            });
        }

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Terminal Logging
        console.log('\n----------------------------------------');
        console.log(`📡 [${channel || 'SYSTEM'}] OTP Request (UNIFIED)`);
        console.log(`📱 Phone: +91 ${phone}`);
        console.log(`🔑 OTP: ${otp}`);
        console.log(`👤 Active Role: ${user.role}`);
        console.log('----------------------------------------\n');

        res.status(200).json({ message: 'OTP sent successfully', role: user.role });
    } catch (err) {
        console.error('Request OTP Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Toggle role to Vendor
export const becomeVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role === 'Vendor') {
            return res.status(400).json({ message: 'Already a vendor' });
        }

        user.role = 'Vendor';
        user.status = 'pending'; // MUST BE in ['pending', 'approved', 'rejected']
        await user.save();
        console.log(`✅ [ROLE_UPGRADE] User ${user.phone} successfully upgraded to Vendor`);

        res.status(200).json({ message: 'Upgraded to vendor successfully', role: user.role });
    } catch (err) {
        console.error('Become Vendor Error:', err);
        res.status(500).json({ message: 'Error upgrading to vendor' });
    }
};

// Toggle role to Supplier
export const becomeSupplier = async (req, res) => {
    console.log(`📩 [SUPPLIER_REG] Incoming request for ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        const { supplierName, businessName, address, city, pincode, gst } = req.body;
        
        console.log('📦 [SUPPLIER_REG] Body received:', { supplierName, businessName, city });
        
        // Parse JSON strings if they come as stringified objects in Multipart
        let bankDetails = req.body.bankDetails;
        if (typeof bankDetails === 'string') bankDetails = JSON.parse(bankDetails);
        
        let location = req.body.location;
        if (typeof location === 'string') location = JSON.parse(location);

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role === 'Supplier') {
            return res.status(400).json({ message: 'Already a supplier' });
        }

        user.role = 'Supplier';
        user.status = 'pending'; // Changed to pending for Admin approval flow
        user.displayName = supplierName || user.displayName;
        user.supplierDetails = {
            businessName,
            address,
            city,
            pincode,
            gst
        };
        
        if (bankDetails) {
            user.bankDetails = bankDetails;
        }

        if (location) {
            user.location = location;
        }

        // Handle Document Uploads from req.files (Local Storage)
        const documentFiles = [];
        if (req.files) {
            if (req.files.gstCert) {
                documentFiles.push({ type: 'GST Certificate', url: `/uploads/documents/${req.files.gstCert[0].filename}` });
            }
            if (req.files.udyogAadhar) {
                documentFiles.push({ type: 'Udyog Aadhar', url: `/uploads/documents/${req.files.udyogAadhar[0].filename}` });
            }
            if (req.files.aadharCard) {
                documentFiles.push({ type: 'Aadhar Card', url: `/uploads/documents/${req.files.aadharCard[0].filename}` });
            }
            if (req.files.addressProof) {
                documentFiles.push({ type: 'Address Proof', url: `/uploads/documents/${req.files.addressProof[0].filename}` });
            }
        }
        
        if (documentFiles.length > 0) {
            user.documents = documentFiles;
        }

        user.isProfileComplete = true; // Still marked complete, but status is pending
        
        await user.save();
        console.log(`✅ [SUPPLIER_REGISTRATION] User ${user.phone} registered as Supplier (PENDING APPROVAL)`);

        res.status(200).json({ 
            message: 'Registration successful! Waiting for Admin verification.', 
            user: {
                id: user._id,
                phone: user.phone,
                role: user.role,
                status: user.status,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (err) {
        console.error('Become Supplier Error:', err);
        res.status(500).json({ message: 'Error upgrading to supplier' });
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
        const { phone, shopName, address, pincode, city, gst } = req.body;
        const location = req.body.location ? JSON.parse(req.body.location) : null;
        const services = req.body.services ? JSON.parse(req.body.services) : [];
        const bankDetails = req.body.bankDetails ? JSON.parse(req.body.bankDetails) : null;

        console.log(`🚀 [PROFILE_COMPLETE] Attempting for Phone: ${phone}`);

        const user = await User.findOne({ phone, role: 'Vendor' });
        
        if (!user) {
            console.error(`❌ [PROFILE_COMPLETE] User NOT found with Phone: ${phone} and Role: Vendor`);
            // Extra check: is user there with different role?
            const anyUser = await User.findOne({ phone });
            if (anyUser) console.log(`ℹ️ [DEBUG] Found user with phone ${phone} but role is: ${anyUser.role}`);
            else console.log(`ℹ️ [DEBUG] No user at all found with phone ${phone}`);
            
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Handle File Uploads from Local Storage
        const documentFiles = [];
        if (req.files) {
            if (req.files.idCard) {
                documentFiles.push({ type: 'Government ID', url: `/uploads/documents/${req.files.idCard[0].filename}` });
            }
            if (req.files.businessProof) {
                documentFiles.push({ type: 'Business proof', url: `/uploads/documents/${req.files.businessProof[0].filename}` });
            }
        }

        user.shopDetails = {
            name: shopName,
            address: address,
            pincode: pincode,
            city: city,
            gst: gst,
            services: services
        };
        user.location = location;
        user.bankDetails = bankDetails;
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

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Surgical update: only change fields that are sent in the request
        Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });

        // ROLE-AWARE SYNC: If root address/pincode/city is updated, sync to specific details
        if (updates.address || updates.pincode || updates.city) {
            if (user.role === 'Vendor') {
                user.shopDetails = {
                    ...user.shopDetails,
                    address: updates.address || user.shopDetails.address,
                    pincode: updates.pincode || user.shopDetails.pincode,
                    city: updates.city || user.shopDetails.city
                };
            } else if (user.role === 'Supplier') {
                user.supplierDetails = {
                    ...user.supplierDetails,
                    address: updates.address || user.supplierDetails.address,
                    pincode: updates.pincode || user.supplierDetails.pincode,
                    city: updates.city || user.supplierDetails.city
                };
            }
        }

        await user.save();
        res.status(200).json(user);
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
