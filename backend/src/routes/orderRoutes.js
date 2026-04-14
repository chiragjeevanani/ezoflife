import express from 'express';
import { 
    createOrder, 
    getMyOrders, 
    getVendorOrders, 
    updateOrderStatus, 
    getAllOrders,
    getRiderTasks,
    acceptOrder,
    verifyPickupOtp,
    getRiderStats,
    getOrderById,
    vendorAcceptOrder,
    getPoolOrders,
    verifyDeliveryOtp
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', createOrder);

// Get my orders (Customer)
router.get('/my', getMyOrders);

// Get vendor assigned orders
router.get('/vendor', getVendorOrders);
router.get('/pool', getPoolOrders);
router.post('/vendor-accept/:id', vendorAcceptOrder);

// Update order status
router.patch('/status/:id', updateOrderStatus);

// Rider Specific Routes
router.post('/accept/:id', acceptOrder);
router.post('/verify-pickup/:id', verifyPickupOtp);
router.post('/verify-delivery/:id', verifyDeliveryOtp);
router.get('/rider/:riderId', getRiderTasks);
router.get('/rider-stats/:riderId', getRiderStats);

// Admin: Get all orders
router.get('/all', getAllOrders);

// Specific order by ID (Must be at the bottom)
router.get('/:id', getOrderById);

export default router;
