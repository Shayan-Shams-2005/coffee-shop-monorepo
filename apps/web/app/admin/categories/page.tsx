// cSpell:disable
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, Edit, Trash2, X, Image as ImageIcon, 
  FolderTree, Folder, Package, ChevronDown, 
  ChevronUp, CornerDownLeft, PackageSearch 
} from "lucide-react";

// Import your mock data based on your folder structure
import { megaMenuCategories, MenuCategory } from "../../../config/menu";

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

// Types
export type Category = {
  id: number;
  name: string;
  parentId: number | null; // null means it's a Main Category
  image: string | null;
  productCount: number;
};

// ==========================================
// Initial Data Generation from Imported Menu Data
// ==========================================
const generateInitialCategories = (data: MenuCategory[]): Category[] => {
  let currentId = 1;
  const flatCategories: Category[] = [];

  data.forEach(mainCat => {
    const mainCatId = currentId++;
    flatCategories.push({
      id: mainCatId,
      name: mainCat.title,
      parentId: null,
      image: null, // Default to null so the PackageSearch icon shows
      productCount: (mainCatId * 7) % 50 + 10,
    });

    mainCat.sections.forEach(section => {
      const sectionId = currentId++;
      flatCategories.push({
        id: sectionId,
        name: section.title,
        parentId: mainCatId,
        image: null,
        productCount: (sectionId * 5) % 20 + 5,
      });

      section.items.forEach(item => {
        const itemId = currentId++;
        flatCategories.push({
          id: itemId,
          name: item,
          parentId: sectionId, 
          image: null,
          productCount: (itemId * 3) % 15 + 1,
        });
      });
    });
  });

  return flatCategories;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(generateInitialCategories(megaMenuCategories));
  const [expandedCats, setExpandedCats] = useState<number[]>([1]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    parentId: "null",
    image: null as File | null,
    imagePreview: "",
  });

  const mainCategories = useMemo(() => categories.filter(c => c.parentId === null), [categories]);
  
  const getSubcategories = (parentId: number) => {
    return categories.filter(c => c.parentId === parentId);
  };

  const toggleExpand = (id: number) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        parentId: category.parentId === null ? "null" : category.parentId.toString(),
        image: null,
        imagePreview: category.image || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", parentId: "null", image: null, imagePreview: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const getAllChildrenIds = (parentId: number): number[] => {
      const children = categories.filter(c => c.parentId === parentId);
      let ids = children.map(c => c.id);
      children.forEach(c => {
        ids = [...ids, ...getAllChildrenIds(c.id)];
      });
      return ids;
    };

    const idsToDelete = [id, ...getAllChildrenIds(id)];
    setCategories(prev => prev.filter(c => !idsToDelete.includes(c.id)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? {
        ...c,
        name: formData.name,
        parentId: formData.parentId === "null" ? null : parseInt(formData.parentId),
        image: formData.imagePreview || c.image
      } : c));
    } else {
      const newCatId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      const newCat: Category = {
        id: newCatId,
        name: formData.name,
        parentId: formData.parentId === "null" ? null : parseInt(formData.parentId),
        image: formData.imagePreview || null,
        productCount: 0,
      };
      setCategories([...categories, newCat]);
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

  const renderCategoryNode = (category: Category, level: number = 0) => {
    const subcats = getSubcategories(category.id);
    const isExpanded = expandedCats.includes(category.id);
    const hasChildren = subcats.length > 0;

    // Dynamically calculate image sizes based on depth level
    const imageSizeClasses = level === 0 ? "w-12 h-12 rounded-xl" : level === 1 ? "w-10 h-10 rounded-lg" : "w-8 h-8 rounded-md";
    const imageIconSize = level === 0 ? "w-6 h-6" : level === 1 ? "w-5 h-5" : "w-4 h-4";

    return (
      <div key={category.id} className="space-y-3">
        <div 
          className={`flex items-center justify-between p-3 rounded-xl transition-colors border group ${
            level === 0 
              ? "bg-[#FCF9F5] dark:bg-[#231511] border-[#F5EFE6] dark:border-[#3c2317] hover:bg-[#F5EFE6]/50 dark:hover:bg-[#2A1B16] mt-4" 
              : "bg-white dark:bg-[#1A0F0C] border-transparent hover:border-[#F5EFE6] dark:hover:border-[#3c2317] hover:bg-[#FCF9F5] dark:hover:bg-[#231511]"
          }`}
          style={{ marginRight: level > 0 ? `${(level - 1) * 20}px` : '0px' }}
        >
          <div className="flex items-center gap-3">
            {level > 1 && (
               <CornerDownLeft className="w-4 h-4 text-gray-300 dark:text-[#3c2317] opacity-50 shrink-0 mr-2" />
            )}

            {hasChildren ? (
              <button 
                onClick={() => toggleExpand(category.id)}
                className={`p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] transition-colors shrink-0 ${level === 0 ? "bg-white dark:bg-[#1A0F0C] shadow-sm" : ""}`}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            ) : (
              <div className="w-8 shrink-0"></div>
            )}

            {/* Render Category Image or Default PackageSearch Icon for ALL levels */}
            <div className={`${imageSizeClasses} bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/30 dark:border-[#3c2317] flex items-center justify-center overflow-hidden shrink-0`}>
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <PackageSearch className={`${imageIconSize} text-[#8C7A6B] dark:text-[#6A5A4F]`} strokeWidth={1.5} />
              )}
            </div>

            <div>
              <h3 className={`font-bold text-[#2C1E16] dark:text-white ${level === 0 ? 'text-lg' : level === 1 ? 'text-base' : 'text-sm text-[#4A3022] dark:text-[#EAE0D5]'}`}>
                {category.name}
              </h3>
              {level === 0 && (
                <p className="text-xs font-bold text-[#8C7A6B] mt-1 flex items-center gap-1">
                  <Folder className="w-3 h-3" /> {toFarsiNumber(subcats.length)} زیرمجموعه مستقیم
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 transition-all">
            
            <Link 
              href={`/admin/products?category=${encodeURIComponent(category.name)}`} 
              className={`flex items-center gap-2 text-xs font-bold transition-all active:scale-95 ${
                level === 0 
                  ? "text-[#4A3022] dark:text-[#EAE0D5] bg-white dark:bg-[#1A0F0C] px-3 py-1.5 rounded-lg border border-[#F5EFE6] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] hover:text-[#C68E58] shadow-sm" 
                  : "text-[#8C7A6B] dark:text-[#A1A1A1] bg-[#FCF9F5] dark:bg-[#2A1B16] px-3 py-1.5 rounded-lg border border-transparent hover:bg-white dark:hover:bg-[#3A221C] hover:text-[#C68E58] dark:hover:text-[#FFD7BA]"
              }`}
            >
              <Package className={`w-3.5 h-3.5 ${level === 0 ? "text-[#C68E58]" : ""}`} />
              {toFarsiNumber(category.productCount)} کالا
            </Link>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleOpenModal(category)} 
                className={`p-1.5 text-gray-400 hover:text-[#C68E58] transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-[#3A221C] ${level === 0 ? "p-2" : ""}`}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(category.id)} 
                className={`p-1.5 text-gray-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 ${level === 0 ? "p-2" : ""}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className={`${level === 0 ? "pl-4 pr-12 border-t border-[#F5EFE6] dark:border-[#3c2317] pt-2" : "pr-4 border-r border-[#F5EFE6] dark:border-[#3c2317] mr-12"}`}>
            {subcats.map(sub => renderCategoryNode(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">ساختاردهی، ویرایش و افزودن گروه‌های کالایی</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#C68E58] dark:hover:bg-[#A87242] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> افزودن دسته جدید
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        <div>
          {mainCategories.map((mainCat) => (
             <div key={mainCat.id} className="border border-[#F5EFE6] dark:border-[#3c2317] rounded-2xl mb-4 overflow-hidden">
                {renderCategoryNode(mainCat, 0)}
             </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317]">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-white">
                {editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">نام دسته‌بندی</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all"
                  placeholder="مثال: قهوه اسپرسو"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">دسته‌بندی والد (اختیاری)</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full bg-[#FCF9F5] dark:bg-[#231511] border border-[#E3C3A4] dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#2C1E16] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 transition-all appearance-none"
                >
                  <option value="null">بدون والد (دسته اصلی)</option>
                  
                  {categories.filter(c => c.id !== editingCategory?.id).map(cat => {
                     let depth = 0;
                     let currentParent = cat.parentId;
                     while (currentParent !== null) {
                        depth++;
                        const parent = categories.find(p => p.id === currentParent);
                        if(parent) currentParent = parent.parentId;
                        else break;
                     }
                     const prefix = Array(depth).fill('—').join('');

                    return (
                      <option key={cat.id} value={cat.id}>
                        {prefix} {cat.name}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">تصویر دسته‌بندی</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#FCF9F5] dark:bg-[#231511] border border-dashed border-[#C68E58]/50 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.imagePreview ? (
                      <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <PackageSearch className="w-8 h-8 text-[#8C7A6B] dark:text-[#6A5A4F]" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="category-image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="category-image"
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-[#2A1B16] border border-[#E3C3A4] dark:border-[#3c2317] rounded-lg text-sm font-bold text-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#3A221C] transition-colors w-full"
                    >
                      انتخاب تصویر جدید
                    </label>
                    <p className="text-xs text-[#8C7A6B] mt-2">فرمت‌های مجاز: JPG, PNG (حداکثر ۲ مگابایت)</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-colors mt-2 sticky bottom-0"
              >
                {editingCategory ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}