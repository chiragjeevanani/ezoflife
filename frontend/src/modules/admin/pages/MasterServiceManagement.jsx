import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { masterServiceApi } from '../../../lib/api';
import { toast } from 'react-hot-toast';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const MasterServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [vendorRates, setVendorRates] = useState([]);
    const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
    const [isLoadingRates, setIsLoadingRates] = useState(false);

    const autocompleteRef = useRef(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        icon: 'local_laundry_service',
        basePrice: 0,
        category: 'General',
        targetAudience: 'both',
        description: '',
        address: '',
        location: { lat: 0, lng: 0 }
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await masterServiceApi.getAll();
            setServices(data);
        } catch (err) {
            toast.error('Failed to fetch services');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setCurrentService(service);
            setFormData({
                name: service.name,
                icon: service.icon,
                basePrice: service.basePrice,
                category: service.category,
                targetAudience: service.targetAudience || 'both',
                description: service.description || '',
                address: service.address || '',
                location: service.location || { lat: 0, lng: 0 }
            });
        } else {
            setCurrentService(null);
            setFormData({
                name: '',
                icon: 'local_laundry_service',
                basePrice: 0,
                category: 'General',
                description: '',
                address: '',
                location: { lat: 0, lng: 0 }
            });
        }
        setIsModalOpen(true);
    };

    const onPlaceSelected = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const newPos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setFormData(prev => ({
                    ...prev,
                    address: place.formatted_address,
                    location: newPos
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentService) {
                await masterServiceApi.update(currentService._id, formData);
                toast.success('Service updated successfully');
            } else {
                await masterServiceApi.create(formData);
                toast.success('Service created successfully');
            }
            fetchServices();
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.message || 'Operation failed');
        }
    };

    const handleViewRates = async (service) => {
        setCurrentService(service);
        setIsLoadingRates(true);
        setIsRatesModalOpen(true);
        try {
            const data = await masterServiceApi.getVendorRates(service._id);
            setVendorRates(data);
        } catch (err) {
            toast.error('Failed to load vendor rates');
        } finally {
            setIsLoadingRates(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this master service?')) return;
        try {
            await masterServiceApi.delete(id);
            toast.success('Service deleted');
            fetchServices();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const categories = ['General', 'Premium', 'Express', 'Industrial'];
    const icons = ['local_laundry_service', 'dry_cleaning', 'iron', 'checkroom', 'eco', 'sanitizer'];

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-body">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-1">Master Services</h1>
                    <p className="text-slate-500 text-sm font-medium">Define global services and base benchmark pricing</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Create New Service
                </button>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <motion.div 
                            layout
                            key={service._id}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(service)}
                                        className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(service._id)}
                                        className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{service.category}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter text-white ${service.targetAudience === 'retail' ? 'bg-indigo-500' : service.targetAudience === 'individual' ? 'bg-amber-500' : 'bg-slate-400'}`}>
                                        {service.targetAudience || 'Both'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black tracking-tight text-slate-900">{service.name}</h3>
                                {service.address && (
                                    <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                                        {service.address}
                                    </p>
                                )}
                                <p className="text-slate-400 text-xs font-medium line-clamp-2">{service.description || 'No description provided.'}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Admin Rate</span>
                                    <span className="text-2xl font-black text-slate-900">₹{service.basePrice}</span>
                                </div>
                                <button 
                                    onClick={() => handleViewRates(service)}
                                    className="px-4 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all"
                                >
                                    View Pricing
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Vendor Rates Modal */}
            <AnimatePresence>
                {isRatesModalOpen && (
                    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setIsRatesModalOpen(false)}
                                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-2xl">{currentService?.icon}</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-slate-900">Vendor Pricing Analysis</h2>
                                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Service: {currentService?.name}</p>
                                </div>
                            </div>

                            {isLoadingRates ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing Market Rates...</p>
                                </div>
                            ) : vendorRates.length === 0 ? (
                                <div className="py-20 text-center space-y-3">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                        <span className="material-symbols-outlined text-[40px]">inventory_2</span>
                                    </div>
                                    <p className="text-slate-400 font-bold text-sm">No vendors offering this service yet.</p>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto pr-4 space-y-4 no-scrollbar">
                                    {vendorRates.map((rate, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <span className="material-symbols-outlined text-xl">storefront</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-800 text-sm">{rate.vendorName}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 tracking-wider whitespace-nowrap">{rate.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8 text-right">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Admin Base</span>
                                                    <span className="font-bold text-slate-500 line-through text-xs">₹{rate.adminRate}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Vendor Rate</span>
                                                    <span className="text-xl font-black text-slate-900 leading-none">₹{rate.vendorRate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Market Rate Intelligence System</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-8">
                                {currentService ? 'Edit Master Service' : 'New Master Service'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Name</label>
                                        <input 
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            placeholder="e.g. Wash & Steam Iron"
                                        />
                                    </div>

                                    {/* Google Maps Autocomplete */}
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Area / Hub Address</label>
                                        {isLoaded ? (
                                            <Autocomplete
                                                onLoad={(ref) => (autocompleteRef.current = ref)}
                                                onPlaceChanged={onPlaceSelected}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Enter hub or service area address..."
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </Autocomplete>
                                        ) : (
                                            <div className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl animate-pulse text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Loading Maps Engine...
                                            </div>
                                        )}
                                        <div className="flex gap-4 px-2">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-300 uppercase">Latitude</span>
                                                <span className="text-[10px] font-bold text-primary">{formData.location.lat.toFixed(6)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-300 uppercase">Longitude</span>
                                                <span className="text-[10px] font-bold text-primary">{formData.location.lng.toFixed(6)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Base Rate</label>
                                        <input 
                                            required
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800"
                                            value={formData.basePrice}
                                            onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                                            placeholder="50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800 appearance-none"
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Audience (Individual / Retail)</label>
                                        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                                            {['individual', 'retail', 'both'].map(target => (
                                                <button
                                                    key={target}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, targetAudience: target})}
                                                    className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${formData.targetAudience === target ? 'bg-white text-primary shadow-md' : 'text-slate-400 opacity-60 hover:opacity-100'}`}
                                                >
                                                    {target}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon Representation</label>
                                        <div className="flex flex-wrap gap-2">
                                            {icons.map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, icon})}
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${formData.icon === icon ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    <span className="material-symbols-outlined">{icon}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea 
                                            rows="3"
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800 resize-none text-sm"
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="A brief explanation of the service scope..."
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                                >
                                    {currentService ? 'Save Changes' : 'Create Service'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MasterServiceManagement;
