"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Star,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Store,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Flag,
  X,
} from "lucide-react";
import { SortBar, SortOption } from "../../components/sort/SortBar";
import { useAuthStore } from "../../src/store/useAuthStore";

const toFarsiNumber = (num: number | string) => {
  if (num === undefined || num === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] ?? x);
};

const REVIEW_SORT_OPTIONS: SortOption[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "buyers", label: "دیدگاه خریداران" },
  { id: "helpful", label: "مفیدترین" },
];

const REVIEWS_PER_PAGE = 5;

export function ProductReviews({ reviews, rating, reviewsCount }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [activeSort, setActiveSort] = useState("helpful");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userVotes, setUserVotes] = useState<
    Record<number, "like" | "dislike" | null>
  >({});

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const reviewsTopRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSort]);

  const handleReviewButtonClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const submitReview = () => {
    if (newReviewText.trim() === "") {
      alert("لطفا متن دیدگاه خود را وارد کنید.");
      return;
    }
    alert("دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.");
    setIsModalOpen(false);
    setNewReviewText("");
    setNewReviewRating(5);
  };

  const handleVote = (reviewId: number, type: "like" | "dislike") => {
    setUserVotes((prev) => {
      if (prev[reviewId] === type) {
        const newState = { ...prev };
        delete newState[reviewId];
        return newState;
      }
      return { ...prev, [reviewId]: type };
    });
  };

  const getReviewLikes = (review: any) => {
    let count = review.likes;
    if (userVotes[review.id] === "like") count += 1;
    return count;
  };

  const getReviewDislikes = (review: any) => {
    let count = review.dislikes;
    if (userVotes[review.id] === "dislike") count += 1;
    return count;
  };

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const aLikes = getReviewLikes(a);
      const bLikes = getReviewLikes(b);

      if (activeSort === "helpful") {
        return bLikes - aLikes;
      }
      if (activeSort === "newest") {
        return b.id - a.id;
      }
      if (activeSort === "buyers") {
        if (a.isBuyer === b.isBuyer) {
          return bLikes - aLikes;
        }
        return a.isBuyer ? -1 : 1;
      }
      return 0;
    });
  }, [reviews, activeSort, userVotes]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);

  let visibleReviews = [];
  if (!isExpanded) {
    visibleReviews = sortedReviews.slice(0, 2);
  } else {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    visibleReviews = sortedReviews.slice(
      startIndex,
      startIndex + REVIEWS_PER_PAGE,
    );
  }

  const scrollToReviews = () => {
    if (reviewsTopRef.current) {
      const yOffset = -120;
      const y =
        reviewsTopRef.current.getBoundingClientRect().top +
        window.scrollY +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    scrollToReviews();
    setOpenMenuId(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-[#F0EBE1] dark:border-[#3c2317] pt-16 pb-24 transition-colors">
        {/* ================= Left Column: Rating & CTA ================= */}
        <div className="lg:col-span-4 flex flex-col gap-8 sticky top-28 h-fit">
          <div className="bg-white dark:bg-[#1A110F] rounded-[32px] p-8 border border-[#F0EBE1] dark:border-[#3c2317] shadow-sm flex flex-col items-center text-center transition-colors">
            <span className="text-6xl font-black text-[#2C1E16] dark:text-white mb-2 transition-colors">
              {toFarsiNumber(rating)}
            </span>

            <div className="flex items-center gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFull = rating >= star;
                const isHalf = rating >= star - 0.5 && rating < star;

                return (
                  <div key={star} className="relative w-6 h-6">
                    <Star className="w-6 h-6 text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700 absolute top-0 right-0 transition-colors" />
                    {(isFull || isHalf) && (
                      <div
                        className={`absolute top-0 right-0 h-full overflow-hidden ${isHalf ? "w-1/2" : "w-full"}`}
                      >
                        <Star className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-sm absolute top-0 right-0 max-w-none" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <span className="text-sm font-medium text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
              از مجموع {toFarsiNumber(reviewsCount)} امتیاز
            </span>
          </div>

          <div className="bg-[#FCF9F5] dark:bg-[#1A1412] border border-[#E3C3A4]/50 dark:border-[#3c2317] rounded-[32px] p-8 text-center relative overflow-hidden shadow-sm transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C68E58]/5 dark:bg-[#C68E58]/10 rounded-bl-full transition-colors"></div>
            <h3 className="text-[#2C1E16] dark:text-white font-black text-lg mb-3 relative z-10 transition-colors">
              دیدگاه شما چیست؟
            </h3>
            <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm mb-6 leading-relaxed relative z-10 font-medium transition-colors">
              تجربه خود را از نوشیدن این قهوه با دیگران به اشتراک بگذارید.
            </p>
            <button
              onClick={handleReviewButtonClick}
              // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text in dark mode
              className="w-full py-4 bg-[#C68E58] hover:bg-[#A87242] text-white font-black rounded-2xl transition-all shadow-[0_8px_25px_rgba(198,142,88,0.25)] active:scale-[0.98] relative z-10 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none"
            >
              ثبت دیدگاه جدید
            </button>
          </div>
        </div>

        {/* ================= Right Column: Reviews List ================= */}
        <div className="lg:col-span-8" ref={reviewsTopRef}>
          <SortBar
            activeSort={activeSort}
            onSortChange={setActiveSort}
            productCount={reviews.length}
            options={REVIEW_SORT_OPTIONS}
            countLabel="دیدگاه"
          />

          <div className="space-y-6">
            {visibleReviews.map((review: any) => {
              const hasLiked = userVotes[review.id] === "like";
              const hasDisliked = userVotes[review.id] === "dislike";
              const reviewRating = review.rating || 5;

              return (
                <div
                  key={review.id}
                  className="bg-white dark:bg-[#1A110F] rounded-[32px] p-8 border border-[#F0EBE1] dark:border-[#3c2317] shadow-sm hover:shadow-md dark:shadow-none transition-shadow relative"
                >
                  <div className="flex items-start justify-between mb-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#FCF9F5] dark:bg-[#2C1A14] rounded-full flex items-center justify-center text-[#C68E58] font-black text-lg border border-[#E3C3A4]/50 dark:border-[#3A221C] shrink-0 mt-1 transition-colors">
                        {review.author.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-[#2C1E16] dark:text-[#EAE0D5] text-base transition-colors">
                            {review.author}
                          </span>
                          {review.isBuyer && (
                            <span className="bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#10B981] dark:text-[#34D399] text-[10px] font-black px-2.5 py-0.5 rounded-lg transition-colors">
                              خریدار
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFull = reviewRating >= star;
                            const isHalf =
                              reviewRating >= star - 0.5 && reviewRating < star;

                            return (
                              <div key={star} className="relative w-4 h-4">
                                <Star className="w-4 h-4 text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700 absolute top-0 right-0 transition-colors" />
                                {(isFull || isHalf) && (
                                  <div
                                    className={`absolute top-0 right-0 h-full overflow-hidden ${isHalf ? "w-1/2" : "w-full"}`}
                                  >
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 absolute top-0 right-0 max-w-none" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                      <span className="text-xs text-[#8C7A6B] dark:text-[#A1A1A1] font-medium transition-colors">
                        {toFarsiNumber(review.date)}
                      </span>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            setOpenMenuId(
                              openMenuId === review.id ? null : review.id,
                            );
                          }}
                          className="text-gray-400 dark:text-[#6A5A4F] hover:text-[#2C1E16] dark:hover:text-[#EAE0D5] transition-colors p-1 relative z-10"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openMenuId === review.id && (
                          <div
                            className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3A221C] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-1.5 z-[100] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              dir="rtl"
                              onClick={() => {
                                alert("گزارش ثبت شد");
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#EF4444] dark:text-[#FF6B6B] hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors text-sm font-bold"
                            >
                              <Flag className="w-4 h-4" />
                              <span>گزارش این دیدگاه</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-[#5A4A42] dark:text-[#EAE0D5] leading-[2] text-justify mb-6 relative z-0 transition-colors">
                    {review.text}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F9F8F6] dark:border-[#3A221C] relative z-0 transition-colors">
                    <div>
                      {review.isBuyer && (
                        <div className="flex items-center gap-3 text-xs font-medium text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
                          <div className="flex items-center gap-1.5">
                            <Store className="w-4 h-4" />
                            <span>نئو کافه</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-[#D1C8B8] dark:bg-[#6A5A4F] transition-colors"></div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#C68E58]"></div>
                            <span>نوع آسیاب: دانه قهوه</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-5 dir-rtl">
                      <button
                        onClick={() => handleVote(review.id, "like")}
                        className={`flex items-center gap-1.5 transition-colors text-[14px] font-bold ${
                          hasLiked
                            ? "text-[#10B981] dark:text-[#34D399]"
                            : "text-[#8C7A6B] dark:text-[#A1A1A1] hover:text-[#10B981] dark:hover:text-[#34D399]"
                        }`}
                      >
                        <span className="pt-0.5">
                          {toFarsiNumber(getReviewLikes(review))}
                        </span>
                        <ThumbsUp
                          className={`w-5 h-5 ${hasLiked ? "fill-[#10B981] dark:fill-[#34D399]" : ""}`}
                        />
                      </button>

                      <button
                        onClick={() => handleVote(review.id, "dislike")}
                        className={`flex items-center gap-1.5 transition-colors text-[14px] font-bold ${
                          hasDisliked
                            ? "text-[#EF4444] dark:text-[#FF6B6B]"
                            : "text-[#8C7A6B] dark:text-[#A1A1A1] hover:text-[#EF4444] dark:hover:text-[#FF6B6B]"
                        }`}
                      >
                        <span className="pt-0.5">
                          {toFarsiNumber(getReviewDislikes(review))}
                        </span>
                        <ThumbsDown
                          className={`w-5 h-5 ${hasDisliked ? "fill-[#EF4444] dark:fill-[#FF6B6B]" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= Expansion & Pagination UI ================= */}
          <div className="mt-8 flex justify-center">
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-[#1A110F] border border-[#E3C3A4] dark:border-[#3c2317] text-[#C68E58] dark:text-[#FFD7BA] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14] font-black text-sm rounded-2xl transition-all shadow-sm active:scale-95"
              >
                مشاهده دیدگاه‌های بیشتر
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : (
              totalPages > 1 && (
                <div className="flex items-center gap-3 bg-white dark:bg-[#1A110F] p-2 rounded-2xl shadow-sm border border-[#F0EBE1] dark:border-[#3c2317] transition-colors">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FCF9F5] dark:bg-[#2C1A14] text-[#C68E58] dark:text-[#FFD7BA] hover:bg-[#E3C3A4]/30 dark:hover:bg-[#3A221C] disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1 px-2 dir-rtl">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => changePage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${
                              currentPage === pageNum
                                ? "bg-[#C68E58] dark:bg-[#3A221C] text-white dark:text-[#FFD7BA] shadow-sm"
                                : "text-[#8C7A6B] dark:text-[#A1A1A1] hover:bg-[#FCF9F5] dark:hover:bg-[#2C1A14]"
                            }`}
                          >
                            {toFarsiNumber(pageNum)}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNum}
                            className="text-[#D1C8B8] dark:text-[#6A5A4F] px-1 transition-colors"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FCF9F5] dark:bg-[#2C1A14] text-[#C68E58] dark:text-[#FFD7BA] hover:bg-[#E3C3A4]/30 dark:hover:bg-[#3A221C] disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ================= 🚀 Review Modal ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#2C1E16]/40 dark:bg-black/70 backdrop-blur-sm transition-colors"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#1A1412] rounded-[32px] p-8 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-transparent dark:border-[#3c2317] relative transition-colors"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 left-6 p-2 text-gray-400 dark:text-[#A1A1A1] hover:text-[#2C1E16] dark:hover:text-[#EAE0D5] bg-gray-50 dark:bg-[#1A110F] hover:bg-gray-100 dark:hover:bg-[#2C1A14] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-[#2C1E16] dark:text-white mb-8 text-center transition-colors">
              ثبت دیدگاه جدید
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] transition-colors">
                  امتیاز شما به این محصول
                </span>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = newReviewRating >= star;
                    const isHalf = newReviewRating === star - 0.5;

                    return (
                      <div
                        key={star}
                        className="relative w-8 h-8 hover:scale-110 transition-transform"
                      >
                        <Star className="w-8 h-8 text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700 absolute top-0 right-0 transition-colors" />

                        {(isFull || isHalf) && (
                          <div
                            className={`absolute top-0 right-0 h-full overflow-hidden ${
                              isHalf ? "w-1/2" : "w-full"
                            }`}
                          >
                            <Star className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-sm absolute top-0 right-0 max-w-none" />
                          </div>
                        )}

                        <div className="absolute inset-0 flex">
                          <button
                            type="button"
                            className="w-1/2 h-full z-10 cursor-pointer"
                            onClick={() => setNewReviewRating(star - 0.5)}
                          />
                          <button
                            type="button"
                            className="w-1/2 h-full z-10 cursor-pointer"
                            onClick={() => setNewReviewRating(star)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-amber-600 mt-1">
                  {toFarsiNumber(newReviewRating)} ستاره
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#5A4A42] dark:text-[#EAE0D5] transition-colors">
                  متن دیدگاه
                </label>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="تجربه خود را از این محصول بنویسید..."
                  className="w-full h-32 p-4 bg-[#F9F8F6] dark:bg-[#1A110F] border border-[#F0EBE1] dark:border-[#3c2317] rounded-2xl resize-none focus:outline-none focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-1 focus:ring-[#C68E58] transition-all text-sm text-[#2C1E16] dark:text-[#EAE0D5] dark:placeholder-[#6A5A4F]"
                ></textarea>
              </div>

              <button
                onClick={submitReview}
                // 🚀 FIXED: Applied primary Mocha (#6A422D) background and creamy (#F3E8E0) text in dark mode
                className="w-full py-4 bg-[#C68E58] hover:bg-[#A87242] text-white font-black rounded-2xl transition-all shadow-[0_8px_25px_rgba(198,142,88,0.25)] active:scale-[0.98] mt-2 dark:bg-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#5A3826] dark:shadow-none"
              >
                ثبت دیدگاه
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}