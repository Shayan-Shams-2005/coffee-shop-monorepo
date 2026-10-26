// app/admin/products/components/ProductTable.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, PackageSearch, Tag, Timer, Infinity, Edit, Trash2 } from "lucide-react";
import { Product } from "../types";
import { toFarsiNumber } from "../constants";
import { ProductApi } from "../api";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  onResetFilters: () => void;
}

export function ProductTable({ products, onDelete, onResetFilters }: ProductTableProps) {
  return (
    <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm table-fixed min-w-[1000px]">
          <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
            <tr>
              <th className="p-5 whitespace-nowrap w-[35%]">محصول</th>
              <th className="p-5 whitespace-nowrap w-[10%]">دسته‌بندی</th>
              <th className="p-5 whitespace-nowrap text-left pl-8 w-[15%]">قیمت (تومان)</th>
              <th className="p-5 whitespace-nowrap text-center w-[16%]">زمان پیشنهاد</th>
              <th className="p-5 whitespace-nowrap text-center w-[8%]">حجم فروش</th>
              <th className="p-5 whitespace-nowrap text-center w-[8%]">موجودی</th>
              <th className="p-5 whitespace-nowrap text-center w-[8%]">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3C3A4]/40 dark:divide-[#3c2317]">
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow 
                  key={product.id || (product as any).productId || (product as any).ProductId} 
                  product={product} 
                  onDelete={onDelete} 
                />
              ))
            ) : (
              <EmptyState onResetFilters={onResetFilters} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 🚀 EXTRACTED COMPONENTS FOR CLEANER CODE
// ----------------------------------------------------------------------

// Helper to safely extract string values from unpredictable API DTOs
const getValStr = (obj: any): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj.trim();
  if (typeof obj === "number") return obj.toString();
  return String(obj.value || obj.Value || obj.name || obj.Name || "").trim();
};

function TableRow({ product, onDelete }: { product: Product, onDelete: (id: number) => void }) {
  const pData = product as any;
  
  // Safe Array extraction
  const variants = Array.isArray(pData.variants) ? pData.variants : (Array.isArray(pData.Variants) ? pData.Variants : []);
  const attributes = Array.isArray(pData.attributes) ? pData.attributes : (Array.isArray(pData.Attributes) ? pData.Attributes : []);
  
  // States
  const [selectedVariant, setSelectedVariant] = useState<any>(variants.length > 0 ? variants[0] : null);
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  const id = pData.id ?? pData.productId ?? pData.ProductId;
  const name = pData.name || pData.productName || pData.ProductName || "بدون نام";
  const brand = pData.brand || pData.brandName || pData.BrandName || "-";
  const category = pData.category || pData.categoryName || pData.CategoryName || "-";
  
  // --- BASE DATA ---
  const basePrice = Number(pData.initialPrice || pData.InitialPrice || pData.originalPrice || pData.OriginalPrice || pData.price || pData.Price || pData.basePrice || pData.BasePrice || 0);
  const baseNewPrice = Number(pData.salePrice || pData.SalePrice || pData.newPrice || pData.NewPrice || 0);
  const baseStock = Number(pData.stockQuantity ?? pData.StockQuantity ?? pData.stock ?? pData.Stock ?? 0);
  const baseOfferEndDate = pData.offerEndDate || pData.OfferEndDate || pData.saleEndAt;
  const baseSalesVolume = Number(pData.soldQuantity ?? pData.SoldQuantity ?? pData.salesVolume ?? pData.SalesVolume ?? 0);

  // --- DYNAMIC DATA (Overrides base data if a variant pill is clicked) ---
  const price = selectedVariant 
    ? Number(selectedVariant.originalPrice || selectedVariant.OriginalPrice || selectedVariant.price || selectedVariant.Price || basePrice) 
    : basePrice;
    
  const newPrice = selectedVariant 
    ? Number(selectedVariant.salePrice || selectedVariant.SalePrice || selectedVariant.newPrice || selectedVariant.NewPrice || 0) 
    : baseNewPrice;
    
  const stock = selectedVariant 
    ? Number(selectedVariant.stockQuantity ?? selectedVariant.StockQuantity ?? selectedVariant.stock ?? selectedVariant.Stock ?? 0) 
    : baseStock;
    
  // 🚀 FIX: Ignore the API's 'hasOffer' flags completely. Strictly check the math.
  const hasOffer = newPrice > 0 && newPrice < price;
  
  const offerEndDate = selectedVariant ? (selectedVariant.offerEndDate || selectedVariant.OfferEndDate || selectedVariant.saleEndAt || null) : baseOfferEndDate;
  
  const salesVolume = selectedVariant ? Number(selectedVariant.soldQuantity ?? selectedVariant.SoldQuantity ?? selectedVariant.salesVolume ?? selectedVariant.SalesVolume ?? baseSalesVolume) : baseSalesVolume;
  
  const isOutOfStock = stock <= 0;

  // Safe Image Extraction 
  let rawImage = pData.image;
  if (!rawImage) {
      const imgs = pData.images || pData.Images || [];
      const mainImg = imgs.find((i:any) => i.isMain || i.IsMain) || imgs[0];
      rawImage = mainImg ? (mainImg.imageUrl || mainImg.ImageUrl) : null;
  }
  const finalImage = rawImage ? ProductApi.getImageUrl(rawImage) : null;

  return (
    <tr className="hover:bg-[#C68E58]/5 dark:hover:bg-[#231511]/60 transition-colors group">
      
      {/* Product Image and Name */}
      <td className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 mt-1 rounded-2xl bg-[#F5EFE6]/50 dark:bg-[#231511] border border-[#E3C3A4]/50 dark:border-[#3c2317] relative p-1 flex-shrink-0 flex items-center justify-center group-hover:border-[#C68E58]/40 overflow-hidden transition-colors">
            {finalImage ? (
              <img 
                src={finalImage} 
                alt={name} 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <PackageSearch 
              className={`w-6 h-6 text-[#C68E58]/60 dark:text-[#6A5A4F] ${finalImage ? 'hidden' : ''}`} 
            />
          </div>
          
          <div className="flex flex-col gap-1.5 w-full">
            <span className="font-bold text-[#4A3022] dark:text-[#EAE0D5] line-clamp-2 leading-relaxed">
              {name}
            </span>
            <span className="text-xs font-bold text-[#8C7A6B] flex items-center gap-1">
              <Tag className="w-3 h-3" /> {brand}
            </span>

            {/* Bulletproof Variant Selection Logic with Expand/Collapse */}
            <div className="flex flex-col gap-2 mt-1">
              {variants.length > 0 && attributes.length > 0 && attributes.map((attr: any, idx: number) => {
                const attrName = getValStr(attr);
                const attrVals = Array.isArray(attr.values) ? attr.values : (Array.isArray(attr.Values) ? attr.Values : []);

                if (attrVals.length === 0) return null;

                const isExpanded = expandedGroups.includes(idx);
                const visibleVals = isExpanded ? attrVals : attrVals.slice(0, 3);
                const hiddenCount = attrVals.length - 3;

                return (
                  <div key={`attr-${idx}`} className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-[#8C7A6B] font-bold">{attrName}:</span>
                    {visibleVals.map((v:any, vIdx: number) => {
                      const valStr = getValStr(v);
                      if (!valStr) return null;
                      
                      const selValues = selectedVariant 
                        ? (Array.isArray(selectedVariant.attributeValues) ? selectedVariant.attributeValues : (Array.isArray(selectedVariant.AttributeValues) ? selectedVariant.AttributeValues : [])) 
                        : [];
                      
                      const isSelected = selValues.some((av:any) => getValStr(av) === valStr);
                      
                      return (
                        <button
                          key={`v-${vIdx}`}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if (isSelected) {
                              setSelectedVariant(null);
                            } else {
                              const matchedVariant = variants.find((vr: any) => {
                                const vrVals = Array.isArray(vr.attributeValues) ? vr.attributeValues : (Array.isArray(vr.AttributeValues) ? vr.AttributeValues : []);
                                return vrVals.some((av: any) => getValStr(av) === valStr);
                              });
                              if (matchedVariant) setSelectedVariant(matchedVariant);
                            }
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-[#C68E58] text-white border-[#C68E58] shadow-sm shadow-[#C68E58]/30" 
                              : "bg-[#FCF9F5] dark:bg-[#1A0F0C] text-[#8C7A6B] border-[#E3C3A4]/60 dark:border-[#3c2317] hover:border-[#C68E58] hover:text-[#C68E58]"
                          }`}
                        >
                          {valStr}
                        </button>
                      )
                    })}
                    
                    {/* Expand Button per group */}
                    {!isExpanded && hiddenCount > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpandedGroups(prev => [...prev, idx]);
                        }}
                        className="text-[10px] text-[#C68E58] hover:text-[#A87242] bg-[#C68E58]/10 hover:bg-[#C68E58]/20 transition-colors font-bold px-2 py-0.5 rounded-full flex items-center cursor-pointer"
                      >
                        +{toFarsiNumber(hiddenCount)} دیگر
                      </button>
                    )}
                  </div>
                )
              })}

              {/* Collapse Button (Only shows if at least one group is expanded) */}
              {expandedGroups.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpandedGroups([]);
                  }}
                  className="text-[10px] w-max text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors font-bold px-2.5 py-1 rounded-md cursor-pointer mt-1"
                >
                  بستن گزینه‌ها
                </button>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="p-5 font-medium text-[#4A3022] dark:text-[#D4C4B7] whitespace-nowrap truncate">
        {category}
      </td>

      {/* Pricing */}
      <td className="p-5 whitespace-nowrap dir-ltr text-left pl-8 transition-all duration-300">
        {hasOffer ? (
          <div className="flex flex-col items-end gap-1">
            <span className="font-black text-rose-500 text-[15px]">
              {newPrice.toLocaleString("fa-IR")}
            </span>
            <span className="text-[#8C7A6B] line-through text-xs font-bold opacity-70">
              {price.toLocaleString("fa-IR")}
            </span>
          </div>
        ) : (
          <span className="font-black text-[#4A3022] dark:text-[#C68E58] text-[15px]">
            {price.toLocaleString("fa-IR")}
          </span>
        )}
      </td>

      {/* Offer Timer with Live Countdown */}
      <td className="p-5 whitespace-nowrap text-center transition-all duration-300">
        {hasOffer ? (
          offerEndDate ? (
            <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-full text-[13px] font-bold">
              <Timer className="w-4 h-4" /> 
              <CountdownTimer targetDate={offerEndDate} />
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

      {/* Sales Volume */}
      <td className="p-5 font-black text-[#4A3022] dark:text-[#C68E58] text-center whitespace-nowrap">
        {toFarsiNumber(salesVolume)}
      </td>

      {/* Stock Status */}
      <td className="p-5 whitespace-nowrap text-center transition-all duration-300">
        {!isOutOfStock ? (
          <span className="text-[#8C7A6B] dark:text-[#A1A1A1] text-xs font-bold">
            {toFarsiNumber(stock)} عدد
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-bold">
            ناموجود
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="p-5 text-center">
        <div className="flex items-center justify-center gap-2 transition-opacity">
          <Link 
            href={`/admin/products/edit?id=${id}`} 
            className="p-2.5 text-[#C68E58] hover:text-[#D4A373] hover:bg-[#F5EFE6] dark:text-[#C68E58] dark:hover:text-[#E3C3A4] dark:hover:bg-[#231511] rounded-xl transition-all inline-flex border border-transparent dark:hover:border-[#3c2317]"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => onDelete(id)} 
            className="p-2.5 text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-all border border-transparent dark:hover:border-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <tr>
      <td colSpan={7} className="p-12 text-center text-[#8C7A6B] font-medium">
        <Search className="w-10 h-10 mx-auto text-[#E3C3A4] dark:text-[#6A5A4F] mb-4 opacity-50" />
        هیچ محصولی با این فیلترها یافت نشد.
        <button 
          onClick={onResetFilters} 
          className="block mx-auto mt-4 text-[#C68E58] hover:text-[#A87242] font-bold text-sm"
        >
          حذف فیلترها
        </button>
      </td>
    </tr>
  );
}

// ----------------------------------------------------------------------
// 🚀 LIVE COUNTDOWN TIMER COMPONENT
// ----------------------------------------------------------------------

function CountdownTimer({ targetDate }: { targetDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      }
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return <span className="opacity-0">...</span>;

  if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
    return <span>پایان یافته</span>;
  }

  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const timeString = `${timeLeft.d > 0 ? timeLeft.d + ':' : ''}${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`;

  return (
    <span dir="ltr" className="tracking-widest inline-block min-w-[70px]">
      {toFarsiNumber(timeString)}
    </span>
  );
}