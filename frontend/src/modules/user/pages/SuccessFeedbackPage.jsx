import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const SuccessFeedbackPage = () => {
  const navigate = useNavigate();
  const bgRef = useRef(null);

  useEffect(() => {
    const blobs = bgRef.current?.querySelectorAll('.blob');
    if (blobs) {
      blobs.forEach((blob) => {
        gsap.to(blob, {
          x: 'random(-40, 40)',
          y: 'random(-40, 40)',
          duration: 'random(6, 12)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
    }
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }), []);

  const orderSummary = useMemo(() => ({
    id: "#SZ-8829",
    location: "Pristine Heights",
    amount: "₹899.00"
  }), []);

  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col font-body"
    >
      <main className="flex-grow pt-28 pb-32 px-6 max-w-2xl mx-auto w-full relative">
        {/* Animated Background Blobs */}
        <div ref={bgRef} className="absolute inset-0 pointer-events-none -z-10">
          <div className="blob absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="blob absolute bottom-20 left-0 w-48 h-48 bg-tertiary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Success State Hero */}
        <motion.section 
          variants={itemVariants}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-10">
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute -inset-6 bg-primary-container/20 rounded-full blur-2xl"
            ></motion.div>
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 4, repeat: Infinity, yoyo: true, ease: "sine.inOut" }}
              className="relative w-36 h-36 bg-primary-gradient rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/30"
            >
              <span className="material-symbols-outlined text-on-primary text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </motion.div>
          </div>
          <h1 className="font-headline text-5xl font-black text-on-background tracking-tighter leading-none mb-6">
            Pristine clean, <br/><span className="text-primary tracking-tighter">Handled.</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60 leading-relaxed max-w-[280px] mx-auto">
            Your laundry experience is now complete and verified. 
          </p>
        </motion.section>

        {/* Bento Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Order Summary Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-10 rounded-[2.5rem] flex flex-col justify-between border border-outline-variant/10 shadow-sm shadow-primary/5 group"
          >
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-primary mb-4 block opacity-60">Session Summary</span>
              <h3 className="font-headline text-3xl font-black text-on-surface mb-2 tracking-tighter">{orderSummary.id}</h3>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Delivered to {orderSummary.location}</p>
            </div>
            <div className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-center group-hover:border-primary/20 transition-colors">
              <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest opacity-60">Total Paid</span>
              <span className="font-headline text-2xl font-black text-primary tracking-tighter leading-none">{orderSummary.amount}</span>
            </div>
          </motion.div>

          {/* Vendor Rating Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-primary/5 p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm border border-primary/10"
          >
            <span className="text-[10px] uppercase font-black tracking-widest text-primary mb-8 block opacity-60">Rate Workshop</span>
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="w-20 h-20 rounded-2xl bg-white mb-6 p-1 relative shadow-lg"
            >
               <img alt="Vendor" className="w-full h-full object-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCmYBcwFrRfQnv_mQEMBHwecj7oHqmOjysHEYv1ZQaJgPQXs0F0Hfz9l5qpsdhGQRhENRQ7Kth5XXYF5vVStaL-70wxHJwQl4A6MZdbkAN_2rU2L2fURT6QDQoFT05fO_zqR8KRDinzSKp8O-5oywrEqA2hWd70vo0AmiNb41bsGAAeAFIW8l3tRsBUA75mlYoATn1QaI69yLMdU-16zYJZrSt5zpwr9NyXj0i68h11gswtyCv6dd75nABkPETQLZ8oW3LJwojsIA" />
            </motion.div>
            <h4 className="font-headline font-black text-2xl mb-6 tracking-tighter text-on-surface leading-none">Sparkle Cleaners</h4>
            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button 
                  key={star}
                  whileTap={{ scale: 0.8 }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className={`transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-primary' : 'text-outline-variant/30'}`}
                >
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feedback Input Area */}
        <motion.div variants={itemVariants} className="bg-white p-10 rounded-[2.5rem] mb-16 border border-outline-variant/10 shadow-sm relative overflow-hidden group">
          <label className="font-headline font-black text-xl mb-6 block tracking-tighter text-on-surface">Experience Review</label>
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-2xl p-6 font-bold text-sm text-on-surface focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-outline-variant/40 outline-none resize-none" 
            placeholder="Share your thoughts on the fresh start..." 
            rows="3"
          />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mb-8 pointer-events-none group-hover:scale-150 transition-transform"></div>
        </motion.div>

        {/* Primary Action Group */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 pb-12">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/home')}
            className="w-full bg-primary-gradient text-on-primary rounded-2xl font-headline font-black text-xl shadow-2xl shadow-primary/20 uppercase tracking-widest"
          >
            Return to Dashboard
          </motion.button>
          
          <motion.button 
            whileTap={{ opacity: 0.5 }}
            className="text-primary font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
          >
            Retrieve Digital Receipt
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
          </motion.button>
        </motion.div>
      </main>

      {/* Persistent Copyright Minimal */}
      <footer className="py-12 text-center text-on-surface-variant/20 font-black text-[9px] uppercase tracking-widest relative z-10 font-body">
        © 2026 Spinzyt Logistics • Editorial Handling Systems
      </footer>
    </motion.div>
  );
};

export default SuccessFeedbackPage;

