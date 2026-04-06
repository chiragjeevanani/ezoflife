import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [loginPhone, setLoginPhone] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [otpChannel, setOtpChannel] = useState('WhatsApp'); // 'WhatsApp' or 'SMS'
  const [agreedToTnC, setAgreedToTnC] = useState(false);

  const isLoginValid = loginPhone.length === 10 && /^\d+$/.test(loginPhone);
  const isSignupValid = signupPhone.length === 10 && /^\d+$/.test(signupPhone) && agreedToTnC;

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  }), []);

  const authTabs = useMemo(() => [
    { key: true, label: 'Login' },
    { key: false, label: 'Signup' }
  ], []);

  const otpChannels = useMemo(() => [
    { id: 'WhatsApp', icon: 'chat', color: 'text-green-600' },
    { id: 'SMS', icon: 'sms', color: 'text-primary' }
  ], []);

  return (
    <div className="bg-background font-body text-on-background min-h-[100dvh] flex flex-col overflow-x-hidden">
      {/* Hero Visual Section */}
      <div className="relative h-[25dvh] min-h-[220px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-container/30 rounded-full blur-[80px]"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-tertiary-container/20 rounded-full blur-[100px]"></div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center px-8"
        >
          <h1 className="font-headline font-black text-[2.5rem] md:text-[3.5rem] text-primary leading-none tracking-tight mb-2">Ez of life</h1>
          <p className="font-label text-on-surface-variant uppercase tracking-[0.2em] text-[10px] font-bold">The Pristine Flow</p>
        </motion.div>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Auth Container */}
      <main className="flex-grow px-6 -mt-6 relative z-20 pb-12">
        <div className="max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-10 mb-8">
            {authTabs.map(({ key, label }) => (
              <button 
                key={label}
                onClick={() => setIsLogin(key)}
                className="relative py-2 focus:outline-none"
              >
                <span className={`font-headline text-xl font-black transition-colors duration-300 ${isLogin === key ? 'text-on-background' : 'text-outline-variant hover:text-outline'}`}>
                  {label}
                </span>
                {isLogin === key && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-1.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Auth Card with AnimatePresence for content switching */}
          <motion.div 
            className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_40px_60px_rgba(47,50,58,0.08)] border border-outline-variant/5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {isLogin ? (
                  <div className="login-content">
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="font-headline text-2xl font-black mb-1.5 text-on-surface tracking-tighter">Welcome Back</h2>
                      <p className="text-on-surface-variant text-sm font-semibold opacity-70">
                        Log in to your account with your phone number.
                      </p>
                    </motion.div>

                    <div className="space-y-6">
                      {/* OTP Channel Selector */}
                      <motion.div variants={itemVariants} className="flex bg-surface-container-low p-1 rounded-2xl border border-slate-300">
                        {otpChannels.map(channel => (
                          <button 
                            key={channel.id}
                            onClick={() => setOtpChannel(channel.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${otpChannel === channel.id ? `bg-white shadow-sm ${channel.color}` : 'text-on-surface-variant opacity-40'}`}
                          >
                            <span className="material-symbols-outlined text-sm">{channel.icon}</span>
                            {channel.id}
                          </button>
                        ))}
                      </motion.div>
                      <motion.div variants={itemVariants} className="relative group">
                        <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2.5 ml-1">Phone Number</label>
                        <div className={`flex items-center bg-surface-container-low rounded-2xl p-1 border border-slate-300 transition-all focus-within:bg-white focus-within:ring-2 ${loginPhone.length > 0 && !isLoginValid ? 'focus-within:ring-error/20 ring-error/10' : 'focus-within:ring-primary/20'}`}>
                          <div className="px-4 font-black text-on-surface text-sm">+91</div>
                          <input 
                            className="w-full bg-transparent border-none focus:ring-0 py-4 px-2 text-on-surface font-black placeholder:text-on-surface/30 placeholder:font-medium" 
                            placeholder="000 000 0000" 
                            type="tel"
                            maxLength={10}
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                        {loginPhone.length > 0 && !isLoginValid && (
                            <p className="text-[9px] text-error font-bold mt-2 ml-1 animate-pulse">Enter a valid 10-digit number</p>
                        )}
                      </motion.div>

                      <motion.button 
                        variants={itemVariants}
                        whileTap={isLoginValid ? { scale: 0.98 } : {}}
                        onClick={() => isLoginValid && navigate('/user/otp')}
                        disabled={!isLoginValid}
                        className={`w-full font-headline font-black py-5 rounded-2xl shadow-xl tracking-widest uppercase text-xs transition-all duration-300 ${isLoginValid ? 'bg-primary-gradient text-on-primary shadow-primary/20' : 'bg-surface-container-high text-outline-variant cursor-not-allowed opacity-50'}`}
                      >
                        Send Code
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="signup-content">
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="font-headline text-2xl font-black mb-1.5 text-on-surface tracking-tighter">Create Account</h2>
                      <p className="text-on-surface-variant text-sm font-semibold opacity-70">
                        Start your journey to pristine fabrics today.
                      </p>
                    </motion.div>

                    <div className="space-y-4">
                      {/* OTP Channel Selector */}
                      <motion.div variants={itemVariants} className="flex bg-surface-container-low p-1 rounded-2xl border border-slate-300 mb-2">
                        {otpChannels.map(channel => (
                          <button 
                            key={channel.id}
                            onClick={() => setOtpChannel(channel.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${otpChannel === channel.id ? `bg-white shadow-sm ${channel.color}` : 'text-on-surface-variant opacity-40'}`}
                          >
                            <span className="material-symbols-outlined text-sm">{channel.icon}</span>
                            {channel.id}
                          </button>
                        ))}
                      </motion.div>
 
                      <motion.div variants={itemVariants}>
                        <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2.5 ml-1">Phone Number</label>
                        <div className={`flex items-center bg-surface-container-low rounded-2xl p-1 border border-slate-300 focus-within:bg-white focus-within:ring-2 ${signupPhone.length > 0 && signupPhone.length !== 10 ? 'focus-within:ring-error/20 ring-error/10' : 'focus-within:ring-primary/20'}`}>
                          <div className="px-4 font-black text-on-surface text-sm">+91</div>
                          <input 
                            className="w-full bg-transparent border-none focus:ring-0 py-4 px-2 text-on-surface font-black placeholder:text-on-surface/30 placeholder:font-medium" 
                            placeholder="000 000 0000" 
                            type="tel" 
                            maxLength={10}
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                        {signupPhone.length > 0 && signupPhone.length !== 10 && (
                            <p className="text-[9px] text-error font-bold mt-2 ml-1">Enter a valid 10-digit number</p>
                        )}
                      </motion.div>

                      {/* T&C Checkbox */}
                      <motion.div variants={itemVariants} className="flex items-start gap-3 px-1 py-1">
                        <button 
                          onClick={() => setAgreedToTnC(!agreedToTnC)}
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all border ${agreedToTnC ? 'bg-primary border-primary text-white' : 'bg-surface-container-low border-outline-variant/20'}`}
                        >
                          {agreedToTnC && <span className="material-symbols-outlined text-[14px]">check</span>}
                        </button>
                        <p className="text-[10px] font-bold text-on-surface-variant leading-relaxed">
                          I agree to the <span className="text-primary underline cursor-pointer">Terms & Conditions</span> and provide consent to receive updates.
                        </p>
                      </motion.div>

                      <motion.button 
                        variants={itemVariants}
                        whileTap={isSignupValid ? { scale: 0.98 } : {}}
                        onClick={() => isSignupValid && navigate('/user/otp')}
                        disabled={!isSignupValid}
                        className={`w-full font-headline font-black py-5 rounded-2xl shadow-xl tracking-widest uppercase text-xs mt-4 transition-all duration-300 ${isSignupValid ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-primary/20' : 'bg-surface-container-high text-outline-variant cursor-not-allowed opacity-50'}`}
                      >
                        Create Account
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Footer micro-copy */}
          <motion.p className="mt-10 text-center text-[11px] text-on-surface-variant font-semibold tracking-wide px-4 opacity-50 underline underline-offset-4 cursor-pointer">
            Trouble logging in? Get support from Ez of life Team
          </motion.p>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed bottom-12 right-12 w-16 h-16 bg-primary-container/20 rounded-full blur-xl pointer-events-none"></div>
      <div className="fixed top-1/2 -left-8 w-24 h-24 bg-tertiary-container/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};

export default AuthPage;

