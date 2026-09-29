// app/admin/notifications/components/ReplyModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, CornerDownLeft, Phone, Mail, Send } from "lucide-react";
import { Notification, toFarsiNumber } from "../types";

interface ReplyModalProps {
  isOpen: boolean;
  activeReply: Notification | null;
  onClose: () => void;
  onSubmit: (replyMessage: string) => void;
}

export function ReplyModal({ isOpen, activeReply, onClose, onSubmit }: ReplyModalProps) {
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    if (isOpen && activeReply) {
      setReplyMessage(activeReply.adminReply || "");
    }
  }, [isOpen, activeReply]);

  if (!isOpen || !activeReply) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    onSubmit(replyMessage);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        
        <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
          <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
            <CornerDownLeft className="w-5 h-5 text-[#C68E58]" />
            پاسخ به {activeReply.userName}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 bg-gray-100 dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-[#FCF9F5] dark:bg-[#231511] border border-[#F5EFE6] dark:border-[#3c2317] rounded-xl p-4">
            <p className="text-xs text-[#8C7A6B] mb-2 font-bold">پاسخ شما برای راه‌های ارتباطی زیر ارسال خواهد شد:</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm font-bold text-[#2C1E16] dark:text-white">
                <Phone className="w-4 h-4 text-[#C68E58]" /> <span className="dir-ltr inline-block">{toFarsiNumber(activeReply.phone)}</span>
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-[#2C1E16] dark:text-white">
                <Mail className="w-4 h-4 text-[#C68E58]" /> {activeReply.email}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">متن پاسخ</label>
            <textarea
              required
              rows={5}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              style={{ textAlign: 'right', direction: 'rtl' }}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all resize-none"
              placeholder="متن پاسخ خود را اینجا بنویسید..."
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
          >
            <Send className="w-5 h-5" /> {activeReply.adminReply ? "ثبت ویرایش پاسخ" : "ارسال پاسخ"}
          </button>
        </form>
      </div>
    </div>
  );
}