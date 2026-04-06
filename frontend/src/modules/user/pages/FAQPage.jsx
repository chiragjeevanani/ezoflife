import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const FAQ_DATA = useMemo(() => [
        {
            category: 'Getting Started',
            questions: [
                { q: 'How do I book a service?', a: 'Simply choose a category from the home screen, select your items, and follow the checkout flow to pick a time slot.' },
                { q: 'What is the Heritage Tier?', a: 'The Heritage Tier is our premium care service for luxury fabrics, silk, and delicate items. It includes specialized treatment and manual inspection.' }
            ]
        },
        {
            category: 'Payments & Fees',
            questions: [
                { q: 'When do I pay?', a: 'You pay 5% of the estimated amount upon pickup, and the remaining balance is settled once your clothes are ready for delivery.' },
                { q: 'What is the Express Surcharge?', a: 'Express service carries a multiplier (usually 1.5x) for 24-hour turnaround.' }
            ]
        },
        {
            category: 'Logistics',
            questions: [
                { q: 'Can I track my rider?', a: 'Yes, once a rider is assigned to your pickup or delivery, you can track them in real-time on the Order Tracking page.' },
                { q: 'What if I miss my slot?', a: 'Our team will contact you to reschedule. Late cancellations may incur a small rescheduling fee.' }
            ]
        }
    ], []);

    const filteredSections = useMemo(() => {
        return FAQ_DATA.map(section => ({
            ...section,
            questions: section.questions.filter(q => 
                q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(section => section.questions.length > 0);
    }, [FAQ_DATA, searchQuery]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    }), []);

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32 font-body">
            <header className="px-6 pt-4 flex items-center mb-8">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface border border-outline-variant/10"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter italic leading-none">Faq</h1>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">Instant Knowledge Base</p>
                    </div>
                </div>
            </header>

            <main className="px-6 max-w-2xl mx-auto">
                {/* Search */}
                <div className="relative mb-10">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-outline-variant">
                        <span className="material-symbols-outlined text-lg">help_outline</span>
                    </div>
                    <input 
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white rounded-[2rem] pl-14 pr-6 py-5 text-sm font-semibold border border-slate-300 shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-10"
                >
                    {filteredSections.map((section, sIdx) => (
                        <div key={section.category}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-5 ml-2">{section.category}</h2>
                            <div className="space-y-3">
                                {section.questions.map((item, qIdx) => {
                                    const id = `${sIdx}-${qIdx}`;
                                    const isOpen = expandedId === id;

                                    return (
                                        <motion.div 
                                            key={id}
                                            variants={itemVariants}
                                            className={`bg-white rounded-[2rem] border transition-all ${isOpen ? 'border-primary/20 shadow-lg' : 'border-outline-variant/5 shadow-sm'}`}
                                        >
                                            <button 
                                                onClick={() => toggleExpand(id)}
                                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                                            >
                                                <span className="text-sm font-black text-on-surface leading-tight pr-4">{item.q}</span>
                                                <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 pb-6 text-xs font-medium text-on-surface-variant leading-relaxed opacity-80 border-t border-outline-variant/5 pt-4">
                                                            {item.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredSections.length === 0 && (
                        <div className="py-20 text-center opacity-40">
                            <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
                            <p className="text-xs font-bold uppercase tracking-widest">No matching answers found.</p>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default FAQPage;

