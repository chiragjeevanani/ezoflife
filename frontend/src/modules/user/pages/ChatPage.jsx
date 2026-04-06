import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [message, setMessage] = useState('');
    const scrollRef = useRef(null);

    const initialMessages = useMemo(() => [
        { id: 1, sender: 'support', text: 'Hello! I am Spinzyt support assistant. How can I help you with order ' + orderId + ' today?', time: '10:30 AM' },
        { id: 2, sender: 'support', text: 'I can help with status updates, delivery preferences, or quality concerns.', time: '10:30 AM' },
    ], [orderId]);

    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessage('');

        // Simulation response
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                sender: 'support',
                text: 'Got it. Let me check the real-time status with our logistics partner. One moment...',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1500);
    };

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }
    }), []);

    return (
        <div className="bg-background text-on-surface min-h-[100dvh] flex flex-col max-h-[100dvh] overflow-hidden font-body">
            {/* Header */}
            <header className="px-6 py-4 bg-white border-b border-outline-variant/10 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface border border-outline-variant/10"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </motion.button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-black text-lg tracking-tighter leading-none italic">Order Help</h1>
                            <span className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{orderId}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Support Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-container flex items-center justify-center text-primary shadow-sm overflow-hidden">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="Support" />
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main 
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 hide-scrollbar bg-surface-container-lowest"
            >
                <div className="text-center mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-30">Conversation started today</span>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-4 rounded-[1.8rem] text-sm font-semibold shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-primary text-on-primary rounded-tr-none' 
                                        : 'bg-white text-on-surface rounded-tl-none border border-outline-variant/10'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[8px] font-black text-on-surface-variant opacity-40 mt-2 uppercase tracking-widest px-1">
                                    {msg.time}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </main>

            {/* Input Bar */}
            <footer className="p-6 bg-white border-t border-outline-variant/10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <form 
                    onSubmit={handleSendMessage}
                    className="relative flex items-center gap-3"
                >
                    <div className="flex-1 bg-surface-container-low rounded-[2rem] px-5 py-2 border border-slate-300 focus-within:ring-2 focus-within:ring-primary/10 transition-all flex items-center min-h-[56px]">
                        <button type="button" className="text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-xl">add_circle</span>
                        </button>
                        <input 
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message support..."
                            className="bg-transparent border-none focus:ring-0 p-3 text-sm font-semibold w-full placeholder:text-outline-variant/60"
                        />
                        <button type="button" className="text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-xl">image</span>
                        </button>
                    </div>
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        disabled={!message.trim()}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl ${
                            message.trim() 
                                ? 'bg-primary text-on-primary shadow-primary/20' 
                                : 'bg-surface-container-high text-on-surface-variant/20 shadow-none'
                        }`}
                    >
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: message.trim() ? "'FILL' 1" : "'FILL' 0" }}>send</span>
                    </motion.button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-[9px] font-bold text-on-surface-variant opacity-30 uppercase tracking-[0.1em]">By chatting, you agree to our <span className="underline">Support Terms</span></p>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;

