import JobApplication from '../models/JobApplication.js';

export const submitApplication = async (req, res) => {
    try {
        const application = new JobApplication(req.body);
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getApplicationsForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await JobApplication.find({ jobId }).sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find()
            .populate('jobId', 'title companyName')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = await JobApplication.findByIdAndUpdate(id, { status }, { new: true });
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        await JobApplication.findByIdAndDelete(req.params.id);
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
