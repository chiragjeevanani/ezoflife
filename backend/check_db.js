import mongoose from 'mongoose';
import Order from './src/models/Order.js';

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ezoflife');
        const orders = await Order.find().sort({createdAt: -1}).limit(5);
        console.log('--- RECENT ORDERS ---');
        orders.forEach(o => {
            console.log(`ID: ${o._id}, DisplayID: ${o.orderId}, Status: ${o.status}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
