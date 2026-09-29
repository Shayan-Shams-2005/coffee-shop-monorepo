// cSpell:disable
"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Edit, Trash2, X, Image as ImageIcon, 
  Link as LinkIcon, Layout, MonitorUp, 
  ShoppingBag, Sparkles, Tag, UploadCloud, ImagePlus 
} from "lucide-react";

// تبدیل اعداد به فارسی
const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

type SectionId = "above_header" | "under_offers" | "under_newest" | "under_brands";

interface AdBanner {
  id: string;
  section: SectionId;
  imageUrl: string;
  link: string;
  alt: string;
}

const SECTION_CONFIG: Record<SectionId, { title: string; max: number; icon: React.ReactNode }> = {
  above_header: { title: "بالای هدر (بالاترین نوار سایت)", max: 1, icon: <MonitorUp strokeWidth={1.5} /> },
  under_offers: { title: "زیر بخش شگفت‌انگیزها", max: 4, icon: <Sparkles strokeWidth={1.5} /> },
  under_newest: { title: "زیر بخش جدیدترین محصولات", max: 4, icon: <ShoppingBag strokeWidth={1.5} /> },
  under_brands: { title: "زیر بخش برندها", max: 4, icon: <Tag strokeWidth={1.5} /> },
};

// 🚀 آرایه خالی شد تا ادمین بنرها را از ابتدا خودش اضافه کند
const initialBanners: AdBanner[] = [];

// کامپوننت داخلی برای مدیریت لود تصاویر و نمایش پِلیس‌هولدر
function BannerThumbnail({ imageUrl }: { imageUrl: string }) {
  const [hasError, setHasError] = useState(false);

  // 🚀 وقتی آدرس تصویر تغییر می‌کند، وضعیت خطا را ریست می‌کنیم تا تصویر جدید نشان داده شود
  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  if (!imageUrl || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5EFE6]/50 dark:bg-[#1A0F0C]">
        <ImageIcon className="w-6 h-6 text-[#8C7A6B] dark:text-[#6A5A4F] mb-1" />
        <span className="text-[10px] font-bold text-[#8C7A6B] dark:text-[#6A5A4F]">محل قرارگیری تصویر</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt=""
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdBanner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdBanner | null>(null);
  const [activeSectionForNew, setActiveSectionForNew] = useState<SectionId | null>(null);

  const [formData, setFormData] = useState({
    imageUrl: "",
    link: "",
    alt: "",
    imageFile: null as File | null,
  });

  // Track if the preview image has failed to load in the modal
  const [imageError, setImageError] = useState(false);

  const handleOpenModal = (section: SectionId, banner?: AdBanner) => {
    setActiveSectionForNew(section);
    setImageError(false); // Reset error state on modal open
    
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        imageUrl: banner.imageUrl,
        link: banner.link,
        alt: banner.alt,
        imageFile: null,
      });
    } else {
      setEditingBanner(null);
      setFormData({ imageUrl: "", link: "", alt: "", imageFile: null });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageError(false); // Reset error state when a new file is chosen
      setFormData({
        ...formData,
        imageFile: file,
        imageUrl: URL.createObjectURL(file) 
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionForNew) return;

    if (editingBanner) {
      setBanners(prev => prev.map(b => b.id === editingBanner.id ? {
        ...b,
        imageUrl: formData.imageUrl,
        link: formData.link,
        alt: formData.alt
      } : b));
    } else {
      const newBanner: AdBanner = {
        id: `bn${Date.now()}`,
        section: activeSectionForNew,
        imageUrl: formData.imageUrl,
        link: formData.link,
        alt: formData.alt,
      };
      setBanners([...banners, newBanner]);
    }
    setIsModalOpen(false);
  };

  const renderBannerSection = (sectionId: SectionId) => {
    const config = SECTION_CONFIG[sectionId];
    const sectionBanners = banners.filter(b => b.section === sectionId);
    const isFull = sectionBanners.length >= config.max;

    return (
      <div key={sectionId} className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none mb-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317] bg-[#FCF9F5]/50 dark:bg-[#231511]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/30 dark:border-[#3c2317] flex items-center justify-center text-[#C68E58]">
              {config.icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-[#2C1E16] dark:text-white">{config.title}</h2>
              <p className="text-xs font-bold text-[#8C7A6B] mt-1">
                ظرفیت: {toFarsiNumber(sectionBanners.length)} از {toFarsiNumber(config.max)} بنر
              </p>
            </div>
          </div>
          
          <button
            onClick={() => handleOpenModal(sectionId)}
            disabled={isFull}
            className={`mt-4 sm:mt-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${
              isFull 
                ? "bg-gray-100 dark:bg-[#2A1B16] text-gray-400 dark:text-gray-600 cursor-not-allowed" 
                : "bg-[#C68E58]/10 hover:bg-[#C68E58] text-[#C68E58] hover:text-white"
            }`}
          >
            <Plus className="w-4 h-4" /> افزودن بنر
          </button>
        </div>

        {/* Section Content */}
        <div className="p-6">
          {sectionBanners.length === 0 ? (
            <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] text-sm font-bold flex flex-col items-center justify-center">
              <Layout className="w-12 h-12 opacity-20 mb-3" />
              هیچ بنری در این بخش ثبت نشده است.
            </div>
          ) : (
            <div className={`grid gap-6 ${sectionId === 'above_header' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
              {sectionBanners.map(banner => (
                <div key={banner.id} className="group relative rounded-2xl border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden bg-[#FCF9F5] dark:bg-[#231511] transition-all hover:border-[#C68E58]/50 hover:shadow-lg">
                  {/* Image Thumbnail */}
                  <div className={`relative overflow-hidden ${sectionId === 'above_header' ? 'h-24' : 'aspect-video'}`}>
                    
                    <BannerThumbnail imageUrl={banner.imageUrl} />
                    
                    {/* Hover Actions overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <button 
                        onClick={() => handleOpenModal(sectionId, banner)}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#C68E58] flex items-center justify-center transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-rose-500 text-white flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Banner Details */}
                  <div className="p-4 border-t border-[#F5EFE6] dark:border-[#3c2317]">
                    <h3 className="font-bold text-sm text-[#2C1E16] dark:text-white truncate mb-2" title={banner.alt}>
                      {banner.alt || "بدون عنوان جایگزین (Alt)"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#8C7A6B] dark:text-[#A1A1A1] dir-ltr text-left overflow-hidden">
                      <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{banner.link || "بدون لینک"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">بنرهای تبلیغاتی</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">مدیریت تصاویر تبلیغاتی در بخش‌های مختلف فروشگاه (Image / GIF)</p>
        </div>
      </div>

      {/* Render Sections */}
      {(Object.keys(SECTION_CONFIG) as SectionId[]).map(sectionId => renderBannerSection(sectionId))}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
                {editingBanner ? <Edit className="w-5 h-5 text-[#C68E58]" /> : <Plus className="w-5 h-5 text-[#C68E58]" />}
                {editingBanner ? "ویرایش بنر" : "افزودن بنر جدید"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-3 text-right">فایل بنر (JPG, PNG, GIF)</label>
                <div className={`relative border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all ${
                  formData.imageUrl && !imageError
                    ? "border-transparent h-40" 
                    : "border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#231511] h-40"
                }`}>
                  
                  {formData.imageUrl && !imageError ? (
                    <div className="relative w-full h-full group bg-black/5">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-2xl" 
                        onError={() => setImageError(true)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] rounded-2xl">
                        <label className="cursor-pointer bg-white/20 hover:bg-white text-white hover:text-[#C68E58] px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md transition-colors flex items-center gap-2">
                          <UploadCloud className="w-4 h-4" /> تغییر تصویر
                          <input type="file" accept="image/jpeg, image/png, image/gif, image/webp" className="hidden" onChange={handleImageChange} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-[#8C7A6B] dark:text-[#6A5A4F] p-4 text-center">
                      <ImagePlus className="w-8 h-8 mb-3" />
                      <span className="font-bold text-sm">برای انتخاب تصویر یا GIF کلیک کنید</span>
                      <span className="text-xs mt-2 opacity-70">حجم مجاز: حداکثر ۳ مگابایت</span>
                      <input type="file" required={!editingBanner} accept="image/jpeg, image/png, image/gif, image/webp" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              {/* Alt Text Input */}
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">عنوان جایگزین تصویر (Alt Text)</label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  style={{ textAlign: 'right', direction: 'rtl' }}
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-right"
                  placeholder="توضیح کوتاه برای سئو (مثال: بنر تخفیف تابستانه)..."
                />
              </div>

              {/* URL Link Input */}
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">لینک مقصد (URL)</label>
                <input
                  type="text"
                  dir="ltr"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left"
                  placeholder="https://example.com/offers"
                />
                <p className="text-[11px] text-[#8C7A6B] mt-2 text-right">لینک صفحه‌ای که کاربر با کلیک روی بنر به آن هدایت می‌شود.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors mt-4 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
              >
                {editingBanner ? "ذخیره تغییرات" : "ایجاد و انتشار بنر"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}