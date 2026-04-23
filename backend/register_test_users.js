import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';

const userSchema = new mongoose.Schema({
    phone: String,
    role: String,
    status: String,
    displayName: String,
    address: String,
    shopDetails: mongoose.Schema.Types.Mixed,
    supplierDetails: mongoose.Schema.Types.Mixed,
    isProfileComplete: Boolean
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function seedUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const testUsers = [
            // Customers
            { phone: '9999999991', role: 'Customer', status: 'approved', displayName: 'Test Customer 1', address: 'Indore, MP' },
            { phone: '9999999992', role: 'Customer', status: 'approved', displayName: 'Test Customer 2', address: 'Bhopal, MP' },
            // Vendors
            { 
                phone: '9999999993', role: 'Vendor', status: 'approved', displayName: 'Test Vendor 1', 
                shopDetails: { name: 'Test Shop 1', address: 'Vijay Nagar', pincode: '452010', city: 'Indore', gst: 'GST9933' },
                isProfileComplete: true
            },
            { 
                phone: '9999999994', role: 'Vendor', status: 'approved', displayName: 'Test Vendor 2', 
                shopDetails: { name: 'Test Shop 2', address: 'Saket', pincode: '452001', city: 'Indore', gst: 'GST9944' },
                isProfileComplete: true
            },
            // Suppliers
            { 
                phone: '9999999995', role: 'Supplier', status: 'approved', displayName: 'Test Supplier 1', 
                supplierDetails: { businessName: 'Supplier Biz 1', address: 'Industrial Area', pincode: '452001', city: 'Indore', gst: 'GST9955' },
                isProfileComplete: true
            },
            { 
                phone: '9999999996', role: 'Supplier', status: 'approved', displayName: 'Test Supplier 2', 
                supplierDetails: { businessName: 'Supplier Biz 2', address: 'Palasia', pincode: '452010', city: 'Indore', gst: 'GST9966' },
                isProfileComplete: true
            }
        ];

        for (const u of testUsers) {
            const updated = await User.findOneAndUpdate(
                { phone: u.phone },
                { $set: u },
                { upsert: true, new: true }
            );
            console.log(`Registered: ${u.phone} as ${u.role}`);
        }

        console.log('✅ All users registered successfully.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding users:', err);
    }
}

seedUsers();
