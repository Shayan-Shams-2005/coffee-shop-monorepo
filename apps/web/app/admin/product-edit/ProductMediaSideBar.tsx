// cSpell:disable
"use client";

import { useState } from "react";
import { Upload, X, Plus, ImageIcon, Layers, Tag, Eye, GripHorizontal } from "lucide-react";
import { ProductFormData } from "../../types/admin";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function ProductMediaSidebar({ formData, setFormData }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Drag and Drop States
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= Image Upload Handlers =================
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, mainImage: imageUrl }));
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentGalleryCount = formData.gallery.length;
      const remainingSlots = 9 - currentGalleryCount; 
      const filesToAdd = files.slice(0, remainingSlots);
      
      const newImageUrls = filesToAdd.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({ 
        ...prev, 
        gallery: [...prev.gallery, ...newImageUrls] 
      }));
    }
  };

  const handleGalleryImageReplace = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        gallery: prev.gallery.map((img, i) => (i === index ? imageUrl : img)),
      }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((p) => ({ ...p, gallery: p.gallery.filter((_, i) => i !== index) }));
  };

  // ================= Drag & Drop Reordering Handlers =================
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); 
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) {
      setDragOverIdx(null);
      return;
    }
    
    const newGallery = [...formData.gallery];
    const [draggedItem] = newGallery.splice(draggedIdx, 1);
    
    if (draggedItem) {
      newGallery.splice(index, 0, draggedItem);
      setFormData(prev => ({ ...prev, gallery: newGallery }));
    }
    
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors">
          <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> تصاویر
          </h2>
          <div className="text-xs font-bold text-[#8C7A6B] bg-[#FCF9F5] dark:bg-[#1A0F0C] px-3 py-1.5 rounded-xl flex items-center gap-1">
            <span dir="ltr">{(formData.gallery.length + (formData.mainImage ? 1 : 0)).toLocaleString("fa-IR")} / ۱۰</span>
            <span>تصویر</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">تصویر اصلی</label>
            <div className="w-full h-48 bg-gray-50/50 dark:bg-[#1A0F0C] border-2 border-dashed border-gray-200 dark:border-[#3c2317] rounded-[2rem] flex flex-col items-center justify-center transition-all relative overflow-hidden group">
              
              {formData.mainImage ? (
                <>
                  <img src={formData.mainImage} alt="" className="w-full h-full object-contain p-2" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-row items-center justify-center gap-6 transition-opacity z-20">
                    <button 
                      type="button"
                      onClick={() => setPreviewImage(formData.mainImage || null)}
                      className="flex flex-col items-center gap-2 text-white hover:text-[#C68E58] transition-colors"
                    >
                      <Eye className="w-7 h-7 drop-shadow-lg" />
                      <span className="text-xs font-bold drop-shadow-md">مشاهده</span>
                    </button>

                    <div className="w-px h-12 bg-white/20"></div>

                    <div className="relative flex flex-col items-center gap-2 text-white hover:text-[#C68E58] transition-colors cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMainImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                      />
                      <Upload className="w-7 h-7 drop-shadow-lg" />
                      <span className="text-xs font-bold drop-shadow-md">تغییر</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleMainImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <Upload className="w-8 h-8 text-gray-300 dark:text-[#6A5A4F] mb-3 group-hover:text-[#C68E58] dark:group-hover:text-[#C68E58] transition-colors group-hover:-translate-y-1 duration-300" />
                  <span className="text-sm font-bold text-gray-400 dark:text-[#8C7A6B] group-hover:text-[#C68E58]">آپلود تصویر اصلی</span>
                </>
              )}
            </div>
          </div>

          {/* Gallery Images Upload */}
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">
              گالری تصاویر
            </label>
            <div className="grid grid-cols-3 gap-3">
              {formData.gallery.map((img, i) => (
                <div 
                  key={img + i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`aspect-square bg-gray-50/50 dark:bg-[#1A0F0C] rounded-2xl relative flex items-center justify-center transition-all group cursor-grab active:cursor-grabbing
                    ${dragOverIdx === i ? "border-2 border-dashed border-[#C68E58] scale-95 opacity-80" : "border border-gray-100 dark:border-[#3c2317]"}
                    ${draggedIdx === i ? "opacity-40" : ""}
                  `}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-2xl pointer-events-none" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-row items-center justify-center gap-3 transition-opacity z-10 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setPreviewImage(img)}
                      className="text-white hover:text-[#C68E58] transition-colors p-1"
                      title="مشاهده"
                    >
                      <Eye className="w-5 h-5 drop-shadow-md" />
                    </button>

                    <div className="w-px h-6 bg-white/30"></div>

                    <div className="relative text-white hover:text-[#C68E58] transition-colors cursor-pointer p-1" title="تغییر">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleGalleryImageReplace(i, e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                      />
                      <Upload className="w-5 h-5 drop-shadow-md" />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => removeGalleryImage(i)} 
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 hover:scale-110 transition-transform z-20 opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {formData.gallery.length < 9 && (
                <div className="aspect-square bg-gray-50/50 dark:bg-[#1A0F0C] border-2 border-dashed border-gray-200 dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] rounded-2xl flex items-center justify-center cursor-pointer transition-colors group relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleGalleryUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <Plus className="w-6 h-6 text-gray-300 dark:text-[#6A5A4F] group-hover:text-[#C68E58]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3 border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors">
          <Layers className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> دسته‌بندی و برند
        </h2>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-400" /> دسته‌بندی
            </label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all cursor-pointer">
              <option value="coffee-beans">دانه‌ قهوه</option>
              <option value="instant-coffee">قهوه فوری</option>
              <option value="brewing-tools">تجهیزات دم‌آوری</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" /> برند
            </label>
            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all cursor-pointer">
              <option value="illy">ایلی (illy)</option>
              <option value="lavazza">لاوازا (Lavazza)</option>
              <option value="neo-roasters">نئو روسترز</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= Lightbox / Image Preview Modal ================= */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full flex justify-center">
            <button 
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 sm:-right-12 p-2 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </>
  );
}