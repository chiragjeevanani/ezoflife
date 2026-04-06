import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserHeader from '../components/UserHeader';

const WalletPage = () => {
    const navigate = useNavigate();

    const transactions = useMemo(() => [
        { id: 'ORD-8821', type: 'Refund', amount: 450, date: 'Mar 28', status: 'Credited' },
        { id: 'ORD-8712', type: 'Payment', amount: -1280, date: 'Mar 24', status: 'Debited' },
        { id: 'TOP-0021', type: 'Top-up', amount: 2000, date: 'Mar 20', status: 'Success' }
    ], []);

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

    return (
        <div className="bg-background text-on-surface min-h-screen pb-32 font-body">
            <UserHeader title="Spinzyt Wallet" showBack={true} onBack={() => navigate(-1)} />
            
            <motion.main 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-xl mx-auto px-6 pt-10 space-y-10"
            >
                {/* Balance Display */}
                <motion.section variants={itemVariants} className="relative">
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">Available Credits</p>
                        <h2 className="text-5xl font-black tracking-tighter tabular-nums mb-10">
                            ₹1,570
                        </h2>
                        
                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-primary text-on-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                Add Money
                            </button>
                            <button className="flex-1 py-4 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
                                Redeem Code
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Transaction History */}
                <motion.section variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/40">Transaction History</h3>
                        <span className="material-symbols-outlined text-on-surface/20">tune</span>
                    </div>

                    <div className="space-y-3">
                        {transactions.map((tx, i) => (
                            <motion.div 
                                variants={itemVariants}
                                key={tx.id} 
                                className="bg-white p-5 rounded-3xl border border-black/5 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-[20px]">
                                            {tx.type === 'Refund' ? 'undo' : tx.type === 'Top-up' ? 'account_balance_wallet' : 'shopping_bag'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-on-surface tracking-tight leading-none mb-1">{tx.type}</h4>
                                        <p className="text-[10px] text-on-surface/30 font-bold uppercase tracking-widest">{tx.date} · {tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-base font-black tracking-tighter tabular-nums ${tx.amount > 0 ? 'text-green-600' : 'text-on-surface'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-on-surface/20 mt-1">{tx.status}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Referral Promo */}
                <motion.section variants={itemVariants} className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-3xl text-primary mb-4">celebration</span>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-2">Refer a Friend</h3>
                    <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest leading-relaxed mb-6">
                        Earn ₹100 Spinzyt Credits for <br/> every friend who completes a wash.
                    </p>
                    <button className="px-8 py-3 bg-white border border-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all">
                        Invite Contacts
                    </button>
                </motion.section>
            </motion.main>
        </div>
    );
};

export default WalletPage;

