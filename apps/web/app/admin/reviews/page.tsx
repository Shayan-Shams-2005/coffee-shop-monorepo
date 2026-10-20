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
// Import ProductApi to get the list of products first
import { ProductApi } from "../products/api";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "all" | "reported">("pending");

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch all products
      const productsData = await ProductApi.getAll();
      const rawProducts = Array.isArray(productsData) ? productsData : (productsData.items || []);

      // 2. Fetch reviews for each product simultaneously
      const reviewPromises = rawProducts.map(async (p: any) => {
          const pId = p.productId || p.id;
          if (!pId) return [];
          
          try {
              const productReviews = await ReviewAdminApi.getByProductId(pId);
              const reviewsArray = Array.isArray(productReviews) ? productReviews : (productReviews.items || []);
              
              // Inject product info into the review object if the backend doesn't provide it natively
              return reviewsArray.map((r: any) => ({
                  ...r,
                  productId: pId,
                  productName: r.productName || p.productName || p.name || "محصول نامشخص"
              }));
          } catch (e) {
              console.warn(`Could not fetch reviews for product ${pId}`, e);
              return [];
          }
      });

      // 3. Wait for all requests to finish and flatten the arrays into one master list
      const allReviewsArrays = await Promise.all(reviewPromises);
      const combinedReviews = allReviewsArrays.flat();
      
      // 4. Map to UI format
      const mappedReviews: Review[] = combinedReviews.map((r: any) => ({
        id: `REV-${r.reviewId || Math.random()}`,
        numericId: r.reviewId,
        productId: r.productId,
        userName: r.userName || "کاربر سایت",
        productName: r.productName,
        date: r.createdAt || new Date().toISOString(),
        rating: r.rating || 5,
        text: r.comment || r.text || "",
        status: r.isApproved ? "approved" : "pending",
        isReported: r.isReported || false,
        adminReply: r.adminReply || undefined,
      }));

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
      await ReviewAdminApi.update(review.productId, review.numericId, { 
        isApproved: true, 
        adminReply: review.adminReply 
      });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, status: "approved" } : r));
    } catch (err) {
      alert("خطا در تایید نظر");
    }
  };

  const handleDelete = async (review: Review) => {
    if(!confirm("آیا از حذف این نظر اطمینان دارید؟")) return;
    try {
      await ReviewAdminApi.delete(review.productId, review.numericId);
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (err) {
      alert("خطا در حذف نظر");
    }
  };

  const handleClearReport = async (review: Review) => {
    try {
      await ReviewAdminApi.update(review.productId, review.numericId, { 
        isReported: false, 
        isApproved: review.status === 'approved',
        adminReply: review.adminReply 
      });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, isReported: false } : r));
    } catch (err) {
      alert("خطا در رد گزارش");
    }
  };

  const handleSubmitReply = async (review: Review, text: string) => {
    try {
      await ReviewAdminApi.update(review.productId, review.numericId, { 
        adminReply: text,
        isApproved: review.status === 'approved'
      });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, adminReply: text } : r));
    } catch (err) {
      alert("خطا در ثبت پاسخ");
    }
  };

  const handleDeleteReply = async (review: Review) => {
    if(!confirm("آیا از حذف این پاسخ اطمینان دارید؟")) return;
    try {
      await ReviewAdminApi.update(review.productId, review.numericId, { 
        adminReply: null,
        isApproved: review.status === 'approved'
      });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, adminReply: undefined } : r));
    } catch (err) {
      alert("خطا در حذف پاسخ");
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