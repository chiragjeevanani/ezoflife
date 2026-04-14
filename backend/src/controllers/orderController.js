import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import axios from 'axios';
import Notification from '../models/Notification.js';
import fs from 'fs';
import { getIO } from '../socket.js';

const logToFile = (msg) => {
    try {
        fs.appendFileSync('./REAL_USER_DEBUG.log', `${new Date().toISOString()} - ${msg}\n`);
    } catch (e) {}
};

// Haversine formula to calculate distance between two points in km
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Google Maps Distance Matrix API call
const calculateGoogleDistance = async (lat1, lon1, lat2, lon2) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lon1}&destinations=${lat2},${lon2}&key=${apiKey}`;
        const response = await axios.get(url);
        if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
            return response.data.rows[0].elements[0].distance.value / 1000; // in km
        }
        return null;
    } catch (error) {
        console.error('Google Maps API Error:', error);
        return null;
    }
};

export const getNearbyVendors = async (customerLat, customerLng, radiusKm = 4) => {
    try {
        const cLat = Number(customerLat);
        const cLng = Number(customerLng);
        const vendors = await User.find({ role: 'Vendor', status: 'approved' });
        const nearbyVendors = [];

        for (const vendor of vendors) {
            const vLat = Number(vendor.location?.lat || 0);
            const vLng = Number(vendor.location?.lng || 0);
            let distance = calculateHaversineDistance(cLat, cLng, vLat, vLng);
            if (distance <= radiusKm) {
                nearbyVendors.push({
                    id: vendor._id,
                    name: vendor.shopDetails?.shopName || vendor.displayName,
                    distance: distance.toFixed(2)
                });
            }
        }
        return nearbyVendors;
    } catch (err) {
        console.error('Nearby Vendors Error:', err);
        return [];
    }
};

const assignVendor = async (customerLat, customerLng) => {
    try {
        const vendors = await User.find({ role: 'Vendor', status: 'approved' });
        if (vendors.length === 0) return null;

        let closestVendor = null;
        let minDistance = Infinity;

        for (const vendor of vendors) {
            const vendorLat = vendor.location?.lat || 0;
            const vendorLng = vendor.location?.lng || 0;

            let distance = await calculateGoogleDistance(customerLat, customerLng, vendorLat, vendorLng);
            if (distance === null) {
                distance = calculateHaversineDistance(customerLat, customerLng, vendorLat, vendorLng);
            }

            if (distance < minDistance) {
                minDistance = distance;
                closestVendor = vendor;
            }
        }

        return closestVendor ? closestVendor._id : null;
    } catch (err) {
        console.error('Vendor Assignment Error:', err);
        return null;
    }
};

export const getNearbyRiders = async (customerLat, customerLng, radiusKm = 4) => {
    try {
        const cLat = Number(customerLat);
        const cLng = Number(customerLng);
        
        const riders = await User.find({ role: 'Rider', status: 'approved' });
        const nearbyRiders = [];

        logToFile(`--- Matching for ${cLat}, ${cLng} (Found ${riders.length} active riders) ---`);

        for (const rider of riders) {
            const rLat = Number(rider.location?.lat || 0);
            const rLng = Number(rider.location?.lng || 0);

            let distance = calculateHaversineDistance(cLat, cLng, rLat, rLng);
            logToFile(`Rider: ${rider.displayName}, Pos: ${rLat},${rLng}, Dist: ${distance.toFixed(3)}km`);
            
            if (distance <= radiusKm) {
                nearbyRiders.push({
                    id: rider._id,
                    distance: distance.toFixed(2),
                    name: rider.displayName
                });
            }
        }
        return nearbyRiders;
    } catch (err) {
        console.error('Nearby Riders Error:', err);
        return [];
    }
};

export const createOrder = async (req, res) => {
    try {
        const { items, pickupSlot, deliverySlot, pickupAddress, pickupLocation, dropAddress, dropLocation, totalAmount, specialInstructions } = req.body;
        const customerId = req.body.customerId; 

        if (!customerId) return res.status(400).json({ message: 'Customer ID required' });

        // Search vendors near pickup location
        const nearbyVendors = await getNearbyVendors(pickupLocation.lat, pickupLocation.lng, 4);
        
        const newOrder = new Order({
            customer: customerId,
            items,
            pickupSlot,
            deliverySlot,
            pickupAddress,
            pickupLocation,
            dropAddress,
            dropLocation,
            totalAmount,
            specialInstructions: specialInstructions || '',
            status: 'Pending'
        });

        await newOrder.save();

        // Real-time broadcast to ALL vendors in the pool (Diagnostic/Redundancy)
        const io = getIO();
        io.to('vendors_pool').emit('new_order_available', {
            orderId: newOrder._id,
            displayId: newOrder.orderId,
            distance: 'Global'
        });
        logToFile(`Global broadcast sent for Order ${newOrder.orderId}`);

        const notifications = nearbyVendors.map(vendor => ({
            recipient: vendor.id,
            role: 'vendor',
            title: 'New Order Available',
            message: `A new laundry request at ${pickupAddress}. Distance: ${vendor.distance}km.`,
            type: 'order_available',
            orderId: newOrder._id
        }));

        if (notifications.length > 0) {
            try {
                await Notification.insertMany(notifications);
                
                nearbyVendors.forEach(v => {
                    logToFile(`Broadcasting to vendor room: user_${v.id}`);
                    io.to(`user_${v.id}`).emit('new_order_available', {
                        orderId: newOrder._id,
                        displayId: newOrder.orderId,
                        distance: v.distance
                    });
                });
            } catch (notifErr) {
                console.error('Notification Insert Error:', notifErr.message);
            }
        }

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const { customerId } = req.query;
        if (!customerId) return res.status(400).json({ message: 'Customer ID required' });

        logToFile(`[DEBUG] Fetching orders for CustomerID: ${customerId}. Detecting phone...`);

        // Phase 1: Get the current user to find their phone number
        const currentUser = await User.findById(customerId);
        if (!currentUser) {
            logToFile(`[DEBUG] ERROR: User not found for ID: ${customerId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        if (!currentUser.phone) {
            logToFile(`[DEBUG] WARNING: User ${customerId} has NO phone number. Fallback to ID search.`);
            const orders = await Order.find({ customer: customerId }).sort({ createdAt: -1 });
            return res.status(200).json(orders);
        }

        logToFile(`[DEBUG] Found phone: ${currentUser.phone} for account ${customerId}`);

        // Phase 2: Find ALL user accounts associated with this phone number (normalize to last 10 digits)
        const last10 = currentUser.phone.slice(-10);
        const allUserAccounts = await User.find({ phone: new RegExp(last10 + '$') });
        const accountIds = allUserAccounts.map(acc => acc._id);

        logToFile(`[DEBUG] Cross-account search for ${last10}. Found ${accountIds.length} linked IDs.`);

        // Phase 3: Fetch all orders for those accounts
        const orders = await Order.find({ customer: { $in: accountIds } })
            .populate('rider', 'displayName phone')
            .populate('vendor', 'shopDetails phone address')
            .sort({ createdAt: -1 });

        logToFile(`[DEBUG] Orders found for ${currentUser.phone}: ${orders.length}`);

        res.status(200).json(orders);
    } catch (err) {
        console.error('Fetch My Orders Error:', err);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const getVendorOrders = async (req, res) => {
    try {
        const { vendorId } = req.query;
        const orders = await Order.find({ vendor: vendorId }).populate('customer', 'displayName phone').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching vendor orders' });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const order = await Order.findById(id)
            .populate('customer', 'displayName phone address location')
            .populate('vendor', 'shopDetails address location');
            
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const updateData = { status };

        if (status === 'Ready') {
            console.log(`[LOGISTICS] Order ${order.orderId} marked as READY. Searching for delivery riders...`);
            
            // Delivery Phase: Start searching for riders from Vendor to Customer
            // Fallback to dropLocation if vendor profile location is missing
            const vLat = order.vendor?.location?.lat || 22.7984; // Default to test region if shop location is 0
            const vLng = order.vendor?.location?.lng || 75.9225;

            console.log(`[LOGISTICS] Provider (${order.vendor?.shopDetails?.name || 'Vendor'}) at ${vLat}, ${vLng}`);

            const nearbyRiders = await getNearbyRiders(vLat, vLng, 4);
            console.log(`[LOGISTICS] Found ${nearbyRiders.length} riders within 4km`);

            updateData.nearbyRiders = nearbyRiders;
            updateData.rider = null; // Open task for delivery rider
            
            // Generate deliveryOtp
            updateData.deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

            const io = getIO();
            
            if (nearbyRiders.length > 0) {
                // Notifications and Broadcast
                nearbyRiders.forEach(rider => {
                    const riderRoom = `user_${rider.id.toString()}`;
                    const earnings = 20 + (parseFloat(rider.distance) * 5);
                    
                    console.log(`[LOGISTICS] Sending delivery broadcast to Room: ${riderRoom}`);
                    
                    // Socket broadcast for real-time card
                    io.to(riderRoom).emit('new_pickup_broadcast', {
                        orderId: order.orderId,
                        mongoOrderId: id,
                        mongoId: id,
                        customerName: order.customer?.displayName || 'Customer',
                        pickupAddress: order.vendor?.shopDetails?.address || order.vendor?.address || 'Vendor Shop',
                        dropAddress: order.customer?.address || order.pickupAddress, 
                        distance: rider.distance,
                        earnings: earnings.toFixed(2),
                        type: 'pickup_available'
                    });
                });

                // Persistent Notifications
                const riderNotifs = nearbyRiders.map(rider => ({
                    recipient: rider.id,
                    role: 'rider',
                    title: 'New Delivery Task',
                    message: `Pickup: ${order.vendor?.shopDetails?.address || 'Vendor'} | Drop: ${order.customer?.displayName}`,
                    type: 'pickup_available',
                    orderId: id
                }));
                await Notification.insertMany(riderNotifs);
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true })
            .populate('customer', 'displayName phone address email')
            .populate('vendor', 'shopDetails address location')
            .populate('rider', 'displayName phone location');
            
        // Socket.io: Notify Customer room
        const io = getIO();
        io.to(`order_${id}`).emit('order_status_update', updatedOrder);

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Update Status Error:', err);
        res.status(500).json({ message: 'Error updating order status' });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'displayName phone').populate('vendor', 'shopDetails phone').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching all orders' });
    }
};

// Rider Specific Controllers
export const getRiderTasks = async (req, res) => {
    try {
        const { riderId } = req.params;
        const rid = new mongoose.Types.ObjectId(riderId);

        const orders = await Order.find({ 
            $or: [
                { rider: rid },
                { 
                    status: { $in: ['Assigned', 'Ready'] }, 
                    'nearbyRiders.id': rid 
                }
            ]
        }).populate('customer', 'displayName phone address location').sort({ createdAt: -1 });

        console.log(`getRiderTasks for ${riderId}: found ${orders.length} orders`);
        res.status(200).json(orders);
    } catch (err) {
        console.error('Fetch Tasks Error:', err);
        res.status(500).json({ message: 'Error fetching rider tasks' });
    }
};

export const getPoolOrders = async (req, res) => {
    try {
        const { vendorId } = req.query;
        const vendor = await User.findById(vendorId);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        const vLat = vendor.location?.lat || 0;
        const vLng = vendor.location?.lng || 0;

        // Find all Pending orders that have no vendor yet
        const orders = await Order.find({ 
            status: 'Pending', 
            vendor: null 
        }).populate('customer', 'displayName address location');
        
        const pool = orders.filter(order => {
            if (!order.location?.lat) return false;
            const dist = calculateHaversineDistance(vLat, vLng, order.location.lat, order.location.lng);
            return dist <= 4; // 4km radius
        }).map(o => ({
            ...o._doc,
            distance: calculateHaversineDistance(vLat, vLng, o.location.lat, o.location.lng).toFixed(2)
        }));

        res.status(200).json(pool);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pool orders' });
    }
};

export const vendorAcceptOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendorId } = req.body;
        
        const order = await Order.findById(id);
        if (order.vendor) return res.status(400).json({ message: 'Order already accepted by another vendor' });

        const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { vendor: vendorId, status: 'Assigned', pickupOtp }, 
            { new: true }
        ).populate('customer', 'displayName phone address location');

        // Remove availability notifications for other vendors
        await Notification.deleteMany({ orderId: id, type: 'order_available' });

        // Notify nearby riders (within 4km as per user request)
        const nearbyRiders = await getNearbyRiders(updatedOrder.pickupLocation.lat, updatedOrder.pickupLocation.lng, 4);
        
        const vendor = await User.findById(vendorId);

        if (nearbyRiders.length > 0) {
            const riderNotifs = nearbyRiders.map(rider => {
                const earnings = 20 + (parseFloat(rider.distance) * 5); // Base 20 + 5/km
                return {
                    recipient: rider.id,
                    role: 'rider',
                    title: 'New Pickup Task',
                    message: `Pickup: ${updatedOrder.pickupAddress} | Drop: ${vendor?.shopDetails?.address || 'Vendor'}`,
                    type: 'order_placed',
                    orderId: id
                };
            });
            await Notification.insertMany(riderNotifs);
        }

        // Update nearby riders in order for dashboard listing
        updatedOrder.nearbyRiders = nearbyRiders;
        await updatedOrder.save();

        // Socket.io updates
        const io = getIO();
        
        // Notify all vendors that order is taken
        io.emit('pool_update', { orderId: id, action: 'removed' }); 
        
        // Notify specific riders with EXTENDED DATA
        nearbyRiders.forEach(rider => {
            const earnings = 20 + (parseFloat(rider.distance) * 5);
            io.to(`user_${rider.id}`).emit('new_pickup_broadcast', {
                orderId: updatedOrder.orderId,
                mongoOrderId: id,
                customerName: updatedOrder.customer?.displayName || 'Customer',
                pickupAddress: updatedOrder.pickupAddress,
                dropAddress: vendor?.shopDetails?.address || vendor?.address || 'Vendor Shop',
                distance: rider.distance,
                earnings: earnings.toFixed(2)
            });
        });

        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error('Vendor Accept Error:', err);
        res.status(500).json({ message: 'Error accepting order' });
    }
};

export const acceptOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { riderId } = req.body;
        
        // Ensure order isn't already taken
        const order = await Order.findById(id);
        if (order.rider) return res.status(400).json({ message: 'Order already accepted by another rider' });

        // Determine new status: If it was Ready for delivery, it's now Out for Delivery
        const newStatus = order.status === 'Ready' ? 'Out for Delivery' : 'Assigned';

        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { rider: riderId, status: newStatus }, 
            { new: true }
        )
        .populate('customer', 'displayName phone address location')
        .populate('rider', 'displayName phone location')
        .populate('vendor', 'shopDetails address location');

        // Socket.io: Notify Customer room
        io.to(`order_${id}`).emit('order_status_update', updatedOrder);
        io.emit('rider_pool_update', { orderId: id, action: 'removed' });

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Error accepting order' });
    }
};

export const getRiderStats = async (req, res) => {
    try {
        const { riderId } = req.params;
        const orders = await Order.find({ rider: riderId });
        
        const completed = orders.filter(o => o.status === 'Delivered').length;
        const totalEarnings = orders.reduce((sum, o) => sum + (o.totalAmount * 0.05), 0); // 5% commission

        res.status(200).json({
            earnings: `₹${totalEarnings.toFixed(2)}`,
            completed: completed.toString(),
            rating: '4.9' // Placeholder until review system is in place
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching rider stats' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            // Check for human-readable orderId (e.g. #SZ-8291)
            const cleanId = id.startsWith('#') ? id : `#${id}`;
            query.orderId = cleanId;
        }

        const order = await Order.findOne(query)
            .populate('customer', 'displayName phone address email')
            .populate('vendor', 'shopDetails phone')
            .populate('rider', 'displayName phone');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order details', error: err.message });
    }
};

export const verifyPickupOtp = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.pickupOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please check with customer.' });
        }

        order.status = 'Picked Up';
        await order.save();
        
        const populatedOrder = await Order.findById(id)
            .populate('customer', 'displayName phone address email')
            .populate('vendor', 'shopDetails address location')
            .populate('rider', 'displayName phone location');

        const io = getIO();
        io.to(`order_${id}`).emit('order_status_update', populatedOrder);

        res.status(200).json({ message: 'Pickup verified and completed!', order: populatedOrder });
    } catch (err) {
        res.status(500).json({ message: 'Verification error', error: err.message });
    }
};

export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.deliveryOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please check with customer.' });
        }

        order.status = 'Delivered';
        await order.save();
        
        const populatedOrder = await Order.findById(id)
            .populate('customer', 'displayName phone address email')
            .populate('vendor', 'shopDetails address location')
            .populate('rider', 'displayName phone location');

        const io = getIO();
        io.to(`order_${id}`).emit('order_status_update', populatedOrder);

        res.status(200).json({ message: 'Delivery completed successfully!', order: populatedOrder });
    } catch (err) {
        res.status(500).json({ message: 'Verification error', error: err.message });
    }
};
