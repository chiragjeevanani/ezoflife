import mongoose from 'mongoose';
import User from './src/models/User.js';
import Order from './src/models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        console.log('⏳ Connecting to Cloud DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Cloud DB Connected');
        
        const phone = '9826723441';
        const users = await User.find({ phone: new RegExp(phone.slice(-10) + '$') });
        console.log(`🔍 Found ${users.length} users with phone ${phone}`);
        
        for (const user of users) {
             const orders = await Order.countDocuments({ customer: user._id });
             console.log(`👤 User: ${user.displayName || 'No Name'} (${user.phone}) [ID: ${user._id}] -> Orders: ${orders}`);
        }
        
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
