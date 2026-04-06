import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AddressesPage = () => {
  const navigate = useNavigate();
  
  const initialAddresses = useMemo(() => [
    { id: 1, type: 'Home', address: '249 Editorial Ave, Suite 4B, Pristine Heights, NY 10012', isDefault: true },
    { id: 2, type: 'Office', address: '88 Creative Plaza, 12th Floor, Metro Central, NY 10001', isDefault: false }
  ], []);

  const addressTypes = useMemo(() => ['Home', 'Office', 'Other'], []);

  const [addresses, setAddresses] = useState(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newType, setNewType] = useState('Home');
  const [formData, setFormData] = useState({
    line1: '',
    line2: '',
    floor: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = () => {
    if (!formData.line1.trim() || !formData.pincode.trim()) return;

    const fullAddressString = `${formData.line1}${formData.line2 ? `, ${formData.line2}` : ''}${formData.floor ? `, Floor ${formData.floor}` : ''}${formData.landmark ? ` (Near ${formData.landmark})` : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, type: newType, address: fullAddressString, raw: formData } 
          : addr
      ));
    } else {
      const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
      setAddresses([...addresses, { 
        id: newId, 
        type: newType, 
        address: fullAddressString, 
        raw: formData,
        isDefault: addresses.length === 0 
      }]);
    }
    closeModal();
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setNewType('Home');
    setFormData({ line1: '', line2: '', floor: '', landmark: '', pincode: '', city: '', state: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setNewType(addr.type);
    setFormData(addr.raw || { line1: addr.address, line2: '', floor: '', landmark: '', pincode: '', city: '', state: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-on-background min-h-[100dvh] pb-32 overflow-x-hidden"
    >
      <main className="max-w-2xl mx-auto px-6 pt-6 font-body">
        <motion.header 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate('/user/profile')}
            className="flex items-center gap-2 text-on-surface font-black text-[10px] uppercase tracking-widest mb-4 opacity-50 hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black text-on-background leading-none tracking-tighter">
              Saved <span className="text-on-surface tracking-tighter italic">Locales.</span>
            </h1>
            <motion.button 
              onClick={openAddModal}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30"
            >
              <span className="material-symbols-outlined text-3xl">add</span>
            </motion.button>
          </div>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {addresses.map((addr) => (
              <motion.div 
                key={addr.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white p-6 rounded-[2.5rem] border transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm ${
                  addr.isDefault ? 'border-primary/20 shadow-xl shadow-primary/5' : 'border-black/5'
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${addr.isDefault ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {addr.type === 'Home' ? 'home' : addr.type === 'Office' ? 'work' : 'location_on'}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-xl text-on-surface tracking-tight leading-none mb-1">{addr.type}</p>
                      {addr.isDefault && <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] opacity-60">Primary</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEditModal(addr)}
                      className="w-10 h-10 flex items-center justify-center text-on-surface/20 hover:text-primary transition-colors bg-slate-50 rounded-xl"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </motion.button>
                    {!addr.isDefault && (
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteAddress(addr.id)}
                        className="w-10 h-10 flex items-center justify-center text-on-surface/20 hover:text-error transition-colors bg-slate-50 rounded-xl"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="mt-4 relative z-10">
                  <p className="text-sm font-bold text-on-surface-variant opacity-60 leading-tight max-w-[90%] line-clamp-2">
                    {addr.address}
                  </p>
                </div>

                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {addresses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 flex flex-col items-center text-center opacity-30"
          >
            <span className="material-symbols-outlined text-7xl mb-4">wrong_location</span>
            <p className="font-black text-[10px] uppercase tracking-widest">No Locales Saved</p>
          </motion.div>
        )}
      </main>

      {/* Structured Address Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none md:items-center md:px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-lg rounded-t-[3rem] p-8 pb-10 relative z-10 shadow-2xl pointer-events-auto md:rounded-[3rem] h-[90dvh] overflow-y-auto hide-scrollbar"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 md:hidden" />
              
              <h3 className="text-4xl font-black tracking-tighter italic uppercase leading-none mb-2">
                {editingAddress ? 'Modify' : 'Locate'} <br/>
                <span className="text-primary tracking-tighter">Address.</span>
              </h3>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40 mb-10 text-center md:text-left">Details for accurate delivery</p>
              
              <div className="space-y-6">
                <div className="flex gap-3">
                  {addressTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setNewType(type)}
                      className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        newType === type ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-50 text-slate-400 border border-black/5'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <AddressInput label="Address Line 1" placeholder="Flat/House No, Building Name" value={formData.line1} onChange={(v) => handleInputChange('line1', v)} />
                  <AddressInput label="Address Line 2" placeholder="Street, Area Name" value={formData.line2} onChange={(v) => handleInputChange('line2', v)} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <AddressInput label="Floor / Apt" placeholder="e.g. 4th Floor" value={formData.floor} onChange={(v) => handleInputChange('floor', v)} />
                    <AddressInput label="Landmark" placeholder="Near Temple/Gym" value={formData.landmark} onChange={(v) => handleInputChange('landmark', v)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <AddressInput label="Pincode" placeholder="6-digit ZIP" type="number" value={formData.pincode} onChange={(v) => handleInputChange('pincode', v)} />
                    <AddressInput label="City" placeholder="City Name" value={formData.city} onChange={(v) => handleInputChange('city', v)} />
                  </div>

                  <AddressInput label="State" placeholder="State Name" value={formData.state} onChange={(v) => handleInputChange('state', v)} />
                </div>

                <button 
                  onClick={handleSaveAddress}
                  className="w-full py-6 bg-primary text-on-primary rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 mt-4 active:scale-95 transition-transform"
                >
                  {editingAddress ? 'Continue Updates' : 'Secure Location'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AddressInput = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div className="space-y-1.5 px-1">
    <p className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">{label}</p>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
    />
  </div>
);

export default AddressesPage;

