// cSpell:disable
"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Send, Search, User, CheckCircle2, Clock, ArrowRight, UserCheck, CheckCircle } from "lucide-react";
import { useAuthStore } from "../../../src/store/useAuthStore"; 

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

const ENDPOINTS = {
  GET_CONVERSATIONS: `${API_BASE_URL}/api/SupportChat/GetAllConversations/admin/conversations`,
  GET_MESSAGES: (id: string | number) => `${API_BASE_URL}/api/SupportChat/GetConversationMessages/conversation/${id}/messages`,
  SEND_MESSAGE: (id: string | number) => `${API_BASE_URL}/api/SupportChat/SendMessage/conversation/${id}/messages`,
  ASSIGN: (id: string | number) => `${API_BASE_URL}/api/SupportChat/AssignConversation/admin/conversations/${id}/assign`,
  STATUS: (id: string | number) => `${API_BASE_URL}/api/SupportChat/UpdateConversationStatus/admin/conversations/${id}/status`,
};

interface Conversation {
  id?: number;
  supportConversationId?: number;
  conversationId?: number;
  userId: number;
  userName: string;
  userPhone?: string;
  status: number;
  assignedAdminId?: number | null; 
  assignedAdminName?: string | null;
  createdAt: string;
}

interface Message {
  id?: number | string;
  supportMessageId?: number;
  content: string;
  senderId?: number;
  isRead?: boolean;
  createdAt?: string;
  sentAt?: string;
}

export default function AdminLiveChatPage() {
  const user = useAuthStore((state: any) => state.user);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getConvId = (conv: Conversation) => conv.id || conv.supportConversationId || conv.conversationId || 0;
  
  const currentAdminId = user?.id || user?.userId || 1; 

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConv) {
      const currentId = getConvId(selectedConv);
      if (currentId) {
        fetchMessages(currentId, true);
        const msgInterval = setInterval(() => {
          fetchMessages(currentId, false);
        }, 5000);
        return () => clearInterval(msgInterval);
      }
    } else {
      setMessages([]);
    }
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(ENDPOINTS.GET_CONVERSATIONS, {
        headers: { "Cache-Control": "no-cache" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || data.data || [];
        setConversations(items);
        
        if (selectedConv) {
           const activeId = getConvId(selectedConv);
           const updatedActive = items.find((c: Conversation) => getConvId(c) === activeId);
           if (updatedActive && updatedActive.assignedAdminId !== selectedConv.assignedAdminId) {
               setSelectedConv(updatedActive);
           }
        }
      }
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const fetchMessages = async (convId: number, showLoader = false) => {
    if (showLoader) setIsLoadingMessages(true);
    try {
      const res = await fetch(ENDPOINTS.GET_MESSAGES(convId), {
        headers: { "Cache-Control": "no-cache" },
        credentials: "include"
      });
      if (res.ok) {
        if (res.status === 204) {
          setMessages([]);
        } else {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.items || data.messages || data.data || [];
          setMessages(items);
        }
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      if (showLoader) setIsLoadingMessages(false);
    }
  };

  const handleAssignChat = async () => {
    if (!selectedConv) return;
    const currentId = getConvId(selectedConv);
    setIsAssigning(true);

    try {
      const res = await fetch(ENDPOINTS.ASSIGN(currentId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ adminId: currentAdminId }), 
      });

      if (res.ok || res.status === 204) {
        const updatedList = conversations.map(c => 
          getConvId(c) === currentId ? { ...c, assignedAdminId: currentAdminId, status: 1 } : c
        );
        setConversations(updatedList);
        setSelectedConv(updatedList.find(c => getConvId(c) === currentId) || null);
      } else {
        alert("Failed to assign the conversation. Please try again.");
      }
    } catch (error) {
      console.error("Assignment error:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;

    const currentId = getConvId(selectedConv);
    if (!currentId) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      const res = await fetch(ENDPOINTS.SEND_MESSAGE(currentId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: messageText }),
      });

      if (res.ok) {
        fetchMessages(currentId, false);
      } else {
        console.error("Send failed with status:", res.status);
        setNewMessage(messageText);
      }
    } catch (error) {
      console.error("Error sending message", error);
      setNewMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.userPhone?.includes(searchQuery)
  );

  // Variable to keep track of dates for the chat separators
  let lastRenderedDate = "";

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500" dir="rtl">
      
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5]">پشتیبانی آنلاین</h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
          مدیریت و پاسخگویی به چت‌های کاربران
        </p>
      </div>

      <div className="flex flex-col md:flex-row h-[75vh] bg-white dark:bg-[#1A110F] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-3xl shadow-sm overflow-hidden">
        
        {/* RIGHT SIDEBAR: Conversation List */}
        <div className={`w-full md:w-1/3 flex flex-col border-l border-[#E3C3A4]/60 dark:border-[#3c2317] bg-[#FDFCFB] dark:bg-[#231511] ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
          
          <div className="p-4 border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجوی کاربر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1A110F] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58]"
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-[#8C7A6B]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {isLoadingList ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-[#C68E58] animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-10 text-[#8C7A6B] text-sm font-bold">
                مکالمه‌ای یافت نشد.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const cId = getConvId(conv);
                const isAssignedToMe = conv.assignedAdminId === currentAdminId;
                
                // 🚀 Added Conversation Date for Sidebar
                const convDateStr = conv.createdAt && !isNaN(new Date(conv.createdAt).getTime())
                    ? new Date(conv.createdAt).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
                    : "";

                return (
                  <button
                    key={`conv-${cId}`} 
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-right ${
                      selectedConv && getConvId(selectedConv) === cId
                        ? "bg-[#C68E58]/10 dark:bg-[#C68E58]/20 border border-[#C68E58]/30" 
                        : "hover:bg-white dark:hover:bg-[#1A110F] border border-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E3C3A4]/30 dark:bg-[#3c2317] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#C68E58]" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#4A3022] dark:text-[#EAE0D5] truncate">
                          {conv.userName || "کاربر ناشناس"}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-[#8C7A6B]">{convDateStr}</span>
                          {conv.status === 0 ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Open" />
                          ) : conv.status === 1 ? (
                            <span className="w-2 h-2 rounded-full bg-blue-500" title="In Progress" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-400" title="Closed" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-[#8C7A6B] dark:text-[#A1A1A1] truncate flex justify-between items-center">
                        <span className="dir-ltr">{conv.userPhone || `Chat ID: ${cId}`}</span>
                        {isAssignedToMe && <span className="text-[10px] text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">در حال بررسی</span>}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* LEFT MAIN AREA: Chat Window */}
        <div className={`w-full md:w-2/3 flex flex-col bg-white dark:bg-[#1A110F] ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
          
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="h-16 flex items-center gap-4 px-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-[#FDFCFB] dark:bg-[#231511]">
                <button 
                  className="md:hidden p-2 -mr-2 text-[#8C7A6B]" 
                  onClick={() => setSelectedConv(null)}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-[#E3C3A4]/30 dark:bg-[#3c2317] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#C68E58]" />
                </div>
                <div>
                  <h2 className="font-black text-[#4A3022] dark:text-white">{selectedConv.userName}</h2>
                  <p className="text-xs font-bold text-[#8C7A6B] dir-ltr text-right">{selectedConv.userPhone}</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-[#C68E58] animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-50">
                    <Clock className="w-12 h-12 text-[#C68E58] mb-2" />
                    <p className="text-[#8C7A6B] font-bold">پیامی در این مکالمه وجود ندارد.</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isCustomer = msg.senderId === selectedConv.userId; 
                    
                    const timeStr = msg.sentAt || msg.createdAt;
                    
                    // 🚀 Parse the Persian Time & Date
                    let formattedTime = "";
                    let messageDateStr = "";
                    
                    if (timeStr && !isNaN(new Date(timeStr).getTime())) {
                       const dateObj = new Date(timeStr);
                       formattedTime = dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
                       messageDateStr = dateObj.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
                    }

                    // 🚀 Check if we need to show a Date Separator
                    const showDateSeparator = messageDateStr !== "" && messageDateStr !== lastRenderedDate;
                    if (showDateSeparator) lastRenderedDate = messageDateStr;

                    return (
                      <div key={msg.id || msg.supportMessageId || `msg-${idx}`} className="flex flex-col">
                        
                        {/* 🚀 Render Date Separator Bubble if it's a new day */}
                        {showDateSeparator && (
                           <div className="flex justify-center my-4">
                              <span className="bg-[#F5EFE6] dark:bg-[#2C1A14] text-[#8C7A6B] dark:text-[#ba8d71] text-[11px] font-bold px-3 py-1 rounded-full border border-[#E3C3A4]/30 dark:border-[#3c2317]">
                                 {messageDateStr}
                              </span>
                           </div>
                        )}

                        <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl ${
                              isCustomer 
                                ? "bg-[#F5EFE6] text-[#2C1E16] dark:bg-[#2C1A14] dark:text-[#E3C3A4] rounded-tl-sm border border-[#E3C3A4]/30 dark:border-[#3c2317]" // User Style
                                : "bg-[#C68E58] text-white rounded-tr-sm shadow-md" // Admin Style
                            }`}
                          >
                            <p className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
                            <div className={`text-[10px] mt-2 font-bold flex items-center justify-end gap-1 ${isCustomer ? "text-[#8C7A6B] dark:text-[#ba8d71]" : "text-white/70"}`}>
                              {formattedTime}
                              {!isCustomer && (
                                 msg.isRead ? <CheckCircle2 className="w-3 h-3 text-blue-200" /> : <CheckCircle className="w-3 h-3 opacity-60" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-[#1A110F] border-t border-[#E3C3A4]/60 dark:border-[#3c2317]">
                
                {selectedConv.assignedAdminId === currentAdminId ? (
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="پاسخ خود را بنویسید..."
                      disabled={isSending}
                      className="w-full h-12 bg-[#FDFCFB] dark:bg-[#231511] border border-[#E3C3A4]/50 dark:border-[#3c2317] rounded-full pr-6 pl-14 text-sm font-medium text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="absolute left-1.5 top-1.5 bottom-1.5 w-9 h-9 flex items-center justify-center bg-[#C68E58] text-white rounded-full hover:bg-[#A87242] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:-scale-x-100" />}
                    </button>
                  </form>
                ) : selectedConv.assignedAdminId ? (
                  <div className="h-12 flex items-center justify-center bg-gray-100 dark:bg-[#231511] rounded-xl text-gray-500 dark:text-[#8C7A6B] text-sm font-bold">
                    این چت در حال بررسی توسط ادمین دیگری ({selectedConv.assignedAdminName || "نامشخص"}) است.
                  </div>
                ) : (
                  <button
                    onClick={handleAssignChat}
                    disabled={isAssigning}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#C68E58] text-white font-bold rounded-xl hover:bg-[#A87242] transition-colors disabled:opacity-50"
                  >
                    {isAssigning ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
                    شروع بررسی و پاسخ به این کاربر
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-50 text-center">
              <User className="w-20 h-20 text-[#C68E58] mb-4 opacity-50" />
              <p className="text-lg font-black text-[#4A3022] dark:text-[#EAE0D5]">مکالمه‌ای انتخاب نشده است</p>
              <p className="text-sm font-bold text-[#8C7A6B] mt-2">برای مشاهده و ارسال پیام، از لیست سمت راست یک کاربر را انتخاب کنید.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}