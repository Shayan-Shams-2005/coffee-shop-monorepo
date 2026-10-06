// app/admin/products/edit/components/sidebar/ImageSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Upload, X, Plus, ImageIcon, Eye } from "lucide-react";
import { ProductFormData } from "../../types";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function ImageSection({ formData, setFormData }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mainImageBroken, setMainImageBroken] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const hasMainImage = Boolean(formData.mainImage?.trim()) && !mainImageBroken;

  useEffect(() => {
    setMainImageBroken(false);
    const src = formData.mainImage?.trim();
    if (!src) return;
    let cancelled = false;
    const probe = new window.Image();
    probe.onerror = () => { if (!cancelled) setMainImageBroken(true); };
    probe.src = src;
    return () => { cancelled = true; };
  }, [formData.mainImage]);

  useEffect(() => {
    if (!formData.gallery || formData.gallery.length === 0) return;
    let cancelled = false;
    
    const removeFromGallery = (src: string) => {
      if (cancelled) return;
      setFormData((prev: any) => {
        const index = prev.gallery.indexOf(src);
        const newGalleryFiles = prev.galleryFiles ? [...prev.galleryFiles] : [];
        if (index > -1) newGalleryFiles.splice(index, 1);
        return {
          ...prev,
          gallery: prev.gallery.filter((g: string) => g !== src),
          galleryFiles: newGalleryFiles
        };
      });
    };

    formData.gallery.forEach((src) => {
      if (!src || !src.trim()) {
        removeFromGallery(src);
        return;
      }
      const probe = new window.Image();
      probe.onerror = () => removeFromGallery(src);
      probe.src = src;
    });
    return () => { cancelled = true; };
  }, [formData.gallery, setFormData]);

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev: any) => ({ ...prev, mainImage: imageUrl, mainImageFile: file }));
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingSlots = 9 - (formData.gallery?.length || 0);
      const filesToAdd = files.slice(0, remainingSlots);
      const newImageUrls = filesToAdd.map((file) => URL.createObjectURL(file));
      
      setFormData((prev: any) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newImageUrls],
        galleryFiles: [...(prev.galleryFiles || []), ...filesToAdd], 
      }));
    }
  };

  const handleGalleryImageReplace = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev: any) => {
        const newGallery = [...(prev.gallery || [])];
        newGallery[index] = imageUrl;
        const newGalleryFiles = [...(prev.galleryFiles || [])];
        newGalleryFiles[index] = file; 
        return { ...prev, gallery: newGallery, galleryFiles: newGalleryFiles };
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev: any) => {
      const newGalleryFiles = prev.galleryFiles ? [...prev.galleryFiles] : [];
      newGalleryFiles.splice(index, 1);
      return { 
        ...prev, 
        gallery: prev.gallery.filter((_: any, i: number) => i !== index),
        galleryFiles: newGalleryFiles
      };
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIdx !== index) setDragOverIdx(index);
  };
  
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) {
      setDragOverIdx(null);
      return;
    }
    setFormData((prev: any) => {
      const newGallery = [...(prev.gallery || [])];
      const newGalleryFiles = [...(prev.galleryFiles || [])];
      
      const [draggedItem] = newGallery.splice(draggedIdx, 1);
      if (draggedItem) newGallery.splice(index, 0, draggedItem);

      if (newGalleryFiles.length > draggedIdx) {
        const [draggedFileItem] = newGalleryFiles.splice(draggedIdx, 1);
        if (draggedFileItem) newGalleryFiles.splice(index, 0, draggedFileItem);
      }

      setDraggedIdx(null);
      setDragOverIdx(null);
      return { ...prev, gallery: newGallery, galleryFiles: newGalleryFiles };
    });
  };
  
  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <>
      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] p-6 sm:p-8 rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <div className="flex justify-between items-center border-b border-[#E3C3A4]/60 dark:border-[#3c2317] pb-4 transition-colors">
          <h2 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] text-lg flex items-center gap-3" dir="rtl">
            <ImageIcon className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> تصاویر
          </h2>
          <div className="text-xs font-bold text-[#8C7A6B] bg-white dark:bg-[#231511] border border-[#E3C3A4]/40 dark:border-[#3c2317] px-3 py-1.5 rounded-xl flex items-center gap-1">
            <span dir="ltr">
              {((formData.gallery?.length || 0) + (hasMainImage ? 1 : 0)).toLocaleString("fa-IR")} / ۱۰
            </span>
            <span>تصویر</span>
          </div>
        </div>

        <div className="space-y-5" dir="rtl">
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">تصویر اصلی</label>
            <div className="w-full h-48 bg-white dark:bg-[#231511] border-2 border-dashed border-[#E3C3A4]/80 dark:border-[#3c2317] rounded-[2rem] flex flex-col items-center justify-center transition-all relative overflow-hidden group">
              {hasMainImage ? (
                <>
                  <img src={formData.mainImage} alt="" onError={() => setMainImageBroken(true)} className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-row items-center justify-center gap-6 transition-opacity z-20">
                    <button type="button" onClick={() => setPreviewImage(formData.mainImage || null)} className="flex flex-col items-center gap-2 text-white hover:text-[#C68E58] transition-colors">
                      <Eye className="w-7 h-7 drop-shadow-lg" />
                      <span className="text-xs font-bold drop-shadow-md">مشاهده</span>
                    </button>
                    <div className="w-px h-12 bg-white/20"></div>
                    <div className="relative flex flex-col items-center gap-2 text-white hover:text-[#C68E58] transition-colors cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleMainImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" />
                      <Upload className="w-7 h-7 drop-shadow-lg" />
                      <span className="text-xs font-bold drop-shadow-md">تغییر</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <input type="file" accept="image/*" onChange={handleMainImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <Upload className="w-8 h-8 text-[#8C7A6B] dark:text-[#6A5A4F] mb-3 group-hover:text-[#C68E58] transition-colors group-hover:-translate-y-1 duration-300" />
                  <span className="text-sm font-bold text-[#8C7A6B] group-hover:text-[#C68E58]">آپلود تصویر اصلی</span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">گالری تصاویر</label>
            <div className="grid grid-cols-3 gap-3">
              {(formData.gallery || []).map((img, i) => (
                <div key={img + i} draggable onDragStart={(e) => handleDragStart(e, i)} onDragOver={(e) => handleDragOver(e, i)} onDrop={(e) => handleDrop(e, i)} onDragEnd={handleDragEnd} className={`aspect-square bg-white dark:bg-[#231511] rounded-2xl relative flex items-center justify-center transition-all group cursor-grab active:cursor-grabbing ${dragOverIdx === i ? "border-2 border-dashed border-[#C68E58] scale-95 opacity-80" : "border border-[#E3C3A4]/60 dark:border-[#3c2317]"} ${draggedIdx === i ? "opacity-40" : ""}`}>
                  <img src={img} alt="" onError={() => removeGalleryImage(i)} className="w-full h-full object-cover rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-row items-center justify-center gap-3 transition-opacity z-10 rounded-2xl">
                    <button type="button" onClick={() => setPreviewImage(img)} className="text-white hover:text-[#C68E58] transition-colors p-1" title="مشاهده">
                      <Eye className="w-5 h-5 drop-shadow-md" />
                    </button>
                    <div className="w-px h-6 bg-white/30"></div>
                    <div className="relative text-white hover:text-[#C68E58] transition-colors cursor-pointer p-1" title="تغییر">
                      <input type="file" accept="image/*" onChange={(e) => handleGalleryImageReplace(i, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" />
                      <Upload className="w-5 h-5 drop-shadow-md" />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 hover:scale-110 transition-transform z-20 opacity-0 group-hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {(formData.gallery?.length || 0) < 9 && (
                <div className="aspect-square bg-white dark:bg-[#231511] border-2 border-dashed border-[#E3C3A4]/80 dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] rounded-2xl flex items-center justify-center cursor-pointer transition-colors group relative">
                  <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <Plus className="w-6 h-6 text-[#8C7A6B] dark:text-[#6A5A4F] group-hover:text-[#C68E58]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl w-full flex justify-center">
            <button type="button" onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 sm:-right-12 p-2 bg-white/10 hover:bg-rose-500 text-white rounded-full transition-colors z-10">
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </>
  );
}