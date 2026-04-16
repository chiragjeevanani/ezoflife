import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jobApi } from '../../../lib/api';
import VendorHeader from '../components/VendorHeader';

const JobManagerPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [form, setForm] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: 'Full-time',
        salary: ''
    });

    const vendorData = JSON.parse(localStorage.getItem('vendorData') || '{}');
    const vendorId = vendorData?._id || vendorData?.id;

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await jobApi.getVendorJobs(vendorId);
            setJobs(data);
        } catch (error) {
            console.error('Fetch jobs error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const requirementsArray = form.requirements.split(',').map(r => r.trim()).filter(r => r !== '');
            const jobData = {
                ...form,
                requirements: requirementsArray,
                companyName: vendorData.shopDetails?.shopName || 'Vendor Laundry',
                createdBy: vendorId,
                creatorRole: 'Vendor'
            };
            await jobApi.create(jobData);
            fetchJobs();
            setIsCreating(false);
            setForm({ title: '', description: '', requirements: '', location: '', type: 'Full-time', salary: '' });
        } catch (error) {
            alert('Error creating job');
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'Rejected': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-background min-h-screen pb-32">
            <VendorHeader />

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Recruitment</h2>
                        <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mt-1">Manage Your Team Growth</p>
                    </div>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreating(true)}
                        className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </motion.button>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Scanning Catalog...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {(Array.isArray(jobs) ? jobs : []).map((job) => (
                                <motion.div 
                                    key={job._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-slate-900 leading-none">{job.title}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(job.status)}`}>
                                                    {job.status}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-xs font-bold">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="material-symbols-outlined text-sm">payments</span>
                                            <span className="text-xs font-bold">{job.salary}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex gap-2">
                                        <button 
                                            onClick={async () => {
                                                if(confirm('Delete this job?')) {
                                                    await jobApi.delete(job._id);
                                                    fetchJobs();
                                                }
                                            }}
                                            className="px-6 py-3 rounded-xl bg-rose-50 text-rose-500 font-black text-[9px] uppercase tracking-widest"
                                        >
                                            Remove
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-900 font-black text-[9px] uppercase tracking-widest">
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {jobs.length === 0 && (
                            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                <span className="material-symbols-outlined text-5xl text-slate-200 mb-4 font-thin">work_outline</span>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                    No active listings.<br/>Grow your workforce today.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create Job Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreating(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="bg-white w-full max-w-xl rounded-t-[3rem] p-8 pb-40 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">New Job Post</h3>
                                <button onClick={() => setIsCreating(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Position Title</label>
                                        <input 
                                            required
                                            value={form.title}
                                            onChange={e => setForm({...form, title: e.target.value})}
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-[1.5rem] p-5 text-sm font-bold transition-all"
                                            placeholder="e.g. Laundry Associate"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Description</label>
                                        <textarea 
                                            required
                                            value={form.description}
                                            onChange={e => setForm({...form, description: e.target.value})}
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-[1.5rem] p-5 text-sm font-bold transition-all min-h-[120px]"
                                            placeholder="Describe the role and day-to-day tasks..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Job Type</label>
                                            <select 
                                                value={form.type}
                                                onChange={e => setForm({...form, type: e.target.value})}
                                                className="w-full bg-slate-50 border-transparent rounded-[1.5rem] p-5 text-sm font-bold"
                                            >
                                                <option>Full-time</option>
                                                <option>Part-time</option>
                                                <option>Contract</option>
                                                <option>Internship</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Salary</label>
                                            <input 
                                                value={form.salary}
                                                onChange={e => setForm({...form, salary: e.target.value})}
                                                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-[1.5rem] p-5 text-sm font-bold transition-all"
                                                placeholder="e.g. 15k - 20k"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Location</label>
                                        <input 
                                            required
                                            value={form.location}
                                            onChange={e => setForm({...form, location: e.target.value})}
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-[1.5rem] p-5 text-sm font-bold transition-all"
                                            placeholder="e.g. Sector 43, Gurgaon"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Requirements (Comma separated)</label>
                                        <input 
                                            value={form.requirements}
                                            onChange={e => setForm({...form, requirements: e.target.value})}
                                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-[1.5rem] p-5 text-sm font-bold transition-all"
                                            placeholder="Experience, Driving, ID Proof"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 mt-4 active:scale-95 transition-all"
                                >
                                    Broadcast Listing
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default JobManagerPage;
