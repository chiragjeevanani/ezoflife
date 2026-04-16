import React, { useState, useEffect } from 'react';
import { feedbackApi } from '../../../lib/api';
import PageHeader from '../components/common/PageHeader';
import { MessageSquare, Trash2, Star, User } from 'lucide-react';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await feedbackApi.getAll();
            setFeedbacks(data);
        } catch (error) {
            console.error('Fetch Feedbacks Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this feedback?')) return;
        try {
            await feedbackApi.delete(id);
            fetchFeedbacks();
        } catch (error) {
            console.error('Delete Feedback Error:', error);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
        ));
    };

    return (
        <div className="p-6 space-y-6">
            <PageHeader title="Customer Feedback" />

            <div className="grid gap-4">
                {loading ? (
                    <div className="h-40 flex items-center justify-center text-slate-400 italic">Loading feedbacks...</div>
                ) : (
                    feedbacks.map((fb) => (
                        <div key={fb._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-4 hover:border-primary/20 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 tracking-tight">{fb.user?.displayName || 'Anonymous'}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{fb.user?.email || 'No Email'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-0.5">
                                        {renderStars(fb.rating)}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{fb.category}</span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">"{fb.comment}"</p>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {new Date(fb.createdAt).toLocaleDateString()}
                                </span>
                                <button 
                                    onClick={() => handleDelete(fb._id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {!loading && feedbacks.length === 0 && (
                    <div className="h-60 flex flex-col items-center justify-center text-slate-400 gap-4">
                        <MessageSquare size={48} className="opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No customer feedback received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackManagement;
