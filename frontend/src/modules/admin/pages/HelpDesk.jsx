import React, { useMemo, useState } from 'react';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, Search, Filter, ArrowRight, User, Send } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import MetricRow from '../components/cards/MetricRow';

export default function HelpDesk() {
  const tickets = useMemo(() => [
    { id: 'T-8821', user: 'Amit Sharma', type: 'Payment', subject: 'Double Deduction on Order #8821', priority: 'High', status: 'Open', time: '12m ago' },
    { id: 'T-8819', user: 'Priya Verma', type: 'Service', subject: 'Stain not removed from Silk Saree', priority: 'Medium', status: 'Pending', time: '45m ago' },
    { id: 'T-8815', user: 'Rahul K.', type: 'Logistics', subject: 'Rider delayed by 30 mins', priority: 'Low', status: 'Resolved', time: '2h ago' }
  ], []);

  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50/50 pb-20">
      <PageHeader 
        title="Help Desk" 
        actions={[
          { label: 'Export Logs', icon: Clock, variant: 'secondary' },
          { label: 'Compose Broadcast', icon: MessageSquare, variant: 'primary' }
        ]}
      />

      <div className="flex flex-1 overflow-hidden divide-x divide-slate-200 bg-white border-t border-slate-200">
        
        {/* Ticket List Sidebar */}
        <div className="w-full lg:w-[450px] flex flex-col bg-white overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="relative flex-1">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="SEARCH TICKETS..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-[9px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
             </div>
             <button className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-slate-400 hover:bg-slate-950 hover:text-white transition-all">
                <Filter size={14} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {tickets.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-6 cursor-pointer hover:bg-slate-50 transition-all relative group ${selectedTicket.id === ticket.id ? 'bg-slate-50' : ''}`}
              >
                {selectedTicket.id === ticket.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900"></div>}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-900 tabular-nums">#{ticket.id}</span>
                    <span className={`px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest ${ticket.priority === 'High' ? 'bg-rose-50 text-rose-500' : ticket.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{ticket.time}</span>
                </div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:translate-x-1 transition-transform">{ticket.subject}</h4>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 opacity-60">
                      <User size={10} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ticket.user}</span>
                   </div>
                   <div className="flex items-center gap-1.5 opacity-60">
                      <MessageSquare size={10} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ticket.type}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="hidden lg:flex flex-1 flex-col bg-slate-50 relative">
          {selectedTicket ? (
            <>
              {/* Context Header */}
              <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-start">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-sm flex items-center justify-center">
                       <User size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{selectedTicket.user}</h2>
                       <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{selectedTicket.type} · POLICY-0821-X</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm text-[8px] font-black uppercase tracking-widest">Verified User</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-2.5">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all rounded-sm flex items-center gap-2">
                       Call User
                    </button>
                    <button className="px-4 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2">
                       Resolve Ticket
                    </button>
                 </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                 <div className="flex flex-col items-center">
                    <span className="px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-4">Ticket Opened {selectedTicket.time}</span>
                 </div>
                 
                 {useMemo(() => [
                    { 
                      type: 'incoming',
                      msg: 'Hello, I noticed the payment was deducted twice for my order #8821. The first attempt said failed but the money was debited, and the second attempt also went through.',
                      time: '12:14 PM'
                    },
                    { 
                      type: 'outgoing',
                      msg: 'Apologies for the inconvenience, Amit. I am checking the settlement logs for SZ-REF-9921. Please hold on for 2 minutes while I verify with the gateway.',
                      time: '12:16 PM',
                      status: 'Seen'
                    }
                 ], []).map((chat, idx) => (
                    <div key={idx} className={`flex gap-4 max-w-[80%] ${chat.type === 'outgoing' ? 'ml-auto flex-row-reverse' : ''}`}>
                       <div className={`w-8 h-8 rounded-sm flex-shrink-0 ${chat.type === 'outgoing' ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                       <div className={`space-y-2 ${chat.type === 'outgoing' ? 'items-end flex flex-col' : ''}`}>
                          <div className={`p-5 rounded-sm shadow-sm ${chat.type === 'outgoing' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-800'}`}>
                             <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                               {chat.msg}
                             </p>
                          </div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                            Sent {chat.time} {chat.status && `· ${chat.status}`}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Input Area */}
              <div className="p-8 bg-white border-t border-slate-100">
                 <div className="relative">
                    <textarea 
                      placeholder="ENTER PROTOCOL RESPONSE..." 
                      className="w-full h-24 p-6 bg-slate-50 border border-slate-200 rounded-sm text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all resize-none"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                       <button className="p-2.5 bg-slate-100 text-slate-500 rounded-sm hover:bg-slate-200 transition-all">
                          <Clock size={16} />
                       </button>
                       <button className="px-6 py-2 bg-slate-900 text-white rounded-[1px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 flex items-center gap-2">
                          Commit Msg <Send size={12} />
                       </button>
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
               <MessageSquare size={64} className="mb-6" />
               <p className="text-[12px] font-black uppercase tracking-[0.4em]">Awaiting Selection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
