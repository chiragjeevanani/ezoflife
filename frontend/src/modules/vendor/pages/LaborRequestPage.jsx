import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LaborRequestPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Jobs'); // 'Jobs' or 'Applications'
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock Data for Jobs
    const [myJobs, setMyJobs] = useState([
        { id: 1, title: 'Expert Ironman Needed', category: 'Ironing', status: 'Active', applicants: 3, date: '24 Apr' },
        { id: 2, title: 'Urgent Helper Required', category: 'Operations', status: 'Filled', applicants: 8, date: '20 Apr' },
    ]);

    // Mock Data for Applications
    const [applications, setApplications] = useState([
        { id: 101, name: 'Ramesh Kumar', job: 'Expert Ironman Needed', experience: '5 Years', rating: 4.8, status: 'Pending' },
        { id: 102, name: 'Suresh Singh', job: 'Expert Ironman Needed', experience: '3 Years', rating: 4.5, status: 'Reviewed' },
        { id: 103, name: 'Mohit Verma', job: 'Urgent Helper Required', experience: '2 Years', rating: 4.2, status: 'Selected' },
    ]);

    useEffect(() => {
        const loadHub = async () => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 3000); // Branded 3s loader
        };
        loadHub();
    }, []);

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-32 font-body">
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        key="spinzyt-loader-jobhub"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-8"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex flex-col items-center"
                        >
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">SPINZYT</h1>
                            <div className="flex items-center gap-2 mt-4 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Staffing Hub Online</span>
                            </div>
                        </motion.div>
                        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1/2 h-full bg-indigo-500 rounded-full"
                            />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Scanning Talent Pool...</p>
                    </motion.div>
                ) : (
                    <motion.div key="hub-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Header */}
                        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full">
                                    <span className="material-symbols-outlined text-indigo-500">arrow_back</span>
                                </motion.button>
                                <div>
                                    <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none mb-1">Staffing Hub</h1>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Manage Jobs & Workers</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCreateModal(true)} className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-90 transition-all">
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </header>

                        {/* Tabs */}
                        <div className="px-6 mt-6">
                            <div className="bg-white p-1 rounded-2xl border border-slate-100 flex shadow-sm">
                                {['Jobs', 'Applications'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <main className="max-w-xl mx-auto px-6 pt-6 space-y-4">
                            {activeTab === 'Jobs' ? (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">My Posted Jobs</h3>
                                    {myJobs.map(job => (
                                        <div key={job.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-100 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'}`}>
                                                        {job.status}
                                                    </span>
                                                    <h4 className="text-base font-black text-slate-900 mt-2 tracking-tight">{job.title}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{job.category} • Posted on {job.date}</p>
                                                </div>
                                                <button className="material-symbols-outlined text-slate-300 hover:text-indigo-500">more_vert</button>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>)}
                                                    </div>
                                                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{job.applicants} Applicants</p>
                                                </div>
                                                <button onClick={() => setActiveTab('Applications')} className="text-[9px] font-black text-slate-900 uppercase tracking-widest hover:underline">View All</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recent Applications</h3>
                                    {applications.map(app => (
                                        <div key={app.id} className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                                                    <span className="material-symbols-outlined">person</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 tracking-tight">{app.name}</h4>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">For: {app.job}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{app.experience} Exp</span>
                                                        <span className="text-[8px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[10px]">star</span>{app.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </main>

                        {/* Create Job Modal Overlay (Simulation) */}
                        <AnimatePresence>
                            {showCreateModal && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm p-6 flex items-center justify-center"
                                >
                                    <motion.div 
                                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                                        className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6"
                                    >
                                        <div className="text-center">
                                            <h3 className="text-xl font-black text-slate-900">Post New Job</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Find the best talent for your shop</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Job Title</p>
                                                <input type="text" placeholder="e.g. Expert Ironman" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</p>
                                                <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20">
                                                    <option>Ironing</option>
                                                    <option>Washing</option>
                                                    <option>Helper</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                                            <button onClick={() => { setShowCreateModal(false); alert('Job Posted Successfully!'); }} className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Post Job</button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LaborRequestPage;
