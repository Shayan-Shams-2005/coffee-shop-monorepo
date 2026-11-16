// app/admin/tags/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Tag, Edit, Trash2, Hash, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductTag, toFarsiNumber } from "./types";
import { ProductTagApi } from "./api";
import { TagModal } from "./components/TagModal";

export default function AdminTagsPage() {
  const [allTags, setAllTags] = useState<ProductTag[]>([]);
  const [visibleTags, setVisibleTags] = useState<ProductTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);

  // Client-Side Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 20;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const tagsData = await ProductTagApi.getAll();
      
      const mappedTags: ProductTag[] = Array.isArray(tagsData) ? tagsData.map((t: any) => ({
        id: t.productTagId || t.id, 
        name: t.name,
        slug: t.slug
      })) : [];
      
      setAllTags(mappedTags);
      
      // Initialize visible tags (page 1)
      const initialVisible = mappedTags.slice(0, PAGE_SIZE);
      setVisibleTags(initialVisible);
      setPage(1);
      setHasMore(mappedTags.length > PAGE_SIZE);
      
    } catch (err: any) {
      console.error(err);
      if (err.message === "SESSION_EXPIRED") {
        alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite Scroll Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          // Load next chunk
          const nextPage = page + 1;
          const nextChunk = allTags.slice(0, nextPage * PAGE_SIZE);
          
          setVisibleTags(nextChunk);
          setPage(nextPage);
          setHasMore(allTags.length > nextPage * PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => { observer.unobserve(target); };
  }, [hasMore, isLoading, page, allTags]);

  const handleOpenModal = (tag?: ProductTag) => {
    setEditingTag(tag || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("آیا از حذف این برچسب اطمینان دارید؟")) {
      try {
        await ProductTagApi.delete(id);
        await fetchTags(); 
      } catch (err: any) {
        console.error("خطای حذف:", err);
        if (err.message === "SESSION_EXPIRED") {
          alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
          router.push("/login");
        } else {
          alert(`خطا در حذف برچسب:\n${err.message}`);
        }
      }
    }
  };

  const handleModalSubmit = async (data: { name: string }) => {
    try {
      if (editingTag) {
        await ProductTagApi.update(editingTag.id, data);
      } else {
        await ProductTagApi.create(data);
      }

      await fetchTags(); 
      setIsModalOpen(false);
      alert("برچسب با موفقیت ذخیره شد!");
    } catch (err: any) {
      console.error(err);
      if (err.message === "SESSION_EXPIRED") {
        alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        router.push("/login");
      } else {
        alert(`خطا: ${err.message || "لطفا ارتباط با سرور را بررسی کنید"}`);
      }
      throw err; 
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">مدیریت برچسب‌ها</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">افزودن و ویرایش تگ‌های کالا (Product Tags)</p>
          {!isLoading && (
            <p className="text-xs font-bold text-[#C68E58] mt-1">{toFarsiNumber(allTags.length)} برچسب ثبت شده</p>
          )}
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#7D4F35] dark:hover:bg-[#633E29] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> افزودن برچسب جدید
        </button>
      </div>

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none p-6 md:p-8 min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center h-full text-[#8C7A6B] font-bold gap-3 z-10 bg-[#FCF9F5]/50 dark:bg-[#1A0F0C]/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-[#C68E58] animate-spin" />
            در حال دریافت اطلاعات از سرور...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visibleTags.map((tag) => (
                <div 
                  key={tag.id} 
                  className="bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-[#C68E58] dark:hover:border-[#C68E58] transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-[#C68E58]" />
                      <h3 className="font-bold text-[#4A3022] dark:text-white text-base">
                        {tag.name}
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-[#8C7A6B] flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {tag.slug}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-[#FCF9F5] dark:border-[#1A0F0C]">
                    <button 
                      onClick={() => handleOpenModal(tag)} 
                      className="p-2 text-[#C68E58] hover:bg-[#F5EFE6] dark:hover:bg-[#3A221C] rounded-xl transition-colors"
                      title="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(tag.id)} 
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {visibleTags.length === 0 && (
                <div className="col-span-full text-center py-10 text-[#8C7A6B] dark:text-[#6A5A4F] font-bold border-2 border-dashed border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-2xl">
                  هیچ برچسبی یافت نشد. اولین برچسب خود را اضافه کنید.
                </div>
              )}
            </div>

            {/* Infinite Scroll Observer Target */}
            <div ref={observerTarget} className="w-full h-12 mt-4 flex justify-center items-center">
              {hasMore && (
                <div className="flex items-center gap-2 text-[#8C7A6B] text-xs font-bold">
                  <Loader2 className="w-4 h-4 text-[#C68E58] animate-spin" /> بارگذاری...
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <TagModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTag={editingTag}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}