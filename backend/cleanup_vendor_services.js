import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Service from './src/models/Service.js';

dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const phone = '2323232323';
        const user = await User.findOne({ phone: new RegExp(phone + '$') });

        if (!user) {
            console.log('Vendor not found');
            process.exit(0);
        }

        const vendorId = user._id;

        // 1. Clear registration services from User model
        user.shopDetails.services = [];
        user.markModified('shopDetails.services');
        await user.save();
        console.log(`Cleared registration services for vendor: ${phone}`);

        // 2. Delete all custom services from Service collection
        const deletedServices = await Service.deleteMany({ vendorId: vendorId });
        console.log(`Deleted ${deletedServices.deletedCount} custom services for vendor: ${phone}`);

        console.log('Cleanup completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
};

cleanup();
