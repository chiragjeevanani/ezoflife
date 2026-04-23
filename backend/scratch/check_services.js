import mongoose from 'mongoose';
import MasterService from './src/models/MasterService.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const services = await MasterService.find();
        console.log('Total Master Services:', services.length);
        services.forEach(s => {
            console.log(`- ${s.name} (Active: ${s.isActive}, Audience: ${s.targetAudience})`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
check();
