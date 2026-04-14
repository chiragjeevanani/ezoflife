import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';
import Notification from './src/models/Notification.js';

dotenv.config();

const clearData = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const orderRes = await Order.deleteMany({});
        console.log(`Deleted ${orderRes.deletedCount} orders`);

        const notifRes = await Notification.deleteMany({});
        console.log(`Deleted ${notifRes.deletedCount} notifications`);

        console.log('--- Cleanup Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup Error:', err);
        process.exit(1);
    }
};

clearData();
