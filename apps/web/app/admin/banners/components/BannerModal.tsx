// app/admin/banners/components/BannerModal.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { X, Edit, Plus, UploadCloud, ImagePlus, Crop, Check } from "lucide-react";
import { AdBanner, SectionId } from "../types";

const Cropper = dynamic(() => import("react-easy-crop"), { 
  ssr: false,
  loading: () => <div className="p-10 text-center font-bold text-[#8C7A6B]">در حال بارگذاری ابزار برش...</div>
}) as any;

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
}

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionId | null;
  editingBanner: AdBanner | null;
  onSubmit: (data: Omit<AdBanner, "id">) => void;
}

const ASPECT_RATIOS: Record<string, number> = {
  above_header: 10 / 1,
  main_slideshow: 21 / 9,
  search_menu: 2.5 / 1,
  under_offers: 16 / 9,
  under_newest: 16 / 9,
  under_brands: 16 / 9,
};

export function BannerModal({ isOpen, onClose, activeSection, editingBanner, onSubmit }: BannerModalProps) {
  const [formData, setFormData] = useState({ imageUrl: "", link: "", alt: "" });
  const [imageError, setImageError] = useState(false);

  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setRawImage(null);
      setIsCropping(false);
      if (editingBanner) {
        setFormData({ imageUrl: editingBanner.imageUrl, link: editingBanner.link, alt: editingBanner.alt });
      } else {
        setFormData({ imageUrl: "", link: "", alt: "" });
      }
    }
  }, [isOpen, editingBanner]);

  // 🚀 FIXED: Moved useCallback ABOVE the early return to respect React's Rule of Hooks
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPx: any) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  // Early return must happen AFTER all hooks
  if (!isOpen || !activeSection) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageError(false);
      const url = URL.createObjectURL(file);
      
      if (file.type === "image/gif") {
        setFormData(prev => ({ ...prev, imageUrl: url }));
        return;
      }

      setRawImage(url);
      setIsCropping(true);
      setCrop({ x: 0, y: 0 });
    }
  };

  const handleApplyCrop = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    try {
      setIsProcessingCrop(true);
      const croppedImageUrl = await getCroppedImg(rawImage, croppedAreaPixels);
      setFormData(prev => ({ ...prev, imageUrl: croppedImageUrl }));
      setIsCropping(false);
      setRawImage(null);
    } catch (e) {
      console.error(e);
      alert("خطا در پردازش تصویر");
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      section: activeSection,
      imageUrl: formData.imageUrl,
      link: formData.link,
      alt: formData.alt,
    });
  };

  let previewClass = "aspect-video";
  if (activeSection === 'above_header') previewClass = "h-14 sm:h-20";
  if (activeSection === 'main_slideshow') previewClass = "aspect-[21/9] sm:aspect-[3/1]";
  if (activeSection === 'search_menu') previewClass = "aspect-[2.5/1]";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#FCF9F5] dark:bg-[#1A1412] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-white dark:bg-[#1A0F0C] shrink-0">
          <h2 className="text-lg font-black text-[#4A3022] dark:text-white flex items-center gap-2">
            {isCropping ? <Crop className="w-5 h-5 text-[#C68E58]" /> : (editingBanner ? <Edit className="w-5 h-5 text-[#C68E58]" /> : <Plus className="w-5 h-5 text-[#C68E58]" />)}
            {isCropping ? "تنظیم کادر تصویر" : (editingBanner ? "ویرایش بنر" : "افزودن بنر جدید")}
          </h2>
          <button onClick={isCropping ? () => setIsCropping(false) : onClose} className="text-[#8C7A6B] hover:text-[#4A3022] dark:text-[#A1A1A1] dark:hover:text-white transition-colors p-1 bg-[#FCF9F5] dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {isCropping && rawImage ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-sm font-bold text-[#8C7A6B] dark:text-[#A1A1A1] w-full text-center mb-2">
                کادر را روی تصویر جابجا کنید. ابعاد این کادر ثابت و دقیقاً مطابق سایت تنظیم شده است.
              </div>
              <div className="relative w-full h-[50vh] bg-black rounded-2xl overflow-hidden shadow-inner border border-[#3c2317]">
                <Cropper
                  image={rawImage}
                  crop={crop}
                  zoom={1}
                  aspect={ASPECT_RATIOS[activeSection as string] || 16/9}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  zoomWithScroll={false} 
                  showGrid={true}
                />
              </div>
              <button
                onClick={handleApplyCrop}
                disabled={isProcessingCrop}
                className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {isProcessingCrop ? "در حال پردازش..." : "تایید و برش تصویر"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-3 text-right justify-between items-end">
                  <span>فایل بنر (تصویر ثابت یا GIF)</span>
                  <span className="text-[10px] bg-[#C68E58]/10 text-[#C68E58] px-2 py-0.5 rounded-md">پیش‌نمایش در اندازه سایت</span>
                </label>
                
                <div className={`relative border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all bg-white dark:bg-[#231511] w-full ${previewClass} ${
                  formData.imageUrl && !imageError ? "border-transparent" : "border-[#E3C3A4]/80 dark:border-[#3c2317] hover:border-[#C68E58] hover:bg-[#F5EFE6]/50 dark:hover:bg-[#2A1B16] min-h-[160px]"
                }`}>
                  {formData.imageUrl && !imageError ? (
                    <div className="relative w-full h-full group bg-black/5">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={() => setImageError(true)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <label className="cursor-pointer bg-white/20 hover:bg-white text-white hover:text-[#C68E58] px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md transition-colors flex items-center gap-2">
                          <UploadCloud className="w-4 h-4" /> تغییر تصویر
                          <input type="file" accept="image/jpeg, image/png, image/webp, image/gif" className="hidden" onChange={handleImageChange} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-[#8C7A6B] dark:text-[#6A5A4F] p-4 text-center">
                      <ImagePlus className="w-8 h-8 mb-3" />
                      <span className="font-bold text-sm">برای انتخاب تصویر یا GIF کلیک کنید</span>
                      <span className="text-xs mt-2 opacity-70">اگر تصویر بزرگتر باشد، به صورت خودکار کادر برش باز می‌شود.</span>
                      <input type="file" required={!editingBanner} accept="image/jpeg, image/png, image/webp, image/gif" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">عنوان جایگزین (Alt Text)</label>
                <input
                  type="text"
                  required
                  style={{ textAlign: 'right', direction: 'rtl' }}
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
                  placeholder="مثال: جشنواره فروش پاییزه..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">لینک مقصد (URL)</label>
                <input
                  type="text"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all text-left dir-ltr"
                  placeholder="https://example.com/offers"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white font-bold py-3.5 rounded-xl transition-colors mt-4 shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none"
              >
                {editingBanner ? "ذخیره تغییرات" : "ایجاد و انتشار بنر"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}