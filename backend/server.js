import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import materialRoutes from './src/routes/materialRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import faqRoutes from './src/routes/faqRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import mediaRoutes from './src/routes/mediaRoutes.js';
import partnershipRoutes from './src/routes/partnershipRoutes.js';
import promotionRoutes from './src/routes/promotionRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import { addSpecialist, getAllSpecialists, deleteSpecialist, createRequisition, getAllRequisitions, assignRequisition } from './src/controllers/laborController.js';

import http from 'http';
import { initSocket } from './src/socket.js';

dotenv.config();
console.log('--- 🚀 SERVER STARTING UP ---');
console.log('--- 🔧 Loading Partnership & Labor Routes ---');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/partnerships', partnershipRoutes);

// Labor Routes - Direct Registration
app.post('/api/labor/add', addSpecialist);
app.get('/api/labor/all', getAllSpecialists);
app.delete('/api/labor/:id', deleteSpecialist);
app.post('/api/labor/place-request', createRequisition);
app.get('/api/labor/active-requests', getAllRequisitions);
app.patch('/api/labor/place-request/:id/assign', assignRequisition);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/jobs', jobRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezoflife';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Ez of Life API is running...' });
});

// Final 404 Handler for diagnostics
app.use((req, res) => {
    console.log(`🔍 404 occurred for: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        message: 'Route not found on this server instance',
        path: req.originalUrl,
        method: req.method
    });
});

// API Routes
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
