// app/admin/products/components/ProductTable.tsx
import { useState } from "react";
import Link from "next/link";
import { Search, PackageSearch, Tag, Timer, Infinity, Edit, Trash2 } from "lucide-react";
import { Product } from "../types";
import { toFarsiNumber, formatPersianDate } from "../constants";
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
        <table className="w-full text-right text-sm">
          <thead className="bg-[#E3C3A4]/15 dark:bg-[#231511] text-[#8C7A6B] dark:text-[#A1A1A1] font-bold border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
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

function TableRow({ product, onDelete }: { product: Product, onDelete: (id: number) => void }) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false); // 🚀 NEW: Controls expanding the key features

  // 🚀 BULLETPROOF C# DTO MAPPING
  const pData = product as any;
  const variants = pData.variants || pData.Variants || [];
  
  const id = pData.id ?? pData.productId ?? pData.ProductId;
  const name = pData.name || pData.productName || pData.ProductName || "بدون نام";
  const brand = pData.brand || pData.brandName || pData.BrandName || "-";
  const category = pData.category || pData.categoryName || pData.CategoryName || "-";
  
  // --- BASE DATA ---
  const basePrice = Number(pData.initialPrice || pData.InitialPrice || pData.originalPrice || pData.OriginalPrice || pData.price || pData.Price || pData.basePrice || pData.BasePrice || 0);
  const baseNewPrice = Number(pData.salePrice || pData.SalePrice || pData.newPrice || pData.NewPrice || 0);
  const baseStock = Number(pData.stockQuantity ?? pData.StockQuantity ?? pData.stock ?? pData.Stock ?? 0);
  const baseHasOffer = pData.hasOffer ?? pData.HasOffer ?? (baseNewPrice > 0);
  const baseOfferEndDate = pData.offerEndDate || pData.OfferEndDate;
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
    
  const hasOffer = selectedVariant ? (newPrice > 0 || selectedVariant.hasOffer || selectedVariant.HasOffer) : baseHasOffer;
  const offerEndDate = selectedVariant ? (selectedVariant.offerEndDate || selectedVariant.OfferEndDate || null) : baseOfferEndDate;
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

  // Safe Arrays
  const attributes = pData.attributes || pData.Attributes || [];
  const allSpecifications = pData.specifications || pData.Specifications || [];
  
  // 🚀 FIX: Strictly filter to show ONLY Key Features (IsMain === true)
  const keyFeatures = allSpecifications.filter((s: any) => s.isMain === true || s.IsMain === true || s.isKeyFeature === true || s.IsKeyFeature === true);
  
  // If no key features are explicitly marked, fallback to top specs to prevent an empty layout (optional safety net)
  const displayFeatures = keyFeatures.length > 0 ? keyFeatures : allSpecifications;

  const visibleFeatures = isSpecsExpanded ? displayFeatures : displayFeatures.slice(0, 2);
  const hiddenFeaturesCount = displayFeatures.length - 2;

  return (
    <tr className="hover:bg-[#C68E58]/5 dark:hover:bg-[#231511]/60 transition-colors group">
      
      {/* Product Image, Name, and Specs */}
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
          
          <div className="flex flex-col gap-1.5 w-full max-w-[320px]">
            <span className="font-bold text-[#4A3022] dark:text-[#EAE0D5] line-clamp-2 leading-relaxed">
              {name}
            </span>
            <span className="text-xs font-bold text-[#8C7A6B] flex items-center gap-1">
              <Tag className="w-3 h-3" /> {brand}
            </span>

            <div className="flex flex-col gap-2 mt-1">
              {/* INTERACTIVE VARIANT PILLS */}
              {attributes.length > 0 && attributes.map((attr: any, idx: number) => (
                <div key={`attr-${idx}`} className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-[#8C7A6B] font-bold">{attr.name || attr.Name}:</span>
                  {(attr.values || attr.Values)?.map((v:any, vIdx: number) => {
                    const valStr = v.value || v.Value;
                    
                    const isSelected = selectedVariant && (selectedVariant.attributeValues || selectedVariant.AttributeValues || []).some((av:any) => (av.value || av.Value) === valStr);
                    
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
                            const matchedVariant = variants.find((vr: any) => 
                              (vr.attributeValues || vr.AttributeValues || []).some((av: any) => (av.value || av.Value) === valStr)
                            );
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
                </div>
              ))}
              
              {/* 🚀 EXPANDABLE KEY FEATURES SECTION */}
              {displayFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {visibleFeatures.map((spec: any, idx: number) => (
                    <span key={`spec-${idx}`} className="inline-flex items-center text-[10px] bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/60 dark:border-[#3c2317] text-[#8C7A6B] px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap">
                      {spec.key || spec.Key}: {spec.value || spec.Value}
                    </span>
                  ))}
                  
                  {/* EXPAND BUTTON */}
                  {!isSpecsExpanded && hiddenFeaturesCount > 0 && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSpecsExpanded(true);
                      }}
                      className="text-[10px] text-[#C68E58] hover:text-[#A87242] bg-[#C68E58]/10 hover:bg-[#C68E58]/20 transition-colors font-bold px-2 py-0.5 rounded-md flex items-center cursor-pointer"
                    >
                      +{toFarsiNumber(hiddenFeaturesCount)} دیگر
                    </button>
                  )}

                  {/* COLLAPSE BUTTON */}
                  {isSpecsExpanded && hiddenFeaturesCount > 0 && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSpecsExpanded(false);
                      }}
                      className="text-[10px] text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors font-bold px-2 py-0.5 rounded-md flex items-center cursor-pointer"
                    >
                      بستن
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="p-5 font-medium text-[#4A3022] dark:text-[#D4C4B7] whitespace-nowrap truncate max-w-[180px]">
        {category}
      </td>

      {/* Pricing (Reacts to Pill Clicks) */}
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

      {/* Offer Timer */}
      <td className="p-5 whitespace-nowrap text-center transition-all duration-300">
        {hasOffer ? (
          offerEndDate ? (
            <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-full text-[13px] font-bold">
              <Timer className="w-4 h-4" /> 
              <span dir="rtl">{formatPersianDate(offerEndDate)}</span>
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

      {/* Stock Status (Reacts to Pill Clicks) */}
      <td className="p-5 whitespace-nowrap transition-all duration-300">
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
      <td className="p-5">
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