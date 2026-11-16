// app/admin/categories/page.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Category } from "./types";
import { CategoryNode } from "./components/CategoryNode";
import { CategoryModal } from "./components/CategoryModal";
import { CategoryApi } from "./api"; 
import { ProductApi } from "../products/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCats, setExpandedCats] = useState<number[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_SIZE = 20;
  const observerTarget = useRef<HTMLDivElement>(null);

  const mainCategories = useMemo(() => categories.filter(c => c.parentId === null), [categories]);

  const fetchCategories = async (currentPage: number, replace = false) => {
    try {
      if (currentPage === 1) setIsLoading(true);
      else setIsFetchingNextPage(true);
      
      const [categoriesData, productsData] = await Promise.all([
        CategoryApi.getAll(currentPage, PAGE_SIZE),
        ProductApi.getAll().catch(() => ({ items: [] })) 
      ]);

      const rawCategories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.items || []);
      const rawProducts = Array.isArray(productsData) ? productsData : (productsData?.items || []);

      const productCounts: Record<string, number> = {};
      
      rawProducts.forEach((p: any) => {
        const catId = p.categoryId || p.CategoryId;
        if (catId) {
          productCounts[catId] = (productCounts[catId] || 0) + 1;
        }
      });
      
      const mappedCats: Category[] = rawCategories.map((c: any) => {
        return {
          id: c.categoryId,
          name: c.categoryName,
          parentId: c.parentCategoryId || null,
          image: CategoryApi.getImageUrl(c.mainImageUrl || ""),
          productCount: productCounts[c.categoryId] || 0,
        };
      });
      
      setCategories(prev => {
        if (replace) return mappedCats;
        return [...prev, ...mappedCats];
      });
      
      if (currentPage === 1 && mappedCats.length > 0 && expandedCats.length === 0) {
        setExpandedCats(mappedCats.filter(c => c.parentId === null).map(c => c.id));
      }

      setHasMore(rawCategories.length === PAGE_SIZE);

    } catch (err: any) {
      console.error(err);
      if (err.message === "SESSION_EXPIRED") {
        alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    fetchCategories(page, page === 1);
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
    fetchCategories(1, true);
  };

  const toggleExpand = (id: number) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (category?: Category) => {
    setEditingCategory(category || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
      try {
        await CategoryApi.delete(id);
        reloadData(); 
      } catch (err: any) {
        console.error("خطای حذف از سمت سرور:", err);
        if (err.message === "SESSION_EXPIRED") {
          alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
          router.push("/login");
        } else {
          alert(`خطا در حذف دسته‌بندی:\n${err.message}`);
        }
      }
    }
  };

  const handleModalSubmit = async (data: { name: string; parentId: number | null; imagePreview: string; file: File | null }) => {
    try {
      const formData = new FormData();
      formData.append("CategoryName", data.name);
      
      if (data.parentId !== null) {
        formData.append("ParentCategoryId", data.parentId.toString());
      }
      
      if (data.file) {
        formData.append("File", data.file); 
      } else if (!editingCategory) {
        alert("آپلود تصویر برای ایجاد دسته‌بندی الزامی است.");
        return; 
      }

      if (editingCategory) {
        await CategoryApi.update(editingCategory.id, formData);
      } else {
        await CategoryApi.create(formData);
      }

      reloadData(); 
      setIsModalOpen(false);

      if (data.parentId && !expandedCats.includes(data.parentId)) {
        setExpandedCats(prev => [...prev, data.parentId!]);
      }
      
      alert("دسته‌بندی با موفقیت ذخیره شد!");
    } catch (err: any) {
      console.error(err);
      if (err.message === "SESSION_EXPIRED") {
        alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        router.push("/login");
      } else {
        alert(`خطا در ارتباط با سرور: ${err.message || "لطفا اتصال بک‌اند را بررسی کنید"}`);
      }
      throw err; 
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">ساختاردهی، ویرایش و افزودن گروه‌های کالایی</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> افزودن دسته جدید
        </button>
      </div>

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none p-6">
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center h-32 text-[#8C7A6B] font-bold gap-3">
             <Loader2 className="w-6 h-6 animate-spin text-[#C68E58]" />
             در حال دریافت اطلاعات از سرور...
          </div>
        ) : (
          <div>
            {mainCategories.map((mainCat) => (
              <div key={mainCat.id} className="border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl mb-4 overflow-hidden">
                  <CategoryNode 
                    category={mainCat}
                    allCategories={categories}
                    expandedCats={expandedCats}
                    onToggleExpand={toggleExpand}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                  />
              </div>
            ))}
            
            <div ref={observerTarget} className="w-full h-16 mt-4 flex flex-col items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#C68E58] animate-spin" />
                  <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">بارگذاری بیشتر...</span>
                </div>
              )}
            </div>

            {categories.length === 0 && !isLoading && (
              <div className="text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold">
                هنوز هیچ دسته‌بندی در دیتابیس ثبت نشده است.
              </div>
            )}
          </div>
        )}
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCategory={editingCategory}
        allCategories={categories}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}