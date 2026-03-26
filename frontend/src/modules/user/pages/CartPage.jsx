import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UserHeader from '../components/UserHeader';
import BottomNav from '../components/BottomNav';

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedService = location.state?.selectedService;
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [addresses] = useState([
    { id: 1, type: 'Home', address: '249 Editorial Ave, Suite 4B, Pristine Heights, NY 10012', isDefault: true },
    { id: 2, type: 'Office', address: '88 Creative Plaza, 12th Floor, Metro Central, NY 10001', isDefault: false }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  // Initialize cart with the selected service or a default if none
  const defaultItems = [
    { id: 'wash_fold', title: 'Wash & Fold', desc: 'Everyday wear, scented & stacked', icon: 'local_laundry_service', color: 'primary', price: 99.00 }
  ];

  const [cartItems, setCartItems] = useState(selectedService ? [selectedService] : defaultItems);
  
  // Track quantities and billing units
  const [quantities, setQuantities] = useState(() => {
    const q = {};
    cartItems.forEach(item => {
      // Use initialQuantity if provided from ServiceInfo, otherwise default
      const initial = (item.id === selectedService?.id && selectedService.initialQuantity) 
        ? selectedService.initialQuantity 
        : (item.id.includes('wash') || item.id.includes('carpet')) ? 5 : 1;
      q[item.id] = initial;
    });
    return q;
  });

  const [billingUnits, setBillingUnits] = useState(() => {
    const u = {};
    cartItems.forEach(item => {
      // Use initialUnit if provided from ServiceInfo, otherwise default
      const initial = (item.id === selectedService?.id && selectedService.initialUnit)
        ? selectedService.initialUnit
        : (item.id.includes('wash') || item.id.includes('carpet')) ? 'kg' : 'pc';
      u[item.id] = initial;
    });
    return u;
  });
  
  const [isExpress, setIsExpress] = useState(false);
  const manualDateRef = useRef(null);

  // Dynamic Date Generation (coordinates correctly with real clock)
  const availableDates = (() => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      let dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      if (i === 0) dayLabel = 'TODAY';
      if (i === 1) dayLabel = 'TOMORROW';
      
      dates.push({
        day: dayLabel,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        raw: d
      });
    }
    return dates;
  })();

  const [selectedPickup, setSelectedPickup] = useState(`${availableDates[0].day}, ${availableDates[0].date}`);
  const [pickupTime, setPickupTime] = useState('02:00 PM - 04:00 PM');
  const [selectedDelivery, setSelectedDelivery] = useState(`${availableDates[1].day}, ${availableDates[1].date}`);
  const [deliveryTime, setDeliveryTime] = useState('06:00 PM - 08:00 PM');
  
  const [showPicker, setShowPicker] = useState(false);
  const [activePicking, setActivePicking] = useState('pickup');

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ];

  const handleSlotSelect = (dateObj, time) => {
    const formattedDate = `${dateObj.day}, ${dateObj.date}`;
    if (activePicking === 'pickup') {
      setSelectedPickup(formattedDate);
      setPickupTime(time);
    } else {
      setSelectedDelivery(formattedDate);
      setDeliveryTime(time);
    }
    setShowPicker(false);
  };

  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [custPickup, setCustPickup] = useState(null);
  const [custDelivery, setCustDelivery] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const handleCalendarSelect = (day) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dayLabel = selected.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dateStr = selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedDate = `${dayLabel}, ${dateStr}`;
    
    // Check if it's in the standard 7-day list
    const isStandard = availableDates.some(ad => `${ad.day}, ${ad.date}` === formattedDate);

    if (activePicking === 'pickup') {
      setSelectedPickup(formattedDate);
      setCustPickup(isStandard ? null : { day: 'CUSTOM', date: dateStr });
    } else {
      setSelectedDelivery(formattedDate);
      setCustDelivery(isStandard ? null : { day: 'CUSTOM', date: dateStr });
    }
    
    setShowFullCalendar(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const updateQuantity = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const newVal = Math.max(0, current + delta);
      if (newVal === 0) {
        setCartItems(items => items.filter(i => i.id !== id));
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: newVal };
    });
  };

  const getItemPrice = (item) => {
    const unit = billingUnits[item.id] || 'pc';
    const rawPrice = item.price;
    // Helper to parse price string or number
    const parsePrice = (p) => {
      if (typeof p === 'number') return p;
      if (typeof p === 'string') {
        const cleaned = p.replace(/[^\d.]/g, '');
        return parseFloat(cleaned) || 0;
      }
      return 0;
    };

    const price = parsePrice(rawPrice);
    
    // Services typically billed by weight (Wash, Carpet, Curtains)
    if (item.id.includes('wash') || item.id.includes('carpet') || item.id.includes('curtain')) {
      if (unit === 'kg') return price > 0 ? price : 99;
      return 18; // Rate per piece for weight-based services
    }
    
    // Services typically billed by piece (Dry Clean, Ironing, Shoe, Bag)
    if (unit === 'pc') return price > 0 ? price : 49;
    return 199; // Standard weight rate for piece-based services
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = getItemPrice(item);
    return acc + (price * (quantities[item.id] || 0));
  }, 0);
  const logisticsFee = 50.00;
  const expressFee = isExpress ? 150.00 : 0;
  const discount = isPromoApplied ? (subtotal * 0.3) : 0;
  const grandTotal = subtotal + logisticsFee + expressFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FRESH30') {
      setIsPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code');
      setIsPromoApplied(false);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="bg-background font-body text-on-background min-h-[100dvh] flex flex-col"
    >
      
      <motion.main 
        variants={containerVariants}
        className="max-w-5xl mx-auto px-6 pt-24 pb-36 w-full flex-1 overflow-y-auto hide-scrollbar"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Items & Options */}
          <div className="lg:col-span-12 space-y-10">
            {/* Section Header */}
            <motion.div variants={itemVariants} className="pl-4 border-l-4 border-primary">
              <h2 className="font-headline text-3xl font-black tracking-tighter leading-none mb-1">Review Items</h2>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest opacity-60">
                {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in your fresh flow.
              </p>
            </motion.div>

            {/* Itemized List */}
            <motion.div variants={containerVariants} className="space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm border border-outline-variant/10 group"
                  >
                    {/* ... item content ... */}
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-${item.color}-container flex items-center justify-center text-${item.color} shadow-sm group-hover:shadow-lg transition-shadow`}>
                        <span className="material-symbols-outlined text-3xl md:text-3xl">
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-[15px] md:text-lg text-on-surface leading-tight">{item.title}</h3>
                        <p className="text-on-surface-variant text-[11px] md:text-xs font-bold opacity-60 mt-0.5">{item.desc}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <div className="flex items-center bg-surface-container-low rounded-2xl p-1 w-fit shadow-xs border border-outline-variant/5">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-primary bg-white rounded-xl shadow-xs"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">remove</span>
                            </motion.button>
                            <span className="font-black text-on-surface px-4 md:px-5 text-sm md:text-md uppercase tabular-nums">
                              {quantities[item.id] || 0} {billingUnits[item.id] === 'kg' ? 'kg' : 'pcs'}
                            </span>
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-primary bg-white rounded-xl shadow-xs"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">add</span>
                            </motion.button>
                          </div>
                          
                          {/* Billing Unit Toggle */}
                          <div className="flex bg-surface-container-low rounded-2xl p-1 w-fit shadow-xs border border-outline-variant/5">
                            <button 
                              onClick={() => setBillingUnits(prev => ({...prev, [item.id]: 'kg'}))}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${billingUnits[item.id] === 'kg' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant opacity-40'}`}
                            >Kg</button>
                            <button 
                              onClick={() => setBillingUnits(prev => ({...prev, [item.id]: 'pc'}))}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${billingUnits[item.id] === 'pc' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant opacity-40'}`}
                            >Cloth</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-headline font-black text-lg md:text-xl text-primary leading-none tracking-tight">
                        ₹{(getItemPrice(item) * (quantities[item.id] || 0)).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-outline-variant/20"
                >
                  <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-outline-variant">shopping_basket</span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tighter">Your cart is resting</h3>
                  <p className="text-on-surface-variant text-sm font-bold opacity-60 mb-8 max-w-xs mx-auto">Looks like you haven't added any fresh flows yet.</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/user/services')}
                    className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Browse Services
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Scheduling Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-black text-2xl flex items-center gap-3 tracking-tighter">
                  <span className="material-symbols-outlined text-primary text-3xl animate-pulse">schedule</span>
                  Timing & Pick
                </h3>
                <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-2xl">
                   <button 
                    onClick={() => setIsExpress(false)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isExpress ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant opacity-40'}`}
                   >Standard</button>
                   <button 
                    onClick={() => setIsExpress(true)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isExpress ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant opacity-40'}`}
                   >Express</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pickup Slot */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setActivePicking('pickup'); setShowPicker(true); }}
                  className="bg-primary/5 p-5 rounded-3xl border-2 border-primary/20 hover:border-primary/50 cursor-pointer relative overflow-hidden transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-black text-primary text-[10px] uppercase tracking-widest">Pickup Slot</p>
                    <span className="material-symbols-outlined text-primary text-sm">edit_calendar</span>
                  </div>
                  <p className="font-black text-on-surface text-lg leading-tight">{selectedPickup}</p>
                  <p className="text-primary font-bold text-xs mt-1 opacity-80">{pickupTime}</p>
                  <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-primary/10 text-6xl">calendar_today</span>
                </motion.div>
                {/* Delivery Slot */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setActivePicking('delivery'); setShowPicker(true); }}
                  className="bg-surface-container-low p-5 rounded-3xl border-2 border-transparent hover:border-primary/30 cursor-pointer transition-all relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-black text-on-surface-variant text-[10px] uppercase tracking-widest opacity-60">Delivery Slot</p>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-40">edit_calendar</span>
                  </div>
                  <p className="font-black text-on-surface text-lg leading-tight opacity-80">{selectedDelivery}</p>
                  <p className="text-on-surface-variant font-bold text-xs mt-1 opacity-60">{deliveryTime}</p>
                  <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-on-surface/5 text-6xl">local_shipping</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Custom Time/Date Picker Modal */}
            <AnimatePresence>
              {showPicker && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowPicker(false)}
                    className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100]"
                  />
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-[3rem] p-10 z-[101] shadow-2xl"
                  >
                    <div className="w-16 h-1.5 bg-outline-variant/20 rounded-full mx-auto mb-8" />
                    
                    <header className="mb-8">
                      <h3 className="text-3xl font-black tracking-tighter mb-2">
                        {activePicking === 'pickup' ? 'Schedule Pickup' : 'Expected Delivery'}
                      </h3>
                      <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Select a convenient window</p>
                    </header>

                    <div className="space-y-8 overflow-y-auto max-h-[60vh] hide-scrollbar pb-6">
                      {/* Date Selection */}
                      <section>
                        <div className="flex justify-between items-center mb-6 ml-2 pr-2">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Available Dates</h4>
                          <button 
                            onClick={() => setShowFullCalendar(true)}
                            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-2xl border border-primary/20 hover:bg-primary hover:text-white transition-all group cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            <span className="text-[9px] font-black uppercase tracking-widest">Manual Pick</span>
                          </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                          {availableDates.map((d, i) => (
                            <button 
                              key={i}
                              onClick={() => {
                                if (activePicking === 'pickup') setSelectedPickup(`${d.day}, ${d.date}`);
                                else setSelectedDelivery(`${d.day}, ${d.date}`);
                              }}
                              className={`px-6 py-4 rounded-2xl flex flex-col items-center min-w-[100px] border-2 transition-all ${
                                (activePicking === 'pickup' ? selectedPickup : selectedDelivery).includes(d.date) && !(activePicking === 'pickup' ? selectedPickup : selectedDelivery).includes('CUSTOM')
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-surface-container-low border-transparent text-on-surface'
                              }`}
                            >
                              <span className="text-[10px] font-black uppercase tracking-tighter">{d.day}</span>
                              <span className="text-lg font-black">{d.date}</span>
                            </button>
                          ))}
                          
                          {/* Custom Date Tile */}
                          {(activePicking === 'pickup' ? custPickup : custDelivery) && (
                            <button 
                              onClick={() => {
                                const d = activePicking === 'pickup' ? custPickup : custDelivery;
                                if (activePicking === 'pickup') setSelectedPickup(`CUSTOM, ${d.date}`);
                                else setSelectedDelivery(`CUSTOM, ${d.date}`);
                              }}
                              className={`px-6 py-4 rounded-2xl flex flex-col items-center min-w-[100px] border-2 transition-all ${
                                (activePicking === 'pickup' ? selectedPickup : selectedDelivery).includes('CUSTOM')
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-surface-container-low border-transparent text-on-surface'
                              }`}
                            >
                              <span className="text-[10px] font-black uppercase tracking-tighter">CUSTOM</span>
                              <span className="text-lg font-black">{(activePicking === 'pickup' ? custPickup : custDelivery).date}</span>
                            </button>
                          )}
                        </div>
                      </section>

                      {/* Time Slots */}
                      <section>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-4 ml-2">Time Windows</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {timeSlots.map((time, i) => (
                            <button 
                              key={i}
                              onClick={() => {
                                if (activePicking === 'pickup') setPickupTime(time);
                                else setDeliveryTime(time);
                                setShowPicker(false);
                              }}
                              className={`p-5 rounded-2xl text-left border-2 flex justify-between items-center transition-all ${
                                (activePicking === 'pickup' ? pickupTime : deliveryTime) === time
                                ? 'bg-primary/5 border-primary text-primary font-black' 
                                : 'bg-surface-container-low border-transparent text-on-surface font-bold shrink-0'
                              }`}
                            >
                              <span className="text-sm">{time}</span>
                              {(activePicking === 'pickup' ? pickupTime : deliveryTime) === time && (
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>

                    <button 
                      onClick={() => setShowPicker(false)}
                      className="w-full mt-6 py-5 bg-surface-container-highest rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Address Selection Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-black text-2xl flex items-center gap-3 tracking-tighter">
                  <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                  Pickup Address
                </h3>
                <button 
                  onClick={() => setShowAddressPicker(true)}
                  className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl"
                >
                  Change
                </button>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl flex items-center gap-5 border border-outline-variant/5">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined">{selectedAddress.type === 'Home' ? 'home' : 'work'}</span>
                </div>
                <div>
                  <p className="font-black text-on-surface text-sm uppercase">{selectedAddress.type}</p>
                  <p className="text-[11px] font-bold text-on-surface-variant opacity-60 leading-relaxed max-w-[200px]">{selectedAddress.address}</p>
                </div>
              </div>
            </motion.div>

            {/* Promo Code Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
              <h3 className="font-headline font-black text-2xl flex items-center gap-3 tracking-tighter">
                <span className="material-symbols-outlined text-primary text-3xl">sell</span>
                Promo Code
              </h3>
              <div className="relative flex items-center bg-surface-container-low rounded-[1.5rem] px-6 py-2 border border-outline-variant/10 focus-within:border-primary/30 transition-all">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code (e.g. FRESH30)"
                  className="bg-transparent border-none focus:ring-0 p-3 text-sm font-black w-full uppercase placeholder:text-outline-variant/40"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {isPromoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {promoError && <p className="text-[10px] font-black text-error uppercase tracking-widest ml-4">{promoError}</p>}
              {isPromoApplied && <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-4">Success! 30% discount unlocked.</p>}
            </motion.div>

            {/* Total Summary */}
            <motion.div 
              variants={itemVariants} 
              className="bg-surface-container-highest rounded-[3rem] p-8 md:p-10 shadow-xl border border-white/40 shadow-primary/5 relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <h3 className="font-headline font-black text-2xl mb-8 tracking-tighter leading-none">Summary</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm md:text-md">
                  <span className="text-on-surface-variant font-bold opacity-70">Subtotal</span>
                  <span className="font-black text-on-surface leading-none">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-md">
                  <span className="text-on-surface-variant font-bold opacity-70">Logistics</span>
                  <span className="font-black text-on-surface leading-none">₹{logisticsFee.toFixed(2)}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between items-center text-sm md:text-md text-primary">
                    <span className="font-bold">Promo Discount (30%)</span>
                    <span className="font-black leading-none">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                {isExpress && (
                  <div className="flex justify-between items-center text-sm md:text-md">
                    <span className="text-primary font-bold">Express Handling</span>
                    <span className="font-black text-primary leading-none">₹{expressFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="h-px bg-outline-variant/15 my-6"></div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-2">Grand Total</p>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={grandTotal}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl md:text-5xl font-black text-on-surface leading-none tracking-tighter"
                      >
                        ₹{grandTotal.toFixed(2)}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/user/confirmation')}
                className="w-full mt-12 bg-primary-gradient text-on-primary font-headline font-black py-5.5 rounded-2xl md:text-lg uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
              >
                Place Order
                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.main>
      {/* Custom Full Month Calendar Modal */}
      <AnimatePresence>
        {showFullCalendar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullCalendar(false)}
              className="fixed inset-0 bg-on-surface/60 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[3rem] p-10 z-[201] shadow-2xl border border-outline-variant/10"
            >
              <header className="flex items-center justify-between mb-8">
                <h4 className="font-headline font-black text-2xl tracking-tighter text-on-surface capitalize">
                  {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                    className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/5"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                    className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/5"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </motion.button>
                </div>
              </header>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[10px] font-black text-on-surface-variant opacity-30 py-2 tracking-widest">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: getDaysInMonth(viewDate).firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: getDaysInMonth(viewDate).days }).map((_, i) => {
                  const day = i + 1;
                  const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
                  return (
                    <motion.button 
                      key={day}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCalendarSelect(day)}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                        isToday 
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/30' 
                        : 'hover:bg-surface-container-low text-on-surface hover:text-primary'
                      }`}
                    >
                      {day}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setShowFullCalendar(false)}
                  className="flex-1 py-4 rounded-2xl bg-surface-container-low font-black text-[10px] uppercase tracking-widest text-on-surface-variant"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Address Picker Modal */}
      <AnimatePresence>
        {showAddressPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressPicker(false)}
              className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-[3rem] p-10 z-[151] shadow-2xl"
            >
              <div className="w-16 h-1.5 bg-outline-variant/20 rounded-full mx-auto mb-8" />
              <h3 className="text-3xl font-black tracking-tighter mb-8 shrink-0">Select Locale</h3>
              <div className="space-y-4 mb-8">
                {addresses.map((addr) => (
                  <button 
                    key={addr.id}
                    onClick={() => { setSelectedAddress(addr); setShowAddressPicker(false); }}
                    className={`w-full p-6 rounded-[2rem] flex items-center justify-between border-2 transition-all ${
                      selectedAddress.id === addr.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface-container-low border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedAddress.id === addr.id ? 'bg-primary text-white' : 'bg-white text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-lg">{addr.type === 'Home' ? 'home' : 'work'}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-sm text-on-surface leading-none mb-1">{addr.type}</p>
                        <p className="text-[10px] font-bold text-on-surface-variant opacity-60 truncate max-w-[180px]">{addr.address}</p>
                      </div>
                    </div>
                    {selectedAddress.id === addr.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => navigate('/user/profile/addresses')}
                className="w-full py-5 bg-surface-container-highest rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Manage Addresses
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CartPage;
