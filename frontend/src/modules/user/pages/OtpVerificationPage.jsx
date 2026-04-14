import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../../../lib/api';

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, channel } = location.state || { phone: '98765 43210', channel: 'SMS' };
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    if (otp.every(digit => digit !== '')) {
      setError('');
      try {
        const fullOtp = otp.join('');
        const response = await authApi.verifyOtp(phone, fullOtp);
        
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user_auth_token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('userId', response.user._id || response.user.id);
          navigate('/user/profile/create');
        } else {
          setError(response.message || 'Invalid OTP');
        }
      } catch (err) {
        setError('Verification failed. Try again.');
      }
    }
  };

  const isOtpComplete = useMemo(() => otp.every(digit => digit !== ''), [otp]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }), []);

  const cardVariants = useMemo(() => ({
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } }
  }), []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-background text-on-background min-h-[100dvh] flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-20 right-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-[-10%] w-80 h-80 bg-tertiary/5 rounded-full blur-[80px]" />
      </div>

      <motion.main 
        variants={cardVariants}
        className="max-w-md w-full bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(47,50,58,0.1)] border border-outline-variant/10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-container/30 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-on-surface mb-3 leading-tight">Verification Code</h1>
          <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest leading-none">We've sent a 6-digit code to</p>
          <p className="text-sm font-black text-primary mt-2 tracking-tight">+91 {phone}</p>
          {error && <p className="text-[10px] text-error font-bold mt-3 animate-pulse">{error}</p>}
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 md:gap-3 mb-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-14 md:w-14 md:h-16 bg-surface-container-low border-2 border-slate-200 rounded-xl text-center text-2xl font-black text-on-surface focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-sm"
            />
          ))}
        </div>

        {/* Resend Logic */}
        <div className="text-center mb-10">
          {timer > 0 ? (
            <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">
              Resend code in <span className="text-primary font-black ml-1">{timer}s</span>
            </p>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => setTimer(30)}
              className="text-xs font-black text-primary uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              Resend Code Now
            </motion.button>
          )}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerify}
          disabled={!isOtpComplete}
          className={`w-full py-5.5 rounded-2xl font-headline font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 ${
            !isOtpComplete 
            ? 'bg-outline-variant/20 text-on-surface-variant/40 shadow-none cursor-not-allowed' 
            : 'bg-primary-gradient text-on-primary shadow-primary/30'
          }`}
        >
          Verify & Continue
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </motion.button>

        <button 
          onClick={() => navigate('/user/auth')}
          className="w-full mt-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
        >
          Change Phone Number
        </button>
      </motion.main>

      {/* Floating Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="fixed top-1/2 right-[5%] w-12 h-12 bg-primary/10 rounded-full blur-xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed bottom-[15%] left-[5%] w-16 h-16 bg-tertiary/10 rounded-full blur-xl pointer-events-none"
      />
    </motion.div>
  );
};

export default OtpVerificationPage;

