import React, { useState, useEffect } from "react";
import { Search, Mail, Filter, Trash, Inbox, RefreshCw, X } from "lucide-react";
import { collection, onSnapshot, query, orderBy, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  status: string;
  createdAt: any;
  dateStr: string;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  
  const initialSelectRef = React.useRef(false);

  useEffect(() => {
    setReplyText("");
  }, [selectedMsgId]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        let dateStr = "Unknown time";
        if (data.createdAt) {
          const d = data.createdAt.toDate();
          dateStr = d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          subject: data.subject,
          content: data.content,
          status: data.status,
          createdAt: data.createdAt,
          dateStr
        } as Message;
      });
      setMessages(msgs);
      if (!initialSelectRef.current && msgs.length > 0) {
        setSelectedMsgId(msgs[0].id);
        initialSelectRef.current = true;
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      try {
        handleFirestoreError(error, OperationType.GET, "messages");
      } catch (e) {}
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        if (selectedMsgId === id) setSelectedMsgId(null);
      } catch (error) {
        try { handleFirestoreError(error, OperationType.DELETE, `messages/${id}`); } catch (e) {}
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMsg = messages.find(m => m.id === selectedMsgId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Messages & Leads</h1>
          <p className="text-[#A8AFBD] mt-1">Manage client inquiries and contact forms.</p>
        </div>
      </div>

      <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
        {/* Messages List */}
        <div className={`w-full ${selectedMsg ? 'hidden md:flex md:w-1/3' : 'md:w-1/3'} border-r border-white/5 flex flex-col`}>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AFBD]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..." 
                className="w-full bg-[#101010] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-[#2984FF]/20 text-[#2984FF] text-xs rounded-full cursor-pointer">All</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
             {loading ? (
               <div className="h-full flex items-center justify-center p-4">
                 <RefreshCw className="w-6 h-6 text-[#A8AFBD] animate-spin" />
               </div>
             ) : filteredMessages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#A8AFBD]">
                 <Inbox className="w-12 h-12 mb-2 opacity-20" />
                 <p>No messages found.</p>
               </div>
             ) : (
                filteredMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    onClick={() => setSelectedMsgId(msg.id)}
                    className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedMsgId === msg.id ? 'bg-white/5 border-l-2 border-l-[#2984FF]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="font-semibold text-white truncate">{msg.name}</h4>
                      <span className="text-xs text-[#A8AFBD] shrink-0 whitespace-nowrap">{msg.dateStr}</span>
                    </div>
                    <p className="text-sm font-medium text-white mb-1 truncate">{msg.subject}</p>
                    <p className="text-xs text-[#A8AFBD] truncate">{msg.content}</p>
                  </div>
                ))
             )}
          </div>
        </div>

        {/* Message Details */}
        <div className={`${!selectedMsg ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#101010]/50 relative z-10`}>
          {selectedMsg ? (
            <>
              <div className="p-4 md:p-6 border-b border-white/5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 md:gap-4">
                     <button className="md:hidden mr-2 text-[#A8AFBD] hover:text-white" onClick={() => setSelectedMsgId(null)}>
                        <X className="w-6 h-6" />
                     </button>
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1B1B1B] border border-white/10 flex items-center justify-center font-bold text-lg md:text-xl text-[#2984FF] shrink-0">
                        {selectedMsg.name.charAt(0)}
                     </div>
                     <div className="min-w-0">
                       <h2 className="text-lg md:text-xl font-bold text-white truncate max-w-[200px] sm:max-w-xs">{selectedMsg.name}</h2>
                       <p className="text-xs md:text-sm text-[#A8AFBD] truncate max-w-[200px] sm:max-w-xs"><a href={`mailto:${selectedMsg.email}`} className="hover:text-[#2984FF]">{selectedMsg.email}</a></p>
                     </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={`mailto:${selectedMsg.email}`} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[#A8AFBD] hover:text-white transition-colors">
                       <Mail className="w-5 h-5" />
                    </a>
                    <button onClick={(e) => handleDelete(selectedMsg.id, e)} className="bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg text-red-500 transition-colors">
                       <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-base md:text-lg text-white mt-4">{selectedMsg.subject}</h3>
              </div>
              <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                <p className="text-[#A8AFBD] leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  {selectedMsg.content}
                </p>
              </div>
              <div className="p-4 border-t border-white/5 bg-[#1B1B1B]">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full bg-[#101010] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors resize-none h-24"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <a href={`mailto:${selectedMsg.email}?subject=${encodeURIComponent(`Re: ${selectedMsg.subject}`)}&body=${encodeURIComponent(replyText)}`} className="bg-[#2984FF] hover:bg-[#2984FF]/90 text-white px-6 py-2 rounded-xl font-medium transition-colors text-sm">
                    Send Reply via Email
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#A8AFBD] p-8 text-center h-full">
              <Inbox className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
