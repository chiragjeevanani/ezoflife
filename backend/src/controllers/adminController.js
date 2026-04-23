import User from '../models/User.js';
import Job from '../models/Job.js';
import Promotion from '../models/Promotion.js';
import Order from '../models/Order.js';
import SystemConfig from '../models/SystemConfig.js';

// Get all roles pending approval
export const getPendingApprovals = async (req, res) => {
    try {
        const pendingUsers = await User.find({ 
            role: { $in: ['Vendor', 'Supplier'] }, 
            status: 'pending'
        }).select('-otp -otpExpiry').lean();
        
        res.status(200).json(pendingUsers);
    } catch (err) {
        console.error('Get Pending Approvals Error:', err);
        res.status(500).json({ message: 'Error fetching approvals' });
    }
};

// Approve a vendor
export const approveVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await User.findByIdAndUpdate(
            id, 
            { status: 'approved' }, 
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json({ message: 'Vendor approved successfully', vendor });
    } catch (err) {
        console.error('Approve Vendor Error:', err);
        res.status(500).json({ message: 'Error approving vendor' });
    }
};

// Reject a vendor
export const rejectVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await User.findByIdAndUpdate(
            id, 
            { status: 'rejected' }, 
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json({ message: 'Vendor rejected', vendor });
    } catch (err) {
        console.error('Reject Vendor Error:', err);
        res.status(500).json({ message: 'Error rejecting vendor' });
    }
};

// Delete a vendor and all their associated data (Cascade Delete)
export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Delete associated Jobs
        await Job.deleteMany({ createdBy: id });

        // 2. Delete associated Promotions
        await Promotion.deleteMany({ vendorId: id });

        // 3. Delete associated Orders (assigned to this vendor)
        await Order.deleteMany({ vendor: id });

        // 4. Finally delete the User (Vendor)
        const vendor = await User.findByIdAndDelete(id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json({ 
            message: 'Vendor and all associated data deleted successfully',
            deletedVendorId: id
        });
    } catch (err) {
        console.error('Delete Vendor Error:', err);
        res.status(500).json({ message: 'Error deleting vendor and associated data' });
    }
};

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await User.find({ role: 'Supplier' }).select('-otp -otpExpiry').lean();
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching suppliers' });
    }
};

// Approve a supplier
export const approveSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await User.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json({ message: 'Supplier approved successfully', supplier });
    } catch (err) {
        res.status(500).json({ message: 'Error approving supplier' });
    }
};

// Reject a supplier
export const rejectSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await User.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json({ message: 'Supplier rejected successfully', supplier });
    } catch (err) {
        res.status(500).json({ message: 'Error rejecting supplier' });
    }
};

// Update a supplier
export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const supplier = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json({ message: 'Supplier updated successfully', supplier });
    } catch (err) {
        console.error('Update Supplier Error:', err);
        res.status(500).json({ message: 'Error updating supplier' });
    }
};

// Delete a supplier
export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await User.findByIdAndDelete(id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting supplier' });
    }
};

// Get Dashboard Stats (Live Data)
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            activeVendors,
            pendingApprovals,
            totalRiders,
            totalSuppliers,
            pendingSuppliers
        ] = await Promise.all([
            User.countDocuments({ role: 'Customer' }),
            User.countDocuments({ role: 'Vendor', status: 'approved' }),
            User.countDocuments({ role: 'Vendor', status: 'pending' }),
            User.countDocuments({ role: 'Rider' }),
            User.countDocuments({ role: 'Supplier' }),
            User.countDocuments({ role: 'Supplier', status: 'pending' })
        ]);

        res.status(200).json({
            stats: {
                totalUsers,
                activeVendors,
                pendingApprovals,
                totalRiders,
                totalSuppliers,
                pendingSuppliers,
                totalRevenue: 0,
                activeOrders: 0 
            }
        });
    } catch (err) {
        console.error('Get Stats Error:', err);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};

// Get all vendors (approved or pending)
export const getAllVendors = async (req, res) => {
    try {
        let vendors = await User.find({ role: 'Vendor' }).select('-otp -otpExpiry').lean();
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching vendors' });
    }
};

// Get single vendor with unified service catalog
export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await User.findById(id).select('-otp -otpExpiry').lean();
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        // Fetch custom services from Service collection
        const Service = (await import('../models/Service.js')).default;
        const customServices = await Service.find({ vendorId: id }).lean();

        // Merge Master Services (from shopDetails) and Custom Services
        const masterServices = vendor.shopDetails?.services || [];
        const unifiedServices = [
            ...masterServices.map(s => ({ ...s, isCustom: false })),
            ...customServices.map(s => ({ 
                id: s._id, 
                name: s.name, 
                vendorRate: s.basePrice, 
                status: s.approvalStatus.toLowerCase(),
                icon: s.icon,
                isCustom: true,
                normalTime: s.normalTime,
                expressTime: s.expressTime
            }))
        ];

        vendor.shopDetails = { ...vendor.shopDetails, services: unifiedServices };
        res.status(200).json(vendor);
    } catch (err) {
        console.error('Get Vendor By ID Error:', err);
        res.status(500).json({ message: 'Error fetching vendor details' });
    }
};

// Get all customers
export const getCustomers = async (req, res) => {
    try {
        let customers = await User.find({ role: 'Customer' }).select('-otp -otpExpiry').lean();
        
        // Auto-seed if less than 5 customers
        if (!customers || customers.length < 5) {
            const seedData = [
                { phone: '7000000001', displayName: 'Rahul Sharma', role: 'Customer', status: 'approved', address: 'Sector 56, Gurgaon' },
                { phone: '7000000002', displayName: 'Priya Verma', role: 'Customer', status: 'approved', address: 'Palam Vihar, Gurgaon' },
                { phone: '7000000003', displayName: 'Amit Goel', role: 'Customer', status: 'approved', address: 'Sushant Lok, Gurgaon' },
                { phone: '7000000004', displayName: 'Sneha Gupta', role: 'Customer', status: 'approved', address: 'Sector 44, Gurgaon' },
                { phone: '7000000005', displayName: 'Vikas Singh', role: 'Customer', status: 'approved', address: 'Sector 50, Gurgaon' }
            ];
            for (const u of seedData) {
                await User.updateOne({ phone: u.phone }, { $set: u }, { upsert: true });
            }
            customers = await User.find({ role: 'Customer' }).select('-otp -otpExpiry').lean();
        }
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
};

// Admin registering a new customer
export const registerCustomer = async (req, res) => {
    try {
        const { phone, displayName, email, address } = req.body;

        if (!phone || !displayName) {
            return res.status(400).json({ message: 'Phone and Name are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this phone number already exists' });
        }

        const newCustomer = new User({
            phone,
            displayName,
            email: email || '',
            address: address || '',
            role: 'Customer',
            status: 'approved', // Admin registered customers are auto-approved
            isProfileComplete: true
        });

        await newCustomer.save();

        res.status(201).json({
            message: 'Customer registered successfully',
            user: newCustomer
        });
    } catch (err) {
        console.error('Register Customer Error:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// Update status of a specific service for a vendor
export const updateVendorServiceStatus = async (req, res) => {
    try {
        const { vendorId, serviceId } = req.params;
        const { status, message } = req.body; // status: 'approved' | 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const vendor = await User.findById(vendorId);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        // 1. Check Custom Services (Service Collection)
        const Service = (await import('../models/Service.js')).default;
        const customService = await Service.findOne({ _id: serviceId, vendorId });
        
        if (customService) {
            customService.approvalStatus = status === 'approved' ? 'Approved' : 'Rejected';
            customService.status = status === 'approved' ? 'Active' : 'Suspended';
            if (status === 'rejected') customService.rejectionReason = message;
            await customService.save();
        } else {
            // 2. Check Master Services (User Collection shopDetails)
            let serviceFound = false;
            vendor.shopDetails.services = vendor.shopDetails.services.map(service => {
                if (service.id === serviceId) {
                    serviceFound = true;
                    service.status = status;
                    if (status === 'rejected') {
                        service.rejectionReason = message || 'Criteria not met';
                    } else {
                        service.rejectionReason = '';
                    }
                }
                return service;
            });

            if (!serviceFound) return res.status(404).json({ message: 'Service not found in vendor profile' });
            vendor.markModified('shopDetails.services');
            await vendor.save();
        }

        // Optional: Trigger notification to vendor
        if (status === 'rejected') {
             try {
                const Notification = (await import('../models/Notification.js')).default;
                await new Notification({
                    userId: vendorId,
                    title: 'Service Rejected',
                    message: `Your service update was rejected: ${message}`,
                    type: 'alert'
                }).save();
             } catch (notifErr) {
                 console.error('Failed to send rejection notification:', notifErr);
             }
        }

        res.status(200).json({ message: `Service ${status} successfully`, vendor });
    } catch (err) {
        console.error('Update Service Status Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// System Config Controllers
export const getSystemConfig = async (req, res) => {
    try {
        let configs = await SystemConfig.find();
        
        // Auto-seed if empty
        if (configs.length === 0) {
            const defaultExpress = new SystemConfig({
                key: 'express_surcharge',
                value: 99,
                description: 'Flat surcharge for Express Delivery mode'
            });
            const defaultNormal = new SystemConfig({
                key: 'normal_logistics_fee',
                value: 50,
                description: 'Base logistics fee for Normal Delivery mode'
            });
            await Promise.all([defaultExpress.save(), defaultNormal.save()]);
            configs = [defaultExpress, defaultNormal];
        }
        
        res.status(200).json(configs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching config' });
    }
};

export const updateSystemConfig = async (req, res) => {
    try {
        const { key, value } = req.body;
        const config = await SystemConfig.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        res.status(200).json(config);
    } catch (err) {
        res.status(500).json({ message: 'Error updating config' });
    }
};

// Upload document for a vendor by Admin
export const uploadVendorDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const vendor = await User.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Add to documents array
        vendor.documents.push({
            type: type || 'Other',
            url: req.file.path // This will be the Cloudinary URL from multer-storage-cloudinary
        });

        await vendor.save();

        res.status(200).json({
            message: 'Document uploaded successfully',
            documents: vendor.documents
        });
    } catch (err) {
        console.error('Admin Document Upload Error:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
