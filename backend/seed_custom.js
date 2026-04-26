import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';

async function seed() {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        const targetUsers = [
            { phone: '9999999991', role: 'Customer', status: 'approved', displayName: 'Test Customer' },
            { 
                phone: '9999999992', role: 'Vendor', status: 'approved', displayName: 'Test Vendor',
                isProfileComplete: true,
                shopDetails: { name: 'Test Vendor Shop', address: 'Vijay Nagar', city: 'Indore', gst: 'GST9922', services: [] }
            },
            { 
                phone: '9999999993', role: 'Supplier', status: 'approved', displayName: 'Test Supplier',
                isProfileComplete: true,
                supplierDetails: { businessName: 'Test Supplier Biz', address: 'Industrial Area', city: 'Indore', gst: 'GST9933' }
            },
            { phone: '9999999994', role: 'Admin', status: 'approved', displayName: 'System Admin' }
        ];

        for (const u of targetUsers) {
            await User.findOneAndUpdate({ phone: u.phone }, u, { upsert: true, new: true });
            console.log(`👤 Seeded ${u.role}: ${u.phone}`);
        }

        console.log('🎉 All accounts registered successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
