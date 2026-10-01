// app/admin/reviews/page.tsx
"use client";

import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import { Review, ReviewStatus, initialReviews } from "./types";
import { ReviewsHeader } from "./components/ReviewsHeader";
import { ReviewsControlBar } from "./components/ReviewsControlBar";
import { ReviewCard } from "./components/ReviewCard";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "all" | "reported">("pending");

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.text.toLowerCase().includes(q) || 
        r.userName.toLowerCase().includes(q) || 
        r.productName.toLowerCase().includes(q)
      );
    }

    if (filterStatus === "reported") {
      result = result.filter(r => r.isReported);
    } else if (filterStatus !== "all") {
      result = result.filter(r => r.status === filterStatus);
    }

    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [reviews, searchQuery, filterStatus]);

  const handleApprove = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleDelete = (id: string) => {
    if(confirm("آیا از حذف این نظر اطمینان دارید؟")) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleClearReport = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isReported: false } : r));
  };

  const handleSubmitReply = (id: string, text: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: text } : r));
  };

  const handleDeleteReply = (id: string) => {
    if(confirm("آیا از حذف این پاسخ اطمینان دارید؟")) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, adminReply: undefined } : r));
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <ReviewsHeader />

      <ReviewsControlBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] flex flex-col items-center">
            <MessageSquare className="w-16 h-16 text-[#E3C3A4] dark:text-[#3c2317] mb-4 opacity-50" />
            <p className="font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">نظری برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard 
              key={review.id}
              review={review}
              onApprove={handleApprove}
              onDelete={handleDelete}
              onClearReport={handleClearReport}
              onSubmitReply={handleSubmitReply}
              onDeleteReply={handleDeleteReply}
            />
          ))
        )}
      </div>
    </div>
  );
}