// app/admin/notifications/components/NotificationCard.tsx
"use client";

import { Bug, MessageCircleQuestion, CheckCircle, User, Phone, Mail, Calendar, Trash2, CheckCircle2, CornerDownLeft, Edit } from "lucide-react";
import { Notification, toFarsiNumber, formatDate } from "../types";

interface NotificationCardProps {
  notif: Notification;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onReply: (notif: Notification) => void;
}

export function NotificationCard({ notif, onDelete, onMarkAsRead, onReply }: NotificationCardProps) {
  return (
    <div 
      className={`relative bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${
        notif.isRead 
          ? 'border-[#F5EFE6] dark:border-[#3c2317] opacity-80 hover:opacity-100' 
          : 'border-[#C68E58] dark:border-[#C68E58] shadow-[0_4px_20px_rgba(198,142,88,0.15)] dark:shadow-none'
      }`}
    >
      {!notif.isRead && (
        <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#C68E58]" />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              notif.type === 'bug' 
                ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' 
                : 'bg-blue-50 text-blue-500 dark:bg-blue-500/10'
            }`}>
              {notif.type === 'bug' ? <Bug className="w-5 h-5" /> : <MessageCircleQuestion className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-lg text-[#2C1E16] dark:text-white flex items-center gap-2">
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
          
          <div className="text-xs font-bold text-[#8C7A6B] bg-[#FCF9F5] dark:bg-[#231511] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 w-fit">
            <Calendar className="w-3.5 h-3.5" /> {toFarsiNumber(formatDate(notif.date))}
          </div>
        </div>

        <div className={`bg-[#FCF9F5] dark:bg-[#231511] rounded-xl p-4 border border-[#F5EFE6] dark:border-[#3c2317] ${notif.adminReply ? 'mb-3' : 'mb-5'}`}>
          <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
            {notif.message}
          </p>
        </div>

        {notif.adminReply && (
          <div className="bg-[#C68E58]/10 dark:bg-[#C68E58]/5 rounded-xl p-4 mb-5 border border-[#C68E58]/30 dark:border-[#C68E58]/20 mr-4 sm:mr-8 relative">
            <div className="flex items-center justify-between mb-2 border-b border-[#C68E58]/20 pb-2">
               <span className="text-xs font-black text-[#C68E58] flex items-center gap-1.5">
                 <CornerDownLeft className="w-4 h-4" /> پاسخ شما
               </span>
               <span className="text-[10px] font-bold text-[#8C7A6B] bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md">
                 {notif.repliedAt && toFarsiNumber(formatDate(notif.repliedAt))}
               </span>
            </div>
            <p className="text-[#2C1E16] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
              {notif.adminReply}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#F5EFE6] dark:border-[#3c2317]">
          <button 
            onClick={() => onDelete(notif.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:border-rose-500 hover:text-rose-500 rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
          >
            <Trash2 className="w-4 h-4" /> حذف
          </button>

          <div className="flex items-center gap-3">
            {!notif.isRead && (
              <button 
                onClick={() => onMarkAsRead(notif.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 rounded-xl text-sm font-bold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> خوانده شد
              </button>
            )}
            <button 
              onClick={() => onReply(notif)}
              className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors ${
                notif.adminReply 
                  ? 'bg-[#8C7A6B] hover:bg-[#6A5A4F]' 
                  : 'bg-[#C68E58] hover:bg-[#A87242]'
              }`}
            >
              {notif.adminReply ? (
                <><Edit className="w-4 h-4" /> ویرایش پاسخ</>
              ) : (
                <><CornerDownLeft className="w-4 h-4" /> پاسخ دادن</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}