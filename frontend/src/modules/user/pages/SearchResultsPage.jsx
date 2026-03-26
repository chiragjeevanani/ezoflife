import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const results = [
    { id: 'wash_fold', title: 'Wash & Fold', desc: 'Everyday wear, scented & stacked', icon: 'local_laundry_service', color: 'primary', price: '₹99.00' },
    { id: 'dry_clean', title: 'Dry Cleaning', desc: 'Suits, Silks & Delicates', icon: 'dry_cleaning', color: 'tertiary', price: '₹149.00' },
    { id: 'ironing', title: 'Ironing', desc: 'Crisp Finish, Steam Ironed', icon: 'iron', color: 'secondary', price: '₹49.00' },
    { id: 'shoe_spa', title: 'Shoe Spa', desc: 'Deep cleaning & restoration', icon: 'steps', color: 'primary', price: '₹199.00' }
  ].filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <header className="fixed top-0 z-50 bg-white/70 backdrop-blur-xl w-full px-6 py-4 border-b border-outline-variant/10">
        <div className="max-w-5xl mx-auto w-full flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="material-symbols-outlined text-outline">arrow_back</button>
            <div className="flex-1 relative flex items-center bg-surface-container-low rounded-2xl px-4 py-2 border border-outline-variant/5">
                <span className="material-symbols-outlined text-outline text-sm mr-2">search</span>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search services..."
                    className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold w-full placeholder:text-outline-variant/40"
                    autoFocus
                />
            </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-36 w-full">
        <div className="mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 opacity-60">
                {results.length} results for "{query}"
            </h2>
        </div>

        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {results.map((item, i) => (
                    <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate('/user/service-info', { state: { selectedService: item } })}
                        className="bg-white p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-container/40 flex items-center justify-center text-${item.color}`}>
                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-headline font-black text-lg text-on-surface">{item.title}</h3>
                                <p className="text-[11px] font-bold text-on-surface-variant opacity-60">{item.desc}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-headline font-black text-primary text-sm">{item.price}</p>
                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-lg">chevron_right</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {results.length === 0 && (
                <div className="py-20 text-center opacity-40">
                    <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                    <p className="font-black text-xs uppercase tracking-widest leading-relaxed">No services found matching<br/>your criteria.</p>
                </div>
            )}
        </div>
      </main>
    </motion.div>
  );
};

export default SearchResultsPage;
