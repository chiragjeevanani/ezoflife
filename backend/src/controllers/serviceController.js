import Service from '../models/Service.js';

// Get all services
export const getAllServices = async (req, res) => {
    try {
        const { approvedOnly, vendorId } = req.query;
        let query = {};
        
        if (approvedOnly === 'true') {
            query.approvalStatus = 'Approved';
        }

        if (vendorId) {
            // Get all Master services OR services belonging to this specific vendor
            query = {
                ...query,
                $or: [
                    { isMaster: true },
                    { vendorId: vendorId }
                ]
            };
        }

        const services = await Service.find(query).sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        console.error('Get All Services Error:', err);
        res.status(500).json({ message: 'Error fetching services' });
    }
};

// Create a new service
export const createService = async (req, res) => {
    try {
        const serviceData = { ...req.body };
        
        // If created by a vendor, it needs approval
        if (serviceData.vendorId) {
            serviceData.isMaster = false;
            serviceData.approvalStatus = 'Pending';
            serviceData.status = 'Inactive';
        } else {
            // Created by Admin
            serviceData.isMaster = true;
            serviceData.approvalStatus = 'Approved';
            serviceData.status = 'Active';
        }

        const newService = new Service(serviceData);
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (err) {
        console.error('Create Service Error:', err);
        res.status(500).json({ message: 'Error creating service' });
    }
};

// Update a service
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedService = await Service.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        res.status(200).json(updatedService);
    } catch (err) {
        console.error('Update Service Error:', err);
        res.status(500).json({ message: 'Error updating service' });
    }
};

// Delete a service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Service.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (err) {
        console.error('Delete Service Error:', err);
        res.status(500).json({ message: 'Error deleting service' });
    }
};
