import Job from '../models/Job.js';
import mongoose from 'mongoose';

export const createJob = async (req, res) => {
    try {
        const job = new Job(req.body);
        // All jobs created by Admin or Vendor are Approved by default as per user request
        job.status = 'Approved';
        if (req.body.creatorRole === 'Admin') job.isDirectAdminPost = true;
        
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getVendorJobs = async (req, res) => {
    try {
        const { vendorId } = req.query;
        if (!vendorId) return res.status(400).json({ message: 'Vendor ID is required' });
        
        // Use ObjectId for precise matching
        const jobs = await Job.find({ 
            createdBy: new mongoose.Types.ObjectId(vendorId) 
        }).sort({ createdAt: -1 });
        
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllJobsForAdmin = async (req, res) => {
    try {
        const jobs = await Job.find().populate('createdBy', 'displayName shopDetails').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getApprovedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Approved' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
