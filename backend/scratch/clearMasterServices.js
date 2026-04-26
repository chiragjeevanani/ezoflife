import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MasterService from '../src/models/MasterService.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';

async function clearData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const result = await MasterService.deleteMany({});
        console.log(`🗑️ Successfully deleted ${result.deletedCount} master services.`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    } catch (err) {
        console.error('❌ Error clearing master services:', err);
        process.exit(1);
    }
}

clearData();
