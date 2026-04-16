import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobApi } from '../../../lib/api';

const CareerModeration = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const [isCreating, setIsCreating] = useState(false);
    const [viewMode, setViewMode] = useState('Jobs'); // 'Jobs' or 'Applications'

    // Form for Admin Direct Post
    const [form, setForm] = useState({
        title: '',
        companyName: 'EzOfLife Corporate',
        description: '',
        requirements: '',
        location: 'Gurgaon (HQ)',
        type: 'Full-time',
        salary: 'As per Industry'
    });

    useEffect(() => {
        fetchJobs();
        fetchApplications();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobApi.getAdminAll();
            setJobs(data);
        } catch (error) {
            console.error('Fetch all jobs error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const data = await jobApi.getAdminApplications();
            setApplications(data);
        } catch (error) {
            console.error('Fetch applications error:', error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await jobApi.updateStatus(id, status);
            fetchJobs();
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleUpdateApplicationStatus = async (id, status) => {
        try {
            await jobApi.updateApplicationStatus(id, status);
            fetchApplications();
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleAdminCreate = async (e) => {
        e.preventDefault();
        try {
            const adminData = JSON.parse(localStorage.getItem('adminUser') || '{}');
            const requirementsArray = form.requirements.split(',').map(r => r.trim()).filter(r => r !== '');
            const jobData = {
                ...form,
                requirements: requirementsArray,
                createdBy: adminData._id || adminData.id || 'admin_id',
                creatorRole: 'Admin'
            };
            await jobApi.create(jobData);
            fetchJobs();
            setIsCreating(false);
            setForm({ title: '', companyName: 'EzOfLife Corporate', description: '', requirements: '', location: 'Gurgaon (HQ)', type: 'Full-time', salary: 'As per Industry' });
        } catch (error) {
            alert('Creation failed');
        }
    };

    const filteredJobs = (Array.isArray(jobs) ? jobs : []).filter(j => j.status === filter);

    return (
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 min-h-screen bg-[#E0F7FA]/30">
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
                <div className="space-y-2">
                    <button className="flex items-center gap-2 text-[9px] font-black not-italic text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Flow
                    </button>
                    <h1 className="text-4xl sm:text-5xl font-black not-italic tracking-tighter text-slate-900 uppercase leading-none">Flow Updates.</h1>
                    <p className="text-[10px] sm:text-xs font-bold not-italic text-slate-400 uppercase tracking-widest">Recruitment pipeline status and candidate tracking</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl flex w-full sm:w-fit shadow-sm border border-white">
                        <button onClick={() => setViewMode('Jobs')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black not-italic uppercase tracking-widest transition-all ${viewMode === 'Jobs' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Jobs</button>
                        <button onClick={() => setViewMode('Applications')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black not-italic uppercase tracking-widest transition-all ${viewMode === 'Applications' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Applications</button>
                    </div>
                    {viewMode === 'Jobs' && (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="w-full sm:w-fit px-8 py-3.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Create Direct Post
                        </button>
                    )}
                </div>
            </div>

            {viewMode === 'Jobs' ? (
                <>
                    <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                        {['Pending', 'Approved', 'Rejected'].map(status => (
                            <button 
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredJobs.map(job => (
                                    <motion.div 
                                        key={job._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-6 rounded-[2rem] border border-slate-100 border-b-4 border-b-slate-900 shadow-sm space-y-4"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{job.companyName}</p>
                                                <h3 className="text-lg font-black text-slate-900 leading-tight">{job.title}</h3>
                                            </div>
                                            {job.creatorRole === 'Admin' && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[8px] font-black uppercase border border-blue-100">Official</span>}
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-xs font-medium text-slate-500 line-clamp-2">{job.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {job.requirements.slice(0, 3).map((r, i) => (
                                                    <span key={i} className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-bold uppercase">{r}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-50 flex gap-2">
                                            {filter === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(job._id, 'Approved')} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest">Approve</button>
                                                    <button onClick={() => handleUpdateStatus(job._id, 'Rejected')} className="px-4 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Reject</button>
                                                </>
                                            )}
                                            {filter !== 'Pending' && (
                                                <button onClick={() => handleUpdateStatus(job._id, 'Pending')} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest">Move to Review</button>
                                            )}
                                            <button 
                                                onClick={async () => { if(confirm('Permanently delete?')) { await jobApi.delete(job._id); fetchJobs(); } }}
                                                className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Applications</span>
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-primary uppercase">{applications?.length || 0} Total</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {(Array.isArray(applications) ? applications : []).map(app => (
                                <motion.div 
                                    key={app._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5 group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none">{app.applicantName}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Applied for <span className="text-primary">{app.jobId?.title}</span>
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                                            app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600' : 
                                            app.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-4 rounded-2xl">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                                            <p className="text-[10px] font-bold text-slate-800 truncate">{app.applicantPhone}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                            <p className="text-[10px] font-bold text-slate-800 truncate">{app.applicantEmail}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <a 
                                            href={app.resumeLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-center shadow-lg shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            View Resume
                                        </a>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleUpdateApplicationStatus(app._id, 'Shortlisted')}
                                                className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">check</span>
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateApplicationStatus(app._id, 'Rejected')}
                                                className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                            <button 
                                                onClick={async () => { if(confirm('Delete application?')) { await jobApi.deleteApplication(app._id); fetchApplications(); } }}
                                                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Admin Post Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-20">
                        <div onClick={() => setIsCreating(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-y-auto max-h-full no-scrollbar">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-6">Create Official Career Post</h2>
                            <form onSubmit={handleAdminCreate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">Title</label>
                                        <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">Company Name</label>
                                        <input required value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">Description</label>
                                    <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold min-h-[100px]" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">Location</label>
                                        <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">Salary</label>
                                        <input required value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">Requirements (CSV)</label>
                                    <input value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Push Live</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareerModeration;
