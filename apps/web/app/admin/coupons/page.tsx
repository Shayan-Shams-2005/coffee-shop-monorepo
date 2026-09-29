// cSpell:disable
"use client";

import { useState, useEffect } from "react";
import { 
  TicketPercent, RefreshCw, Plus, Trash2, 
  Copy, Check, Percent, Hash, CalendarDays, 
  CheckCircle2, XCircle, Edit, X, Save
} from "lucide-react";

// --- Helpers ---
const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// --- Types ---
interface Coupon {
  id: string;
  code: string;
  discount: number;
  createdAt: string;
  expiresInDays: number;
  isActive: boolean;
}

// --- Mock Data ---
const initialCoupons: Coupon[] = [
  { id: "c-1", code: "NEOWELCOME20", discount: 20, createdAt: "2023-10-20", expiresInDays: 30, isActive: true },
  { id: "c-2", code: "COFFEE10", discount: 10, createdAt: "2023-10-25", expiresInDays: 7, isActive: true },
  { id: "c-3", code: "WINTER50", discount: 50, createdAt: "2023-01-10", expiresInDays: 0, isActive: false },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  
  // Generator States
  const [codeLength, setCodeLength] = useState<number>(8);
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [expiryDays, setExpiryDays] = useState<number>(14);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  
  // UI States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Edit Modal States
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editFormData, setEditFormData] = useState({ code: "", discount: 0, expiresInDays: 0 });

  // Generate random alphanumeric code
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < codeLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(result);
  };

  // Generate an initial code on mount
  useEffect(() => {
    generateRandomCode();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateCoupon = () => {
    if (!generatedCode.trim()) return;
    
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: generatedCode,
      discount: discountPercent,
      createdAt: new Date().toISOString().split('T')[0]!,
      expiresInDays: expiryDays,
      isActive: true,
    };
    
    setCoupons([newCoupon, ...coupons]);
    generateRandomCode(); // Generate a new one right after saving
  };

  const handleDelete = (id: string) => {
    if(confirm("آیا از حذف این کد تخفیف اطمینان دارید؟")) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Edit Handlers
  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setEditFormData({
      code: coupon.code,
      discount: coupon.discount,
      expiresInDays: coupon.expiresInDays
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editFormData.code.trim()) return;

    setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? {
      ...c,
      code: editFormData.code.toUpperCase(),
      discount: editFormData.discount,
      expiresInDays: editFormData.expiresInDays
    } : c));
    
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

      {/* Generator Form Card */}
      <div className="bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#F5EFE6] dark:border-[#3c2317] p-5 sm:p-8 mb-8 shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        <h2 className="text-lg font-black text-[#2C1E16] dark:text-white mb-6 border-b border-[#F5EFE6] dark:border-[#3c2317] pb-4">
          ساخت کد تخفیف جدید
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Code Length Input */}
          <div>
            <label className="flex text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 items-center gap-1.5">
              <Hash className="w-4 h-4 text-[#C68E58]" /> تعداد حروف کد
            </label>
            <input
              type="number"
              min="4"
              max="16"
              value={codeLength}
              onChange={(e) => setCodeLength(Number(e.target.value))}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all dir-ltr text-left font-black text-lg"
            />
          </div>

          {/* Discount Percent Input */}
          <div>
            <label className="flex text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 items-center gap-1.5">
              <Percent className="w-4 h-4 text-[#C68E58]" /> درصد تخفیف
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all dir-ltr text-left font-black text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] font-bold">%</span>
            </div>
          </div>

          {/* Expiry Days Input */}
          <div>
            <label className="flex text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-[#C68E58]" /> انقضا (تعداد روز)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all dir-ltr text-left font-black text-lg"
            />
          </div>
        </div>

        {/* Code Preview & Actions */}
        <div className="flex flex-col sm:flex-row items-end gap-4 bg-[#FCF9F5] dark:bg-[#231511] p-4 sm:p-5 rounded-2xl border border-[#F5EFE6] dark:border-[#3c2317]">
          
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1] mb-2">کد تولید شده:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedCode}
                className="w-full bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3.5 text-[#2C1E16] dark:text-[#C68E58] focus:outline-none transition-all dir-ltr text-left font-black text-xl tracking-widest"
              />
              <button 
                onClick={generateRandomCode}
                className="p-3.5 bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] rounded-xl text-[#8C7A6B] hover:text-[#C68E58] transition-colors shrink-0 group"
                title="تولید مجدد کد"
              >
                <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleCreateCoupon}
            className="w-full sm:w-auto h-[54px] flex items-center justify-center gap-2 px-8 bg-[#C68E58] hover:bg-[#A87242] text-white rounded-xl text-sm font-bold transition-all shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" /> ایجاد کد تخفیف
          </button>

        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        <div className="p-5 sm:p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
          <h2 className="text-lg font-black text-[#2C1E16] dark:text-white">کدهای تخفیف ایجاد شده</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#FCF9F5] dark:bg-[#231511] text-[#8C7A6B] font-bold border-b border-[#F5EFE6] dark:border-[#3c2317]">
              <tr>
                <th className="p-5 whitespace-nowrap">کد تخفیف</th>
                <th className="p-5 whitespace-nowrap text-center">درصد تخفیف</th>
                <th className="p-5 whitespace-nowrap text-center">وضعیت</th>
                <th className="p-5 whitespace-nowrap text-center">اعتبار</th>
                <th className="p-5 whitespace-nowrap text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6] dark:divide-[#3c2317]">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-[#FCF9F5]/70 dark:hover:bg-[#2A1B16]/50 transition-colors group">
                    
                    {/* Code Column */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleCopy(coupon.code, coupon.id)}
                          className="p-1.5 bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-lg text-[#8C7A6B] hover:text-[#C68E58] transition-colors"
                          title="کپی کد"
                        >
                          {copiedId === coupon.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <span className="font-black text-lg text-[#2C1E16] dark:text-white dir-ltr tracking-wider">
                          {coupon.code}
                        </span>
                      </div>
                    </td>

                    {/* Discount Column */}
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-base px-3 py-1 rounded-lg border border-rose-100 dark:border-rose-500/20">
                        {toFarsiNumber(coupon.discount)}%
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => handleToggleStatus(coupon.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          coupon.isActive 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                            : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 dark:bg-[#231511] dark:text-gray-400 dark:border-[#3c2317]'
                        }`}
                        title="تغییر وضعیت"
                      >
                        {coupon.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {coupon.isActive ? "فعال" : "غیرفعال"}
                      </button>
                    </td>

                    {/* Expiry Column */}
                    <td className="p-5 text-center text-[#8C7A6B] dark:text-[#A1A1A1] font-bold">
                      {coupon.expiresInDays > 0 
                        ? `${toFarsiNumber(coupon.expiresInDays)} روز`
                        : <span className="text-rose-500">منقضی شده</span>
                      }
                    </td>

                    {/* Actions Column */}
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(coupon)}
                          className="p-2.5 text-gray-400 hover:text-[#C68E58] bg-gray-50 hover:bg-[#FCF9F5] dark:bg-[#231511] dark:text-[#6A5A4F] dark:hover:text-[#C68E58] rounded-xl transition-all border border-transparent dark:hover:border-[#3c2317]"
                          title="ویرایش کوپن"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon.id)} 
                          className="p-2.5 text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 dark:bg-[#231511] dark:text-[#6A5A4F] dark:hover:text-rose-400 rounded-xl transition-all border border-transparent dark:hover:border-rose-500/20"
                          title="حذف کوپن"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#8C7A6B] font-medium">
                    <TicketPercent className="w-10 h-10 mx-auto text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 opacity-50" />
                    هیچ کد تخفیفی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setEditingCoupon(null)} />
          
          <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#C68E58]" /> ویرایش کد تخفیف
              </h2>
              <button onClick={() => setEditingCoupon(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">کد تخفیف</label>
                <input
                  type="text"
                  required
                  value={editFormData.code}
                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black tracking-widest uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">درصد تخفیف</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editFormData.discount}
                    onChange={(e) => setEditFormData({ ...editFormData, discount: Number(e.target.value) })}
                    className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">انقضا (تعداد روز)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editFormData.expiresInDays}
                  onChange={(e) => setEditFormData({ ...editFormData, expiresInDays: Number(e.target.value) })}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all dir-ltr text-left font-black"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  <Save className="w-5 h-5" /> ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}