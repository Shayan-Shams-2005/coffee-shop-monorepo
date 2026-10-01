// app/admin/notifications/components/NotificationCard.tsx
"use client";

import { useState } from "react";
import { Bug, MessageCircleQuestion, CheckCircle, User, Phone, Mail, Calendar, Trash2, CheckCircle2, CornerDownLeft, Edit, Send, Reply } from "lucide-react";
import { Notification, toFarsiNumber, formatDate } from "../types";

interface NotificationCardProps {
  notif: Notification;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onSubmitReply: (id: string, text: string) => void;
  onDeleteReply: (id: string) => void;
}

export function NotificationCard({ notif, onDelete, onMarkAsRead, onSubmitReply, onDeleteReply }: NotificationCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleStartReply = () => {
    setReplyText(notif.adminReply || "");
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText("");
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSubmitReply(notif.id, replyText);
    setIsReplying(false);
    setReplyText("");
  };

  return (
    <div 
      className={`relative bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${
        notif.isRead 
          ? 'border-[#E3C3A4]/60 dark:border-[#3c2317] opacity-80 hover:opacity-100' 
          : 'border-[#C68E58] dark:border-[#7D4F35]/80 shadow-[0_4px_20px_rgba(198,142,88,0.15)] dark:shadow-none'
      }`}
    >
      {!notif.isRead && (
        <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#C68E58] dark:bg-[#7D4F35]" />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
              notif.type === 'bug' 
                ? 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' 
                : 'bg-white dark:bg-[#231511] text-[#C68E58] border-[#E3C3A4]/60 dark:border-[#3c2317]'
            }`}>
              {notif.type === 'bug' ? <Bug className="w-5 h-5" /> : <MessageCircleQuestion className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-base text-[#4A3022] dark:text-white flex items-center gap-2">
                {notif.subject}
                {!notif.isRead && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">جدید</span>
                )}
                {notif.adminReply && (
                  <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> پاسخ داده شده
                  </span>
                )}
              </h3>
              <div className="text-xs font-bold text-[#8C7A6B] mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {notif.userName}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> <a href={`tel:${notif.phone}`} className="hover:text-[#C68E58] dir-ltr inline-block text-right">{toFarsiNumber(notif.phone)}</a></span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> <a href={`mailto:${notif.email}`} className="hover:text-[#C68E58]">{notif.email}</a></span>
              </div>
            </div>
          </div>
          
          <div className="text-xs font-bold text-[#8C7A6B] bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 w-fit">
            <Calendar className="w-3.5 h-3.5" /> {toFarsiNumber(formatDate(notif.date))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#231511] rounded-xl p-4 mb-5 border border-[#E3C3A4]/60 dark:border-[#3c2317]">
          <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
            "{notif.message}"
          </p>

          {/* Admin Reply Display */}
          {notif.adminReply && !isReplying && (
            <div className="mt-4 bg-[#C68E58]/10 dark:bg-[#C68E58]/5 rounded-xl p-4 border border-[#C68E58]/30 dark:border-[#C68E58]/20 relative">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#C68E58]/20">
                <span className="text-xs font-black text-[#C68E58] flex items-center gap-1.5">
                  <Reply className="w-4 h-4" /> پاسخ پشتیبانی
                </span>
              </div>
              <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
                {notif.adminReply}
              </p>
            </div>
          )}
        </div>

        {/* Reply Input Form */}
        {isReplying && (
          <div className="mb-5 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl p-4 animate-in slide-in-from-top-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="متن پاسخ خود را اینجا بنویسید (پاسخ برای کاربر ایمیل و پیامک می‌شود)..."
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl p-3 text-sm text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] min-h-[100px] resize-none mb-3"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button 
                onClick={handleCancelReply}
                className="px-4 py-2 text-sm font-bold text-[#8C7A6B] hover:text-[#4A3022] dark:hover:text-white transition-colors"
              >
                لغو
              </button>
              <button 
                onClick={handleSend}
                disabled={!replyText.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-[#C68E58] hover:bg-[#D4A373] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" /> {notif.adminReply ? "ثبت تغییرات" : "ارسال پاسخ"}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E3C3A4]/60 dark:border-[#3c2317]">
          {/* Left: Destructive Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onDelete(notif.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-rose-500 hover:text-rose-500 rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
            >
              <Trash2 className="w-4 h-4" /> حذف پیام
            </button>
          </div>

          {/* Right: Positive/Constructive Actions */}
          <div className="flex items-center gap-2">
            {!notif.isRead && (
              <button 
                onClick={() => onMarkAsRead(notif.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 rounded-xl text-sm font-bold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> خوانده شد
              </button>
            )}

            {notif.adminReply && !isReplying && (
              <>
                <button 
                  onClick={() => onDeleteReply(notif.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-rose-500 hover:text-rose-500 rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> حذف پاسخ
                </button>
                {/* 🚀 Changed to Nescafe solid color to match Reviews page */}
                <button 
                  onClick={handleStartReply}
                  className="flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors bg-[#C68E58] hover:bg-[#D4A373] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
                >
                  <Edit className="w-4 h-4" /> ویرایش پاسخ
                </button>
              </>
            )}

            {!notif.adminReply && !isReplying && (
              <button 
                onClick={handleStartReply}
                className="flex items-center gap-1.5 px-6 py-2 bg-[#C68E58] hover:bg-[#D4A373] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white rounded-xl text-sm font-bold transition-colors shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
              >
                <CornerDownLeft className="w-5 h-5" /> پاسخ دادن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}