import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserHeader from '../components/UserHeader';

const PaymentMethodsPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const savedMethods = [
    { id: '1', type: 'card', brand: 'visa', last4: '4242', expiry: '12/26', holder: 'Julian Mendoza' },
    { id: '2', type: 'upi', brand: 'google_pay', handle: 'julian.m@okaxis' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <header className="fixed top-0 z-50 bg-white/70 backdrop-blur-xl w-full flex items-center px-6 py-4 border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface-variant mr-4">arrow_back</button>
        <h1 className="font-headline font-black text-xl text-primary tracking-tighter">Payment Methods</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-36 w-full">
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Description */}
          <motion.div variants={itemVariants} className="ml-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1 block opacity-60">Wallet & Vault</span>
            <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">Saved Methods</h2>
            <p className="text-xs font-bold text-on-surface-variant opacity-60">Manage your cards and digital payment IDs for a faster checkout flow.</p>
          </motion.div>

          {/* Saved Methods List */}
          <div className="space-y-4">
            {savedMethods.map((method) => (
              <motion.div 
                key={method.id}
                variants={itemVariants}
                className="bg-white rounded-[2rem] p-6 flex items-center justify-between border border-outline-variant/10 shadow-sm"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">
                      {method.type === 'card' ? 'credit_card' : 'qr_code_2'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-on-surface tracking-tight leading-none mb-1">
                      {method.type === 'card' ? `Visa •••• ${method.last4}` : method.handle}
                    </h3>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
                      {method.type === 'card' ? `Expires ${method.expiry}` : 'UPI ID'}
                    </p>
                  </div>
                </div>
                <button className="material-symbols-outlined text-outline-variant hover:text-error transition-colors">delete_outline</button>
              </motion.div>
            ))}

            {/* Add New Button */}
            <motion.button 
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 rounded-[2rem] border-2 border-dashed border-primary/20 text-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/5 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Add New Payment Method
            </motion.button>
          </div>

          {/* Security Info */}
          <motion.div 
            variants={itemVariants}
            className="bg-primary/5 rounded-3xl p-8 flex items-start gap-5 border border-primary/10"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-xl">verified_user</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-on-surface tracking-tight mb-1 uppercase">Bank-Grade Security</h4>
              <p className="text-[11px] font-bold text-on-surface-variant opacity-60 leading-relaxed">
                Your payment data is encrypted and stored in a secure vault. We never share your full card details with anyone.
              </p>
            </div>
          </motion.div>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default PaymentMethodsPage;
