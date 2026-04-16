import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { feedbackApi } from '../../../lib/api';
import { Star, Send, X } from 'lucide-react';

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const vendorIdFromQuery = searchParams.get('vendorId');

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [category, setCategory] = useState(orderId ? 'Service' : 'App Experience');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const userData = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('user') || '{}');
    const userId = userData?._id || userData?.id || localStorage.getItem('userId');

    const handleSubmit = async () => {
        if (!comment) return;
        setSubmitting(true);
        try {
            await feedbackApi.submit({
                userId,
                orderId,
                vendorId: vendorIdFromQuery, // Linked to vendor if provided
                rating,
                comment,
                category
            });
            setSuccess(true);
            setTimeout(() => navigate(-1), 2000);
        } catch (error) {
            console.error('Submit Feedback Error:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="text-2xl font-black tracking-tighter mb-2">Thank You!</h2>
                <p className="text-sm font-bold text-slate-500">Your feedback helps us improve Ez of Life.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-body pb-28">
            <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <X size={24} />
                </button>
                <h1 className="text-sm font-black uppercase tracking-widest text-slate-900">Platform Feedback</h1>
                <div className="w-10" />
            </header>

            <main className="p-6 space-y-8 flex-1">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">{orderId ? 'Rate your service' : 'Share your experience'}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">{orderId ? `Order #${orderId.slice(-6)}` : "We're listening to our users"}</p>
                </div>

                {/* Rating */}
                <div className="space-y-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rate your experience</p>
                    <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button 
                                key={s} 
                                onClick={() => setRating(s)}
                                className="transition-transform active:scale-90"
                            >
                                <Star 
                                    size={36} 
                                    className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category - Only show if general feedback */}
                {!orderId && (
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Service', 'App Experience', 'Rider', 'Pricing'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        category === cat 
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                        : 'bg-white text-slate-400 border-slate-100'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comment */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                        {orderId ? 'How was the service?' : 'What could be better?'}
                    </label>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={orderId ? "Tell us about the wash quality, packing, etc." : "Tell us what you loved or what we can improve..."}
                        className="w-full h-40 bg-white border border-slate-200 rounded-[2rem] p-6 text-sm font-bold outline-none focus:border-primary/30 transition-all resize-none shadow-sm"
                    />
                </div>
            </main>

            <div className="p-6 bg-white border-t border-slate-50">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !comment}
                    className="w-full py-5 rounded-[1.5rem] bg-primary text-on-primary font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
                >
                    {submitting ? 'Submitting...' : (
                        <>
                            <Send size={16} />
                            Send Feedback
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FeedbackForm;
