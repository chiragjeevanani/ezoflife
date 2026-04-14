import mongoose from 'mongoose';
import User from './src/models/User.js';
import Order from './src/models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ DB Connected');
        
        // Search for user with exactly the number provided in request
        const phone = '9826723441';
        const user = await User.findOne({ phone });
        
        if (user) {
            const orders = await Order.countDocuments({ customer: user._id });
            console.log(`🎯 EXACT MATCH FOUND! User: ${user.displayName}, Phone: ${user.phone}, Orders: ${orders}`);
        } else {
            console.log(`❌ NO USER found with EXACT phone ${phone}`);
            
            // Show similar numbers
            const partial = '982672';
            const matches = await User.find({ phone: new RegExp(partial) });
            console.log(`🔍 Similar numbers starting with "${partial}":`);
            matches.forEach(m => console.log(`   - ${m.displayName}: ${m.phone}`));
        }
        
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
