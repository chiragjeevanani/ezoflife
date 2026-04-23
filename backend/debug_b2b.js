import mongoose from 'mongoose';
import User from './src/models/User.js';
import B2BOrder from './src/models/B2BOrder.js';

const MONGODB_URI = 'mongodb://localhost:27017/ezoflife';

async function checkOrders() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const orders = await B2BOrder.find().populate('supplier vendor');
    console.log(`Total B2B Orders: ${orders.length}`);

    orders.forEach(o => {
        console.log(`Order: ${o.b2bOrderId} | Status: ${o.status} | Supplier: ${o.supplier?.displayName || o.supplier} | Vendor: ${o.vendor?.displayName || o.vendor}`);
    });

    const suppliers = await User.find({ role: 'Supplier' });
    console.log(`Total Suppliers: ${suppliers.length}`);
    suppliers.forEach(s => {
        console.log(`Supplier: ${s.displayName} | Status: ${s.status} | Pincode: ${s.supplierDetails?.pincode} | City: ${s.supplierDetails?.city}`);
    });

    process.exit();
}

checkOrders();
