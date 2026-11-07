// components/search/SearchDropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 🚀 Imported useRouter
import { Search, X, Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import { SearchApi } from "./api";

const formatPrice = (price: number) => price.toLocaleString("fa-IR");

export function SearchDropdown() {
  const router = useRouter(); // 🚀 Initialize router

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounce search logic for live results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await SearchApi.searchProducts(query);
        setResults(data.items || data || []); 
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(fetchResults, 500); 
    return () => clearTimeout(timerId);
  }, [query]);

  // 🚀 Handle Enter key / Form Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      // Change "?search=" to whatever query parameter your /shop page expects
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // Trending dummy data
  const trendingSearches = ["قهوه اسپرسو", "فرنچ پرس", "موکاپات", "دان قهوه عربیکا"];

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 sm:p-2 rounded-full transition-colors flex items-center justify-center ${
          isOpen ? "bg-[#C68E58] text-white" : "hover:bg-[#E3C3A4]/20 text-[#2C1E16] dark:text-white"
        }`}
        aria-label="جستجو"
      >
        <Search className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Expanding Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-4 w-[90vw] sm:w-[450px] bg-white dark:bg-[#1A1412] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#E3C3A4]/40 dark:border-[#3c2317] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[200]" 
          dir="rtl"
        >
          {/* 🚀 Changed to a <form> to capture Enter key presses natively */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex items-center gap-3 p-4 border-b border-[#E3C3A4]/40 dark:border-[#3c2317] bg-[#FCF9F5] dark:bg-[#231511]"
          >
            <Search className="w-5 h-5 text-[#C68E58] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در همه کالاها..."
              className="flex-1 bg-transparent border-none outline-none text-[#4A3022] dark:text-[#EAE0D5] text-base font-medium placeholder:text-[#8C7A6B]/70"
            />
            {query && (
              <button 
                type="button" // Prevents clearing the input from submitting the form
                onClick={() => setQuery("")} 
                className="p-1.5 bg-[#E3C3A4]/20 dark:bg-[#3c2317] rounded-full text-[#8C7A6B] hover:text-rose-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 sm:p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-[#C68E58]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-bold">در حال جستجو...</span>
              </div>
            ) : query && results.length === 0 ? (
              <div className="text-center py-10 text-[#8C7A6B] font-medium text-sm">
                محصولی با نام «{query}» یافت نشد.
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col gap-1">
                {results.map((product: any) => {
                  const rawImages = product.images || product.Images || [];
                  const mainImg = rawImages.find((i: any) => i.isMain || i.IsMain) || rawImages[0];
                  const imageUrl = mainImg ? SearchApi.getImageUrl(mainImg.imageUrl || mainImg.ImageUrl) : "/placeholder.png";
                  
                  const basePrice = Number(product.price || product.originalPrice || 0);
                  const salePrice = Number(product.newPrice || product.salePrice || 0);
                  const isDiscounted = product.hasOffer && salePrice > 0 && salePrice < basePrice;

                  return (
                    <Link
                      key={product.productId || product.id}
                      href={`/product/${product.productId || product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-2 sm:p-3 rounded-2xl hover:bg-[#FCF9F5] dark:hover:bg-[#231511] transition-colors group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-[#1A1412] border border-[#E3C3A4]/30 dark:border-[#3c2317] flex items-center justify-center p-1.5 shrink-0">
                        <img src={imageUrl} alt={product.productName || product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-sm text-[#4A3022] dark:text-white truncate group-hover:text-[#C68E58] transition-colors">
                          {product.productName || product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs sm:text-sm font-black text-[#2C1E16] dark:text-[#EAE0D5]">
                            {formatPrice(isDiscounted ? salePrice : basePrice)} تومان
                          </span>
                          {isDiscounted && (
                            <span className="text-[10px] text-[#8C7A6B] line-through">
                              {formatPrice(basePrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowLeft className="w-4 h-4 text-[#C68E58] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Trending Searches */
              <div className="p-2">
                <h5 className="text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C68E58]" /> جستجوهای پرطرفدار
                </h5>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => {
                        setIsOpen(false);
                        router.push(`/shop?search=${encodeURIComponent(tag)}`); // 🚀 Clicking a tag also searches
                      }} 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E3C3A4]/60 dark:border-[#3c2317] text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1] hover:text-[#C68E58] dark:hover:text-[#FFD7BA] hover:border-[#C68E58] transition-colors"
                    >
                      {tag} <ArrowLeft className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}