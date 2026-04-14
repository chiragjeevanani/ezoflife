import Material from '../models/Material.js';

// Create new material
export const createMaterial = async (req, res) => {
    try {
        const material = new Material(req.body);
        await material.save();
        res.status(201).json({ message: 'Material added successfully', material });
    } catch (error) {
        res.status(500).json({ message: 'Error adding material', error: error.message });
    }
};

// Get all materials
export const getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find().sort({ createdAt: -1 });
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching materials', error: error.message });
    }
};

// Update material
export const updateMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!material) return res.status(404).json({ message: 'Material not found' });
        res.status(200).json({ message: 'Material updated successfully', material });
    } catch (error) {
        res.status(500).json({ message: 'Error updating material', error: error.message });
    }
};

// Delete material
export const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndDelete(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });
        res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting material', error: error.message });
    }
};
