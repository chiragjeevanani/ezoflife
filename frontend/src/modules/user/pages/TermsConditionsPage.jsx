import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsConditionsPage = () => {
  const navigate = useNavigate();

  const sections = useMemo(() => [
    { title: 'Service Usage', content: 'By using our services, you agree to provide accurate information and follow our operational protocols. We reserve the right to refuse service if safety or operational standards are not met.' },
    { title: 'Cancellation & Fees', content: 'Orders can be cancelled free of charge before a rider is assigned for pickup. Late cancellations may incur a fee. We maintain clear billing through our secure vault system.' },
    { title: 'Item Care', content: 'We handle every garment with extreme care. Any specific care instructions should be mentioned during pickup. Liability for damages is limited to a fixed multiple of the service fee.' },
    { title: 'Account Governance', content: 'Users are responsible for maintaining the security of their accounts. Any suspicious activity should be reported immediately to our support center.' }
  ], []);

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
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface-variant mr-4">arrow_back</button>
        <h1 className="font-headline font-black text-xl text-primary tracking-tighter">Terms & Conditions</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-36 w-full">
        <motion.section 
          variants={itemVariants}
          className="mb-12 ml-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1 block opacity-60">Rules of Engagement</span>
          <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">Service Terms,<br/>Defined Clearly.</h2>
          <p className="text-[11px] font-bold text-on-surface-variant opacity-60 mt-4 uppercase tracking-widest leading-relaxed">
            Last Updated: March 25, 2026
          </p>
        </motion.section>

        <section className="space-y-10 px-2">
          {sections.map((sec, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="space-y-4"
            >
              <h3 className="font-headline font-black text-lg text-primary tracking-tight leading-none uppercase">{sec.title}</h3>
              <p className="text-[13px] font-bold text-on-surface-variant opacity-60 leading-relaxed max-w-[90%]">
                {sec.content}
              </p>
            </motion.div>
          ))}
        </section>

        <motion.section variants={itemVariants} className="mt-20 p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-4 px-10">
            For further clarification on legal terms, please reach out via our support channel.
          </p>
          <button 
             onClick={() => navigate('/user/support')}
             className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
          >
            Contact Legal Team
          </button>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default TermsConditionsPage;

