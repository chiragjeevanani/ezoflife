import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { authApi } from '../../../lib/api';
import { toast } from 'react-hot-toast';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '100%'
};
const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090 // New Delhi
};

const ShopDetails = () => {
    const navigate = useNavigate();
    const locationState = useLocation();
    const { phone } = locationState.state || {};

    const [shopName, setShopName] = useState('');
    const [gst, setGst] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState(defaultCenter);
    const [selectedServices, setSelectedServices] = useState([1]);
    const [saving, setSaving] = useState(false);

    const isEditing = locationState.state?.isEditing;
    const vendorData = JSON.parse(localStorage.getItem('vendorData') || '{}');
    const vendorId = vendorData.id || vendorData._id;

    React.useEffect(() => {
        if (isEditing && vendorId) {
            const loadProfile = async () => {
                try {
                    const profile = await authApi.getProfile(vendorId);
                    if (profile.shopDetails) {
                        setShopName(profile.shopDetails.name || '');
                        setAddress(profile.shopDetails.address || '');
                        setGst(profile.shopDetails.gst || '');
                        if (profile.location?.lat) setLocation(profile.location);
                    }
                } catch (err) {
                    console.error('Error loading profile:', err);
                }
            };
            loadProfile();
        }
    }, [isEditing, vendorId]);

    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const availableServices = useMemo(() => [
        { id: 1, title: 'Wash & Fold', icon: 'local_laundry_service' },
        { id: 2, title: 'Dry Cleaning', icon: 'dry_cleaning' },
        { id: 3, title: 'Steam Press', icon: 'iron' },
        { id: 4, title: 'Shoe Care', icon: 'checkroom' }
    ], []);

    const toggleService = (id) => {
        setSelectedServices(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const reverseGeocode = useCallback((lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                setAddress(results[0].formatted_address);
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
            setLocation(newPos);
            setAddress(place.formatted_address);
            if (mapRef.current) {
                mapRef.current.panTo(newPos);
            }
        }
    };

    const onMarkerDragEnd = (e) => {
        const newPos = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        setLocation(newPos);
        reverseGeocode(newPos.lat, newPos.lng);
    };

    const handleNext = async () => {
        if (!shopName) return alert('Please enter shop name');
        if (!address) return alert('Please provide shop address');

        if (isEditing) {
            try {
                setSaving(true);
                await authApi.updateProfile(vendorId, {
                    shopDetails: {
                        name: shopName,
                        address: address,
                        gst: gst,
                        services: selectedServices.map(id => availableServices.find(s => s.id === id).title)
                    },
                    location: location
                });
                toast.success('Shop details updated!');
                navigate('/vendor/profile');
            } catch (err) {
                toast.error('Failed to update: ' + err.message);
            } finally {
                setSaving(false);
            }
            return;
        }

        navigate('/vendor/upload-documents', { 
            state: { 
                phone, 
                shopName, 
                gst, 
                address,
                location,
                services: selectedServices.map(id => availableServices.find(s => s.id === id).title)
            } 
        });
    };

    if (loadError) return <div className="p-10 text-center font-bold text-rose-500">Error loading maps. Check API Key.</div>;
    if (!isLoaded) return <div className="p-10 text-center font-black text-primary animate-pulse uppercase tracking-[0.3em]">Igniting Maps...</div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#F8FAFC] text-[#1E293B] min-h-screen font-sans"
        >
            {/* Header */}
            <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Shop Profile</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                    <img 
                        src="https://lh3.googleusercontent.com/a/ACg8ocL_X_X_X_X_X_X_X_X_X_X_X=s96-c" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">
                {/* Compact Stepper */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3D5AFE] text-white flex items-center justify-center text-sm font-bold">1</div>
                        <span className="text-sm font-bold text-[#3D5AFE]">Shop Details</span>
                    </div>
                    <div className="flex-1 mx-4 h-[2px] bg-slate-200 relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '50%' }}
                            className="absolute inset-y-0 bg-[#3D5AFE]"
                        />
                    </div>
                    <div className="flex items-center gap-3 opacity-40">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">2</div>
                        <span className="text-sm font-medium text-slate-500">Verification</span>
                    </div>
                </div>

                {/* Form Progress Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
                    <section className="space-y-6">
                        {/* Shop Name */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Shop Name</label>
                            <input 
                                type="text"
                                shadow-sm
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="e.g. Pristine Cleaners"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:border-[#3D5AFE]/30 focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        {/* GST Number */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">GST Number (Optional)</label>
                            <input 
                                type="text"
                                value={gst}
                                onChange={(e) => setGst(e.target.value)}
                                placeholder="15-digit GSTIN"
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:border-[#3D5AFE]/30 focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800"
                            />
                        </div>

                        {/* Address Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Store Location</label>
                                <button 
                                    onClick={() => {
                                        navigator.geolocation.getCurrentPosition((pos) => {
                                            const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                                            setLocation(newPos);
                                            reverseGeocode(newPos.lat, newPos.lng);
                                            mapRef.current?.panTo(newPos);
                                        });
                                    }}
                                    className="text-[#3D5AFE] text-[11px] font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">my_location</span>
                                    Current
                                </button>
                            </div>
                            
                            <div className="relative group">
                                <div className="w-full h-64 rounded-3xl bg-slate-200 overflow-hidden relative border border-slate-100 shadow-inner">
                                    <Autocomplete
                                        onLoad={(ref) => autocompleteRef.current = ref}
                                        onPlaceChanged={onPlaceSelected}
                                    >
                                        <input 
                                            type="text"
                                            placeholder="Search shop location..."
                                            className="absolute top-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-primary/10 font-bold text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </Autocomplete>
                                    
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={location}
                                        zoom={15}
                                        onLoad={(map) => mapRef.current = map}
                                        options={{
                                            disableDefaultUI: true,
                                            zoomControl: true,
                                            styles: [
                                                {
                                                    "featureType": "poi",
                                                    "elementType": "labels",
                                                    "stylers": [{ "visibility": "off" }]
                                                }
                                            ]
                                        }}
                                    >
                                        <Marker 
                                            position={location} 
                                            draggable={true}
                                            onDragEnd={onMarkerDragEnd}
                                            animation={window.google.maps.Animation.DROP}
                                        />
                                    </GoogleMap>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Detailed Address</label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="House No, Building, Street, Area..."
                                    rows="3"
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:border-[#3D5AFE]/30 focus:ring-4 focus:ring-[#3D5AFE]/5 outline-none transition-all font-semibold text-slate-800 text-sm leading-relaxed resize-none"
                                />
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1 italic">
                                    * You can refine the address manually after pinning on the map.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Services Offered</label>
                        <div className="grid grid-cols-2 gap-3">
                            {availableServices.map((service) => {
                                const isSelected = selectedServices.includes(service.id);
                                return (
                                    <button 
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'bg-[#3D5AFE]/5 border-[#3D5AFE]/20 text-[#3D5AFE]' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-[#3D5AFE]' : 'text-slate-400'}`}>
                                            {service.icon}
                                        </span>
                                        <span className="text-xs font-bold">{service.title}</span>
                                        {isSelected && <span className="material-symbols-outlined text-[14px] ml-auto font-bold">check_circle</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer Action */}
                <div className="space-y-4">
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        disabled={saving}
                        className={`w-full py-5 rounded-2xl bg-[#3D5AFE] text-white font-bold text-lg shadow-xl shadow-[#3D5AFE]/20 flex items-center justify-center gap-3 hover:bg-[#304FFE] transition-all ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span>{isEditing ? (saving ? 'Saving...' : 'Save Changes') : 'Next Step'}</span>
                        <span className="material-symbols-outlined text-[20px]">{isEditing ? 'check' : 'arrow_forward'}</span>
                    </motion.button>
                    <p className="text-center text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                        Standard verification: 24h
                    </p>
                </div>
            </main>
        </motion.div>
    );
};

export default ShopDetails;
