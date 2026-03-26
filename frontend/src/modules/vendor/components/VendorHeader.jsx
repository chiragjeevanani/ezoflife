import React from 'react';
import { useNavigate } from 'react-router-dom';

const VendorHeader = ({ title = "Ez of Life", showBack = false }) => {
    const navigate = useNavigate();
    return (
        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-slate-100 min-h-[72px]">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#3D5AFE] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                )}
                {!showBack && (
                    <div 
                        onClick={() => navigate('/vendor/profile')}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer border border-slate-200"
                    >
                        <img 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1G7gcHTDKYAyUsrelXEMf2w6RQyBCMwtQmyqi-a7ZPOQcRRYhe1gqMBSPUsXY8Ru16zqZWc8aMj-kve41JSGpk8PBMQSmPvwiBPyQnE-KlBH_j2zy2u_kqX_CmMYKy2-bOYW3G-i3PiCbE759VmmQXpJyL_cmmWYbnIEV-rZR8sjSexO93iameBgS7Rd19y8CQTrD4Ke46jtuCZrbKo6LTv7KtyX4330_FAPFGYdMldUrndR32fDYqOWnPk42gI1Zxydi6FSoas" 
                            alt="Vendor Profile"
                        />
                    </div>
                )}
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-[#3D5AFE] leading-none mb-1">{title}</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Vendor Partner</p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/vendor/notifications')}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#3D5AFE] transition-colors"
            >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
        </header>
    );
};

export default VendorHeader;
