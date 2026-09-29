"use client";

import { useState, useEffect } from "react";
import { Upload, X, Plus, ImageIcon, Layers, Tag, Eye, Package, Minus } from "lucide-react";
import { ProductFormData } from "../../types/admin";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function ProductMediaSidebar({ formData, setFormData }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mainImageBroken, setMainImageBroken] = useState(false);

  // Dynamic States for Select Options
  const [categories, setCategories] = useState([
    { id: "coffee-beans", name: "دانه‌ قهوه" },
    { id: "instant-coffee", name: "قهوه فوری" },
    { id: "brewing-tools", name: "تجهیزات دم‌آوری" }
  ]);
  
  const [brands, setBrands] = useState([
    { id: "illy", name: "ایلی (illy)" },
    { id: "lavazza", name: "لاوازا (Lavazza)" },
    { id: "neo-roasters", name: "نئو روسترز" }
  ]);

  // Modal States
  const [activeModal, setActiveModal] = useState<"category" | "brand" | null>(null);
  const [newItemName, setNewItemName] = useState("");

  // Drag and Drop States
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
      setFormData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((g) => g !== src),
      }));
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value 
    }));
  };

  // Safe stock updaters
  const incrementStock = () => {
    setFormData((prev) => {
      const currentStock = (prev as any).stock ? Number((prev as any).stock) : 0;
      return { ...prev, stock: currentStock + 1 };
    });
  };

  const decrementStock = () => {
    setFormData((prev) => {
      const currentStock = (prev as any).stock ? Number((prev as any).stock) : 0;
      return { ...prev, stock: Math.max(0, currentStock - 1) };
    });
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) return;
    
    const newId = `custom-${Date.now()}`;
    const newItem = { id: newId, name: newItemName.trim() };

    if (activeModal === "category") {
      setCategories(prev => [...prev, newItem]);
      setFormData(prev => ({ ...prev, category: newId }));
    } else if (activeModal === "brand") {
      setBrands(prev => [...prev, newItem]);
      setFormData(prev => ({ ...prev, brand: newId }));
    }

    closeModal();
  };

  const closeModal = () => {
    setActiveModal(null);
    setNewItemName("");
  };

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
      const remainingSlots = 9 - (formData.gallery?.length || 0);
      const filesToAdd = files.slice(0, remainingSlots);
      const newImageUrls = filesToAdd.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newImageUrls],
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

  // Drag & Drop Handlers
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
    const newGallery = [...formData.gallery];
    const [draggedItem] = newGallery.splice(draggedIdx, 1);
    if (draggedItem) {
      newGallery.splice(index, 0, draggedItem);
      setFormData((prev) => ({ ...prev, gallery: newGallery }));
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
      {/* Images Section */}
      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors">
          <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3" dir="rtl">
            <ImageIcon className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> تصاویر
          </h2>
          <div className="text-xs font-bold text-[#8C7A6B] bg-[#FCF9F5] dark:bg-[#1A0F0C] px-3 py-1.5 rounded-xl flex items-center gap-1">
            <span dir="ltr">
              {((formData.gallery?.length || 0) + (hasMainImage ? 1 : 0)).toLocaleString("fa-IR")} / ۱۰
            </span>
            <span>تصویر</span>
          </div>
        </div>

        <div className="space-y-5" dir="rtl">
          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">تصویر اصلی</label>
            <div className="w-full h-48 bg-gray-50/50 dark:bg-[#1A0F0C] border-2 border-dashed border-gray-200 dark:border-[#3c2317] rounded-[2rem] flex flex-col items-center justify-center transition-all relative overflow-hidden group">
              {hasMainImage ? (
                <>
                  <img
                    src={formData.mainImage}
                    alt=""
                    onError={() => setMainImageBroken(true)}
                    className="w-full h-full object-contain p-2"
                  />
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
                  <Upload className="w-8 h-8 text-gray-300 dark:text-[#6A5A4F] mb-3 group-hover:text-[#C68E58] transition-colors group-hover:-translate-y-1 duration-300" />
                  <span className="text-sm font-bold text-gray-400 dark:text-[#8C7A6B] group-hover:text-[#C68E58]">آپلود تصویر اصلی</span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5">
              گالری تصاویر
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(formData.gallery || []).map((img, i) => (
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
                  <img
                    src={img}
                    alt=""
                    onError={() => removeGalleryImage(i)}
                    className="w-full h-full object-cover rounded-2xl pointer-events-none"
                  />
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
              {(formData.gallery?.length || 0) < 9 && (
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

      {/* Category & Brand Section */}
      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3 border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors" dir="rtl">
          <Layers className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> دسته‌بندی و برند
        </h2>
        
        <div className="space-y-5" dir="rtl">
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" /> دسته‌بندی
              </label>
              <button 
                type="button" 
                onClick={() => setActiveModal("category")}
                className="text-xs font-bold text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> افزودن دسته‌بندی
              </button>
            </div>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all cursor-pointer appearance-none">
              <option value="" disabled>انتخاب کنید...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" /> برند
              </label>
              <button 
                type="button"
                onClick={() => setActiveModal("brand")}
                className="text-xs font-bold text-[#C68E58] hover:text-[#A87242] dark:hover:text-[#EAE0D5] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> افزودن برند
              </button>
            </div>
            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all cursor-pointer appearance-none">
              <option value="" disabled>انتخاب کنید...</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stock Quantity Section */}
      <div className="bg-white dark:bg-[#231511] p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-[#3c2317] shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none transition-all space-y-6">
        <h2 className="font-bold text-[#2C1E16] dark:text-white text-lg flex items-center gap-3 border-b border-gray-100 dark:border-[#3c2317] pb-4 transition-colors" dir="rtl">
          <Package className="w-5 h-5 text-[#C68E58] dark:text-[#C68E58]" /> موجودی انبار
        </h2>
        
        <div className="space-y-5" dir="rtl">
          <div>
            <label className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2.5 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" /> تعداد در انبار
            </label>
            <div className="relative flex items-center group">
              <input 
                type="number" 
                name="stock" 
                value={(formData as any).stock ?? ""} 
                onChange={handleChange} 
                placeholder="مثال: ۵۰"
                min="0"
                className="w-full h-14 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-100 dark:border-[#3c2317] rounded-2xl px-5 text-[#2C1E16] dark:text-[#EAE0D5] focus:border-[#C68E58] dark:focus:border-[#C68E58] focus:ring-4 focus:ring-[#C68E58]/10 outline-none transition-all !text-right font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pl-[4.5rem]"
                dir="rtl"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center bg-white dark:bg-[#231511] border border-gray-100 dark:border-[#3c2317] rounded-xl overflow-hidden shadow-sm">
                <button 
                  type="button"
                  onClick={incrementStock}
                  className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-gray-50 dark:hover:bg-[#1A0F0C] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-100 dark:bg-[#3c2317]"></div>
                <button 
                  type="button"
                  onClick={decrementStock}
                  className="w-8 h-10 flex items-center justify-center text-[#8C7A6B] hover:text-[#C68E58] hover:bg-gray-50 dark:hover:bg-[#1A0F0C] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white dark:bg-[#231511] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-gray-100 dark:border-[#3c2317]">
            <h3 className="font-bold text-[#2C1E16] dark:text-white text-lg mb-5 text-right">
              {activeModal === "category" ? "افزودن دسته‌بندی جدید" : "افزودن برند جدید"}
            </h3>
            
            <input
              type="text"
              dir="rtl"
              placeholder={activeModal === "category" ? "مثال: تجهیزات جانبی" : "مثال: نسپرسو"}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewItem()}
              className="w-full h-12 bg-gray-50/50 dark:bg-[#1A0F0C] border border-gray-200 dark:border-[#3c2317] rounded-xl px-4 text-sm font-medium text-[#2C1E16] dark:text-white focus:border-[#C68E58] outline-none transition-colors mb-6 !text-right"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 h-12 bg-gray-100 dark:bg-[#1A0F0C] hover:bg-gray-200 dark:hover:bg-[#3c2317] text-[#4A3022] dark:text-[#EAE0D5] rounded-xl font-bold transition-colors"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleAddNewItem}
                disabled={!newItemName.trim()}
                className="flex-1 h-12 bg-[#C68E58] hover:bg-[#A87242] disabled:opacity-50 disabled:hover:bg-[#C68E58] text-white rounded-xl font-bold transition-colors"
              >
                ثبت و انتخاب
              </button>
            </div>
          </div>
        </div>
      )}

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