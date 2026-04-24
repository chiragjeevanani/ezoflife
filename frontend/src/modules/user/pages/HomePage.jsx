import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceApi, masterServiceApi } from '../../../lib/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('Essential'); // 'Essential' or 'Heritage'
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantities, setSelectedQuantities] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('cart_quantities');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cart_quantities', JSON.stringify(selectedQuantities));
  }, [selectedQuantities]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      // Normalize customerType to lowercase for consistent comparison
      const customerType = (userData.customerType || 'individual').toLowerCase();
      
      let data;
      if (customerType === 'retail') {
        data = await masterServiceApi.getAll();
      } else {
        data = await serviceApi.getAll({ approvedOnly: true });
      }

      const filtered = data.filter(s => {
        // Master services use 'isActive', Vendor services use 'status'
        const isActive = s.isActive === true || s.status === 'Active';
        const isApproved = s.approvalStatus === 'Approved' || customerType === 'retail';
        
        // Match target audience
        const target = (s.targetAudience || 'both').toLowerCase();
        const isMatch = target === 'both' || target === customerType;
        
        return isActive && isApproved && isMatch;
      });
      
      setServices(filtered);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
    const service = services.find(s => (s._id || s.id) === id);
    return acc + (service?.basePrice || 0) * q;
  }, 0), [selectedQuantities, services]);

  
  const [isCartDismissed, setIsCartDismissed] = useState(false);

  // Reset dismissal when cart items change (if increasing)
  useEffect(() => {
    if (cartItemsCount > 0) {
      setIsCartDismissed(false);
    }
  }, [cartItemsCount]);

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

  const handleServiceClick = (serviceId, service, i) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/user/auth');
      return;
    }

    navigate('/user/service-info', { 
      state: { 
        selectedService: { 
          id: serviceId, 
          title: service.name, 
          desc: service.description, 
          image: service.image, 
          color: isHeritage ? 'heritage' : (i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'tertiary'), 
          price: `₹${service.basePrice}.00` 
        } 
      } 
    });
  };

  const handleCartClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/user/auth');
      return;
    }
    navigate('/user/cart');
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
        {/* 1. Promotional Banner Carousel - TOP */}
        <motion.section variants={cardVariants} className="mb-8 w-full relative group">
          <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100">
            <AnimatePresence mode="wait">
              <motion.div 
                key={banners[currentBanner].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`${banners[currentBanner].bg} p-10 relative overflow-hidden flex flex-col justify-end min-h-[240px]`}
              >
                <div className={`absolute top-0 right-0 w-64 h-64 ${banners[currentBanner].accent} rounded-full -mr-20 -mt-20 blur-[80px] animate-pulse`}></div>
                <div className="relative z-10">
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">{banners[currentBanner].sub}</span>
                  <h2 className="text-4xl font-black text-white mb-8 leading-tight tracking-tighter">{banners[currentBanner].title}</h2>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className={`${banners[currentBanner].btn} px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 shadow-2xl`}
                  >
                    {banners[currentBanner].label} <span className="material-symbols-outlined text-sm">{banners[currentBanner].icon}</span>
                  </motion.button>
                </div>
                
                <div className="absolute right-10 top-10 flex gap-2">
                  {banners.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentBanner ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* 2. Tier Toggle */}
        <motion.div variants={cardVariants} className="mb-8 flex justify-center">
          <div className="bg-slate-50 p-1.5 rounded-[2rem] border border-slate-100 flex gap-1 shadow-sm">
            <button 
              onClick={() => setSelectedTier('Essential')}
              className={`px-10 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${!isHeritage ? 'bg-black text-white shadow-xl' : 'text-slate-400'}`}
            >
              Essential
            </button>
            <button 
              onClick={() => setSelectedTier('Heritage')}
              className={`px-10 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${isHeritage ? 'bg-[#996515] text-white shadow-xl' : 'text-slate-400'}`}
            >
              Heritage
            </button>
          </div>
        </motion.div>

        {/* 3. Search Bar */}
        <motion.div variants={cardVariants} className="mb-10">
          <div className={`relative flex items-center bg-white rounded-[2rem] px-6 py-5 shadow-sm border ${isHeritage ? 'border-[#D4AF37]/30' : 'border-slate-100'} focus-within:ring-4 ${isHeritage ? 'focus-within:ring-[#996515]/5' : 'focus-within:ring-primary/5'} transition-all`}>
            <span className={`material-symbols-outlined ${isHeritage ? 'text-[#996515]' : 'text-slate-400'} mr-4`}>search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent border-none focus:ring-0 outline-none p-0 text-md w-full placeholder:text-slate-300 font-bold" 
              placeholder={isHeritage ? "Search premium care..." : "Search services..."}
              type="text"
            />
          </div>
        </motion.div>

        {/* 4. Enhanced Service Selection */}
        <motion.section variants={cardVariants} className="mb-10 w-full font-body">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className={`text-[10px] uppercase tracking-[0.25em] ${themeText} font-black`}>
                {JSON.parse(localStorage.getItem('userData') || '{}').customerType === 'retail' ? 'Retail Collection' : (isHeritage ? 'Heritage Collection' : 'Our Expertise')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {loading ? (
                [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-5 h-48 border border-black/5 animate-pulse flex flex-col items-center justify-center gap-4" />
                ))
            ) : (
                <>
                {services.filter(s => (s.tier || 'Essential') === selectedTier).map((service, i) => {
                    const serviceId = service._id || service.id;
                    const qty = selectedQuantities[serviceId] || 0;
                    const isSelected = qty > 0;

                    return (
                        <motion.div 
                        key={serviceId}
                        variants={cardVariants}
                        className={`bg-white rounded-[2rem] p-5 flex flex-col items-center text-center gap-3 border ${isSelected ? (isHeritage ? 'border-[#996515] ring-1 ring-[#996515]/20' : 'border-black ring-1 ring-black/10') : (isHeritage ? 'border-[#D4AF37]/20' : 'border-black/5')} shadow-sm group relative overflow-hidden transition-all`}
                        >
                        

                        <div 
                            onClick={() => handleServiceClick(serviceId, service, i)}
                            className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-on-surface cursor-pointer group-hover:bg-opacity-100 transition-all duration-300 ${isHeritage ? 'group-hover:bg-[#996515]' : 'group-hover:bg-black'} group-hover:text-white overflow-hidden`}
                        >
                            {service.image ? (
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className={`material-symbols-outlined text-2xl ${isHeritage ? 'text-[#996515] group-hover:text-white' : ''}`}>local_laundry_service</span>
                            )}
                        </div>
                        
                        <div className="w-full">
                            <h4 className="font-headline font-black text-[13px] leading-tight mb-1 text-on-surface">{service.name}</h4>
                            <p className="text-[9px] text-on-surface/40 font-bold uppercase tracking-widest leading-none truncate w-full mb-3">{service.category}</p>
                            
                            <div className="flex items-center justify-between bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <button 
                                onClick={() => updateQuantity(serviceId, -1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-on-surface-variant hover:text-black transition-all active:scale-90"
                            >
                                <span className="material-symbols-outlined text-sm font-black">remove</span>
                            </button>
                            
                            <input 
                                type="tel"
                                className="w-8 bg-transparent border-none text-center p-0 text-[11px] font-black pointer-events-auto"
                                value={qty}
                                onChange={(e) => setManualQuantity(serviceId, e.target.value)}
                            />

                            <button 
                                onClick={() => updateQuantity(serviceId, 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-on-surface-variant hover:text-black transition-all active:scale-90"
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
                </>
            )}
          </div>
        </motion.section>

        {/* Floating Cart Bar (BRD Requirement) */}
        <AnimatePresence>
          {cartItemsCount > 0 && !isCartDismissed && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-28 left-6 right-6 z-[100] max-w-lg mx-auto group"
            >
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCartClick}
                  className={`${themeGradient} w-full h-[64px] rounded-3xl p-1 flex items-center justify-between shadow-2xl shadow-primary/30 overflow-hidden`}
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
                  
                  <div className="flex items-center gap-2 pr-12">
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

                {/* DISMISS BUTTON */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCartDismissed(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-xl flex items-center justify-center backdrop-blur-md transition-all z-10"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default HomePage;

