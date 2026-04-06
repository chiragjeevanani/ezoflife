import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import useNotificationStore from '../../../shared/stores/notificationStore';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const bgRef = useRef(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    const blobs = bgRef.current?.querySelectorAll('.blob');
    if (blobs) {
      blobs.forEach((blob) => {
        gsap.to(blob, {
          x: 'random(-30, 30)',
          y: 'random(-30, 30)',
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }), []);

  const serviceSummary = useMemo(() => [
    { icon: 'local_laundry_service', title: 'Premium Wash & Fold', desc: 'Hypoallergenic • Scent-free', price: 99.00, color: 'primary' },
    { icon: 'dry_cleaning', title: 'Silk Blouse (Eco-Dry)', desc: 'Special handling • Hanging', price: 149.00, color: 'tertiary' }
  ], []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col"
    >
      <main className="flex-grow pt-28 pb-32 px-6 max-w-5xl mx-auto w-full relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div ref={bgRef} className="absolute inset-0 pointer-events-none -z-10">
          <div className="blob absolute top-20 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="blob absolute bottom-20 left-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header Section */}
        <motion.header 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-12 ml-2"
        >
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-2 opacity-80">Final Review</p>
          <h2 className="font-headline text-4xl md:text-5xl font-black text-on-background tracking-tighter leading-none">
            Review Your<br/><span className="text-primary opacity-90">Fresh Start.</span>
          </h2>
        </motion.header>

        {/* Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Logistics & Summary */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Details Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm border border-outline-variant/10 group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">location_on</span>
              </div>
              <h3 className="font-headline text-xl font-black mb-8 text-primary tracking-tight">Pickup & Delivery</h3>
              <div className="flex gap-6 items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-lg shadow-primary/30"></div>
                  <div className="w-[2px] h-20 bg-gradient-to-b from-primary/30 to-tertiary/30"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-tertiary shadow-lg shadow-tertiary/30"></div>
                </div>
                <div className="space-y-10">
                  <div className="group/item cursor-default">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 opacity-60">Pickup Address</p>
                    <p className="text-lg font-black leading-snug text-on-surface">249 Editorial Ave, Suite 4B<br/>Pristine Heights, NY 10012</p>
                    <p className="text-primary font-bold text-xs mt-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Tomorrow, 08:00 AM - 10:00 AM
                    </p>
                  </div>
                  <div className="group/item cursor-default">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 opacity-60">Return Delivery</p>
                    <p className="text-lg font-black leading-snug text-on-surface">Same as Pickup</p>
                    <p className="text-tertiary font-bold text-xs mt-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                      Friday, Oct 27, Evening
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Service Summary List */}
            <motion.div variants={itemVariants} className="bg-surface-container-low p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="font-headline text-xl font-black mb-8 tracking-tight">Service Summary</h3>
              <div className="space-y-4">
                {serviceSummary.map((service, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-5 bg-white rounded-3xl shadow-xs border border-outline-variant/5"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl bg-${service.color}-container/40 flex items-center justify-center text-${service.color}`}>
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{service.icon}</span>
                      </div>
                      <div>
                        <p className="font-black text-on-surface text-[15px]">{service.title}</p>
                        <p className="text-xs text-on-surface-variant font-bold opacity-60">{service.desc}</p>
                      </div>
                    </div>
                    <p className="font-headline font-black text-primary">₹{service.price.toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Checkout Persistence */}
          <aside className="lg:col-span-5">
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 md:p-10 rounded-[3rem] sticky top-28 shadow-xl shadow-primary/5 border border-outline-variant/10"
            >
              <h3 className="font-headline text-2xl font-black mb-10 tracking-tighter">Summary</h3>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-sm md:text-md">
                  <span className="text-on-surface-variant font-bold opacity-60">Subtotal</span>
                  <span className="font-black text-on-surface">₹849.00</span>
                </div>
                <div className="flex justify-between text-sm md:text-md">
                  <span className="text-on-surface-variant font-bold opacity-60">Service Fee</span>
                  <span className="font-black text-on-surface">₹50.00</span>
                </div>
                <div className="flex justify-between text-sm md:text-md">
                  <span className="text-on-surface-variant font-bold opacity-60">Express Delivery</span>
                  <span className="font-black text-primary tracking-tighter uppercase text-xs">Complimentary</span>
                </div>
                
                <div className="pt-8 mt-6 border-t border-outline-variant/10 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 opacity-60">Total Amount</p>
                    <p className="text-4xl md:text-5xl font-black text-primary leading-none tracking-tighter">₹899.00</p>
                  </div>
                  <span className="material-symbols-outlined text-primary-container text-5xl mb-1 opacity-50">payments</span>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-surface-container-low rounded-3xl flex items-center gap-4 cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-2xl">credit_card</span>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Payment</p>
                    <p className="font-black text-on-surface text-sm">Apple Pay (•••• 9012)</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-xl group-hover:translate-x-1 transition-transform">chevron_right</span>
                </motion.div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    addNotification('order_placed', 'Order Confirmed', 'Your laundry request #SZ-8821 has been successfully queued.', 'user');
                    addNotification('order_placed', 'New Order #SZ-8821', 'A new laundry request is available for pickup in HSR Layout.', 'rider');
                    addNotification('order_placed', 'Incoming Order #SZ-8821', 'New Premium Wash & Fold order received. Preparing for intake.', 'vendor');
                    navigate('/user/payment');
                  }}
                  className="w-full py-6 rounded-2xl bg-primary-gradient text-on-primary font-headline font-black text-xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  Confirm Order
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </motion.button>


                <p className="text-center text-[10px] text-on-surface-variant font-bold leading-relaxed opacity-50 px-6">
                  By confirming, you agree to Spinzyt's <span className="underline decoration-primary/30">Terms of Service</span> and professional handling guidelines.
                </p>
              </div>
            </motion.div>

            {/* Stylized Map Minimal */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 rounded-[2.5rem] overflow-hidden h-44 relative group cursor-pointer shadow-sm"
            >
              <img 
                alt="map location" 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1s]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQoYdAG89glCjaeEkbF_8hGfq8sA5Fi7L2_2zT8cu5EynPvi87YleqaYdJiXJOjbvovXHPpfF-CTwrs1CaLOuKWIE4VFTZKhxw8S11oRFYgYncZRhHSOt3EDq2VTcN_cxix5F-m2o90__iq6-D-4tV5BOg1WEsA14U2vrcC0BC-3sG94ruxE2rqMuP98nt1v1aojpKbVsU6xLOzqZWhZiQOa-wwxWt7YX_lLyzsONSHpybM2f-TKAHdUEGyh86RcmzIm4AWLVRFMg" 
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-multiply group-hover:bg-transparent transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white p-3.5 rounded-full shadow-2xl"
                >
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </motion.div>
              </div>
            </motion.div>
          </aside>
        </motion.div>
      </main>

      {/* Simplified Mobile Footer */}
      <footer className="pb-12 text-center text-on-surface-variant/30 font-black text-[10px] uppercase tracking-widest px-6">
        © 2026 Spinzyt Inc. • Your garments, handled with editorial care.
      </footer>
    </motion.div>
  );
};

export default OrderConfirmationPage;

