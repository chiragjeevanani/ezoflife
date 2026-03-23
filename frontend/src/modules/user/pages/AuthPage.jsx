import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [loginPhone, setLoginPhone] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  const isLoginValid = loginPhone.length === 10 && /^\d+$/.test(loginPhone);
  const isSignupValid = signupName.length >= 3 && signupPhone.length === 10 && /^\d+$/.test(signupPhone);

  const containerVariants = {
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
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

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
            <button 
              onClick={() => setIsLogin(true)}
              className="relative py-2 focus:outline-none"
            >
              <span className={`font-headline text-xl font-black transition-colors duration-300 ${isLogin ? 'text-on-background' : 'text-outline-variant hover:text-outline'}`}>
                Login
              </span>
              {isLogin && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-1.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className="relative py-2 focus:outline-none"
            >
              <span className={`font-headline text-xl font-black transition-colors duration-300 ${!isLogin ? 'text-on-background' : 'text-outline-variant hover:text-outline'}`}>
                Signup
              </span>
              {!isLogin && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-1.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
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
                      <motion.div variants={itemVariants} className="relative group">
                        <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2.5 ml-1">Phone Number</label>
                        <div className={`flex items-center bg-surface-container-low rounded-2xl p-1 transition-all focus-within:bg-white focus-within:ring-2 ${loginPhone.length > 0 && !isLoginValid ? 'focus-within:ring-error/20 ring-error/10 ring-1' : 'focus-within:ring-primary/20'}`}>
                          <div className="px-4 font-black text-on-surface text-sm">+91</div>
                          <input 
                            className="w-full bg-transparent border-none focus:ring-0 py-4 px-2 text-on-surface font-black placeholder:text-outline-variant" 
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
                      <motion.div variants={itemVariants}>
                        <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2.5 ml-1">Full Name</label>
                        <input 
                            className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 px-5 text-on-surface font-black placeholder:text-outline-variant" 
                            placeholder="John Doe" 
                            type="text" 
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                        />
                        {signupName.length > 0 && signupName.length < 3 && (
                            <p className="text-[9px] text-error font-bold mt-2 ml-1">Name must be at least 3 characters</p>
                        )}
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label className="block font-label text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2.5 ml-1">Phone Number</label>
                        <div className={`flex items-center bg-surface-container-low rounded-2xl p-1 border border-transparent focus-within:bg-white focus-within:ring-2 ${signupPhone.length > 0 && signupPhone.length !== 10 ? 'focus-within:ring-error/20 ring-error/10 ring-1' : 'focus-within:ring-primary/20'}`}>
                          <div className="px-4 font-black text-on-surface text-sm">+91</div>
                          <input 
                            className="w-full bg-transparent border-none focus:ring-0 py-4 px-2 text-on-surface font-black" 
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

                {/* Shared Social Options */}
                <motion.div variants={itemVariants} className="mt-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-grow bg-outline-variant/15"></div>
                    <span className="font-label text-[10px] text-outline-variant font-black uppercase tracking-widest shrink-0 opacity-60">Authentication</span>
                    <div className="h-[1px] flex-grow bg-outline-variant/15"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2.5 py-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all active:scale-95">
                      <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7j5MlFmc8BxUbSQFq-aydxt-ISYovUwP9-xoBOjbre67puPbnocH5_VXn1ui6DbLaiImyfMARsutY9rX6rsAytDK4a6Zbfw0DeftbtrvzQbtXnnV-eiVbPfZBAsP6tBj4dcY2j9uXprshQf8xl5qLFK1IV0ufIObHAZytkuJkMh6iCS2jROnKz5fzah8olFb2SXTl57T9I-09ghlvUfZbut8OjlF90VC4WjNldWDdy2JmCKvYYWzwCvfIUXLnymXlRlpMphgkvmA" />
                      <span className="font-black text-[11px] tracking-widest uppercase focus:outline-none">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2.5 py-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all active:scale-95">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>ios</span>
                      <span className="font-black text-[11px] tracking-widest uppercase focus:outline-none">Apple</span>
                    </button>
                  </div>
                </motion.div>
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
