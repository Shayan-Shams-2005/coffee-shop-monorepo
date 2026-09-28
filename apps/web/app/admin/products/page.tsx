// cSpell:disable
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Edit, Trash2, Filter, PackageSearch, Search, X, Infinity, Timer, Tag } from "lucide-react";

// Importing the shared DRY components from your shop structure
import { FilterSideBar } from "../../../components/filters/FilterSideBar";
import { SortBar, SortOption } from "../../../components/sort/SortBar";

// Import categories to generate complete mock data
import { megaMenuCategories } from "../../../config/menu";

export type SortType =
  | "newest"
  | "cheapest"
  | "expensive"
  | "bestoffer";

const ADMIN_SORT_OPTIONS: SortOption[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "bestoffer", label: "بیشترین تخفیف" },
];

const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

const formatPersianDate = (dateString: string) => {
  const date = new Date(dateString);
  const datePart = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long' }).format(date);
  const timePart = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  return `${datePart}، ${timePart}`;
};

// ==========================================
// Generate 300 Mock Products for ALL Categories
// ==========================================
const getCompleteCategories = () => {
  const names = new Set<string>();
  megaMenuCategories.forEach(main => {
    names.add(main.title);
    main.sections.forEach(sec => {
      names.add(sec.title);
      sec.items.forEach(item => names.add(item));
    });
  });
  return Array.from(names);
};
const COMPLETE_CATEGORIES = getCompleteCategories();

const baseProducts = [
  { name: "قهوه اسپرسو ویژه", price: 350000, brand: "ایلی" },
  { name: "قهوه ترک مدیوم", price: 280000, brand: "مهمت افندی" },
  { name: "اسپرسو دارک رست", price: 420000, brand: "لاوازا" },
  { name: "دان قهوه ۱۰۰٪ عربیکا", price: 550000, brand: "استارباکس" },
  { name: "کپسول قهوه نسپرسو", price: 480000, brand: "نسپرسو" },
  { name: "چای سبز لاهیجان", price: 150000, brand: "تی‌کانه" },
  { name: "ماگ سرامیکی مشکی", price: 220000, brand: "متفرقه" },
  { name: "موکاپات ۳ کاپ", price: 850000, brand: "بیالتی" },
  { name: "فرنچ پرس ۶۰۰ میل", price: 450000, brand: "یاتی" },
  { name: "پودر کاکائو هلندی", price: 320000, brand: "نسکافه" },
];

const mockProducts = Array.from({ length: 300 }).map((_, index) => {
  const base = baseProducts[index % baseProducts.length]!;
  const categoryName = COMPLETE_CATEGORIES[index % COMPLETE_CATEGORIES.length] || "قهوه اسپرسو";
  
  return {
    id: index + 1000,
    name: `${base.name} (کد ${index + 1})`,
    category: categoryName,
    brand: base.brand,
    price: base.price + ((index % 5) * 15000),
    stock: index % 7 === 0 ? 0 : 15 + (index % 10),
    salesVolume: 10 + (index % 50),
    hasOffer: index % 4 === 0,
    newPrice: index % 4 === 0 ? base.price - 50000 : null,
    offerEndDate: index % 4 === 0 ? "2026-10-15T23:59:59" : null,
    image: `/images/product-${(index % 3) + 1}.png`,
  };
});

function ProductsPageContent() {
  const searchParams = useSearchParams();
  // Read the category from the URL (e.g., ?category=قهوه اسپرسو)
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState(mockProducts);

  // Shared Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // Initialize the category filter with the URL parameter if it exists!
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );

  // 🚀 FIXED: Ensure the category is checked when the URL changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories((prev) =>
        prev.includes(initialCategory) ? prev : [...prev, initialCategory]
      );
    }
  }, [initialCategory]);
  
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const MAX_ALLOWED_PRICE = 5000000;

  // Handle body scroll locking for mobile drawer
  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFilterOpen]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
  };

  // Robust Filtering & Sorting Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      result = result.filter(
        (p) => p.name.includes(searchQuery.trim()) || p.category.includes(searchQuery.trim())
      );
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => p.category && selectedCategories.includes(p.category));
    }
    if (minPrice) result = result.filter((p) => p.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseInt(maxPrice));

    return [...result].sort((a, b) => {
      switch (activeSort) {
        case "bestoffer":
          const aDiscount = a.hasOffer && a.newPrice ? a.price - a.newPrice : 0;
          const bDiscount = b.hasOffer && b.newPrice ? b.price - b.newPrice : 0;
          return bDiscount - aDiscount;
        case "cheapest":
          const aPrice = a.hasOffer && a.newPrice ? a.newPrice : a.price;
          const bPrice = b.hasOffer && b.newPrice ? b.newPrice : b.price;
          return aPrice - bPrice;
        case "expensive":
          const axPrice = a.hasOffer && a.newPrice ? a.newPrice : a.price;
          const bxPrice = b.hasOffer && b.newPrice ? b.newPrice : b.price;
          return bxPrice - axPrice;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });
  }, [products, searchQuery, selectedBrands, selectedCategories, minPrice, maxPrice, activeSort]);

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2C1E16] dark:text-white tracking-tight">مدیریت محصولات</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">افزودن، ویرایش و قیمت‌گذاری کالاهای فروشگاه</p>
        </div>
        
        <Link href="/admin/edit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C68E58] hover:bg-[#A87242] dark:bg-[#C68E58] dark:hover:bg-[#A87242] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none transition-all active:scale-95 hover:-translate-y-0.5">
          <Plus className="w-5 h-5" /> افزودن محصول جدید
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* ================= Sidebar Filter Component ================= */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <FilterSideBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            MAX_ALLOWED_PRICE={MAX_ALLOWED_PRICE}
          />
        </div>

        {/* ================= Main Content Area ================= */}
        <main className="flex-1 w-full min-w-0 space-y-6">
          
          <SortBar
            activeSort={activeSort}
            onSortChange={(sort) => setActiveSort(sort as SortType)}
            productCount={filteredAndSortedProducts.length}
            options={ADMIN_SORT_OPTIONS}
          >
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#1A110F] border border-[#E3C3A4] dark:border-[#3A221C] text-[#C68E58] dark:text-[#EAE0D5] rounded-xl text-xs font-bold transition-colors"
            >
              <Filter className="w-4 h-4" /> فیلترها
            </button>
          </SortBar>

          {/* Data Table */}
          <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#FCF9F5] dark:bg-[#231511] text-[#8C7A6B] font-bold border-b border-[#F5EFE6] dark:border-[#3c2317]">
                  <tr>
                    <th className="p-5 whitespace-nowrap">محصول</th>
                    <th className="p-5 whitespace-nowrap">دسته‌بندی</th>
                    <th className="p-5 whitespace-nowrap text-left pl-8">قیمت (تومان)</th>
                    <th className="p-5 whitespace-nowrap text-center">زمان پیشنهاد</th>
                    <th className="p-5 whitespace-nowrap text-center">حجم فروش</th>
                    <th className="p-5 whitespace-nowrap">موجودی</th>
                    <th className="p-5 whitespace-nowrap text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6] dark:divide-[#3c2317]">
                  {filteredAndSortedProducts.length > 0 ? (
                    filteredAndSortedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#FCF9F5]/70 dark:hover:bg-[#2A1B16]/50 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#FCF9F5] dark:bg-[#231511] border border-gray-100 dark:border-[#3c2317] relative p-1 flex-shrink-0 flex items-center justify-center group-hover:border-[#C68E58]/30 transition-colors">
                              <PackageSearch className="w-6 h-6 text-gray-300 dark:text-[#6A5A4F]" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-[#2C1E16] dark:text-white line-clamp-2">{product.name}</span>
                              <span className="text-xs font-bold text-[#8C7A6B] flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {product.brand}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-5 font-medium text-[#4A3022] dark:text-[#EAE0D5] whitespace-nowrap truncate max-w-[180px]">
                          {product.category}
                        </td>

                        <td className="p-5 whitespace-nowrap dir-ltr text-left pl-8">
                          {product.hasOffer && product.newPrice ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="font-black text-rose-500 text-[15px]">
                                {product.newPrice.toLocaleString("fa-IR")}
                              </span>
                              <span className="text-[#8C7A6B] line-through text-xs font-bold opacity-70">
                                {product.price.toLocaleString("fa-IR")}
                              </span>
                            </div>
                          ) : (
                            <span className="font-black text-[#2C1E16] dark:text-[#D4A373] text-[15px]">
                              {product.price.toLocaleString("fa-IR")}
                            </span>
                          )}
                        </td>

                        <td className="p-5 whitespace-nowrap text-center">
                          {product.hasOffer ? (
                            product.offerEndDate ? (
                              <div className="inline-flex items-center gap-1.5 text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-full text-[13px] font-bold">
                                <Timer className="w-4 h-4" /> 
                                <span dir="rtl">{formatPersianDate(product.offerEndDate)}</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center gap-1 text-[#C68E58] bg-[#C68E58]/10 px-3 py-1.5 rounded-full text-[13px] font-bold">
                                <Infinity className="w-4 h-4" /> دائمی
                              </div>
                            )
                          ) : (
                            <span className="text-[#8C7A6B] font-black text-lg">-</span>
                          )}
                        </td>
                        
                        <td className="p-5 font-black text-[#2C1E16] dark:text-[#D4A373] text-center whitespace-nowrap">
                          {toFarsiNumber(product.salesVolume)}
                        </td>

                        <td className="p-5 whitespace-nowrap">
                          {product.stock > 0 ? (
                            <span className="text-[#8C7A6B] dark:text-[#A1A1A1] text-xs font-bold">{toFarsiNumber(product.stock)} عدد</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-bold">
                              ناموجود
                            </span>
                          )}
                        </td>

                        <td className="p-5">
                          <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/edit`} className="p-2.5 text-gray-400 hover:text-[#C68E58] hover:bg-[#FCF9F5] dark:text-[#6A5A4F] dark:hover:text-[#C68E58] dark:hover:bg-[#231511] rounded-xl transition-all inline-flex border border-transparent dark:hover:border-[#3c2317]">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => setProducts(products.filter((p) => p.id !== product.id))} className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:text-[#6A5A4F] dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-all border border-transparent dark:hover:border-rose-500/20">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-[#8C7A6B] font-medium">
                        <Search className="w-10 h-10 mx-auto text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 opacity-50" />
                        هیچ محصولی با این فیلترها یافت نشد.
                        <button onClick={handleResetFilters} className="block mx-auto mt-4 text-[#C68E58] hover:text-[#A87242] font-bold text-sm">
                          حذف فیلترها
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ================= Mobile Filter Drawer ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#FCF9F5] dark:bg-[#1A1412] rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 transition-colors">
            
            <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317] bg-white dark:bg-[#1A110F] rounded-t-3xl shrink-0 transition-colors">
              <h2 className="text-lg font-black text-[#2C1E16] dark:text-[#EAE0D5] flex items-center gap-2 transition-colors">
                <Filter className="w-5 h-5 text-[#C68E58]" /> فیلتر محصولات
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 bg-gray-50 dark:bg-[#2C1A14] rounded-full flex items-center justify-center text-gray-500 dark:text-[#EAE0D5] hover:bg-gray-100 dark:hover:bg-[#3A221C] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <FilterSideBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                MAX_ALLOWED_PRICE={MAX_ALLOWED_PRICE}
              />
            </div>

            <div className="p-4 border-t border-[#F5EFE6] dark:border-[#3c2317] bg-white dark:bg-[#1A110F] shrink-0 transition-colors">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full h-12 bg-[#C68E58] hover:bg-[#A87242] transition-colors text-white font-bold rounded-xl shadow-md"
              >
                مشاهده {toFarsiNumber(filteredAndSortedProducts.length)} کالا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-64 flex items-center justify-center text-[#8C7A6B] font-bold">
        در حال بارگذاری...
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}