import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { faqApi } from '../../../lib/api';

const HelpCenterPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await faqApi.getAll();
        setFaqs(data);
      } catch (error) {
        console.error('Fetch FAQs Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }), []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col font-body"
    >
      <header className="fixed top-0 z-50 bg-white/70 backdrop-blur-xl w-full flex items-center px-6 py-4 border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface mr-4">arrow_back</button>
        <h1 className="font-headline font-black text-xl text-primary tracking-tighter">Help Center</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-36 w-full">
        {/* Support Hero */}
        <motion.section 
          variants={itemVariants}
          className="mb-12 ml-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1 block">Customer Care</span>
          <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">How can we<br/>help you?</h2>
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => navigate('/user/support/tickets')}
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              Live Chat
            </button>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <motion.h3 variants={itemVariants} className="font-headline font-black text-[10px] uppercase tracking-[0.3em] text-on-surface ml-2">Frequently Asked</motion.h3>
          <div className="space-y-4">
            {loading ? (
              <div className="py-12 text-center opacity-30 italic text-sm">Loading FAQs...</div>
            ) : faqs.map((faq, i) => (
              <motion.div 
                key={faq._id || i}
                variants={itemVariants}
                className="bg-white rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm"
              >
                <h4 className="font-black text-sm text-on-surface tracking-tight mb-3 flex items-start gap-3">
                  <span className="text-primary mt-0.5 font-black text-xs">Q.</span>
                  {faq.question}
                </h4>
                <p className="text-[11px] font-bold text-on-surface-variant leading-relaxed ml-6">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
            {!loading && faqs.length === 0 && (
                <div className="py-12 text-center opacity-30 italic text-sm font-black uppercase tracking-widest">No questions yet.</div>
            )}
          </div>
        </section>

        {/* Social Support */}
        <motion.section variants={itemVariants} className="mt-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface mb-6">Connect across channels</p>
          <div className="flex justify-center gap-6 text-on-surface">
            <span className="material-symbols-outlined text-2xl hover:text-primary transition-colors cursor-pointer">public</span>
            <span className="material-symbols-outlined text-2xl hover:text-primary transition-colors cursor-pointer">alternate_email</span>
            <span className="material-symbols-outlined text-2xl hover:text-primary transition-colors cursor-pointer">share_location</span>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default HelpCenterPage;

