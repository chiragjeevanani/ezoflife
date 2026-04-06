import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MoreMenuPage = () => {
  const navigate = useNavigate();

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.05 
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  }), []);

  const userRole = useMemo(() => localStorage.getItem('userRole') || 'customer', []);
  const isVendor = useMemo(() => userRole === 'vendor', [userRole]);

  const menuSections = useMemo(() => [
    {
      title: "Operational Support",
      icon: "account_tree",
      items: [
        { icon: "account_balance_wallet", title: "My Wallet", desc: "Credits & History", path: "/user/profile/wallet" },
        { icon: "help_center", title: "Help Center", desc: "Guides & Tutorials", path: "/user/support" },
        { icon: "quiz", title: "FAQs", desc: "Instant Answers", path: "/user/faq" },
        { icon: "rate_review", title: "Drop Feedback", desc: "Improve the experience", path: "/user/review" }
      ]
    },
    {
      title: "Ecosystem",
      icon: "lan",
      items: [
        { icon: "handshake", title: "Partner with us", desc: "Logistics & Supplies", path: "/user/partnerships" },
        { icon: "campaign", title: "Advertise", desc: "Digital Media Kit", path: "/user/advertise" },
        isVendor ? 
          { icon: "dashboard_customize", title: "Vendor Dashboard", desc: "Manage your Shop Operations", path: "/vendor/dashboard", color: "secondary" } :
          { icon: "storefront", title: "Become a Vendor", desc: "Onboard Physical Shop", path: "/user/become-vendor" },
        { icon: "work", title: "Careers", desc: "Join the team", path: "/user/careers", color: "tertiary" }
      ]
    },
    {
      title: "Legal & Safety",
      icon: "shield",
      items: [
        { icon: "gavel", title: "Terms of Service", desc: "Rules of Engagement", path: "/user/terms", rightIcon: "open_in_new" },
        { icon: "verified_user", title: "Privacy Policy", desc: "Data Protection Protocol", path: "/user/privacy", rightIcon: "open_in_new" }
      ]
    }
  ], [isVendor]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('user_auth_token');
    navigate('/user/auth');
  };

  return (
    <div className="bg-background text-on-surface min-h-[100dvh] flex flex-col font-body">
      <main className="pt-24 pb-44 px-6 max-w-2xl mx-auto w-full">
        <motion.header 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 px-2"
        >
          <span className="text-[10px] font-black text-on-background uppercase tracking-[0.3em] block mb-2">Management Terminal</span>
          <h1 className="font-headline font-black text-4xl tracking-tighter leading-none italic">More Options</h1>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="mb-8">
              <div className="flex items-center gap-2 px-2 mb-4 text-on-background">
                <span className="material-symbols-outlined text-[14px]">{section.icon}</span>
                <h4 className="font-headline font-black text-[9px] uppercase tracking-[0.3em]">{section.title}</h4>
              </div>
              <div className="bg-white rounded-[2rem] border border-black/5 divide-y divide-black/5 overflow-hidden shadow-sm shadow-primary/5">
                {section.items.map((item, iIdx) => (
                  <motion.button 
                    key={iIdx}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between p-5 text-left group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${item.color || 'primary'}/5 text-${item.color || 'primary'} transition-colors`}>
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      </div>
                      <div>
                        <span className="block font-black text-sm tracking-tight leading-none mb-1 text-on-surface">{item.title}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">{item.desc}</span>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-lg transition-transform group-hover:translate-x-1 text-primary`}>
                      {item.rightIcon || "chevron_right"}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-8">
            <div className="flex items-center gap-2 px-2 mb-4 text-on-background">
              <span className="material-symbols-outlined text-[14px]">dangerous</span>
              <h4 className="font-headline font-black text-[9px] uppercase tracking-[0.3em]">Critical Actions</h4>
            </div>
            <div className="bg-white rounded-[2rem] border border-black/5 divide-y divide-black/5 overflow-hidden shadow-sm shadow-primary/5">
              <motion.button 
                variants={itemVariants}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
                whileTap={{ scale: 0.995 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-5 text-left group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-error/10 text-error transition-colors">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span>
                  </div>
                  <div>
                    <span className="block font-black text-sm tracking-tight leading-none mb-1 text-error">Terminate Session</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Sign out of local instance</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1 text-error">logout</span>
              </motion.button>
            </div>
          </div>

          <footer className="mt-12 px-4 text-center text-on-background">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Spinzyt Operations Control</p>
            <p className="text-[9px] font-bold uppercase tracking-widest italic">v.2.4.0-Enterprise • Operational Core 2026</p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
};

export default MoreMenuPage;

