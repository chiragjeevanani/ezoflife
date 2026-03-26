import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HelpCenterPage = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: 'How do I track my order?', a: 'You can track your order in real-time from the "Orders" section in your profile or by clicking "Track Order" on the home page after placing one.' },
    { q: 'What is the turnaround time?', a: 'Standard orders typically take 24-48 hours. Express orders are handled with priority and usually returned within 24 hours.' },
    { q: 'How do I pay for my order?', a: 'We accept various payment methods including UPI (Google Pay, PhonePe), Credit/Debit cards, and Cash on Delivery.' },
    { q: 'Can I cancel my order?', a: 'Orders can be cancelled free of charge before the rider is assigned for pickup. Check your order tracking for the current status.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <header className="fixed top-0 z-50 bg-white/70 backdrop-blur-xl w-full flex items-center px-6 py-4 border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface-variant mr-4">arrow_back</button>
        <h1 className="font-headline font-black text-xl text-primary tracking-tighter">Help Center</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-36 w-full">
        {/* Support Hero */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 ml-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1 block opacity-60">Customer Care</span>
          <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">How can we<br/>help you?</h2>
          <div className="flex gap-4 mt-6">
            <button className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              Live Chat
            </button>
            <button className="flex-1 bg-white text-primary border border-primary/20 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-sm">call</span>
              Call Support
            </button>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <h3 className="font-headline font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant opacity-40 ml-2">Frequently Asked</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm"
              >
                <h4 className="font-black text-sm text-on-surface tracking-tight mb-3 flex items-start gap-3">
                  <span className="text-primary mt-0.5 font-black text-xs">Q.</span>
                  {faq.q}
                </h4>
                <p className="text-[11px] font-bold text-on-surface-variant opacity-60 leading-relaxed ml-6">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social Support */}
        <section className="mt-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-6">Connect across channels</p>
          <div className="flex justify-center gap-6 text-on-surface-variant opacity-60">
            <span className="material-symbols-outlined text-2xl hover:text-primary transition-colors cursor-pointer">public</span>
            <span className="material-symbols-outlined text-2xl hover:text-primary transition-colors cursor-pointer">alternate_email</span>
            <span className="material-symbols-outlined text-2xl hover:text-primary transition-colors cursor-pointer">share_location</span>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default HelpCenterPage;
