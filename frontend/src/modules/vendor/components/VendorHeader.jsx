import useNotificationStore from '../../../shared/stores/notificationStore';

const VendorHeader = ({ title = "Spinzyt", showBack = false }) => {
    const navigate = useNavigate();
    const notifications = useNotificationStore((state) => state.notifications);
    const unreadCount = notifications.filter(n => n.persona === 'vendor' && !n.read).length;

    return (
        <header className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-outline-variant/10 min-h-[72px]">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                )}
                {!showBack && (
                    <div 
                        onClick={() => navigate('/vendor/profile')}
                        className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden cursor-pointer border border-outline-variant/5"
                    >
                        <img 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1G7gcHTDKYAyUsrelXEMf2w6RQyBCMwtQmyqi-a7ZPOQcRRYhe1gqMBSPUsXY8Ru16zqZWc8aMj-kve41JSGpk8PBMQSmPvwiBPyQnE-KlBH_j2zy2u_kqX_CmMYKy2-bOYW3G-i3PiCbE759VmmQXpJyL_cmmWYbnIEV-rZR8sjSexO93iameBgS7Rd19y8CQTrD4Ke46jtuCZrbKo6LTv7KtyX4330_FAPFGYdMldUrndR32fDYqOWnPk42gI1Zxydi6FSoas" 
                            alt="Vendor Profile"
                        />
                    </div>
                )}
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold tracking-tight text-primary leading-none mb-1">{title}</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Vendor Partner</p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/vendor/notifications')}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-primary transition-colors relative"
            >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>
        </header>
    );
};


export default VendorHeader;
