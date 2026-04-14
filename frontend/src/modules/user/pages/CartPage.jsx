import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MASTER_SERVICES } from '../../../shared/data/sharedData';
import { orderApi, serviceApi, authApi } from '../../../lib/api';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 28.4595, lng: 77.0266 }; // Gurgaon

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedService = location.state?.selectedService;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await serviceApi.getAll();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services for cart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const [quantities, setQuantities] = useState(() => {
    const saved = localStorage.getItem('cart_quantities');
    const q = saved ? JSON.parse(saved) : {};
    if (selectedService && !q[selectedService.id]) {
      q[selectedService.id] = selectedService.initialQuantity || 1;
    }
    return q;
  });

  const [clothCounts, setClothCounts] = useState({});

  const cartItems = useMemo(() => {
    if (services.length === 0) return [];
    return services.filter(s => {
      const id = s._id || s.id;
      return quantities[id] > 0;
    });
  }, [services, quantities]);

  const [billingUnits, setBillingUnits] = useState({});

  useEffect(() => {
    if (cartItems.length > 0 && Object.keys(billingUnits).length === 0) {
      const u = {};
      cartItems.forEach(item => {
        const id = item._id || item.id;
        u[id] = item.unit || (id.includes('wash') || id.includes('carpet') ? 'kg' : 'pc');
      });
      setBillingUnits(u);
    }
  }, [cartItems]);
  
  // Sync with localStorage whenever quantities change
  useEffect(() => {
    if (Object.keys(quantities).length > 0) {
      localStorage.setItem('cart_quantities', JSON.stringify(quantities));
    }
  }, [quantities]);
  
  const [isExpress, setIsExpress] = useState(false);
  const [garmentPhotos, setGarmentPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setGarmentPhotos(prev => [...prev, ...newPhotos]);
  };

  const availableDates = useMemo(() => {
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
  }, []);

  const [selectedPickup, setSelectedPickup] = useState(`${availableDates[0].day}, ${availableDates[0].date}`);
  const [pickupTime, setPickupTime] = useState('02:00 PM - 04:00 PM');
  const [selectedDelivery, setSelectedDelivery] = useState(`${availableDates[1].day}, ${availableDates[1].date}`);
  const [deliveryTime, setDeliveryTime] = useState('06:00 PM - 08:00 PM');
  
  const [showPicker, setShowPicker] = useState(false);
  const [activePicking, setActivePicking] = useState('pickup');

  const timeSlots = useMemo(() => [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ], []);

  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [custPickup, setCustPickup] = useState(null);
  const [custDelivery, setCustDelivery] = useState(null);

  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapLocation, setMapLocation] = useState(defaultCenter);
  const [mapAddress, setMapAddress] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const reverseGeocode = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setMapAddress(results[0].formatted_address);
      }
    });
  }, []);

  const onPlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const newPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setMapLocation(newPos);
      setMapAddress(place.formatted_address);
      mapRef.current?.panTo(newPos);
    }
  };

  const onMarkerDragEnd = (e) => {
    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMapLocation(newPos);
    reverseGeocode(newPos.lat, newPos.lng);
  };

  const [addresses, setAddresses] = useState([]);
  const [selectedPickupAddress, setSelectedPickupAddress] = useState(null);
  const [selectedDropAddress, setSelectedDropAddress] = useState(null);
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [activeAddressType, setActiveAddressType] = useState('pickup');

  useEffect(() => {
    const fetchProfile = async () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData._id || userData.id;
      if (!userId) return;
      try {
        const profile = await authApi.getProfile(userId);
        if (profile.address) {
          const mainAddr = { 
            id: 'main', 
            type: 'Home', 
            address: profile.address, 
            location: profile.location || defaultCenter 
          };
          setAddresses([mainAddr]);
          setSelectedPickupAddress(mainAddr);
          setSelectedDropAddress(mainAddr);
        }
      } catch (error) {
        console.error('Error fetching profile for address:', error);
      }
    };
    fetchProfile();
  }, []);

  const confirmMapAddress = async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData._id || userData.id;
    if (!userId) {
        alert('Please login to save address');
        return;
    }

    try {
        const newAddr = { id: Date.now(), type: 'New Address', address: mapAddress, location: mapLocation };
        
        // Save to backend
        await authApi.updateProfile(userId, { 
            address: mapAddress,
            location: mapLocation 
        });

        setAddresses(prev => [newAddr, ...prev]);
        
        if (activeAddressType === 'pickup') {
            setSelectedPickupAddress(newAddr);
            if (isSameAddress) setSelectedDropAddress(newAddr);
        } else {
            setSelectedDropAddress(newAddr);
        }

        setShowMapPicker(false);
        setShowAddressPicker(false);
    } catch (error) {
        console.error('Save address error:', error);
        alert('Failed to save address');
    }
  };

  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

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

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
  }), []);

  const updateQuantity = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const newVal = Math.max(0, current + delta);
      const next = { ...prev };
      if (newVal === 0) {
        delete next[id];
      } else {
        next[id] = newVal;
      }
      localStorage.setItem('cart_quantities', JSON.stringify(next));
      return next;
    });
  };

  const getItemPrice = (item) => {
    const id = item._id || item.id;
    const unit = billingUnits[id] || 'pc';
    const rawPrice = item.basePrice || item.price;
    const parsePrice = (p) => {
      if (typeof p === 'number') return p;
      if (typeof p === 'string') {
        const cleaned = p.replace(/[^\d.]/g, '');
        return parseFloat(cleaned) || 0;
      }
      return 0;
    };
    const price = parsePrice(rawPrice);
    
    // Platform fee (aggregator margin)
    const aggregatorFee = 1.15;
    const finalPrice = Math.round(price * aggregatorFee);

    if (id.includes('wash') || id.includes('carpet') || id.includes('curtain')) {
      if (unit === 'kg') return finalPrice > 0 ? finalPrice : 99;
      return 18;
    }
    if (unit === 'pc') return finalPrice > 0 ? finalPrice : 49;
    return 199;
  };

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => {
    return acc + (getItemPrice(item) * (quantities[item._id || item.id] || 0));
  }, 0), [cartItems, quantities, billingUnits]);

  const logisticsFee = 50.00;
  const surcharge = useMemo(() => isExpress ? 1.5 : 1.0, [isExpress]);
  const grandTotal = useMemo(() => (subtotal + logisticsFee) * surcharge, [subtotal, logisticsFee, surcharge]);
  const discount = useMemo(() => isPromoApplied ? (grandTotal * 0.3) : 0, [isPromoApplied, grandTotal]);
  const finalTotal = useMemo(() => grandTotal - discount, [grandTotal, discount]);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FRESH30') {
      setIsPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code');
      setIsPromoApplied(false);
    }
  };

  const [specialInstructions, setSpecialInstructions] = useState('');

  const handlePlaceOrder = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData._id || userData.id || '66112c3f8e4b8a2e5c8b4567'; 
      const orderData = {
        customerId: userId,
        items: cartItems.map(item => ({
          serviceId: item._id || item.id,
          name: item.name,
          quantity: quantities[item._id || item.id],
          price: getItemPrice(item),
          unit: billingUnits[item._id || item.id],
          clothCount: billingUnits[item._id || item.id] === 'kg' ? (clothCounts[item._id || item.id] || 1) : 0
        })),
        pickupSlot: {
          date: selectedPickup,
          time: pickupTime
        },
        deliverySlot: {
          date: selectedDelivery,
          time: deliveryTime
        },
        pickupAddress: selectedPickupAddress?.address || '',
        pickupLocation: selectedPickupAddress?.location || defaultCenter,
        dropAddress: isSameAddress ? (selectedPickupAddress?.address || '') : (selectedDropAddress?.address || ''),
        dropLocation: isSameAddress ? (selectedPickupAddress?.location || defaultCenter) : (selectedDropAddress?.location || defaultCenter),
        totalAmount: finalTotal,
        specialInstructions
      };

      const response = await orderApi.createOrder(orderData);
      if (response._id) {
        // Clear cart
        localStorage.removeItem('cart_quantities');
        navigate('/user/confirmation', { state: { order: response } });
      }
    } catch (err) {
      console.error('Order Error:', err);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="bg-background font-body text-on-background min-h-[100dvh] flex flex-col"
    >
      {/* Sticky Header with Back Button */}
      <header className="fixed top-0 left-0 right-0 z-[80] bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary shadow-sm active:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined font-black">arrow_back</span>
          </motion.button>
          <h1 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Cart Details</h1>
          <div className="w-10" />
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        className="max-w-5xl mx-auto px-6 pt-24 pb-36 w-full flex-1 overflow-y-auto hide-scrollbar"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-12 space-y-10">
            <motion.div variants={itemVariants} className="pl-4 border-l-4 border-primary">
              <h2 className="font-headline text-3xl font-black tracking-tighter leading-none mb-1">Review Items</h2>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest opacity-60">
                {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in your fresh flow.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-sm animate-pulse">
                   <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">Syncing Cart Data...</p>
                </div>
              ) : cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <motion.div 
                    key={item._id || item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm border border-outline-variant/10 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:shadow-lg transition-shadow`}>
                        <span className="material-symbols-outlined text-3xl md:text-3xl">
                          {item.icon || 'local_laundry_service'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-[15px] md:text-lg text-on-surface leading-tight">{item.name}</h3>
                        <p className="text-on-surface-variant text-[11px] md:text-xs font-bold opacity-60 mt-0.5">{item.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <div className="flex items-center bg-surface-container-low rounded-2xl p-1 w-fit shadow-xs border border-outline-variant/5">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id || item.id, -1)}
                              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-primary bg-white rounded-xl shadow-xs"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">remove</span>
                            </motion.button>
                            <span className="font-black text-on-surface px-4 md:px-5 text-sm md:text-md uppercase tabular-nums">
                              {quantities[item._id || item.id] || 0} {billingUnits[item._id || item.id] === 'kg' ? 'kg' : 'pcs'}
                            </span>
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id || item.id, 1)}
                              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-primary bg-white rounded-xl shadow-xs"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">add</span>
                            </motion.button>
                          </div>
                          <div className="flex bg-surface-container-low rounded-2xl p-1 w-fit shadow-xs border border-outline-variant/5">
                            <button 
                              onClick={() => setBillingUnits(prev => ({...prev, [item._id || item.id]: 'kg'}))}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${billingUnits[item._id || item.id] === 'kg' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant opacity-40'}`}
                            >Kg</button>
                            <button 
                              onClick={() => setBillingUnits(prev => ({...prev, [item._id || item.id]: 'pc'}))}
                              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${billingUnits[item._id || item.id] === 'pc' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant opacity-40'}`}
                            >Cloth</button>
                          </div>

                          {billingUnits[item._id || item.id] === 'kg' && (
                            <div className="flex items-center gap-3 bg-surface-container-low rounded-2xl p-1 shadow-xs border border-primary/10">
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary ml-2">Clothes:</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setClothCounts(prev => ({...prev, [item._id || item.id]: Math.max(1, (prev[item._id || item.id] || 1) - 1)}))}
                                  className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-primary shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-xs">remove</span>
                                </button>
                                <span className="text-[10px] font-black min-w-[20px] text-center">{clothCounts[item._id || item.id] || 1}</span>
                                <button 
                                  onClick={() => setClothCounts(prev => ({...prev, [item._id || item.id]: (prev[item._id || item.id] || 1) + 1}))}
                                  className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-primary shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-xs">add</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-headline font-black text-lg md:text-xl text-primary leading-none tracking-tight">
                        ₹{(getItemPrice(item) * (quantities[item._id || item.id] || 0)).toFixed(2)}
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

            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-black text-2xl flex items-center gap-3 tracking-tighter">
                  <span className="material-symbols-outlined text-primary text-3xl">photo_library</span>
                  Garment Photos
                </h3>
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-low px-3 py-1.5 rounded-lg opacity-40">Optional</span>
              </div>
              <p className="text-[11px] font-bold text-on-surface-variant opacity-60 leading-relaxed -mt-2">Upload photos for condition verification before pickup.</p>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-[2rem] border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                   <span className="material-symbols-outlined text-outline-variant group-hover:text-primary">add_a_photo</span>
                   <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 group-hover:text-primary">Upload</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} multiple accept="image/*" className="hidden" />
                {garmentPhotos.map((p, idx) => (
                  <div key={idx} className="aspect-square rounded-[2rem] bg-surface-container-low border border-outline-variant/10 overflow-hidden relative group">
                    <img src={p} alt="Garment" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setGarmentPhotos(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ))}
                {garmentPhotos.length === 0 && Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-[2rem] bg-surface-container-low border border-outline-variant/10 flex items-center justify-center text-outline-variant opacity-20">
                    <span className="material-symbols-outlined text-xl">image</span>
                  </div>
                ))}
              </div>
            </motion.div>

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

            <AnimatePresence>
              {showPicker && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPicker(false)} className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100]" />
                  <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-[3rem] p-10 z-[101] shadow-2xl">
                    <div className="w-16 h-1.5 bg-outline-variant/20 rounded-full mx-auto mb-8" />
                    <header className="mb-8">
                      <h3 className="text-3xl font-black tracking-tighter mb-2">{activePicking === 'pickup' ? 'Schedule Pickup' : 'Expected Delivery'}</h3>
                      <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Select a convenient window</p>
                    </header>
                    <div className="space-y-8 overflow-y-auto max-h-[60vh] hide-scrollbar pb-6">
                      <section>
                        <div className="flex justify-between items-center mb-6 ml-2 pr-2">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Available Dates</h4>
                          <button onClick={() => setShowFullCalendar(true)} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-2xl border border-primary/20 hover:bg-primary hover:text-white transition-all group cursor-pointer">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            <span className="text-[9px] font-black uppercase tracking-widest">Manual Pick</span>
                          </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                          {availableDates.map((d, i) => (
                            <button key={i} onClick={() => { if (activePicking === 'pickup') setSelectedPickup(`${d.day}, ${d.date}`); else setSelectedDelivery(`${d.day}, ${d.date}`); }} className={`px-6 py-4 rounded-2xl flex flex-col items-center min-w-[100px] border-2 transition-all ${(activePicking === 'pickup' ? selectedPickup : selectedDelivery).includes(d.date) && !(activePicking === 'pickup' ? selectedPickup : selectedDelivery).includes('CUSTOM') ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-low border-transparent text-on-surface'}`}>
                              <span className="text-[10px] font-black uppercase tracking-tighter">{d.day}</span>
                              <span className="text-lg font-black">{d.date}</span>
                            </button>
                          ))}
                          {(activePicking === 'pickup' ? custPickup : custDelivery) && (
                            <button onClick={() => { const d = activePicking === 'pickup' ? custPickup : custDelivery; if (activePicking === 'pickup') setSelectedPickup(`CUSTOM, ${d.date}`); else setSelectedDelivery(`CUSTOM, ${d.date}`); }} className={`px-6 py-4 rounded-2xl flex flex-col items-center min-w-[100px] border-2 transition-all ${(activePicking === 'pickup' ? selectedPickup : selectedDelivery).includes('CUSTOM') ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-low border-transparent text-on-surface'}`}>
                              <span className="text-[10px] font-black uppercase tracking-tighter">CUSTOM</span>
                              <span className="text-lg font-black">{(activePicking === 'pickup' ? custPickup : custDelivery).date}</span>
                            </button>
                          )}
                        </div>
                      </section>
                      <section>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-4 ml-2">Time Windows</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {timeSlots.map((time, i) => (
                            <button key={i} onClick={() => { if (activePicking === 'pickup') setPickupTime(time); else setDeliveryTime(time); setShowPicker(false); }} className={`p-5 rounded-2xl text-left border-2 flex justify-between items-center transition-all ${(activePicking === 'pickup' ? pickupTime : deliveryTime) === time ? 'bg-primary/5 border-primary text-primary font-black' : 'bg-surface-container-low border-transparent text-on-surface font-bold shrink-0'}`}>
                              <span className="text-sm">{time}</span>
                              {(activePicking === 'pickup' ? pickupTime : deliveryTime) === time && <span className="material-symbols-outlined text-sm">check_circle</span>}
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>
                    <button onClick={() => setShowPicker(false)} className="w-full mt-6 py-5 bg-surface-container-highest rounded-2xl font-black text-[10px] uppercase tracking-widest">Dismiss</button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-black text-2xl flex items-center gap-3 tracking-tighter">
                  <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                  Address Selection
                </h3>
              </div>
              
              <div className="space-y-4">
                {/* Pickup Address */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 ml-4">Pickup from</p>
                  {selectedPickupAddress ? (
                    <div className="bg-surface-container-low p-4 rounded-3xl flex items-center justify-between border border-outline-variant/5 gap-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 shrink-0 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                          <span className="material-symbols-outlined text-xl">home</span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-on-surface text-[12px] uppercase leading-none mb-1">{selectedPickupAddress.type}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant opacity-60 leading-tight truncate">{selectedPickupAddress.address}</p>
                        </div>
                      </div>
                      <button onClick={() => { setActiveAddressType('pickup'); setShowAddressPicker(true); }} className="shrink-0 text-[10px] font-black text-primary uppercase tracking-widest bg-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-primary/5 transition-colors">Change</button>
                    </div>
                  ) : (
                    <button onClick={() => { setActiveAddressType('pickup'); setShowAddressPicker(true); }} className="w-full py-8 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 text-primary hover:bg-primary/5 transition-all outline-none">
                      <span className="material-symbols-outlined">add_location</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">Select Pickup Address</span>
                    </button>
                  )}
                </div>

                {/* Same as pickup toggle */}
                <div className="flex items-center justify-between px-6 py-4 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">sync_alt</span>
                    <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Deliver to the same address</p>
                  </div>
                  <button 
                    onClick={() => {
                        const next = !isSameAddress;
                        setIsSameAddress(next);
                        if (next) setSelectedDropAddress(selectedPickupAddress);
                    }}
                    className={`w-12 h-7 rounded-full transition-all relative ${isSameAddress ? 'bg-primary' : 'bg-outline-variant/40'}`}
                  >
                    <motion.div 
                        animate={{ x: isSameAddress ? 24 : 4 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                {/* Drop Address (only if not same) */}
                <AnimatePresence>
                    {!isSameAddress && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 ml-4">Drop at</p>
                            {selectedDropAddress ? (
                                <div className="bg-surface-container-low p-4 rounded-3xl flex items-center justify-between border border-outline-variant/5 gap-2">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 shrink-0 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                            <span className="material-symbols-outlined text-xl">local_shipping</span>
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-black text-on-surface text-[12px] uppercase leading-none mb-1">{selectedDropAddress.type}</p>
                                            <p className="text-[10px] font-bold text-on-surface-variant opacity-60 leading-tight truncate">{selectedDropAddress.address}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setActiveAddressType('drop'); setShowAddressPicker(true); }} className="shrink-0 text-[10px] font-black text-primary uppercase tracking-widest bg-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-primary/5 transition-colors">Change</button>
                                </div>
                            ) : (
                                <button onClick={() => { setActiveAddressType('drop'); setShowAddressPicker(true); }} className="w-full py-8 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 text-primary hover:bg-primary/5 transition-all outline-none">
                                    <span className="material-symbols-outlined">add_location_alt</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Select Drop Address</span>
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
              <h3 className="font-headline font-black text-2xl flex items-center gap-3 tracking-tighter">
                <span className="material-symbols-outlined text-primary text-3xl">notes</span>
                Special Instructions
              </h3>
              <p className="text-[11px] font-bold text-on-surface-variant opacity-60 leading-relaxed -mt-2">Anything else we should know? (e.g. no starch, handle with care)</p>
              <textarea 
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Type your instructions here..."
                className="w-full bg-surface-container-low border border-outline-variant/10 p-5 rounded-[2rem] text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                rows="3"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
              <h3 className="font-headline font-black text-2xl flex items-center gap-3 tracking-tighter">
                <span className="material-symbols-outlined text-primary text-3xl">sell</span>
                Promo Code
              </h3>
              <div className="relative flex items-center bg-surface-container-low rounded-[1.5rem] px-6 py-2 border border-outline-variant/10 focus-within:border-primary/30 transition-all">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code (e.g. FRESH30)" className="bg-transparent border-none focus:ring-0 p-3 text-sm font-black w-full uppercase placeholder:text-outline-variant/40" />
                <button onClick={handleApplyPromo} className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">{isPromoApplied ? 'Applied' : 'Apply'}</button>
              </div>
              {promoError && <p className="text-[10px] font-black text-error uppercase tracking-widest ml-4">{promoError}</p>}
              {isPromoApplied && <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-4">Success! 30% discount unlocked.</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-surface-container-highest rounded-[3rem] p-8 md:p-10 shadow-xl border border-white/40 shadow-primary/5 relative overflow-hidden">
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
                  <div className="flex justify-between items-center text-sm md:text-md text-primary">
                    <span className="font-bold">Express Surcharge (1.5x)</span>
                    <span className="font-black leading-none">× 1.50</span>
                  </div>
                )}
                <div className="h-px bg-outline-variant/15 my-6"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-2 font-bold">Upfront Pickup Security (5%)</p>
                    <p className="text-xl font-black text-primary leading-none tracking-tighter mb-4">₹{(finalTotal * 0.05).toFixed(2)}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-2">Total Order Value</p>
                    <AnimatePresence mode="wait">
                      <motion.p key={finalTotal} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl md:text-5xl font-black text-on-surface leading-none tracking-tighter">₹{finalTotal.toFixed(2)}</motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <p className="text-[9px] font-bold text-primary italic leading-relaxed">Only 5% will be charged upon pickup. The remaining balance (95%) is payable only after your clothes are ready and verified.</p>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePlaceOrder} className="w-full mt-12 bg-primary-gradient text-on-primary font-headline font-black py-5.5 rounded-2xl md:text-lg uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                Place Order
                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.main>

      <AnimatePresence>
        {showFullCalendar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullCalendar(false)} className="fixed inset-0 bg-on-surface/60 backdrop-blur-md z-[200]" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[3rem] p-10 z-[201] shadow-2xl border border-outline-variant/10">
              <header className="flex items-center justify-between mb-8">
                <h4 className="font-headline font-black text-2xl tracking-tighter text-on-surface capitalize">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                <div className="flex gap-2">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/5"><span className="material-symbols-outlined text-xl">chevron_left</span></motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary border border-outline-variant/5"><span className="material-symbols-outlined text-xl">chevron_right</span></motion.button>
                </div>
              </header>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (<div key={`${d}-${i}`} className="text-center text-[10px] font-black text-on-surface-variant opacity-30 py-2 tracking-widest">{d}</div>))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: getDaysInMonth(viewDate).firstDay }).map((_, i) => (<div key={`empty-${i}`} className="aspect-square" />))}
                {Array.from({ length: getDaysInMonth(viewDate).days }).map((_, i) => { const day = i + 1; const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString(); return (<motion.button key={day} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleCalendarSelect(day)} className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-black transition-all ${isToday ? 'bg-primary text-on-primary shadow-lg shadow-primary/30' : 'hover:bg-surface-container-low text-on-surface hover:text-primary'}`}>{day}</motion.button>); })}
              </div>
              <div className="mt-10 flex gap-4">
                <button onClick={() => setShowFullCalendar(false)} className="flex-1 py-4 rounded-2xl bg-surface-container-low font-black text-[10px] uppercase tracking-widest text-on-surface-variant">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddressPicker && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddressPicker(false)} className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[150]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-[3rem] p-10 z-[151] shadow-2xl">
              <div className="w-16 h-1.5 bg-outline-variant/20 rounded-full mx-auto mb-8" />
              <h3 className="text-3xl font-black tracking-tighter mb-8 shrink-0">Select Locale</h3>
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                <button 
                  onClick={() => setShowMapPicker(true)}
                  className="w-full p-6 rounded-[2rem] flex items-center gap-5 border-2 border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">map</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase leading-none mb-1">Pin on Map</p>
                    <p className="text-[10px] font-bold opacity-60">Use GPS for precise location</p>
                  </div>
                  <span className="material-symbols-outlined ml-auto">chevron_right</span>
                </button>

                {addresses.map((addr) => (
                  <button key={addr.id} onClick={() => { 
                    if (activeAddressType === 'pickup') {
                        setSelectedPickupAddress(addr);
                        if (isSameAddress) setSelectedDropAddress(addr);
                    } else {
                        setSelectedDropAddress(addr);
                    }
                    setShowAddressPicker(false); 
                  }} className={`w-full p-6 rounded-[2rem] flex items-center justify-between border-2 transition-all ${(activeAddressType === 'pickup' ? selectedPickupAddress : selectedDropAddress)?.id === addr.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface-container-low border-transparent'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${(activeAddressType === 'pickup' ? selectedPickupAddress : selectedDropAddress)?.id === addr.id ? 'bg-primary text-white' : 'bg-white text-on-surface-variant'}`}><span className="material-symbols-outlined text-lg">{addr.type === 'Home' ? 'home' : 'work'}</span></div>
                      <div className="text-left">
                        <p className="font-black text-sm text-on-surface leading-none mb-1">{addr.type}</p>
                        <p className="text-[10px] font-bold text-on-surface-variant opacity-60 truncate max-w-[180px]">{addr.address}</p>
                      </div>
                    </div>
                    {(activeAddressType === 'pickup' ? selectedPickupAddress : selectedDropAddress)?.id === addr.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                  </button>
                ))}
              </div>
              <button onClick={() => navigate('/user/profile/addresses')} className="w-full py-5 bg-surface-container-highest rounded-2xl font-black text-[10px] uppercase tracking-widest">Manage Addresses</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMapPicker && isLoaded && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-x-0 bottom-0 top-10 md:top-20 bg-white rounded-t-[3rem] z-[201] flex flex-col overflow-hidden">
               <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter">Pin Location</h3>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mt-1">Drag marker to exact spot</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                          setMapLocation(newPos);
                          reverseGeocode(newPos.lat, newPos.lng);
                          mapRef.current?.panTo(newPos);
                        });
                      }}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20"
                    >
                      <span className="material-symbols-outlined text-sm">my_location</span>
                      Current
                    </button>
                    <button onClick={() => setShowMapPicker(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100"><span className="material-symbols-outlined text-lg">close</span></button>
                  </div>
               </div>

               <div className="flex-1 relative">
                 <Autocomplete 
                   onLoad={(ref) => autocompleteRef.current = ref}
                   onPlaceChanged={onPlaceSelected}
                 >
                   <div className="absolute top-6 left-6 right-6 z-10">
                      <div className="bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white flex items-center gap-3">
                         <span className="material-symbols-outlined text-primary ml-3">search</span>
                         <input 
                           type="text" 
                           placeholder="Search area, colony or apartment..." 
                           className="flex-1 bg-transparent border-none focus:ring-0 p-3 text-sm font-bold placeholder:opacity-40"
                         />
                      </div>
                   </div>
                 </Autocomplete>

                 <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapLocation}
                    zoom={15}
                    onLoad={(map) => mapRef.current = map}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                    }}
                 >
                    <Marker 
                      position={mapLocation}
                      draggable={true}
                      onDragEnd={onMarkerDragEnd}
                    />
                 </GoogleMap>
               </div>

               <div className="p-8 bg-white border-t border-slate-100 space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Selected Location</p>
                      <p className="text-xs font-bold text-on-surface leading-normal">{mapAddress || 'Finding address...'}</p>
                    </div>
                  </div>
                  
                  <textarea 
                    value={mapAddress}
                    onChange={(e) => setMapAddress(e.target.value)}
                    placeholder="Add Floor/House No/Landmark..."
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                    rows="2"
                  />

                  <button 
                    onClick={confirmMapAddress}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    Confirm & Use This Address
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CartPage;

