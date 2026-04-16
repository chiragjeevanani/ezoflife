import Feedback from '../models/Feedback.js';

// Submit new feedback
export const submitFeedback = async (req, res) => {
    try {
        const { userId, orderId, vendorId, rating, comment, category } = req.body;
        console.log('📝 Feedback Submission Attempt:', { userId, orderId, vendorId, rating, category });
        
        // Basic validation for ObjectIds to prevent 500 errors
        const isValidId = (id) => id && id.length === 24;

        const feedbackData = {
            user: userId,
            rating,
            comment,
            category
        };

        if (isValidId(orderId)) feedbackData.order = orderId;
        if (isValidId(vendorId)) feedbackData.vendor = vendorId;

        const newFeedback = new Feedback(feedbackData);
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

// Get feedbacks for a specific Vendor
export const getVendorFeedbacks = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const feedbacks = await Feedback.find({ vendor: vendorId })
            .populate('user', 'displayName phoneNumber')
            .populate('order', 'orderId createdAt')
            .sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendor feedbacks', error: error.message });
    }
};

// Get all feedbacks for Admin
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', 'displayName email phoneNumber')
            .populate('order', 'orderId status')
            .sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedbacks', error: error.message });
    }
};

// Delete feedback (Admin only)
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        await Feedback.findByIdAndDelete(id);
        res.status(200).json({ message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error: error.message });
    }
};
