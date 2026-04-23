import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { feedbackApi } from '../../../lib/api';
import { Star, User, Calendar, ShoppingBag } from 'lucide-react';

const VendorReviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const vendorDataRaw = localStorage.getItem('vendorData') || localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
    const vendorData = JSON.parse(vendorDataRaw);
    const vendorId = vendorData?._id || vendorData?.id || vendorData?.user?._id || vendorData?.user?.id || localStorage.getItem('userId');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const data = await feedbackApi.getByVendorId(vendorId);
                setReviews(data || []);
            } catch (error) {
                console.error('Fetch Vendor Reviews Error:', error);
            } finally {
                setLoading(false);
            }
        };
        if (vendorId) {
            fetchReviews();
        } else {
            setLoading(false);
        }
    }, [vendorId]);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < rating ? 'fill-primary text-primary' : 'text-slate-200'} />
        ));
    };

    return (
        <div className="bg-slate-50 min-h-screen font-body pb-32">
            <header className="bg-white px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Customer Reviews</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Your Service Excellence Track</p>
                    </div>
                </div>
            </header>

            <main className="p-6">
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Compiling ratings...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.length > 0 ? reviews.map((review) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={review._id} 
                                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800 leading-none mb-1">{review.user?.displayName || 'Anonymous'}</h4>
                                            <div className="flex gap-0.5">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter">Verified Order</span>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                                </div>

                                <div className="flex items-center justify-between opacity-40">
                                    <div className="flex items-center gap-1.5">
                                        <ShoppingBag size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{review.order?.orderId || 'Direct Review'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                                <span className="material-symbols-outlined text-4xl">rate_review</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">No reviews received yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default VendorReviews;
