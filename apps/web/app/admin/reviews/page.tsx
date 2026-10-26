// app/admin/reviews/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Review, ReviewStatus } from "./types";
import { ReviewsHeader } from "./components/ReviewsHeader";
import { ReviewsControlBar } from "./components/ReviewsControlBar";
import { ReviewCard } from "./components/ReviewCard";
import { ReviewAdminApi } from "./api";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "all" | "reported">("pending");
const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      const data = await ReviewAdminApi.getPending();
      const rawReviews = Array.isArray(data) ? data : (data.items || []);

// Map to your UI format
      const mappedReviews: Review[] = rawReviews.map((r: any) => {
        // 🚀 FIX: Added productReviewId based exactly on your console log!
        const actualId = r.productReviewId || r.id || r.reviewId || r.Id || r.ReviewId; 
        const prodId = r.productId || r.ProductId || 0;

        return {
          id: `REV-${actualId || Math.random()}`,
          numericId: actualId, // This will now correctly be 1 (or whatever the productReviewId is)
          productId: prodId,
          // 🚀 FIX: Added reviewerName based on your console log
          userName: r.reviewerName || r.userName || r.author || "کاربر سایت",
          productName: r.productName || r.ProductName || "محصول نامشخص",
          date: r.createdAt || r.date || r.CreatedAt || new Date().toISOString(),
          rating: r.rating || r.Rating || 5,
          text: r.comment || r.text || r.Comment || "",
          status: "pending", 
          isReported: r.isReported || r.IsReported || false,
          adminReply: r.adminReply || r.AdminReply || undefined,
        };
      });

      setReviews(mappedReviews);
    } catch (err: any) {
      console.error(err);
      if (err.message === "SESSION_EXPIRED") {
        alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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

  const handleApprove = async (review: Review) => {
    try {
      await ReviewAdminApi.approve(review.numericId);
      // Remove it from the pending list since it is approved
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (err) {
      alert("خطا در تایید نظر");
    }
  };

  const handleDelete = async (review: Review) => {
    if(!confirm("آیا از حذف/رد این نظر اطمینان دارید؟")) return;
    try {
      await ReviewAdminApi.reject(review.numericId);
      // Remove it from the UI after rejection
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (err) {
      alert("خطا در حذف نظر");
    }
  };

  // Mock functions for features your backend doesn't seem to have dedicated endpoints for yet
  const handleClearReport = async (review: Review) => {
    alert("این قابلیت هنوز در سرور پیاده‌سازی نشده است.");
  };

  const handleSubmitReply = async (review: Review, text: string) => {
    alert("قابلیت ثبت پاسخ هنوز در سرور پیاده‌سازی نشده است.");
  };

  const handleDeleteReply = async (review: Review) => {
    alert("قابلیت حذف پاسخ هنوز در سرور پیاده‌سازی نشده است.");
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

      <div className="space-y-4 relative min-h-[300px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#FCF9F5]/50 dark:bg-[#1A0F0C]/50 z-10 rounded-2xl">
            <Loader2 className="w-10 h-10 animate-spin text-[#C68E58]" />
            <span className="font-bold text-[#8C7A6B]">در حال دریافت نظرات...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
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