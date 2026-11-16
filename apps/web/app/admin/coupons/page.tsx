// app/admin/coupons/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { TicketPercent, Loader2 } from "lucide-react";
import { Coupon } from "./types";
import { CouponGenerator } from "./components/CouponGenerator";
import { CouponTable } from "./components/CouponTable";
import { CouponModal } from "./components/CouponModal";
import { OfferCodeApi } from "./api";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_SIZE = 15;
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchCoupons = async (currentPage: number, replace = false) => {
    try {
      if (currentPage === 1) setIsLoading(true);
      else setIsFetchingNextPage(true);
      
      const data = await OfferCodeApi.getAll(currentPage, PAGE_SIZE);
      const rawCoupons = Array.isArray(data) ? data : (data.items || []);

      setCoupons(prev => {
        if (replace) return rawCoupons;
        return [...prev, ...rawCoupons];
      });

      setHasMore(rawCoupons.length === PAGE_SIZE);
    } catch (err) {
      if (currentPage === 1) alert("خطا در دریافت لیست کدهای تخفیف.");
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    fetchCoupons(page, page === 1);
  }, [page]);

  // Infinite Scroll Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading && !isFetchingNextPage) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => { observer.unobserve(target); };
  }, [hasMore, isLoading, isFetchingNextPage]);

  const reloadData = () => {
    setPage(1);
    fetchCoupons(1, true);
  };

  const handleCreateCoupon = async (data: { code: string; discount: number; expiresInDays: number }) => {
    try {
      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + data.expiresInDays);

      await OfferCodeApi.create({
        code: data.code,
        discountPercentage: data.discount,
        startsAt: startsAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        // Defaults based on backend DTO
        usageLimit: null, 
        userUsageLimit: null,
        minimumOrderAmount: null,
        maximumDiscountAmount: null
      });
      alert("کد تخفیف با موفقیت ایجاد شد!");
      reloadData();
    } catch (err: any) {
      alert(`خطا در ساخت کد تخفیف:\n${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("آیا از حذف این کد تخفیف اطمینان دارید؟")) {
      try {
        await OfferCodeApi.delete(id);
        reloadData();
      } catch (err: any) {
        alert(err.message || "خطا در حذف کد تخفیف.");
      }
    }
  };

  const handleDeactivate = async (id: number) => {
    if(confirm("آیا از غیرفعال‌سازی این کد تخفیف اطمینان دارید؟")) {
      try {
        await OfferCodeApi.deactivate(id);
        reloadData();
      } catch (err: any) {
        alert(err.message || "خطا در غیرفعال‌سازی کد تخفیف.");
      }
    }
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (data: { code: string; discount: number; expiresInDays: number }) => {
    if (!editingCoupon) return;
    try {
      const startsAt = new Date(editingCoupon.startsAt);
      const expiresAt = new Date(startsAt);
      expiresAt.setDate(expiresAt.getDate() + data.expiresInDays);

      await OfferCodeApi.update(editingCoupon.offerCodeId, {
        code: data.code,
        discountPercentage: data.discount,
        startsAt: startsAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        usageLimit: editingCoupon.usageLimit,
        userUsageLimit: editingCoupon.userUsageLimit,
        minimumOrderAmount: editingCoupon.minimumOrderAmount,
        maximumDiscountAmount: editingCoupon.maximumDiscountAmount
      });
      setIsModalOpen(false);
      setEditingCoupon(null);
      reloadData();
    } catch (err: any) {
      alert(`خطا در ویرایش کد تخفیف:\n${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight flex items-center gap-3">
          <TicketPercent className="w-8 h-8 text-[#C68E58]" />
          کدهای تخفیف
        </h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
          تولید کدهای تخفیف سفارشی و مدیریت کوپن‌های فعال فروشگاه
        </p>
      </div>

      <CouponGenerator onCreateCoupon={handleCreateCoupon} />

      <div className="relative min-h-[300px]">
        {isLoading && page === 1 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#FCF9F5]/80 dark:bg-[#1A0F0C]/80 backdrop-blur-sm z-10 rounded-[1.5rem]">
            <Loader2 className="w-10 h-10 animate-spin text-[#C68E58]" />
            <span className="font-bold text-[#8C7A6B]">در حال دریافت اطلاعات...</span>
          </div>
        ) : (
          <>
            <CouponTable 
              coupons={coupons}
              onToggleStatus={handleDeactivate} // We use deactivate since reactivation isn't in your endpoints yet
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
            
            {/* Observer Target */}
            <div ref={observerTarget} className="w-full h-16 mt-4 flex flex-col items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#C68E58] animate-spin" />
                  <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">بارگذاری بیشتر...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <CouponModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCoupon(null); }}
        editingCoupon={editingCoupon}
        onSubmit={handleSaveEdit}
      />
    </div>
  );
}