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

      <motion.main className="max-w-5xl mx-auto px-6 pt-24 pb-36 w-full flex-1 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-12 space-y-10">
            <div className="pl-4 border-l-4 border-primary">
              <h2 className="font-headline text-3xl font-black tracking-tighter leading-none mb-1 text-slate-900">Review Items</h2>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest opacity-60">{cartItems.length} services added.</p>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-sm animate-pulse">
                   <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">Syncing...</p>
                </div>
              ) : cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <motion.div key={item._id || item.id} className="bg-white rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm border border-outline-variant/10 group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm"><span className="material-symbols-outlined text-3xl">{item.icon || 'local_laundry_service'}</span></div>
                      <div>
                        <h3 className="font-headline font-black text-[15px] md:text-lg text-on-surface leading-tight text-slate-900">{item.name}</h3>
                        
                        {/* Delivery Time Badge */}
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isExpress ? 'text-amber-600' : 'text-slate-500'}`}>
                                {isExpress ? (item.expressTime || '24h Delivery') : (item.normalTime || '2-3 Days')}
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <div className="flex items-center bg-surface-container-low rounded-2xl p-1 w-fit border border-outline-variant/5">
                            <button onClick={() => updateQuantity(item._id || item.id, -1)} className="w-8 h-8 flex items-center justify-center text-primary bg-white rounded-xl shadow-xs"><span className="material-symbols-outlined text-sm font-bold">remove</span></button>
                            <span className="font-black text-on-surface px-4 text-sm">{quantities[item._id || item.id] || 0} {billingUnits[item._id || item.id]}</span>
                            <button onClick={() => updateQuantity(item._id || item.id, 1)} className="w-8 h-8 flex items-center justify-center text-primary bg-white rounded-xl shadow-xs"><span className="material-symbols-outlined text-sm font-bold">add</span></button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right"><span className="font-headline font-black text-lg text-primary">₹{(getItemPrice(item) * (quantities[item._id || item.id] || 0)).toFixed(2)}</span></div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100"><p className="text-sm font-black text-slate-400 uppercase tracking-widest">Cart is Empty</p></div>
              )}
            </div>

            {applicablePromos.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-4">Discover Offers</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {applicablePromos.map(promo => (
                            <motion.div key={promo._id} onClick={() => handleApplyPromo(promo.code)} className={`min-w-[280px] p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all ${appliedPromoData?._id === promo._id ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h4 className={`text-lg font-black tracking-tighter mb-1 ${appliedPromoData?._id === promo._id ? 'text-white' : 'text-slate-900'}`}>{promo.title}</h4>
                                <div className={`mt-4 px-4 py-2 rounded-xl text-center border ${appliedPromoData?._id === promo._id ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}><span className="text-xs font-black">{promo.code}</span></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-headline font-black text-2xl flex items-center gap-3 text-slate-900"><span className="material-symbols-outlined text-primary text-3xl">schedule</span>Fulfillment</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setIsExpress(false)}
                      className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${!isExpress ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-900 hover:bg-slate-100'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined">local_shipping</span>
                            {!isExpress && <span className="material-symbols-outlined">check_circle</span>}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Standard</p>
                        <p className="text-sm font-black">Normal Speed</p>
                        <p className="text-[10px] font-bold mt-2 opacity-60">₹{normalLogisticsConfig} Delivery</p>
                    </div>

                    <div 
                      onClick={() => setIsExpress(true)}
                      className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${isExpress ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-900 hover:bg-slate-100'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined">zap</span>
                            {isExpress && <span className="material-symbols-outlined">check_circle</span>}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Express</p>
                        <p className="text-sm font-black">24h Priority</p>
                        <p className="text-[10px] font-bold mt-2 opacity-60">+ ₹{expressChargeConfig} Surcharge</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div onClick={() => { setActivePicking('pickup'); setShowPicker(true); }} className="bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/20 cursor-pointer"><p className="text-[9px] font-black text-primary uppercase mb-1">Pickup</p><p className="text-lg font-black text-slate-900">{selectedPickup}</p></div>
                    <div onClick={() => { setActivePicking('delivery'); setShowPicker(true); }} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent cursor-pointer"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Delivery</p><p className="text-lg font-black text-slate-900">{selectedDelivery}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-headline font-black text-2xl flex items-center gap-3 text-slate-900"><span className="material-symbols-outlined text-primary text-3xl">location_on</span>Locale</h3>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Diff. Drop?</span>
                        <div 
                          onClick={() => setIsSameAddress(!isSameAddress)}
                          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${!isSameAddress ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!isSameAddress ? 'left-7' : 'left-1'}`} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Pickup Section */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">1. Collection Point</p>
                        <div onClick={() => { setActiveAddressType('pickup'); setShowAddressPicker(true); }} className="bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/20 cursor-pointer hover:bg-white transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><span className="material-symbols-outlined">directions_run</span></div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-0.5">Pickup From</p>
                                    <p className="text-sm font-bold text-slate-900 truncate">{selectedPickupAddress?.address || 'Select Pickup Location'}</p>
                                </div>
                                <span className="material-symbols-outlined text-primary/40">chevron_right</span>
                            </div>
                        </div>
                    </div>

                    {/* Drop Section (Conditional) */}
                    {!isSameAddress && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">2. Final Destination</p>
                            <div onClick={() => { setActiveAddressType('drop'); setShowAddressPicker(true); }} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 cursor-pointer hover:bg-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm"><span className="material-symbols-outlined">local_shipping</span></div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Drop To</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{selectedDropAddress?.address || 'Select Drop Location'}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {isSameAddress && (
                        <div className="flex items-center gap-2 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                             <span className="material-symbols-outlined text-emerald-500 text-sm">verified</span>
                             <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Laundry will be dropped at pickup location</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <h3 className="font-headline font-black text-2xl mb-8 text-white">Summary</h3>
              <div className="space-y-6">
                <div className="flex justify-between text-sm"><span className="text-white/60 font-black">Cart Subtotal</span><span className="font-black text-white">₹{subtotal.toFixed(2)}</span></div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-white/60 font-black">Delivery (Normal)</span>
                    <span className="font-black text-white">₹{normalLogisticsConfig.toFixed(2)}</span>
                </div>

                {isExpress && (
                    <div className="flex justify-between text-sm text-amber-400">
                        <span className="font-black">Express Fulfillment</span>
                        <span className="font-black">+ ₹{expressChargeConfig.toFixed(2)}</span>
                    </div>
                )}
                
                <div className="h-px bg-white/10 my-6"></div>
                
                {isPromoApplied && (
                    <div className="flex justify-between text-sm text-emerald-400 mb-6 font-black uppercase tracking-widest">
                        <span>Reward Applied</span>
                        <span>- ₹{discount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Grand Total</p>
                        <p className="text-5xl font-black text-white tracking-tighter">₹{finalTotal.toFixed(2)}</p>
                    </div>
                </div>
              </div>
              <button onClick={handlePlaceOrder} className="w-full mt-12 bg-primary text-on-primary font-headline font-black py-6 rounded-2xl text-lg uppercase shadow-2xl active:scale-95 transition-all">Launch Fresh Flow</button>
            </div>
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
                        <button onClick={() => setShowMapPicker(true)} className="w-full p-8 border-2 border-dashed border-primary/30 rounded-[2.5rem] flex items-center justify-center gap-4 text-primary bg-primary/5">
                            <span className="material-symbols-outlined text-3xl">map</span>
                            <span className="text-xs font-black uppercase tracking-widest">Pin on Map</span>
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
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-2xl rounded-t-[3rem] p-10 relative z-10 shadow-2xl min-h-[50vh] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Pin on Map</h3>
                        <button onClick={() => setShowMapPicker(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-[2rem] overflow-hidden relative h-[400px]">
                        {!isLoaded ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase">Loading Satellite View...</p>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((pos) => {
                                               const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                                               setMapLocation(newPos);
                                               reverseGeocode(newPos.lat, newPos.lng);
                                               mapRef.current?.panTo(newPos);
                                            });
                                        }
                                    }}
                                    className="absolute top-4 right-4 z-[10] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary border border-slate-100 active:scale-90 transition-all"
                                >
                                    <span className="material-symbols-outlined">my_location</span>
                                </button>
                                <GoogleMap mapContainerStyle={mapContainerStyle} center={mapLocation} zoom={15} onLoad={(map) => mapRef.current = map}>
                                    <Marker position={mapLocation} draggable={true} onDragEnd={onMarkerDragEnd} />
                                </GoogleMap>
                            </>
                        )}
                    </div>
                    <div className="mt-6 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase mb-1">Selected Address</p>
                        <p className="text-xs font-bold text-slate-900 leading-normal">{mapAddress || 'Fetching address...'}</p>
                    </div>
                    <button onClick={confirmMapAddress} className="w-full mt-6 py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase shadow-xl">Confirm Locale</button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CartPage;
