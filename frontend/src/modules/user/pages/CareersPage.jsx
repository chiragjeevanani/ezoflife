import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CareersPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isApplied, setIsApplied] = useState(false);

    const MOCK_JOBS = useMemo(() => [
        { id: 1, title: 'Expert Pressman Required', category: 'Skilled Labor (Vendor)', location: 'Brooklyn, NY', desc: 'Seeking experienced steam iron specialist for high-volume boutique care.', type: 'Full-time' },
        { id: 2, title: 'Operations Manager', category: 'Spinzyt Internal', location: 'Manhattan, NY', desc: 'Oversee logistics and vendor management for the regional hub.', type: 'Corporate' },
        { id: 3, title: 'Wet Cleaner & Spotter', category: 'Skilled Labor (Vendor)', location: 'Queens, NY', desc: 'Must handle silk and delicate fabrics. Knowledge of stain removal is a plus.', type: 'Shift-based' },
        { id: 4, title: 'Rider Partner', category: 'Spinzyt Internal', location: 'Bronx, NY', desc: 'Hyperlocal delivery partner for our high-speed flow network.', type: 'Flexible' },
    ], []);

    const categories = useMemo(() => ['All', 'Spinzyt Internal', 'Skilled Labor (Vendor)'], []);
    
    const filteredJobs = useMemo(() => 
        MOCK_JOBS.filter(job => 
            (selectedCategory === 'All' || job.category === selectedCategory) &&
            (job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.location.toLowerCase().includes(searchQuery.toLowerCase()))
        ), 
        [MOCK_JOBS, selectedCategory, searchQuery]
    );

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    }), []);

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32 font-body">
            <header className="px-6 pt-4 flex items-center mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-outline-variant/10"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter italic leading-none">Careers</h1>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">Join the Ecosystem</p>
                    </div>
                </div>
            </header>

            <main className="px-6 max-w-2xl mx-auto">
                {/* Search and Filters */}
                <motion.div initial="hidden" animate="visible" variants={itemVariants} className="space-y-6 mb-10">
                    <div className="relative flex items-center bg-white rounded-3xl px-6 py-4 shadow-sm border border-outline-variant/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <span className="material-symbols-outlined text-outline-variant mr-3">search</span>
                        <input 
                            type="text" 
                            placeholder="Filter by Skill or Location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 p-0 text-sm font-semibold w-full placeholder:text-outline-variant/40"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                                    selectedCategory === cat 
                                    ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/10' 
                                    : 'bg-white text-on-surface-variant border-outline-variant/10'
                                }`}
                            >
                                {cat === 'Skilled Labor (Vendor)' ? 'Skilled Labor' : cat === 'Spinzyt Internal' ? 'Internal' : cat}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Job List */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <motion.div 
                                key={job.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white rounded-[2rem] p-6 border border-outline-variant/5 shadow-sm space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-black text-lg tracking-tight text-on-surface mb-1">{job.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{job.category}</span>
                                            <span className="w-1 h-1 rounded-full bg-outline-variant/30"></span>
                                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{job.type}</span>
                                        </div>
                                    </div>
                                    <div className="bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/10 flex items-center gap-1.5 shrink-0">
                                        <span className="material-symbols-outlined text-[12px] text-primary">location_on</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest">{job.location}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed italic opacity-80 line-clamp-2">
                                    "{job.desc}"
                                </p>
                                <button 
                                    onClick={() => { setIsApplied(true); setTimeout(() => setIsApplied(false), 3000); }}
                                    className="w-full py-4 bg-surface-container-high rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all border border-primary/10"
                                >
                                    Instant Application
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center opacity-40">
                            <span className="material-symbols-outlined text-5xl mb-4">person_search</span>
                            <p className="text-xs font-bold uppercase tracking-widest">No matching roles found.</p>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* Success Toast */}
            <AnimatePresence>
                {isApplied && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-6 right-6 z-[100]"
                    >
                        <div className="bg-primary text-on-primary rounded-2xl p-5 shadow-2xl flex items-center gap-4 border border-white/20">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined">send</span>
                            </div>
                            <div>
                                <p className="font-black text-[13px] leading-none mb-1">Application Sent</p>
                                <p className="text-[10px] font-bold opacity-80">The vendor team has been notified.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop Visuals */}
            <div className="fixed bottom-[10%] -left-20 w-80 h-80 bg-tertiary/5 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
    );
};

export default CareersPage;

