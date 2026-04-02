import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserHeader from '../components/UserHeader';
import BottomNav from '../components/BottomNav';

const MoreMenuPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  const MenuSection = ({ title, children, icon }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 px-2 mb-4 text-on-background">
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
        <h4 className="font-headline font-black text-[9px] uppercase tracking-[0.3em]">{title}</h4>
      </div>
      <div className="bg-white rounded-[2rem] border border-black/5 divide-y divide-black/5 overflow-hidden shadow-sm shadow-primary/5">
        {children}
      </div>
    </div>
  );

  const MenuItem = ({ icon, title, desc, onClick, color = "primary", rightIcon = "chevron_right", isError = false }) => (
    <motion.button 
      variants={itemVariants}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
      whileTap={{ scale: 0.995 }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 text-left group transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isError ? 'bg-error/10 text-error' : `bg-${color}/5 text-${color}`} transition-colors`}>
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <div>
          <span className={`block font-black text-sm tracking-tight leading-none mb-1 ${isError ? 'text-error' : 'text-on-surface'}`}>{title}</span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">{desc}</span>
        </div>
      </div>
      <span className={`material-symbols-outlined text-lg transition-transform group-hover:translate-x-1 ${isError ? 'text-error' : 'text-primary'}`}>
        {rightIcon}
      </span>
    </motion.button>
  );

  return (
    <div className="bg-background text-on-surface min-h-[100dvh] flex flex-col">
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
          <MenuSection title="Operational Support" icon="account_tree">
            <MenuItem 
              icon="help_center" 
              title="Help Center" 
              desc="Guides & Tutorials" 
              onClick={() => navigate('/user/support')}
            />
            <MenuItem 
              icon="quiz" 
              title="FAQs" 
              desc="Instant Answers" 
              onClick={() => navigate('/user/support')}
            />
            <MenuItem 
              icon="rate_review" 
              title="Drop Feedback" 
              desc="Improve the experience" 
              onClick={() => {}}
            />
          </MenuSection>

          <MenuSection title="Ecosystem" icon="lan">
            <MenuItem 
              icon="storefront" 
              title="Partner with us" 
              desc="Register as Vendor" 
              color="primary"
              onClick={() => navigate('/vendor/auth')}
            />
            <MenuItem 
              icon="work" 
              title="Careers" 
              desc="Join the team" 
              color="tertiary"
              onClick={() => navigate('/user/careers')}
            />
          </MenuSection>

          <MenuSection title="Legal & Safety" icon="shield">
            <MenuItem 
              icon="gavel" 
              title="Terms of Service" 
              desc="Rules of Engagement" 
              rightIcon="open_in_new"
              onClick={() => navigate('/user/privacy')}
            />
            <MenuItem 
              icon="verified_user" 
              title="Privacy Policy" 
              desc="Data Protection Protocol" 
              rightIcon="open_in_new"
              onClick={() => navigate('/user/privacy')}
            />
          </MenuSection>

          <MenuSection title="Critical Actions" icon="dangerous">
            <MenuItem 
              icon="logout" 
              title="Terminate Session" 
              desc="Sign out of local instance" 
              isError={true}
              onClick={() => navigate('/user/auth')}
            />
          </MenuSection>

          <footer className="mt-12 px-4 text-center text-on-background">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Ez of Life Operations Control</p>
            <p className="text-[9px] font-bold uppercase tracking-widest italic">v.2.4.0-Enterprise • Operational Core 2026</p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
};

export default MoreMenuPage;
