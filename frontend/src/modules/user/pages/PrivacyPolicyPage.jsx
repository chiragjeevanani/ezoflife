import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const sections = [
    { title: 'Data Collection', content: 'We collect your name, phone number, and address to facilitate laundry pickups and deliveries. Your location data is used only during active orders to provide real-time tracking.' },
    { title: 'Information Use', content: 'Your data is used to process orders, communicate status updates, and improve our services. We do not sell your personal information to third parties.' },
    { title: 'Security', content: 'We implement bank-grade encryption and secure storage for your payment and personal details. PCI-DSS compliance is maintained for all financial transactions.' },
    { title: 'User Rights', content: 'You can request deletion of your account and data at any time through our support center. We retain only what is legally required for tax and audit purposes.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <header className="fixed top-0 z-50 bg-white/70 backdrop-blur-xl w-full flex items-center px-6 py-4 border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface-variant mr-4">arrow_back</button>
        <h1 className="font-headline font-black text-xl text-primary tracking-tighter">Privacy Policy</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-36 w-full">
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 ml-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1 block opacity-60">Legal & Care</span>
          <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">Your Privacy,<br/>Our Commitment.</h2>
          <p className="text-[11px] font-bold text-on-surface-variant opacity-60 mt-4 uppercase tracking-widest leading-relaxed">
            Last Updated: March 25, 2026
          </p>
        </motion.section>

        <section className="space-y-10 px-2">
          {sections.map((sec, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-headline font-black text-lg text-primary tracking-tight leading-none uppercase">{sec.title}</h3>
              <p className="text-[13px] font-bold text-on-surface-variant opacity-60 leading-relaxed max-w-[90%]">
                {sec.content}
              </p>
            </motion.div>
          ))}
        </section>

        <section className="mt-20 p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-4 px-10">
            For further clarification on legal terms, please reach out via our support channel.
          </p>
          <button 
             onClick={() => navigate('/user/support')}
             className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
          >
            Contact Legal Team
          </button>
        </section>
      </main>
    </motion.div>
  );
};

export default PrivacyPolicyPage;
