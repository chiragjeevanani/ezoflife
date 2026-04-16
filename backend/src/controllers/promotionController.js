import Promotion from '../models/Promotion.js';

export const createPromotion = async (req, res) => {
    try {
        const promotion = new Promotion(req.body);
        await promotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getVendorPromotions = async (req, res) => {
    try {
        const { vendorId } = req.query;
        const promotions = await Promotion.find({ vendorId }).sort({ createdAt: -1 });
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const togglePromotionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await Promotion.findById(id);
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });

        promotion.status = promotion.status === 'Active' ? 'Paused' : 'Active';
        await promotion.save();
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePromotion = async (req, res) => {
    try {
        await Promotion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Promotion deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Customer facing: Get applicable promos for a vendor
export const getApplicablePromos = async (req, res) => {
    try {
        const { vendorId } = req.query;
        const promos = await Promotion.find({ 
            vendorId, 
            status: 'Active',
            expiryDate: { $gte: new Date() }
        });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
