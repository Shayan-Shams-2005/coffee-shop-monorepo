// app/admin/reviews/components/ReviewCard.tsx
"use client";

import { useState } from "react";
import { User, Clock, Flag, AlertCircle, CheckCircle, Package, Star, Reply, Edit, Trash2, X, Send, CheckCircle2 } from "lucide-react";
import { Review, toFarsiNumber, formatDate } from "../types";

interface ReviewCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onClearReport: (id: string) => void;
  onSubmitReply: (id: string, text: string) => void;
  onDeleteReply: (id: string) => void;
}

export function ReviewCard({ review, onApprove, onDelete, onClearReport, onSubmitReply, onDeleteReply }: ReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleStartReply = () => {
    setReplyText(review.adminReply || "");
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText("");
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSubmitReply(review.id, replyText);
    setIsReplying(false);
    setReplyText("");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 dir-ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-[#C68E58] text-[#C68E58] dark:fill-[#D4A373] dark:text-[#D4A373]' : 'fill-gray-200 text-gray-200 dark:fill-[#3c2317] dark:text-[#3c2317]'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`relative bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${
        review.status === 'approved' && !review.isReported
          ? 'border-[#E3C3A4]/60 dark:border-[#3c2317] opacity-80 hover:opacity-100' 
          : review.isReported
          ? 'border-rose-400 dark:border-rose-500/50 shadow-[0_4px_20px_rgba(225,29,72,0.1)] dark:shadow-none'
          : 'border-[#C68E58] dark:border-[#7D4F35]/80 shadow-[0_4px_20px_rgba(198,142,88,0.15)] dark:shadow-none'
      }`}
    >
      {/* Indicator Bars */}
      {review.status === 'pending' && !review.isReported && <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#C68E58] dark:bg-[#7D4F35]" />}
      {review.isReported && <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-rose-500 dark:bg-rose-600" />}

      <div className="p-5 sm:p-6">
        
        {/* Header: User & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-center text-[#C68E58] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#4A3022] dark:text-white flex items-center gap-2">
                {review.userName}
              </h3>
              <p className="text-xs font-bold text-[#8C7A6B] mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {toFarsiNumber(formatDate(review.date))}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {review.isReported && (
              <span className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/20 flex items-center gap-1.5">
                <Flag className="w-4 h-4" /> گزارش شده
              </span>
            )}

            {review.status === 'pending' ? (
              <span className="bg-[#C68E58]/10 text-[#C68E58] dark:bg-[#7D4F35]/20 dark:text-[#D4A373] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#C68E58]/20 dark:border-[#7D4F35]/30 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> در انتظار بررسی
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> انتشار یافته
              </span>
            )}
          </div>
        </div>

        {/* Body: Product Info & Comment Text */}
        <div className="bg-white dark:bg-[#231511] rounded-xl p-4 mb-5 border border-[#E3C3A4]/60 dark:border-[#3c2317]">
          <div className="flex items-center justify-between mb-3 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-3">
            <div className="flex items-center gap-2 text-[#C68E58]">
              <Package className="w-4 h-4 shrink-0" />
              <span className="text-sm font-bold truncate">{review.productName}</span>
            </div>
            {renderStars(review.rating)}
          </div>
          
          <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
            "{review.text}"
          </p>

          {/* Admin Reply Display */}
          {review.adminReply && !isReplying && (
            <div className="mt-4 bg-[#C68E58]/10 dark:bg-[#C68E58]/5 rounded-xl p-4 border border-[#C68E58]/30 dark:border-[#C68E58]/20 relative">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#C68E58]/20">
                <span className="text-xs font-black text-[#C68E58] flex items-center gap-1.5">
                  <Reply className="w-4 h-4" /> پاسخ فروشگاه
                </span>
              </div>
              <p className="text-[#4A3022] dark:text-[#EAE0D5] text-sm leading-relaxed whitespace-pre-wrap">
                {review.adminReply}
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
              placeholder="متن پاسخ خود را اینجا بنویسید..."
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl p-3 text-sm text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58] min-h-[100px] resize-none mb-3"
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
                <Send className="w-4 h-4" /> {review.adminReply ? "ثبت تغییرات" : "ثبت پاسخ"}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E3C3A4]/60 dark:border-[#3c2317]">
          
          {/* Left: Destructive Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onDelete(review.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-rose-500 hover:text-rose-500 rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
            >
              <Trash2 className="w-4 h-4" /> حذف نظر
            </button>

            {review.isReported && (
              <button 
                onClick={() => onClearReport(review.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:bg-[#FCF9F5] hover:text-[#4A3022] dark:hover:bg-[#3A221C] dark:hover:text-white rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
              >
                <X className="w-4 h-4" /> رد گزارش
              </button>
            )}
          </div>

          {/* Right: Positive/Constructive Actions */}
          <div className="flex items-center gap-2">
            
            {review.adminReply && !isReplying && (
              <>
                <button 
                  onClick={() => onDeleteReply(review.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-rose-500 hover:text-rose-500 rounded-xl text-sm font-bold text-[#8C7A6B] transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> حذف پاسخ
                </button>
                {/* 🚀 Changed Edit Reply button to match the exact Nescafe colors of the Approve button */}
                <button 
                  onClick={handleStartReply}
                  className="flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors bg-[#C68E58] hover:bg-[#D4A373] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
                >
                  <Edit className="w-4 h-4" /> ویرایش پاسخ
                </button>
              </>
            )}

            {!review.adminReply && !isReplying && (
              <button 
                onClick={handleStartReply}
                className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#231511] hover:bg-[#FCF9F5] dark:hover:bg-[#3A221C] text-[#C68E58] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl text-sm font-bold transition-colors"
              >
                <Reply className="w-4 h-4" /> پاسخ دادن
              </button>
            )}

            {/* Approve Button */}
            {review.status === 'pending' && (
              <button 
                onClick={() => onApprove(review.id)}
                className="flex items-center gap-1.5 px-6 py-2 bg-[#C68E58] hover:bg-[#D4A373] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white rounded-xl text-sm font-bold transition-colors shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
              >
                <CheckCircle2 className="w-5 h-5" /> تایید و انتشار
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}