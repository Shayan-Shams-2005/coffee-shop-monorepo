// app/(main)/product/[id]/page.tsx
"use client";

import { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, AlertCircle } from "lucide-react";

import { useCartStore } from "../../../../src/store/useCartStore";

import { StickyBottomBar } from "../../../../components/product/StickyBottomBar";
import { ProductGallery } from "../../../../components/product-page/ProductGallery";
import { ProductReviews } from "../../../../components/product-page/ProductReviews";
import { RelatedProductsSlider } from "../../../../components/product-page/RelatedProducts/RelatedProductsSlider";
import { ProductDetails } from "../../../../components/product-page/ProductDetails";
import { ProductOverview } from "../../../../components/product-page/ProductOverview";
import { ProductOrderCard } from "../../../../components/product-page/ProductOrderCard";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

const getImageUrl = (path: string) => {
  if (!path) return "";
  let cleaned = path.replace(/\\/g, '/');
  if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) return cleaned;
  cleaned = cleaned.replace(/^file:\/\/\//i, '').replace(/^[a-zA-Z]:\//i, '/');
  const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Categories\/|\/Brands\/).*/i);
  if (uploadFolderMatch) cleaned = uploadFolderMatch[0];
  return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const addToCart = useCartStore((state) => state.addToCart);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  const [variants, setVariants] = useState<any[]>([]);
  const [grindOptions, setGrindOptions] = useState<string[]>([]);
  const [selectedGrind, setSelectedGrind] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBottomBar, setShowBottomBar] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const prodRes = await fetch(`${API_BASE_URL}/api/Product/GetById/${id}`, { cache: "no-store" });
        if (!prodRes.ok) {
            if (prodRes.status === 401) throw new Error("دسترسی غیرمجاز (۴۰۱): سرور اجازه مشاهده این محصول را نمی‌دهد.");
            if (prodRes.status === 404) throw new Error("محصول مورد نظر یافت نشد.");
            throw new Error(`خطا در ارتباط با سرور (کد ${prodRes.status})`);
        }
        const pData = await prodRes.json();

        // 🚀 FIX 1: Use the correct Swagger endpoint for fetching reviews
        const revRes = await fetch(`${API_BASE_URL}/api/Reviews/GetByProduct?productId=${id}`).catch(() => null);
        
        let rData = [];
        if (revRes?.ok) {
          const rawRevData = await revRes.json();
          // Sometimes APIs return { items: [...] } or just the array directly
          rData = Array.isArray(rawRevData) ? rawRevData : (rawRevData.items || []);
        }

        const allRes = await fetch(`${API_BASE_URL}/api/Product/GetAll`).catch(() => null);
        const allData = allRes?.ok ? await allRes.json() : [];

        const basePrice = Number(pData.price || pData.originalPrice || 0);
        const salePrice = Number(pData.newPrice || pData.salePrice || 0);
        const isDiscounted = pData.hasOffer && salePrice > 0 && salePrice < basePrice;

        const rawImages = pData.images || [];
        const images = rawImages.length > 0 
          ? rawImages.map((img: any) => getImageUrl(img.imageUrl || img.ImageUrl)) 
          : ["/p1/1.jpg"];

        let hoursLeft = 0;
        if (isDiscounted && pData.offerEndDate) {
          const end = new Date(pData.offerEndDate).getTime();
          const now = Date.now();
          if (end > now) hoursLeft = (end - now) / (1000 * 60 * 60);
        }

        const formattedProduct = {
          id: pData.productId || pData.id,
          name: pData.productName || pData.name || "محصول بدون نام",
          enName: pData.brandName || pData.categoryName || "",
          description: pData.description || "توضیحاتی برای این محصول ثبت نشده است.",
          price: isDiscounted ? salePrice : basePrice,
          oldPrice: isDiscounted ? basePrice : 0,
          discount: isDiscounted ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0,
          rating: 5, 
          reviewsCount: rData.length || 0,
          images: images,
          hoursLeft: hoursLeft,
          offerEndDate: isDiscounted ? pData.offerEndDate : null,
          features: (pData.specifications || [])
            .filter((s: any) => s.isMain || s.isKeyFeature || s.IsMain)
            .map((s: any) => ({ label: s.name || s.key || s.Key, value: s.value || s.Value })),
          specifications: (pData.specifications || [])
            .map((s: any) => ({ name: s.name || s.key || s.Key, value: s.value || s.Value })),
        };

        const rawVariants = pData.variants || pData.Variants || [];
        const parsedVariants = rawVariants.map((v: any) => {
             const attrVal = v.attributeValues?.[0] || (v.AttributeValues ? v.AttributeValues[0] : null);
             const optionName = attrVal ? (attrVal.value || attrVal.Value) : "";
             const origPrice = Number(v.originalPrice || v.OriginalPrice || v.price || v.Price || 0);
             const rawSalePrice = Number(v.salePrice || v.SalePrice || 0);
             const isLegitDiscount = rawSalePrice > 0 && rawSalePrice < origPrice;

             let parsedVariantEndDate = undefined;
             const rawDate = v.saleEndAt || v.saleEndDate || v.offerEndDate || v.discountEndDate;
             if (rawDate) {
                 parsedVariantEndDate = new Date(rawDate);
             } else if (v.saleDurationMinutes) {
                 parsedVariantEndDate = new Date(Date.now() + v.saleDurationMinutes * 60000);
             }

             return {
                 name: optionName,
                 price: origPrice,
                 salePrice: isLegitDiscount ? rawSalePrice : 0,
                 hasOffer: isLegitDiscount,
                 offerEndDate: isLegitDiscount ? parsedVariantEndDate : null
             };
        });

        let grinds = ["دانه قهوه"];
        if (parsedVariants.length > 0) {
          grinds = parsedVariants.map((v: any) => v.name).filter(Boolean);
        } else {
          const attr = (pData.attributes || []).find((a: any) => (a.name || a.Name)?.includes("آسیاب"));
          if (attr && attr.values) grinds = attr.values.map((v: any) => v.value || v.Value || "");
        }
        
        setGrindOptions(grinds);
        setSelectedGrind(grinds[0] || ""); 
        setVariants(parsedVariants);

        // 🚀 FIX 2: Apply the C# field name mappings (reviewerName, productReviewId) 
        const formattedReviews = rData
          .filter((r: any) => r.isApproved !== false) 
          .map((r: any) => ({
            id: r.productReviewId || r.reviewId || r.id || Math.random(),
            author: r.reviewerName || r.userName || r.author || "کاربر سایت",
            date: r.createdAt || r.date || new Date().toISOString(),
            rating: r.rating || r.Rating || 5,
            text: r.comment || r.text || r.Comment || "",
            isBuyer: true, // You can make this dynamic if your API sends a flag
            likes: r.likes || 0,
            dislikes: r.dislikes || 0,
            adminReply: r.adminReply || r.AdminReply
          }));

        if (formattedReviews.length > 0) {
          const sum = formattedReviews.reduce((acc: number, r: any) => acc + r.rating, 0);
          formattedProduct.rating = Number((sum / formattedReviews.length).toFixed(1));
        }

        const rawAll = Array.isArray(allData) ? allData : (allData.items || []);
        const formattedRelated = rawAll
          .filter((p: any) => (p.productId || p.id) !== formattedProduct.id)
          .slice(0, 6)
          .map((p: any) => {
             const pBase = Number(p.price || p.originalPrice || p.basePrice || 0);
             const pSale = Number(p.newPrice || p.salePrice || 0);
             const pDisc = (p.hasOffer || p.HasOffer) && pSale > 0 && pSale < pBase;
             return {
                 id: p.productId || p.id,
                 name: p.productName || p.name,
                 price: pDisc ? pSale : pBase,
                 oldPrice: pDisc ? pBase : 0,
                 discount: pDisc ? Math.round(((pBase - pSale) / pBase) * 100) : 0,
                 hasTimer: pDisc && p.offerEndDate,
             };
          });

        setProduct(formattedProduct);
        setReviews(formattedReviews);
        setRelatedProducts(formattedRelated);

      } catch (e: any) {
        console.error("Error loading product page:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]); 

  useEffect(() => {
    const checkVisibility = () => {
      let isPastButton = false;
      if (addToCartBtnRef.current) {
        const rect = addToCartBtnRef.current.getBoundingClientRect();
        isPastButton = rect.bottom <= 0;
      }
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      setShowBottomBar(isPastButton && !isAtBottom);
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    checkVisibility();
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  const displayProduct = { ...product };
  if (product && variants.length > 0 && selectedGrind) {
     const selectedVar = variants.find(v => v.name === selectedGrind);
     if (selectedVar) {
         displayProduct.price = selectedVar.hasOffer ? selectedVar.salePrice : selectedVar.price;
         displayProduct.oldPrice = selectedVar.hasOffer ? selectedVar.price : 0;
         displayProduct.discount = selectedVar.hasOffer ? Math.round(((selectedVar.price - selectedVar.salePrice) / selectedVar.price) * 100) : 0;
         displayProduct.offerEndDate = selectedVar.hasOffer ? selectedVar.offerEndDate : null;

         if (selectedVar.hasOffer && selectedVar.offerEndDate) {
             const end = new Date(selectedVar.offerEndDate).getTime();
             const now = Date.now();
             displayProduct.hoursLeft = end > now ? (end - now) / (1000 * 60 * 60) : 0;
         } else {
             displayProduct.hoursLeft = 0;
         }
     }
  }

  const handleAddToCart = () => {
    if (!selectedGrind) {
      alert("لطفاً نوع آسیاب را انتخاب کنید.");
      return;
    }
    addToCart({
      id: displayProduct.id,
      name: `${displayProduct.name}\n${selectedGrind}`,
      price: displayProduct.price,
      imageUrl: displayProduct.images[0] ?? "",
      roastLevel: "متوسط", 
      description: displayProduct.description,
      rating: displayProduct.rating,
    });
    alert("محصول با موفقیت به سبد خرید اضافه شد!");
  };

  if (isLoading) {
    return (
      <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
        <AlertCircle className="w-16 h-16 text-rose-500 opacity-80" />
        <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5]">{error || "محصول یافت نشد"}</h2>
        <Link href="/shop" className="px-6 py-3 bg-[#C68E58] text-white rounded-xl font-bold shadow-md hover:bg-[#A87242] transition-colors">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen transition-colors duration-300">
      <div className="container mx-auto max-w-[1400px] px-4 py-8 relative">
        <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] dark:text-[#ba8d71] mb-10 font-medium transition-colors">
          <Link href="/" className="hover:text-[#D4A373] dark:hover:text-[#FFD7BA] transition-colors">خانه</Link>
          <ChevronLeft className="w-3 h-3 text-[#D4A373]/50 dark:text-[#C68E58]/50" />
          <Link href="/shop" className="hover:text-[#D4A373] dark:hover:text-[#FFD7BA] transition-colors">قهوه</Link>
          <ChevronLeft className="w-3 h-3 text-[#D4A373]/50 dark:text-[#C68E58]/50" />
          <span className="text-[#4A3022] dark:text-[#EAE0D5] font-bold transition-colors">
            {displayProduct.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          <div className="lg:col-span-9 flex flex-col gap-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <ProductGallery
                images={displayProduct.images}
                productName={displayProduct.name}
              />
              <ProductDetails
                product={displayProduct}
                selectedGrind={selectedGrind}
                setSelectedGrind={setSelectedGrind}
                grindOptions={grindOptions}
              />
            </div>
            <ProductOverview product={displayProduct} />
          </div>

          <ProductOrderCard
            product={displayProduct}
            onAddToCart={handleAddToCart}
            addToCartBtnRef={addToCartBtnRef}
          />
        </div>

        {relatedProducts.length > 0 && (
          <RelatedProductsSlider products={relatedProducts} />
        )}
        
        <ProductReviews
          reviews={reviews}
          rating={displayProduct.rating}
          reviewsCount={displayProduct.reviewsCount}
          productId={displayProduct.id} 
        />

        <StickyBottomBar
          product={displayProduct}
          isVisible={showBottomBar}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}