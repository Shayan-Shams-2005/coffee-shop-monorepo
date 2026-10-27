// cSpell:disable
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquare, AlertCircle, User, Headset, ShieldAlert, CheckCircle, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../../../src/store/useAuthStore";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

const ENDPOINTS = {
  CREATE: `${API_BASE_URL}/api/SupportChat/GetOrCreateConversation/conversation`,
  GET_MINE: `${API_BASE_URL}/api/SupportChat/GetMyConversation/conversation/me`,
  GET_MSGS: (id: string | number) => `${API_BASE_URL}/api/SupportChat/GetConversationMessages/conversation/${id}/messages`,
  SEND_MSG: (id: string | number) => `${API_BASE_URL}/api/SupportChat/SendMessage/conversation/${id}/messages`,
};

export default function SupportPage() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const user = useAuthStore((state: any) => state.user);
  
  const [isMounted, setIsMounted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // 🚀 FIX: State to hold the exact user ID returned from the Conversation API
  const [myUserId, setMyUserId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // If the Zustand store has the ID, set it as a fallback
    if (user?.id) setMyUserId(String(user.id));
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMounted) return;
    
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const initChat = async () => {
      try {
        const res = await fetch(ENDPOINTS.GET_MINE, {
          headers: { "Cache-Control": "no-cache" },
          credentials: "include" 
        });

        if (res.status === 401 || res.status === 403) {
           const errorText = await res.text();
           if (errorText.toLowerCase().includes("customer") || errorText.toLowerCase().includes("admin")) {
              setAccessError("شما با حساب ادمین وارد شده‌اید. ادمین‌ها فقط از طریق پنل مدیریت امکان چت دارند.");
           } else {
              setAccessError("نشست شما منقضی شده است. لطفا از حساب کاربری خارج شده و دوباره وارد شوید.");
           }
           setIsLoading(false);
           return;
        }

        let currentConvId = null;

        if (res.status === 204) {
           currentConvId = null; 
        } else if (res.ok) {
           const data = await res.json();
           
           // 🚀 FIX: Grab the exact userId directly from the SupportConversationDto!
           if (data?.userId) setMyUserId(String(data.userId));
           
           currentConvId = data?.supportConversationId || data?.id || data?.conversationId;
        }

        if (currentConvId) {
           setConversationId(currentConvId);
           fetchMessages(currentConvId);
        }
      } catch (error) {
        console.error("Error initializing support chat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();

    const interval = setInterval(() => {
      if (conversationId) fetchMessages(conversationId, false);
    }, 10000);

    return () => clearInterval(interval);
  }, [isMounted, isAuthenticated, conversationId]);

  const fetchMessages = async (convId: string | number, showLoader = true) => {
    try {
      const res = await fetch(ENDPOINTS.GET_MSGS(convId), {
        headers: { "Cache-Control": "no-cache" },
        credentials: "include" 
      });
      if (res.ok) {
        if (res.status === 204) {
            setMessages([]);
            return;
        }
        const data = await res.json();
        const msgArray = Array.isArray(data) ? data : data.items || data.messages || data.data || [];
        setMessages(msgArray);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || accessError) return;

    const messageText = newMessage.trim();
    setNewMessage(""); 
    setIsSending(true);

    try {
      let currentConvId = conversationId;
      
      if (!currentConvId) {
          const createRes = await fetch(ENDPOINTS.CREATE, {
              method: "POST",
              headers: { "accept": "*/*", "Content-Type": "application/json" },
              credentials: "include", 
              body: JSON.stringify({}) 
          });
          
          if (createRes.ok) {
             const createData = await createRes.json();
             currentConvId = createData?.supportConversationId || createData?.id || createData?.conversationId;
             if (createData?.userId) setMyUserId(String(createData.userId));
             if (currentConvId) setConversationId(currentConvId);
          } else {
             throw new Error("Could not initialize chat");
          }
      }

      if (!currentConvId) throw new Error("Could not initialize conversation ID.");

      const res = await fetch(ENDPOINTS.SEND_MSG(currentConvId), {
        method: "POST",
        headers: { "accept": "*/*", "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ content: messageText }), 
      });

      if (res.ok) {
        fetchMessages(currentConvId, false);
      } else {
        setNewMessage(messageText); 
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(messageText); 
    } finally {
      setIsSending(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]">
        <Loader2 className="w-10 h-10 text-[#C68E58] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412] px-4" dir="rtl">
        <div className="bg-white dark:bg-[#231511] border border-[#F5EFE6] dark:border-[#3c2317] rounded-3xl p-10 max-w-md w-full text-center shadow-lg">
          <AlertCircle className="w-16 h-16 text-[#D95D39] mx-auto mb-6" />
          <h2 className="text-2xl font-black text-[#2C1E16] dark:text-white mb-4">نیاز به ورود</h2>
          <p className="text-[#8C7A6B] dark:text-[#ba8d71] font-medium mb-8 leading-relaxed">
            برای ارتباط با پشتیبانی و ثبت تیکت، لطفاً ابتدا وارد حساب کاربری خود شوید.
          </p>
          <Link
            href="/login"
            className="w-full inline-flex justify-center items-center gap-2 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            <User className="w-5 h-5" />
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  let lastRenderedDate = "";
  const todayStr = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-[85vh] bg-[#FCF9F5] dark:bg-[#1A1412] py-8 px-4 transition-colors" dir="rtl">
      <div className="container mx-auto max-w-4xl h-[75vh] flex flex-col bg-white dark:bg-[#1A110F] border border-[#F5EFE6] dark:border-[#3c2317] rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
        
        <div className="shrink-0 h-20 border-b border-[#F5EFE6] dark:border-[#3c2317] px-6 sm:px-8 flex items-center gap-4 bg-[#FDFCFB] dark:bg-[#231511]">
          <div className="w-12 h-12 bg-[#C68E58]/10 dark:bg-[#C68E58]/20 text-[#C68E58] rounded-full flex items-center justify-center shrink-0">
            <Headset className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#2C1E16] dark:text-white">پشتیبانی نئو کافه</h1>
            <p className="text-xs sm:text-sm font-medium text-[#8C7A6B] dark:text-[#ba8d71] mt-0.5">
              پاسخگویی سریع به سوالات و مشکلات شما
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 custom-scrollbar bg-white dark:bg-[#1A110F]">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#C68E58] animate-spin" />
              <span className="text-sm font-bold text-[#8C7A6B] dark:text-[#ba8d71]">در حال بررسی گفتگو...</span>
            </div>
          ) : accessError ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center opacity-80 px-4">
              <ShieldAlert className="w-16 h-16 text-[#D95D39]" />
              <p className="text-[#2C1E16] dark:text-[#E3C3A4] font-bold max-w-md leading-relaxed">
                {accessError}
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center opacity-60">
              <MessageSquare className="w-16 h-16 text-[#D4A373] dark:text-[#5A3826]" />
              <p className="text-[#8C7A6B] dark:text-[#ba8d71] font-bold">
                پیامی وجود ندارد.<br/> مشکل یا سوال خود را مطرح کنید تا تیم پشتیبانی در اسرع وقت پاسخ دهند.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              
              // 🚀 FIX: We now compare the message sender against the true User ID we extracted from the Conversation
              const rawSenderId = String(msg.senderId ?? msg.SenderId ?? "");
              
              // If it matches your User ID, it goes to the Right. Otherwise, it is the Admin and goes Left.
              const isUserMsg = myUserId ? (rawSenderId === myUserId) : false;

              const timeStr = msg.sentAt ?? msg.SentAt ?? msg.createdAt ?? msg.CreatedAt;
              const rawContent = msg.content ?? msg.Content ?? "";
              const rawIsRead = msg.isRead ?? msg.IsRead ?? false;
              
              let formattedTime = "";
              let messageDateStr = "";

              if (timeStr && !isNaN(new Date(timeStr).getTime())) {
                const dateObj = new Date(timeStr);
                formattedTime = dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
                const rawDateStr = dateObj.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
                messageDateStr = rawDateStr === todayStr ? "امروز" : rawDateStr;
              }

              const showDateSeparator = messageDateStr !== "" && messageDateStr !== lastRenderedDate;
              if (showDateSeparator) lastRenderedDate = messageDateStr;

              return (
                <div key={msg.supportMessageId || idx} className="flex flex-col w-full mb-2">
                  
                  {showDateSeparator && (
                     <div className="flex justify-center my-4">
                        <span className="bg-[#F5EFE6] dark:bg-[#2C1A14] text-[#8C7A6B] dark:text-[#ba8d71] text-[11px] font-bold px-3 py-1 rounded-full border border-[#E3C3A4]/30 dark:border-[#3c2317]">
                           {messageDateStr}
                        </span>
                     </div>
                  )}

                  <div className="flex w-full">
                    <div 
                      className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl ${
                        isUserMsg 
                          ? "ml-auto bg-[#C68E58] text-white rounded-tr-sm shadow-md" // RIGHT SIDE: Your Brown Messages
                          : "mr-auto bg-[#F5EFE6] text-[#2C1E16] dark:bg-[#2C1A14] dark:text-[#E3C3A4] rounded-tl-sm border border-[#E3C3A4]/30 dark:border-[#3c2317]" // LEFT SIDE: Admin's Light Messages
                      }`}
                    >
                      <p className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap text-right">{rawContent}</p>
                      
                      {formattedTime && (
                        <div className={`text-[10px] mt-2 font-bold flex items-center justify-end gap-1 ${isUserMsg ? "text-white/70" : "text-[#8C7A6B] dark:text-[#ba8d71]"}`}>
                          {formattedTime}
                          {isUserMsg && (
                            rawIsRead ? <CheckCircle2 className="w-3 h-3 text-blue-200" /> : <CheckCircle className="w-3 h-3 text-white/60" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 p-4 sm:p-6 bg-white dark:bg-[#1A110F] border-t border-[#F5EFE6] dark:border-[#3c2317]">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="w-full h-14 bg-[#FDFCFB] dark:bg-[#231511] border border-[#E3C3A4]/50 dark:border-[#3c2317] rounded-full pl-16 pr-6 text-sm font-medium text-[#2C1E16] dark:text-[#EAE0D5] placeholder:text-[#A1A1A1] dark:placeholder-[#6A5A4F] focus:outline-none focus:border-[#C68E58] focus:ring-2 focus:ring-[#C68E58]/20 transition-all disabled:opacity-50"
              disabled={isSending || !!accessError}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending || !!accessError}
              className="absolute left-2 top-2 bottom-2 w-10 h-10 flex items-center justify-center bg-[#C68E58] text-white rounded-full hover:bg-[#A87242] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowLeft className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}