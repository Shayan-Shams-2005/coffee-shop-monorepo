// cSpell:disable
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, X, Image as ImageIcon, 
  Tag, Package, ChevronDown, ChevronUp, CornerDownLeft, 
  Coffee, Wrench, ImagePlus, Folder
} from "lucide-react";

// Imported the brands data and interface from config
import { Brand, brandsData } from "../../../config/brands";

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type UIBrand = Omit<Brand, "category"> & {
  category: string;
  image: string | null;
  productCount: number;
};

const initialBrands: UIBrand[] = brandsData.map((b, index) => ({
  ...b,
  image: null,
  productCount: (index * 7) % 50 + 5,
}));

const getCategoryTitle = (cat: string) => {
  if (cat === "coffee") return "برندهای دانه و قهوه";
  if (cat === "equipment") return "برندهای تجهیزات و اکسسوری";
  return `برندهای ${cat}`;
};

const getCategoryShortName = (cat: string) => {
  if (cat === "coffee") return "دانه و قهوه";
  if (cat === "equipment") return "تجهیزات";
  return cat;
};

const getCategoryIcon = (cat: string, isLarge = false) => {
  const sizeClass = isLarge ? "" : "w-4 h-4";
  const stroke = isLarge ? 1.5 : undefined;

  if (cat === "coffee") return <Coffee className={sizeClass} strokeWidth={stroke} />;
  if (cat === "equipment") return <Wrench className={sizeClass} strokeWidth={stroke} />;
  return <Folder className={sizeClass} strokeWidth={stroke} />;
};

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<UIBrand[]>(initialBrands);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["coffee", "equipment"]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<UIBrand | null>(null);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(brands.map(b => b.category)));
  }, [brands]);

  const [formData, setFormData] = useState({
    name: "",
    enName: "",
    category: "",
    isNewCategory: false,
    newCategoryName: "",
    image: null as File | null,
    imagePreview: "",
  });

  const toggleExpand = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleOpenModal = (brand?: UIBrand, defaultCategory?: string) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        enName: brand.enName,
        category: brand.category,
        isNewCategory: false,
        newCategoryName: "",
        image: null,
        imagePreview: brand.image || "",
      });
    } else {
      setEditingBrand(null);
      setFormData({ 
        name: "", 
        enName: "", 
        category: defaultCategory || (uniqueCategories[0] ?? "coffee"), 
        isNewCategory: false,
        newCategoryName: "",
        image: null, 
        imagePreview: "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = formData.isNewCategory && formData.newCategoryName.trim() !== "" 
      ? formData.newCategoryName.trim() 
      : formData.category;

    if (editingBrand) {
      setBrands(prev => prev.map(b => b.id === editingBrand.id ? {
        ...b,
        name: formData.name,
        enName: formData.enName,
        category: finalCategory,
        image: formData.imagePreview || b.image
      } : b));
    } else {
      const newBrandId = `b${Date.now()}`;
      const newBrand: UIBrand = {
        id: newBrandId,
        name: formData.name,
        enName: formData.enName,
        category: finalCategory,
        image: formData.imagePreview || null,
        productCount: 0,
      };
      setBrands([...brands, newBrand]);
      
      if (!expandedGroups.includes(finalCategory)) {
        setExpandedGroups(prev => [...prev, finalCategory]);
      }
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file) 
      });
    }
  };

  const renderBrandGroup = (categoryName: string, groupBrands: UIBrand[]) => {
    const isExpanded = expandedGroups.includes(categoryName);
    const title = getCategoryTitle(categoryName);
    const icon = getCategoryIcon(categoryName, true);

    return (
      <div key={categoryName} className="border border-[#F5EFE6] dark:border-[#3c2317] rounded-2xl mb-4 overflow-hidden">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl transition-colors border group bg-[#FCF9F5] dark:bg-[#231511] border-[#F5EFE6] dark:border-[#3c2317] hover:bg-[#F5EFE6]/50 dark:hover:bg-[#2A1B16] mt-4 mx-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleExpand(categoryName)}
                className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] transition-colors shrink-0 bg-white dark:bg-[#1A0F0C] shadow-sm"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/30 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0 text-[#C68E58]">
                {icon}
              </div>

              <div>
                <h3 className="font-bold text-[#2C1E16] dark:text-white text-lg">
                  {title}
                </h3>
                <p className="text-xs font-bold text-[#8C7A6B] mt-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {toFarsiNumber(groupBrands.length)} برند ثبت شده
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 transition-all pr-4">
              <button
                onClick={() => handleOpenModal(undefined, categoryName)}
                className="flex items-center gap-2 text-xs font-bold text-[#C68E58] bg-[#C68E58]/10 hover:bg-[#C68E58] hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> افزودن به این گروه
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="pl-4 pr-12 border-t border-[#F5EFE6] dark:border-[#3c2317] pt-2 pb-4">
              {groupBrands.length === 0 ? (
                <div className="text-center py-6 text-[#8C7A6B] dark:text-[#6A5A4F] text-sm font-bold">
                  هیچ برندی در این گروه یافت نشد.
                </div>
              ) : (
                groupBrands.map(brand => (
                  <div 
                    key={brand.id} 
                    className="flex items-center justify-between p-3 rounded-xl transition-colors border-transparent hover:border-[#F5EFE6] dark:hover:border-[#3c2317] hover:bg-[#FCF9F5] dark:hover:bg-[#231511] group mb-2 border"
                  >
                    <div className="flex items-center gap-3">
                      <CornerDownLeft className="w-4 h-4 text-gray-300 dark:text-[#3c2317] opacity-50 shrink-0 mr-2" />
                      <div className="w-8 shrink-0"></div>

                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/30 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0">
                        {brand.image ? (
                          <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Tag className="w-4 h-4 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-bold text-base text-[#2C1E16] dark:text-white">
                          {brand.name}
                        </h3>
                        <span className="text-xs font-medium text-[#8C7A6B] dir-ltr text-right">
                          {brand.enName}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 transition-all">
                      <Link 
                        href={`/admin/products?brand=${encodeURIComponent(brand.name)}`} 
                        className="flex items-center gap-2 text-xs font-bold transition-all active:scale-95 text-[#8C7A6B] dark:text-[#A1A1A1] bg-[#FCF9F5] dark:bg-[#2A1B16] px-3 py-1.5 rounded-lg border border-transparent hover:bg-white dark:hover:bg-[#3A221C] hover:text-[#C68E58] dark:hover:text-[#FFD7BA]"
                      >
                        <Package className="w-3.5 h-3.5" />
                        {toFarsiNumber(brand.productCount)} کالا
                      </Link>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleOpenModal(brand)} 
                          className="p-1.5 text-gray-400 hover:text-[#C68E58] transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-[#3A221C]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(brand.id)} 
                          className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* 🚀 Bulletproof global style specifically for these Persian inputs */}
      <style dangerouslySetInnerHTML={{__html: `
        .strict-persian-input {
          text-align: right !important;
          direction: rtl !important;
        }
        .strict-persian-input::placeholder {
          text-align: right !important;
          direction: rtl !important;
        }
      `}} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">مدیریت برندها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">افزودن، ویرایش و مدیریت گروه‌ها و برندهای مختلف</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#C68E58] dark:hover:bg-[#A87242] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> افزودن برند جدید
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        <div>
          {uniqueCategories.map(cat => {
            const groupBrands = brands.filter(b => b.category === cat);
            return renderBrandGroup(cat, groupBrands);
          })}
          
          {uniqueCategories.length === 0 && (
            <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold">
              هنوز هیچ برندی ثبت نشده است.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-white">
                {editingBrand ? "ویرایش برند" : "افزودن برند جدید"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar" dir="rtl">
              
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">نام برند (فارسی)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  // 🚀 Applied strict CSS class to guarantee right-alignment
                  className="strict-persian-input w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
                  placeholder="مثال: نسپرسو"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">نام برند (انگلیسی)</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={formData.enName}
                  onChange={(e) => setFormData({ ...formData, enName: e.target.value })}
                  // Explicit inline LTR and left-align for English inputs
                  style={{ textAlign: 'left', direction: 'ltr' }}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
                  placeholder="Example: Nespresso"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">گروه برند</label>
                {formData.isNewCategory ? (
                  <div className="flex gap-2 w-full" dir="rtl">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        required
                        value={formData.newCategoryName}
                        onChange={(e) => setFormData({ ...formData, newCategoryName: e.target.value })}
                        // 🚀 Applied strict CSS class to guarantee right-alignment
                        className="strict-persian-input w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#C68E58] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
                        // 🚀 Reordered dots to strictly appear at the logical end (left visually) 
                        placeholder="نام گروه جدید..." 
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isNewCategory: false, newCategoryName: "" })}
                      className="px-6 py-3 bg-gray-100 dark:bg-[#2A1B16] text-[#8C7A6B] rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3c2317] transition-colors shrink-0"
                    >
                      انصراف
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {uniqueCategories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${
                          formData.category === cat
                            ? "bg-[#C68E58]/10 border-[#C68E58] text-[#C68E58]"
                            : "bg-[#FCF9F5] dark:bg-[#231511] border-[#E3C3A4]/50 dark:border-[#3c2317] text-[#8C7A6B] hover:border-[#C68E58]/50"
                        }`}
                      >
                        {getCategoryIcon(cat)} {getCategoryShortName(cat)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isNewCategory: true, category: "" })}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#C68E58] text-[#C68E58] text-sm font-bold hover:bg-[#C68E58]/10 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> گروه جدید
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 text-right">لوگوی برند</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#FCF9F5] dark:bg-[#231511] border border-dashed border-[#C68E58]/50 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.imagePreview ? (
                      <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImagePlus className="w-8 h-8 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="brand-image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="brand-image"
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-[#2A1B16] border border-[#E3C3A4] dark:border-[#3c2317] rounded-lg text-sm font-bold text-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#3A221C] transition-colors w-full"
                    >
                      انتخاب تصویر جدید
                    </label>
                    <p className="text-xs text-[#8C7A6B] mt-2 text-right">فرمت‌های مجاز: JPG, PNG (حداکثر ۲ مگابایت)</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors mt-2 sticky bottom-0"
              >
                {editingBrand ? "ذخیره تغییرات" : "ایجاد برند"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}