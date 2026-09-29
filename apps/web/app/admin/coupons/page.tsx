// app/admin/coupons/page.tsx
"use client";

import { useState } from "react";
import { TicketPercent } from "lucide-react";
import { Coupon, initialCoupons } from "./types";
import { CouponGenerator } from "./components/CouponGenerator";
import { CouponTable } from "./components/CouponTable";
import { CouponModal } from "./components/CouponModal";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleCreateCoupon = (data: { code: string; discount: number; expiresInDays: number }) => {
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: data.code,
      discount: data.discount,
      createdAt: new Date().toISOString().split('T')[0]!,
      expiresInDays: data.expiresInDays,
      isActive: true,
    };
    
    setCoupons([newCoupon, ...coupons]);
  };

  const handleDelete = (id: string) => {
    if(confirm("آیا از حذف این کد تخفیف اطمینان دارید؟")) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (data: { code: string; discount: number; expiresInDays: number }) => {
    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? {
        ...c,
        code: data.code,
        discount: data.discount,
        expiresInDays: data.expiresInDays
      } : c));
    }
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight flex items-center gap-3">
          <TicketPercent className="w-8 h-8 text-[#C68E58]" />
          کدهای تخفیف
        </h1>
        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
          تولید کدهای تخفیف سفارشی و مدیریت کوپن‌های فعال فروشگاه
        </p>
      </div>

      <CouponGenerator onCreateCoupon={handleCreateCoupon} />

      <CouponTable 
        coupons={coupons}
        onToggleStatus={handleToggleStatus}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <CouponModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCoupon(null); }}
        editingCoupon={editingCoupon}
        onSubmit={handleSaveEdit}
      />
      
    </div>
  );
}