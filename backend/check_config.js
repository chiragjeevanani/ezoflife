import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';

const systemConfigSchema = new mongoose.Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed
});

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

async function checkConfig() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const configs = await SystemConfig.find();
        console.log('System Configs in DB:', JSON.stringify(configs, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkConfig();
