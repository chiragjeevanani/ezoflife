import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MASTER_SERVICES } from '../../../shared/data/sharedData';
import { orderApi, serviceApi, authApi, promotionApi } from '../../../lib/api';
import { shippingConfigApi } from '../../../lib/shippingApi';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '400px' };
const defaultCenter = { lat: 28.4595, lng: 77.0266 }; // Gurgaon

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedService = location.state?.selectedService;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicablePromos, setApplicablePromos] = useState([]);
  const [appliedPromoData, setAppliedPromoData] = useState(null);

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
    if (selectedService && !q[selectedService._id || selectedService.id]) {
        const sid = selectedService._id || selectedService.id;
        q[sid] = selectedService.initialQuantity || 1;
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

  useEffect(() => {
    if (cartItems.length > 0) {
        const vendorId = cartItems[0].vendorId;
        if (vendorId) {
            promotionApi.getApplicablePromos(vendorId).then(setApplicablePromos).catch(console.error);
        }
    }
  }, [cartItems]);

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
  
  useEffect(() => {
    if (Object.keys(quantities).length > 0) {
      localStorage.setItem('cart_quantities', JSON.stringify(quantities));
    }
  }, [quantities]);
  
  const [expressChargeConfig, setExpressChargeConfig] = useState(0);
  const [normalLogisticsConfig, setNormalLogisticsConfig] = useState(0); // Default to 0 to detect fetch
  
  useEffect(() => {
    const fetchConfig = async () => {
        try {
            const configs = await shippingConfigApi.getConfig();
            
            const surcharge = configs.find(c => c.key === 'express_surcharge');
            if (surcharge) setExpressChargeConfig(Number(surcharge.value));

            const normalFee = configs.find(c => c.key === 'normal_logistics_fee');
            if (normalFee) setNormalLogisticsConfig(Number(normalFee.value));
        } catch (err) {
            console.error('Error fetching delivery config:', err);
        }
    };
    fetchConfig();
  }, []);

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
  
  // Detailed Address States
  const [addrDetails, setAddrDetails] = useState({
    type: 'HOME',
    line1: '',
    line2: '',
    floor: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });

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
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const syncAddresses = async () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData._id || userData.id;
      
      // 1. Get address from localStorage (Set by UserHeader/Home)
      const detectedAddr = localStorage.getItem('detected_address');
      const detectedCoords = JSON.parse(localStorage.getItem('detected_coords') || 'null');

      let initialAddresses = [];
      let defaultAddress = null;

      if (detectedAddr) {
          defaultAddress = { 
            id: 'current_set', 
            type: 'Current Selection', 
            address: detectedAddr, 
            location: detectedCoords || defaultCenter 
          };
          initialAddresses.push(defaultAddress);
      }

      // 2. Fetch profile addresses if logged in
      if (userId) {
        try {
          const profile = await authApi.getProfile(userId);
          if (profile.address && profile.address !== detectedAddr) {
            initialAddresses.push({ 
              id: 'profile', 
              type: 'Profile Home', 
              address: profile.address, 
              location: profile.location || defaultCenter 
            });
          }
        } catch (error) {
          console.error('Error fetching profile address:', error);
        }
      }

      setAddresses(initialAddresses);
      
      // 3. AUTOMATICALLY set the detected address as pickup
      if (defaultAddress) {
          setSelectedPickupAddress(defaultAddress);
          setSelectedDropAddress(defaultAddress);
      } else if (initialAddresses.length > 0) {
          setSelectedPickupAddress(initialAddresses[0]);
          setSelectedDropAddress(initialAddresses[0]);
      }
    };

    syncAddresses();
  }, []);

  const confirmMapAddress = async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData._id || userData.id;
    if (!userId) {
        alert('Please login to save address');
        return;
    }

    // Combine into a full string for backward compatibility
    const fullAddress = `${addrDetails.line1}, ${addrDetails.line2}${addrDetails.floor ? `, Floor: ${addrDetails.floor}` : ''}${addrDetails.landmark ? `, Near ${addrDetails.landmark}` : ''}, ${addrDetails.city}, ${addrDetails.state} - ${addrDetails.pincode}`;

    try {
        const newAddr = { 
            id: Date.now(), 
            type: addrDetails.type, 
            address: fullAddress, 
            location: mapLocation,
            details: addrDetails
        };
        
        await authApi.updateProfile(userId, { 
            address: fullAddress,
            location: mapLocation 
        });

        setAddresses(prev => [newAddr, ...prev]);
        localStorage.setItem('address_is_full', 'true');

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

  const logisticsFee = normalLogisticsConfig;
  const currentExpressFee = isExpress ? expressChargeConfig : 0;
  const grandTotal = useMemo(() => (subtotal + logisticsFee + currentExpressFee), [subtotal, logisticsFee, currentExpressFee]);
  
  const discount = useMemo(() => {
      if (!isPromoApplied || !appliedPromoData) return 0;
      if (appliedPromoData.discountType === 'Flat') return Math.min(appliedPromoData.discountValue, grandTotal);
      return (grandTotal * appliedPromoData.discountValue) / 100;
  }, [isPromoApplied, appliedPromoData, grandTotal]);

  const finalTotal = useMemo(() => Math.max(0, grandTotal - discount), [grandTotal, discount]);

  const handleApplyPromo = (code) => {
    const targetCode = typeof code === 'string' ? code : promoCode;
    const promo = applicablePromos.find(p => p.code.toUpperCase() === targetCode.toUpperCase());
    
    if (promo) {
      if (subtotal < promo.minOrderValue) {
          setPromoError(`Min order ₹${promo.minOrderValue} required`);
          setIsPromoApplied(false);
          return;
      }
      setAppliedPromoData(promo);
      setIsPromoApplied(true);
      setPromoError('');
      setPromoCode(promo.code);
    } else {
      setPromoError('Invalid code');
      setIsPromoApplied(false);
      setAppliedPromoData(null);
    }
  };

  const [specialInstructions, setSpecialInstructions] = useState('');

  const handlePlaceOrder = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData._id || userData.id; 
      if (!userId) return alert('Please login');

      const orderData = {
        customerId: userId,
        items: cartItems.map(item => ({
          serviceId: item._id || item.id,
          name: item.name,
          quantity: quantities[item._id || item.id],
          price: getItemPrice(item),
          unit: billingUnits[item._id || item.id]
        })),
        pickupSlot: { date: selectedPickup, time: pickupTime },
        deliverySlot: { date: selectedDelivery, time: deliveryTime },
        pickupAddress: selectedPickupAddress?.address || '',
        pickupLocation: selectedPickupAddress?.location || defaultCenter,
        dropAddress: isSameAddress ? (selectedPickupAddress?.address || '') : (selectedDropAddress?.address || ''),
        dropLocation: isSameAddress ? (selectedPickupAddress?.location || defaultCenter) : (selectedDropAddress?.location || defaultCenter),
        totalAmount: finalTotal,
        deliveryMode: isExpress ? 'Express' : 'Normal',
        deliveryCharge: logisticsFee + currentExpressFee,
        promoApplied: isPromoApplied ? appliedPromoData?._id : null,
        discountAmount: discount,
        specialInstructions
      };

      const response = await orderApi.createOrder(orderData);
      if (response._id) {
        localStorage.removeItem('cart_quantities');
        navigate('/user/confirmation', { state: { order: response } });
      }
    } catch (err) {
      alert('Error placing order');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background font-body text-on-background min-h-[100dvh] flex flex-col"
    >
      <header className="fixed top-0 left-0 right-0 z-[80] bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary shadow-sm"><span className="material-symbols-outlined font-black">arrow_back</span></motion.button>
          <h1 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Cart Details</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Booking Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex flex-col gap-1">
                  <h3 className="font-headline font-black text-2xl text-slate-900 uppercase tracking-tighter">Booking Preview.</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verify your details before payment</p>
                </div>
                <button onClick={() => setShowPreview(false)} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm hover:text-rose-500 transition-all">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Services & Items</p>
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item._id || item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-400">check_circle</span>
                          <span className="font-bold text-sm text-slate-900">{item.name} × {quantities[item._id || item.id]}</span>
                        </div>
                        <span className="font-black text-slate-900">₹{getItemPrice(item) * quantities[item._id || item.id]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Pickup Address</p>
                    <p className="text-xs font-bold text-slate-900 leading-relaxed">{selectedPickupAddress?.address}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Scheduling</p>
                    <p className="text-xs font-bold text-slate-900">Pickup: {selectedPickup}</p>
                    <p className="text-xs font-bold text-slate-900 mt-1">Delivery: {selectedDelivery}</p>
                  </div>
                </div>

                <div className="bg-black rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                    <span>Grand Total</span>
                    <span className="text-white">₹{finalTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Pay Now (Advance)</p>
                      <p className="text-4xl font-black text-white tracking-tighter">₹{(finalTotal * 0.05).toFixed(0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Pay After Delivery</p>
                      <p className="text-2xl font-black text-white/60 tracking-tighter">₹{(finalTotal * 0.95).toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={finalSubmitOrder}
                  disabled={loading}
                  className={`w-full py-6 rounded-[1.5rem] bg-black text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-emerald-500 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main className="max-w-5xl mx-auto px-6 pt-24 pb-36 w-full flex-1 overflow-y-auto hide-scrollbar">
        <div className="flex flex-col gap-10">
          
          {/* 1. Item Summary Detail - TOP */}
          <div className="pl-4 border-l-4 border-black">
            <h2 className="font-headline text-3xl font-black tracking-tighter leading-none mb-1 text-slate-900 uppercase">Your Summary.</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{cartItems.length} services selected</p>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemId = item._id || item.id;
              const qty = quantities[itemId];
              const unitPrice = getItemPrice(item);
              const totalPrice = unitPrice * qty;
              const isHeritageService = item.tier === 'Heritage' || (item.basePrice > 200);

              return (
                <div key={itemId} className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5 border border-slate-100 shadow-sm relative overflow-hidden group">
                  {/* Icon Box */}
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shrink-0">
                    <span className="material-symbols-outlined text-xl md:text-2xl">{item.icon || 'local_laundry_service'}</span>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <h3 className="font-black text-md md:text-lg text-slate-900 uppercase tracking-tight leading-none truncate">{item.name}</h3>
                      <span className="text-[8px] md:text-[9px] font-black px-2 py-0.5 md:py-1 rounded-lg uppercase tracking-widest bg-slate-100 text-slate-400 shrink-0">
                        {isHeritageService ? 'Heritage' : 'Essential'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
                      {/* NEW PILL-STYLE QTY CONTROL - MATCHING IMAGE */}
                      <div className="bg-slate-50 rounded-[2rem] px-1.5 py-1 flex items-center gap-2 md:gap-4 border border-slate-100/50 shadow-inner w-full sm:w-auto justify-between sm:justify-start">
                        <button 
                          onClick={() => updateQuantity(itemId, -1)}
                          className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-full text-slate-400 shadow-sm hover:text-black transition-all active:scale-90"
                        >
                          <span className="material-symbols-outlined text-sm md:text-md font-black">remove</span>
                        </button>
                        
                        <div className="flex flex-col items-center min-w-[30px] md:min-w-[40px]">
                          <span className="text-xs font-black text-slate-900 leading-none">{qty}</span>
                          <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1 whitespace-nowrap">Per {billingUnits[itemId] || 'Kg'}</span>
                        </div>

                        <button 
                          onClick={() => updateQuantity(itemId, 1)}
                          className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-full text-slate-400 shadow-sm hover:text-black transition-all active:scale-90"
                        >
                          <span className="material-symbols-outlined text-sm md:text-md font-black">add</span>
                        </button>
                      </div>

                      {/* Pricing Section - MATCHING IMAGE */}
                      <div className="flex items-center justify-between sm:justify-start gap-6 md:gap-8 w-full sm:w-auto pt-2 sm:pt-0">
                        <div className="flex flex-col">
                          <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Price/Unit</p>
                          <p className="text-md md:text-lg font-black text-slate-900 mt-1 tracking-tighter">₹{unitPrice}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Total</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900 mt-1 tracking-tighter">₹{totalPrice.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Circular Remove Button - TOP RIGHT */}
                  <button 
                    onClick={() => updateQuantity(itemId, -qty)}
                    className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg md:text-xl font-black">close</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 2. Premium Delivery Selection Section - FROM IMAGE */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            {/* Tabs Header */}
            <div className="bg-slate-50 p-2 flex border-b border-slate-100">
              <button 
                className="flex-1 py-3.5 rounded-2xl text-[11px] font-black tracking-tight bg-black text-white shadow-lg"
              >
                Delivery Type
              </button>
            </div>

            {/* Delivery Options */}
            <div className="divide-y divide-slate-100">
              {/* Express Option */}
              <div 
                onClick={() => setIsExpress(true)}
                className={`p-6 flex items-center justify-between cursor-pointer transition-all ${isExpress ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isExpress ? 'border-amber-500' : 'border-slate-200'}`}>
                    {isExpress && <div className="w-3 h-3 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-black text-sm ${isExpress ? 'text-amber-600' : 'text-slate-900'}`}>Express ⚡</h4>
                      <div className="h-4 w-px bg-slate-200" />
                      <span className="text-slate-400 line-through text-[10px]">₹{expressChargeConfig + 20}</span>
                      <span className="text-slate-900 font-black text-xs">₹{expressChargeConfig}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">Fastest delivery, directly to you!</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black ${isExpress ? 'text-amber-600' : 'text-slate-400'}`}>35-40 mins</span>
                </div>
              </div>

              {/* Standard Option (Normal) */}
              <div 
                onClick={() => setIsExpress(false)}
                className={`p-6 flex items-center justify-between cursor-pointer transition-all ${!isExpress ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${!isExpress ? 'border-black' : 'border-slate-200'}`}>
                    {!isExpress && <div className="w-3 h-3 rounded-full bg-black" />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">Normal (Standard)</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">Minimal order grouping</p>
                    <p className="text-[10px] font-black text-slate-900 mt-1">₹{normalLogisticsConfig}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black ${!isExpress ? 'text-slate-900' : 'text-slate-400'}`}>40-45 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Address Management Section - NEW */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-black text-xl flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                  <span className="material-symbols-outlined text-black">location_on</span>Address Details.
                </h3>
              </div>

              {/* Pickup Address Box */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-xl">directions_run</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pickup Address</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {selectedPickupAddress?.address || 'No address selected'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setActiveAddressType('pickup'); setShowAddressPicker(true); }}
                  className="px-5 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20 hover:scale-105 transition-all shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Drop Address Option */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">local_shipping</span>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-tight">Drop to different location?</p>
                  </div>
                  <div 
                    onClick={() => setIsSameAddress(!isSameAddress)}
                    className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${!isSameAddress ? 'bg-black' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!isSameAddress ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>

                {!isSameAddress && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-xl">location_home</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Drop Address</p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {selectedDropAddress?.address || 'Select Drop Location'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setActiveAddressType('drop'); setShowAddressPicker(true); }}
                      className="px-5 py-2 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shrink-0"
                    >
                      Set
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Pickup & Delivery Slots Section - NEW */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-black text-xl flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                <span className="material-symbols-outlined text-black">schedule</span>Slots Selection.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Slot Card */}
              <div 
                onClick={() => { setActivePicking('pickup'); setShowPicker(true); }}
                className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 cursor-pointer hover:bg-white transition-all group"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-black transition-colors">Pickup</p>
                <div className="flex flex-col">
                  <p className="text-sm font-black text-slate-900">{selectedPickup}</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">{pickupTime}</p>
                </div>
              </div>

              {/* Delivery Slot Card */}
              <div 
                onClick={() => { setActivePicking('delivery'); setShowPicker(true); }}
                className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 cursor-pointer hover:bg-white transition-all group"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-black transition-colors">Delivery</p>
                <div className="flex flex-col">
                  <p className="text-sm font-black text-slate-900">{selectedDelivery}</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">{deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Pre Pickup Photo Upload - NEW */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="font-headline font-black text-xl flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                <span className="material-symbols-outlined text-black">photo_camera</span>Pre Pickup Photo.
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Optional record for your safety</p>
            </div>

            <div className="flex flex-col gap-4">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-full py-5 rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center gap-3 hover:bg-white hover:border-black transition-all group"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-black">add_a_photo</span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-black">Upload Garment Photos 📷</span>
              </button>

              {/* Photos Preview */}
              {garmentPhotos.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  {garmentPhotos.map((url, i) => (
                    <div key={i} className="relative shrink-0">
                      <img src={url} alt="Garment" className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                      <button 
                        onClick={() => setGarmentPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="material-symbols-outlined text-[10px] font-black">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. Promo Code Selection */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Promo Code</h3>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="ENTER COUPON CODE" 
                className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-black placeholder:text-slate-300 focus:ring-2 focus:ring-black transition-all"
              />
              <button 
                onClick={() => handleApplyPromo()}
                className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-4">{promoError}</p>}
            {isPromoApplied && <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-4">Coupon Applied Successfully!</p>}
          </div>

          {/* 7. Notes / Instructions Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Notes / Instructions</h3>
            <textarea 
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests? (e.g. Wash separately, Use mild detergent)"
              className="w-full bg-slate-50 border-none rounded-3xl px-6 py-5 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-black transition-all min-h-[120px] resize-none"
            />
          </div>

          {/* 8. Payment Info Logic */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Payment Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col gap-2">
                <span className="material-symbols-outlined text-emerald-500">payments</span>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Pay 5% Now</p>
                <p className="text-xs font-bold text-emerald-600">Secure booking deposit</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-2">
                <span className="material-symbols-outlined text-slate-400">handshake</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Rest After Delivery</p>
                <p className="text-xs font-bold text-slate-400">Pay remaining 95% later</p>
              </div>
            </div>
          </div>

          {/* 9. Price Breakdown & Final Action */}
          <div className="bg-black rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col gap-1 mb-8">
              <h3 className="font-headline font-black text-2xl text-white uppercase tracking-tighter">Price Breakdown.</h3>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Clear pricing transparency</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-black uppercase tracking-widest text-white/60">
                <span>Items Total</span>
                <span className="text-white">₹{subtotal.toFixed(0)}</span>
              </div>
              
              <div className="flex justify-between text-sm font-black uppercase tracking-widest text-white/60">
                <span>Delivery Fee</span>
                <span className="text-white">₹{normalLogisticsConfig.toFixed(0)}</span>
              </div>

              {isExpress && (
                <div className="flex justify-between text-sm font-black uppercase tracking-widest text-amber-400">
                  <span>Express Fee</span>
                  <span>₹{expressChargeConfig.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black uppercase tracking-widest text-white/60">
                <span>Taxes (GST)</span>
                <span className="text-white">₹{(grandTotal * 0.05).toFixed(0)}</span> {/* 5% tax example */}
              </div>

              <div className="h-px bg-white/10 my-4"></div>

              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Advance Payable (5%)</p>
                  <p className="text-3xl font-black text-white tracking-tighter">₹{(finalTotal * 0.05).toFixed(0)}</p>
                </div>
                <div className="text-right flex flex-col">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Remaining After Delivery</p>
                  <p className="text-xl font-black text-white/60 tracking-tighter line-through">₹{(finalTotal * 0.95).toFixed(0)}</p>
                  <p className="text-2xl font-black text-white tracking-tighter mt-1">₹{(finalTotal * 0.95).toFixed(0)}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder} 
              className="w-full mt-10 bg-white text-black font-black py-6 rounded-[1.5rem] text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-amber-400 hover:text-black transition-colors"
            >
              Confirm Booking
            </button>
          </div>

        </div>
      </motion.main>

      <AnimatePresence>
        {showPicker && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPicker(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-2xl rounded-t-[3rem] p-10 relative z-10 shadow-2xl max-h-[80vh] overflow-y-auto">
                    <h3 className="text-3xl font-black mb-8 text-slate-900">{activePicking === 'pickup' ? 'Schedule Pickup' : 'Select Delivery'}</h3>
                    <div className="space-y-8">
                        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                            {availableDates.map((d, i) => (
                                <button key={i} onClick={() => { if (activePicking === 'pickup') setSelectedPickup(`${d.day}, ${d.date}`); else setSelectedDelivery(`${d.day}, ${d.date}`); }} className={`px-8 py-5 rounded-[2rem] flex flex-col items-center min-w-[120px] transition-all ${(activePicking === 'pickup' ? selectedPickup : selectedDelivery).includes(d.date) ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}><span className="text-[10px] font-black uppercase mb-1">{d.day}</span><span className="text-xl font-black">{d.date}</span></button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {timeSlots.map((time, i) => (
                                <button key={i} onClick={() => { if (activePicking === 'pickup') setPickupTime(time); else setDeliveryTime(time); setShowPicker(false); }} className={`p-6 rounded-2xl text-left border-2 transition-all ${(activePicking === 'pickup' ? pickupTime : deliveryTime) === time ? 'border-primary text-primary' : 'bg-slate-50 border-transparent text-slate-900'}`}><span className="text-sm font-black">{time}</span></button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddressPicker && (
            <div className="fixed inset-0 z-[150] flex items-end justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddressPicker(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-2xl rounded-t-[3rem] p-10 relative z-10 shadow-2xl max-h-[80vh] overflow-y-auto">
                    <h3 className="text-3xl font-black mb-8 text-slate-900">Locale</h3>
                    <div className="space-y-4">
                        <button onClick={() => setShowMapPicker(true)} className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center gap-4 text-slate-900 bg-slate-50 hover:bg-white transition-all">
                            <span className="material-symbols-outlined text-2xl">add_location_alt</span>
                            <span className="text-xs font-black uppercase tracking-widest">Add New Address</span>
                        </button>
                        {addresses.map(addr => (
                            <div 
                              key={addr.id} 
                              onClick={() => { 
                                if (activeAddressType === 'pickup') {
                                    setSelectedPickupAddress(addr);
                                    if (isSameAddress) setSelectedDropAddress(addr);
                                } else {
                                    setSelectedDropAddress(addr);
                                }
                                setShowAddressPicker(false); 
                              }} 
                              className="p-6 rounded-[2rem] bg-slate-50 flex items-center gap-5 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-primary text-2xl">home</span>
                                <div>
                                    <p className="text-xs font-black text-slate-900 leading-none mb-1">{addr.type}</p>
                                    <p className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">{addr.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMapPicker && (
            <div className="fixed inset-0 z-[200] flex items-end justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMapPicker(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                <motion.div 
                    initial={{ y: "100%" }} 
                    animate={{ y: 0 }} 
                    exit={{ y: "100%" }} 
                    className="bg-white w-full max-w-2xl rounded-t-[3rem] p-8 md:p-10 relative z-10 shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto hide-scrollbar"
                >
                    <div className="flex flex-col mb-8">
                        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
                        <h3 className="text-4xl font-black italic tracking-tighter leading-none mb-2">LOCATE<br/>ADDRESS.</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Details for accurate delivery</p>
                    </div>
                    
                    <div className="space-y-8">
                        {/* Address Type Selection */}
                        <div className="flex gap-3">
                            {['HOME', 'OFFICE', 'OTHER'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setAddrDetails(prev => ({ ...prev, type: t }))}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${addrDetails.type === t ? 'bg-black text-white shadow-xl scale-[1.02]' : 'bg-slate-50 text-slate-400'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1">Address Line 1</label>
                                <input 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Flat/House No, Building Name"
                                    value={addrDetails.line1}
                                    onChange={(e) => setAddrDetails(prev => ({ ...prev, line1: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1">Address Line 2</label>
                                <input 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Street, Area Name"
                                    value={addrDetails.line2}
                                    onChange={(e) => setAddrDetails(prev => ({ ...prev, line2: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1">Floor / Apt</label>
                                    <input 
                                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="e.g. 4th Floor"
                                        value={addrDetails.floor}
                                        onChange={(e) => setAddrDetails(prev => ({ ...prev, floor: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1">Landmark</label>
                                    <input 
                                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Near Temple/Gym"
                                        value={addrDetails.landmark}
                                        onChange={(e) => setAddrDetails(prev => ({ ...prev, landmark: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1">Pincode</label>
                                    <input 
                                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="6-digit ZIP"
                                        value={addrDetails.pincode}
                                        onChange={(e) => setAddrDetails(prev => ({ ...prev, pincode: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1">City</label>
                                    <input 
                                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="City Name"
                                        value={addrDetails.city}
                                        onChange={(e) => setAddrDetails(prev => ({ ...prev, city: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1">State</label>
                                <input 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="State Name"
                                    value={addrDetails.state}
                                    onChange={(e) => setAddrDetails(prev => ({ ...prev, state: e.target.value }))}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={confirmMapAddress} 
                            disabled={!addrDetails.line1 || !addrDetails.pincode}
                            className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl disabled:opacity-30 disabled:grayscale transition-all mt-6 active:scale-95"
                        >
                            Secure Location
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CartPage;
