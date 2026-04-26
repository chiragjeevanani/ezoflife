import React, { useMemo, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../../../lib/api';

const DocumentUpload = () => {
    const navigate = useNavigate();
    const locationState = useLocation();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const registrationData = {
        phone: storedUser.phone || '',
        ...locationState.state
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState({
        id: null,
        biz: null
    });

    const uploadRequirements = useMemo(() => [
        { id: 'gst', title: "GST Document", desc: "GST Registration Certificate", icon: "badge", delay: 0.2 },
        { id: 'msme', title: "MSME Document", desc: "MSME / Udyam Aadhar Certificate", icon: "description", delay: 0.3 }
    ], []);

    const handleFileSelect = (id, file) => {
        if (file) {
            setFiles(prev => ({ ...prev, [id]: file }));
        }
    };

    const handleSubmit = async () => {
        if (!files.gst || !files.msme) {
            return setError('Please upload both required documents');
        }

        setIsSubmitting(true);
        setError('');
        
        try {
            const formData = new FormData();
            formData.append('phone', registrationData.phone);
            formData.append('shopName', registrationData.shopName);
            formData.append('address', registrationData.address);
            formData.append('gst', registrationData.gst || '');
            
            // Complex objects must be stringified for Multipart/FormData
            formData.append('location', JSON.stringify(registrationData.location));
            formData.append('services', JSON.stringify(registrationData.services));
            formData.append('bankDetails', JSON.stringify(registrationData.bankDetails));

            // Append actual file blobs
            formData.append('gstDoc', files.gst);
            formData.append('msmeDoc', files.msme);

            const response = await authApi.completeVendorProfile(formData);

            if (response.message.includes('successfully')) {
                localStorage.setItem(`vendorStatus_${registrationData.phone}`, 'pending');
                navigate('/vendor/approval-pending', { state: { phone: registrationData.phone } });
            } else {
                setError(response.message || 'Submission failed');
            }
        } catch (err) {
            console.error('Final Registration Error:', err);
            setError('Server error during submission');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface font-body text-on-surface min-h-screen"
        >
            {/* TopAppBar */}
            <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Registration</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-white shadow-sm">
                    <span className="material-symbols-outlined text-primary font-bold">description</span>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-12 pb-32">
                {/* Compact Stepper */}
                <div className="flex items-center justify-between px-2 mb-12">
                    <div className="flex items-center gap-3 opacity-40">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">1</div>
                        <span className="text-sm font-medium text-slate-500">Shop Details</span>
                    </div>
                    <div className="flex-1 mx-4 h-[2px] bg-slate-200 relative">
                        <motion.div 
                            initial={{ width: '50%' }}
                            animate={{ width: '100%' }}
                            className="absolute inset-y-0 bg-primary"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">2</div>
                        <span className="text-sm font-bold text-primary">Verification</span>
                    </div>
                </div>

                {/* Upload Cards Section */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-on-surface">Confirm Identity</h2>
                        <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                            Upload clear photos of your business certifications and identity for verification.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {uploadRequirements.map(req => (
                            <UploadCard 
                                key={req.id}
                                title={req.title} 
                                desc={req.desc} 
                                icon={files[req.id] ? "check_circle" : req.icon} 
                                isSelected={!!files[req.id]}
                                onSelect={(file) => handleFileSelect(req.id, file)}
                            />
                        ))}
                    </div>

                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                        <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[24px]">verified</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-on-surface mb-1">Encrypted Vault</h3>
                            <p className="text-[10px] font-medium text-on-surface-variant leading-relaxed">
                                Your documents are processed through our secure vault and are only visible to the verification team.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Action Section */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface/80 backdrop-blur-xl border-t border-slate-100 z-50">
                    <div className="max-w-xl mx-auto space-y-4">
                        {error && <p className="text-center text-rose-500 font-bold text-[10px] uppercase tracking-widest">{error}</p>}
                        
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className={`w-full py-5 rounded-2xl ${isSubmitting ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white shadow-xl shadow-primary/20'} font-black text-lg flex items-center justify-center gap-3 transition-all`}
                        >
                            {isSubmitting ? 'Submitting Application...' : 'Finish Registration'}
                            <span className="material-symbols-outlined text-[20px]">
                                {isSubmitting ? 'sync' : 'arrow_forward'}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

const UploadCard = ({ title, desc, icon, isSelected, onSelect }) => {
    const fileInputRef = useRef(null);

    return (
        <div 
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${isSelected ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5' : 'bg-white border-slate-100 text-on-surface-variant hover:border-primary/30'}`}
        >
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => onSelect(e.target.files[0])}
            />
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isSelected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
                <span className="material-symbols-outlined text-[32px]">{icon}</span>
            </div>
            <div>
                <h3 className="text-lg font-bold tracking-tight mb-1">{title}</h3>
                <p className="text-[11px] font-medium opacity-60 leading-relaxed max-w-[150px] mx-auto">{desc}</p>
            </div>
            {isSelected && (
                <div className="px-4 py-1.5 bg-primary/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                    File Selected
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
