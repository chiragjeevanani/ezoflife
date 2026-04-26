import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';

async function clearOrders() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        console.log('🧹 Purging all orders...');
        const result = await Order.deleteMany({});
        console.log(`✅ SUCCESS: Deleted ${result.deletedCount} orders.`);

        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err);
        process.exit(1);
    }
}

clearOrders();
