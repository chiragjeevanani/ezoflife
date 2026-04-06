import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MASTER_SERVICES } from '../../../shared/data/sharedData';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('Essential'); // 'Essential' or 'Heritage'
  const [selectedQuantities, setSelectedQuantities] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('cart_quantities');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cart_quantities', JSON.stringify(selectedQuantities));
  }, [selectedQuantities]);

  const updateQuantity = (id, delta) => {
    setSelectedQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const setManualQuantity = (id, val) => {
    const num = parseInt(val) || 0;
    setSelectedQuantities(prev => {
      if (num <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: num };
    });
  };

  const cartItemsCount = useMemo(() => Object.values(selectedQuantities).reduce((acc, q) => acc + q, 0), [selectedQuantities]);
  const cartTotal = useMemo(() => Object.entries(selectedQuantities).reduce((acc, [id, q]) => {
    const service = MASTER_SERVICES.find(s => s.id === id);
    return acc + (service?.basePrice || 0) * q;
  }, 0), [selectedQuantities]);
  
  // RBAC Direct Logic
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'vendor') {
      navigate('/vendor/dashboard', { replace: true });
    }
  }, [navigate]);

  // Mock active order state
  const activeOrder = useMemo(() => ({ id: '#SZ-8821', status: 'In Progress', type: 'Wash & Fold' }), []);

  const isHeritage = selectedTier === 'Heritage';
  const themeColor = useMemo(() => isHeritage ? '#D4AF37' : '#06b6d4', [isHeritage]);
  const themeGradient = useMemo(() => isHeritage ? 'bg-gradient-to-br from-[#D4AF37] to-[#996515]' : 'bg-primary-gradient', [isHeritage]);
  const themeText = useMemo(() => isHeritage ? 'text-[#996515]' : 'text-primary', [isHeritage]);
  const themeBorder = useMemo(() => isHeritage ? 'border-[#D4AF37]/20' : 'border-primary/20', [isHeritage]);
  const themeBgSubtle = useMemo(() => isHeritage ? 'bg-[#D4AF37]/5' : 'bg-primary/5', [isHeritage]);

  const banners = useMemo(() => [
    { 
      id: 1, 
      title: isHeritage ? <>Exquisite<br/>Garment Care</> : <>30% Off Your<br/>First Order</>, 
      sub: isHeritage ? 'Heritage Tier' : 'Limited Era', 
      bg: isHeritage ? 'bg-gradient-to-br from-[#D4AF37] to-[#996515]' : 'bg-primary-gradient', 
      accent: isHeritage ? 'bg-black/10' : 'bg-white/10',
      btn: 'bg-white ' + (isHeritage ? 'text-[#996515]' : 'text-primary'),
      icon: isHeritage ? 'diamond' : 'bolt',
      label: isHeritage ? 'Experience Luxury' : 'Boost Now'
    },
    { 
      id: 2, 
      title: <>Experience<br/>Heritage Care</>, 
      sub: 'Premium Tier', 
      bg: 'bg-gradient-to-br from-[#D4AF37] to-[#996515]', 
      accent: 'bg-black/10',
      btn: 'bg-white text-[#996515]',
      icon: 'diamond',
      label: 'Upgrade Now'
    },
    { 
      id: 3, 
      title: <>Express Flow<br/>Under 24h</>, 
      sub: 'Swift Delivery', 
      bg: 'bg-gradient-to-br from-[#06b6d4] to-[#0891b2]', 
      accent: 'bg-white/10',
      btn: 'bg-white text-[#0891b2]',
      icon: 'speed',
      label: 'Express Book'
    }
  ], [isHeritage]);

  const [currentBanner, setCurrentBanner] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/user/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }), []);

  const cardVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }), []);

  const categoryChips = useMemo(() => ['All', 'Daily Wear', 'Premium Care', 'Curtains & Linen'], []);

  return (
    <div className="bg-background text-on-surface min-h-[100dvh] flex flex-col">
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 pt-24 pb-36 px-6 max-w-5xl mx-auto w-full overflow-y-auto hide-scrollbar"
      >
        {/* Tier Toggle (Sprint 1) */}
        <motion.div variants={cardVariants} className="mb-6 flex justify-center">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-200 flex gap-1">
            <button 
              onClick={() => setSelectedTier('Essential')}
              className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${!isHeritage ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
            >
              Essential
            </button>
            <button 
              onClick={() => setSelectedTier('Heritage')}
              className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${isHeritage ? 'bg-[#996515] text-white shadow-lg shadow-[#996515]/20' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
            >
              Heritage
            </button>
          </div>
        </motion.div>

        {/* Active Order Banner */}
        {activeOrder && (
          <motion.div 
            variants={cardVariants}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/tracking')}
            className={`mb-8 bg-white border ${themeBorder} p-4 rounded-3xl flex items-center justify-between cursor-pointer group shadow-sm shadow-primary/5`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full ${isHeritage ? 'bg-[#996515]' : 'bg-primary'} flex items-center justify-center text-on-primary shadow-lg shadow-primary/20`}>
                <span className="material-symbols-outlined text-xl animate-spin-slow">sync</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black ${themeText} uppercase tracking-widest leading-none mb-1`}>Active Order</span>
                <h3 className="text-sm font-black text-on-surface leading-none">{activeOrder.type} — {activeOrder.status}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-outline uppercase tracking-widest group-hover:text-primary transition-colors">Track</span>
              <span className={`material-symbols-outlined ${themeText} text-sm`}>arrow_forward</span>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div variants={cardVariants} className="mb-8">
          <div className={`relative flex items-center bg-white rounded-3xl px-6 py-4 shadow-sm border ${isHeritage ? 'border-[#D4AF37]/30' : 'border-slate-300'} focus-within:ring-2 ${isHeritage ? 'focus-within:ring-[#996515]/10' : 'focus-within:ring-primary/10'} transition-all`}>
            <span className={`material-symbols-outlined ${isHeritage ? 'text-[#996515]' : 'text-outline'} mr-3`}>search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent border-none focus:ring-0 p-0 text-md w-full placeholder:text-outline-variant font-semibold" 
              placeholder={isHeritage ? "Find premium care..." : "How can we help today?"}
              type="text"
            />
          </div>
        </motion.div>

        {/* Promotional Banner Carousel */}
        <motion.section variants={cardVariants} className="mb-10 w-full relative group">
          <div className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/10">
            <AnimatePresence mode="wait">
              <motion.div 
                key={banners[currentBanner].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "anticipate" }}
                className={`${banners[currentBanner].bg} p-8 relative overflow-hidden flex flex-col justify-end min-h-[220px]`}
              >
                <div className={`absolute top-0 right-0 w-48 h-48 ${banners[currentBanner].accent} rounded-full -mr-12 -mt-12 blur-3xl animate-pulse`}></div>
                <div className="relative z-10">
                  <span className="text-on-primary text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2.5 block opacity-80">{banners[currentBanner].sub}</span>
                  <h2 className="text-3xl font-black text-on-primary mb-6 leading-[1.1] tracking-tighter">{banners[currentBanner].title}</h2>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className={`${banners[currentBanner].btn} px-7 py-3 rounded-full font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 shadow-xl`}
                  >
                    {banners[currentBanner].label} <span className="material-symbols-outlined text-sm">{banners[currentBanner].icon}</span>
                  </motion.button>
                </div>
                
                {/* Indicators */}
                <div className="absolute right-8 top-8 flex gap-1.5">
                  {banners.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
                    />
                  ))}
                </div>

                <div className="absolute -left-4 -bottom-4 opacity-10 rotate-[-15deg] pointer-events-none">
                  <span className="material-symbols-outlined text-[160px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {banners[currentBanner].icon === 'bolt' ? 'eco' : banners[currentBanner].icon === 'diamond' ? 'military_tech' : 'rocket'}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Enhanced Service Selection (Sprint 5) */}
        <motion.section variants={cardVariants} className="mb-10 w-full font-body">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className={`text-[10px] uppercase tracking-[0.25em] ${themeText} font-black`}>{isHeritage ? 'Heritage Collection' : 'Our Expertise'}</span>
              <h2 className="text-3xl font-black tracking-tighter leading-tight italic">{isHeritage ? 'Pristine Luxury.' : 'Choose Care.'}</h2>
            </div>
          </div>
          
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 -mx-6 px-6">
            {categoryChips.map(cat => (
              <button key={cat} className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                cat === 'All' ? `${isHeritage ? 'bg-[#996515] border-[#996515]' : 'bg-primary border-primary'} text-white shadow-lg` : 'bg-white text-on-surface/40 border-black/5 hover:border-black/20'
              }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MASTER_SERVICES.map((service, i) => {
              const qty = selectedQuantities[service.id] || 0;
              const isSelected = qty > 0;

              return (
                <motion.div 
                  key={service.id}
                  variants={cardVariants}
                  className={`bg-white rounded-[2rem] p-5 flex flex-col items-center text-center gap-3 border ${isSelected ? (isHeritage ? 'border-[#996515] ring-1 ring-[#996515]/20' : 'border-primary ring-1 ring-primary/20') : (isHeritage ? 'border-[#D4AF37]/20' : 'border-black/5')} shadow-sm group relative overflow-hidden transition-all`}
                >
                  {/* Selection Radio Indicator (BRD Requirement) */}
                  <div 
                    onClick={() => updateQuantity(service.id, isSelected ? -qty : 1)}
                    className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? (isHeritage ? 'bg-[#996515] border-[#996515]' : 'bg-primary border-primary') : 'border-slate-200'}`}
                  >
                    {isSelected && <span className="material-symbols-outlined text-[12px] text-white font-black">check</span>}
                  </div>

                  <div 
                    onClick={() => navigate('/user/service-info', { 
                      state: { 
                        selectedService: { 
                          id: service.id, 
                          title: service.name, 
                          desc: service.description, 
                          icon: service.icon, 
                          color: isHeritage ? 'heritage' : (i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'tertiary'), 
                          price: `₹${service.basePrice}.00` 
                        } 
                      } 
                    })}
                    className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-on-surface cursor-pointer group-hover:bg-opacity-100 transition-all duration-300 ${isHeritage ? 'group-hover:bg-[#996515]' : 'group-hover:bg-primary'} group-hover:text-white`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${isHeritage ? 'text-[#996515] group-hover:text-white' : ''}`}>{service.icon}</span>
                  </div>
                  
                  <div className="w-full">
                    <h4 className="font-headline font-black text-[13px] leading-tight mb-1 text-on-surface">{service.name}</h4>
                    <p className="text-[9px] text-on-surface/40 font-bold uppercase tracking-widest leading-none truncate w-full mb-3">{service.category}</p>
                    
                    {/* Quantity Controls (Inline) */}
                    <div className="flex items-center justify-between bg-slate-50 p-1 rounded-xl border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(service.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-on-surface-variant hover:text-primary transition-all active:scale-90"
                      >
                        <span className="material-symbols-outlined text-sm font-black">remove</span>
                      </button>
                      
                      <input 
                        type="tel"
                        className="w-8 bg-transparent border-none text-center p-0 text-[11px] font-black pointer-events-auto"
                        value={qty}
                        onChange={(e) => setManualQuantity(service.id, e.target.value)}
                      />

                      <button 
                        onClick={() => updateQuantity(service.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-on-surface-variant hover:text-primary transition-all active:scale-90"
                      >
                        <span className="material-symbols-outlined text-sm font-black">add</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            <motion.div 
              variants={cardVariants}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/user/services')}
              className={`${themeBgSubtle} rounded-[2rem] p-5 flex flex-col items-center justify-center gap-2 border border-dashed ${themeBorder} shadow-sm group cursor-pointer active:scale-95 transition-all`}
            >
              <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${themeText} shadow-sm border ${themeBorder}`}>
                <span className="material-symbols-outlined text-xl">apps</span>
              </div>
              <p className={`text-[9px] font-black ${themeText} uppercase tracking-widest`}>More Care</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Express Booking */}
        <motion.section variants={cardVariants} className="w-full">
          <div className="bg-white rounded-[2rem] p-7 border border-outline-variant/10 shadow-[0_32px_32px_rgba(47,50,58,0.06)] relative overflow-hidden">
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${themeBgSubtle} flex items-center justify-center ${themeText}`}>
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight">Express Pickup</h3>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Under 60 mins</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/user/service-info', { 
                  state: { 
                    selectedService: { id: 'wash_express', title: 'Wash & Fold (Express)', desc: 'Priority turnaround', icon: 'bolt', color: 'primary', price: '₹199.00' } 
                  } 
                })}
                className={`${themeGradient} text-on-primary w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-lg shadow-primary/20`}
              >
                Book Now
              </motion.button>
            </div>
            {/* Background pattern */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${themeBgSubtle} rounded-full blur-3xl -mr-16 -mt-16`}></div>
          </div>
        </motion.section>
        {/* Floating Cart Bar (BRD Requirement) */}
        <AnimatePresence>
          {cartItemsCount > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-28 left-6 right-6 z-[100] max-w-lg mx-auto"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/user/cart')}
                className={`${themeGradient} w-full h-[64px] rounded-3xl p-1 flex items-center justify-between shadow-2xl shadow-primary/30 group overflow-hidden`}
              >
                <div className="flex items-center gap-4 pl-6">
                  <div className="flex flex-col items-start leading-none gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Shopping Bag</span>
                    <h3 className="text-white font-black text-lg tracking-tight">₹{cartTotal.toLocaleString()}</h3>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <span className="text-white/80 font-black text-[10px] uppercase tracking-widest bg-black/10 px-3 py-1.5 rounded-full">
                    {cartItemsCount} {cartItemsCount === 1 ? 'Article' : 'Articles'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 pr-5">
                  <span className="text-white font-black text-[11px] uppercase tracking-widest group-hover:mr-1 transition-all">Proceed to Cart</span>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  </div>
                </div>

                {/* Animated Light Sweep Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%]"
                  animate={{ translateX: ["100%", "-100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default HomePage;

