import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DocumentUpload = () => {
    const navigate = useNavigate();

    const uploadRequirements = useMemo(() => [
        { id: 'id', title: "Government ID", desc: "Driver's License, Aadhaar, or Passport", icon: "id_card", delay: 0.2 },
        { id: 'biz', title: "Business proof", desc: "GST Registration, Trade License, or Lease", icon: "description", delay: 0.3 }
    ], []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface font-body text-on-surface min-h-screen"
        >
            {/* TopAppBar */}
            <motion.header 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-surface/70 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4"
            >
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-surface-container-low transition-colors duration-300 rounded-full cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-on-surface">arrow_back</span>
                    </motion.button>
                    <h1 className="font-headline font-bold text-headline-sm tracking-tight text-on-surface">Registration</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/10 shadow-inner">
                        <span className="material-symbols-outlined text-primary font-bold">description</span>
                    </div>
                </div>
            </motion.header>

            <motion.main 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="max-w-4xl mx-auto px-6 pt-12 pb-32"
            >
                {/* Progress Stepper (Step 2 Active) */}
                <div className="mb-12 flex items-center justify-between">
                    <div className="flex-1 opacity-60">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                                <p className="text-label-md uppercase tracking-widest font-bold text-on-surface-variant">Step 1</p>
                                <h2 className="font-headline font-bold text-headline-sm tracking-tight opacity-50">Shop Details</h2>
                            </div>
                        </div>
                    </div>
                    <div className="w-24 h-1.5 bg-surface-container-low rounded-full mx-4 overflow-hidden">
                        <motion.div 
                            initial={{ width: '40%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full vendor-gradient rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 vendor-gradient text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary/20 scale-110">2</div>
                            <div>
                                <p className="text-label-md uppercase tracking-widest font-bold text-primary">Step 2</p>
                                <h2 className="font-headline font-bold text-headline-sm tracking-tight">Documents</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Cards Section */}
                <div className="space-y-12">
                     <p className="text-body-lg text-on-surface-variant font-medium max-w-lg leading-relaxed mb-4">
                        Please upload clear, legible photos of your business certifications and personal identification for verification.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {uploadRequirements.map(req => (
                            <UploadCard 
                                key={req.id}
                                title={req.title} 
                                desc={req.desc} 
                                icon={req.icon} 
                                delay={req.delay}
                            />
                        ))}
                    </div>

                    <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 flex items-start gap-6 relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 transition-transform duration-700 group-hover:scale-110">
                            <span className="material-symbols-outlined text-[120px]">verified_user</span>
                        </div>
                        <div className="p-4 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[28px] font-bold">verified</span>
                        </div>
                        <div className="relative z-10 flex-1">
                            <h3 className="font-headline text-xl font-extrabold text-on-surface mb-2 tracking-tight">Security & Privacy</h3>
                            <p className="text-sm font-medium text-on-surface-variant leading-relaxed font-body">
                                Your documents are processed through our encrypted private vault and are only visible to the verification team.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Action Section */}
                <div className="mt-20 flex flex-col items-center gap-8">
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/vendor/approval-pending')}
                        className="w-full md:w-[450px] py-6 vendor-gradient text-on-primary font-headline text-xl font-bold rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                    >
                        Submit Application
                        <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                    </motion.button>
                    
                    <div className="flex items-center gap-4 text-on-surface-variant opacity-40 font-bold text-label-md uppercase tracking-widest scale-90">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        End-to-end Encrypted
                    </div>
                </div>
            </motion.main>
        </motion.div>
    );
};

const UploadCard = ({ title, desc, icon, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -8, shadow: "0 25px 35px -12px rgb(0 0 0 / 0.15)" }}
        className="bg-surface-container-low p-10 rounded-2xl border-2 border-dashed border-outline-variant/30 hover:border-primary/40 hover:bg-white transition-all flex flex-col items-center text-center group cursor-pointer"
    >
        <div className="w-20 h-20 vendor-gradient rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-primary/20 rotate-12 transition-transform duration-500 group-hover:rotate-0">
            <span className="material-symbols-outlined text-[36px] font-bold">{icon}</span>
        </div>
        <h3 className="font-headline text-xl font-bold text-on-surface mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-[180px] mb-8">{desc}</p>
        
        <div className="w-full h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/10 text-primary font-extrabold text-sm uppercase tracking-widest gap-2 group-hover:bg-primary-container/20 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            Choose File
        </div>
    </motion.div>
);

export default DocumentUpload;
