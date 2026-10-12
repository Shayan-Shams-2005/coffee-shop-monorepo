// app/admin/products/edit/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFormData, OptionGroup, ProductOption } from "./types";
import { ProductGeneralPricing } from "./components/ProductGeneralPricing";
import { ProductVariantSpecs } from "./components/ProductVariantSpecs";
import { ProductMediaSidebar } from "./components/ProductMediaSideBar";
import { EditProductHeader } from "./components/EditProductHeader";
import { ProductApi, ProductVariantApi } from "../api";

const LOCAL_INITIAL_DATA: ProductFormData = {
  title: "", description: "", category: "", brand: "",
  basePrice: 0, salePrice: 0, stock: 0,
  mainImage: "", mainImageFile: null, gallery: [], galleryFiles: [],
  keyFeatures: [], specs: [], optionGroups: []
};

const formatToISODate = (dateVal: any): string | null => {
  if (!dateVal) return null;
  if (typeof dateVal.toISOString === "function") return dateVal.toISOString();
  if (typeof dateVal.toDate === "function") return dateVal.toDate().toISOString();
  try { return new Date(dateVal).toISOString(); } catch (e) { return null; }
};

function ProductEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id"); 
  const productId = editId ? Number(editId) : null;
  
  const [formData, setFormData] = useState<ProductFormData>(LOCAL_INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    ProductApi.getById(productId)
      .then((data) => {
        let mainImgPath = "";
        let galleryPaths: string[] = [];
        if (Array.isArray(data.images) && data.images.length > 0) {
          const mainImgObj = data.images.find((img: any) => img.isMain === true) || data.images[0];
          mainImgPath = ProductApi.getImageUrl(mainImgObj?.imageUrl);
          galleryPaths = data.images.filter((img: any) => !img.isMain && img.imageUrl).map((img: any) => ProductApi.getImageUrl(img.imageUrl));
        }

        const loadedSpecs: any[] = [];
        const loadedKeyFeatures: any[] = [];
        if (Array.isArray(data.specifications)) {
          data.specifications.forEach((spec: any) => {
            const mapped = { id: spec.productSpecificationId || spec.id, key: spec.key || spec.name, value: spec.value };
            if (spec.isMain || spec.isKeyFeature) loadedKeyFeatures.push(mapped);
            else loadedSpecs.push(mapped);
          });
        }

        const mappedGroups: OptionGroup[] = [];
        if (Array.isArray(data.variants)) {
           const groupMap = new Map<string, ProductOption[]>();
           
           data.variants.forEach((v: any) => {
             const attrVal = v.attributeValues?.[0]; 
             if (!attrVal) return;
             
             let parentAttrName = "بدون گروه";
             let optionName = attrVal.value;

             if (Array.isArray(data.attributes)) {
                for (const attr of data.attributes) {
                   if (attr.values?.some((val: any) => val.productAttributeValueId === attrVal.productAttributeValueId)) {
                      parentAttrName = attr.name;
                      break;
                   }
                }
             }
             
             if (!groupMap.has(parentAttrName)) groupMap.set(parentAttrName, []);
             
             groupMap.get(parentAttrName)!.push({
                variantId: v.productVariantId || v.id,
                name: optionName,
                price: v.originalPrice || v.price || 0,
                stock: v.stockQuantity || 0,
                hasOffer: v.salePrice != null && v.salePrice > 0,
                salePrice: v.salePrice || 0,
                offerEndDate: v.offerEndDate ? new Date(v.offerEndDate) : undefined
             });
           });
           
           groupMap.forEach((options, title) => {
             mappedGroups.push({ title, options });
           });
        }

        setFormData({
          ...LOCAL_INITIAL_DATA,
          title: data.productName || data.name || data.title || "",
          description: data.description || "",
          category: data.categoryId ? data.categoryId.toString() : "",
          brand: data.brandId ? data.brandId.toString() : "",
          basePrice: data.price || data.originalPrice || data.basePrice || 0,
          salePrice: data.salePrice || data.newPrice || 0,
          offerEndDate: data.offerEndDate ? new Date(data.offerEndDate) : undefined,
          stock: data.stockQuantity || data.stock || 0,
          mainImage: mainImgPath,
          gallery: galleryPaths,
          keyFeatures: loadedKeyFeatures,
          specs: loadedSpecs,
          optionGroups: mappedGroups,
        });
      })
      .catch(() => alert("خطا در دریافت اطلاعات محصول."))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const categoryId = parseInt(formData.category);
      const brandId = parseInt(formData.brand);

      if (!categoryId || isNaN(categoryId) || !brandId || isNaN(brandId)) {
        alert("لطفاً دسته‌بندی و برند را به درستی از لیست انتخاب کنید.");
        setIsSaving(false); return;
      }

      if (!formData.title || formData.title.trim() === "") {
        alert("لطفاً نام محصول را وارد کنید.");
        setIsSaving(false); return;
      }

      const isGlobalDiscountActive = formData.salePrice > 0 && formData.salePrice < formData.basePrice;
      let currentProductId = productId;

      // ==========================================
      // STEP 1: CREATE OR UPDATE BASE PRODUCT
      // ==========================================
      if (!currentProductId) {
        if (!formData.mainImageFile) {
          alert("لطفاً تصویر اصلی محصول را انتخاب کنید.");
          setIsSaving(false); return;
        }

        const submitData = new FormData();
        submitData.append("ProductName", formData.title);
        submitData.append("OriginalPrice", (formData.basePrice || 0).toString());
        submitData.append("SalePrice", isGlobalDiscountActive ? formData.salePrice.toString() : "0");
        submitData.append("Description", formData.description);
        // 🚀 FIX: Strictly use the manual stock input
        submitData.append("StockQuantity", (formData.stock || 0).toString());
        submitData.append("CategoryId", categoryId.toString());
        submitData.append("BrandId", brandId.toString());
        
        if (isGlobalDiscountActive) {
          submitData.append("HasOffer", "true");
          const isoDate = formatToISODate(formData.offerEndDate);
          if (isoDate) submitData.append("OfferEndDate", isoDate);
        }
        
        submitData.append("Images", formData.mainImageFile);
        (formData.galleryFiles || []).forEach(file => submitData.append("Images", file));

        const createdData = await ProductApi.create(submitData);
        currentProductId = createdData.productId || createdData.id; 
      } else {
        await ProductApi.update(currentProductId, {
          ProductName: formData.title,
          OriginalPrice: formData.basePrice || 0,
          SalePrice: isGlobalDiscountActive ? formData.salePrice : null,
          Description: formData.description || "",
          // 🚀 FIX: Strictly use the manual stock input
          StockQuantity: formData.stock || 0,
          CategoryId: categoryId,
          BrandId: brandId,
          HasOffer: isGlobalDiscountActive,
          OfferEndDate: isGlobalDiscountActive ? formatToISODate(formData.offerEndDate) : null
        });

        if (formData.mainImageFile instanceof File) await ProductApi.addImage(currentProductId, formData.mainImageFile, true);
        for (const file of (formData.galleryFiles || [])) {
          if (file instanceof File) await ProductApi.addImage(currentProductId, file, false);
        }
      }

      if (!currentProductId) throw new Error("خطا: شناسه محصول دریافت نشد.");

      // ==========================================
      // STEP 2: SET SPECIFICATIONS
      // ==========================================
      const specsPayload = [
        ...formData.keyFeatures.map((kf, i) => ({ Key: kf.key, Value: kf.value, DisplayOrder: i, IsMain: true })),
        ...formData.specs.map((s, i) => ({ Key: s.key, Value: s.value, DisplayOrder: formData.keyFeatures.length + i, IsMain: false }))
      ].filter(spec => spec.Key && spec.Value);

      if (specsPayload.length > 0) {
        await ProductApi.setSpecifications(currentProductId, specsPayload);
      }

      // ==========================================
      // STEP 3: MAGIC TRANSLATION (PREEMPTIVE DELETE)
      // ==========================================
      let attributeValuesMap = new Map<string, number>(); 

      if (formData.optionGroups && formData.optionGroups.length > 0) {
        const attributesPayload = formData.optionGroups.map(g => ({
          name: (g.title || "").trim(),
          values: Array.from(new Set(g.options.map(o => (o.name || "").trim()).filter(Boolean)))
        })).filter(a => a.name && a.values.length > 0);

        if (attributesPayload.length > 0) {
          
          if (productId) {
             const existingProduct = await ProductApi.getById(currentProductId);
             if (Array.isArray(existingProduct.variants)) {
                 for (const v of existingProduct.variants) {
                     const vId = v.productVariantId || v.id;
                     if (vId) await ProductVariantApi.delete(currentProductId, vId);
                 }
             }
             formData.optionGroups.forEach(g => {
                 g.options.forEach(o => o.variantId = undefined);
             });
          }

          await ProductApi.setAttributes(currentProductId, { attributes: attributesPayload });
          
          const freshProductData = await ProductApi.getById(currentProductId);
          if (Array.isArray(freshProductData.attributes)) {
             freshProductData.attributes.forEach((attr: any) => {
               if (Array.isArray(attr.values)) {
                  attr.values.forEach((val: any) => {
                     attributeValuesMap.set(`${(attr.name || "").trim()}:${(val.value || "").trim()}`, val.productAttributeValueId);
                  });
               }
             });
          }
        }
      }

      // ==========================================
      // STEP 4: CREATE VARIANTS USING THE IDS
      // ==========================================
      if (formData.optionGroups && formData.optionGroups.length > 0) {
        let variantCounter = 1; 

        for (const group of formData.optionGroups) {
          for (const option of group.options) {
            if (!option.name) continue; 
            
            const mappedId = attributeValuesMap.get(`${(group.title || "").trim()}:${(option.name || "").trim()}`);
            
            if (!mappedId) {
                console.warn(`Could not find DB ID for ${group.title}:${option.name}`);
                continue; 
            }

            const variantDto = {
              Sku: `PRD-${currentProductId}-${Math.floor(Math.random() * 100000)}-${variantCounter++}`,
              OriginalPrice: option.price || formData.basePrice || 0,
              SalePrice: (option.hasOffer && option.salePrice > 0) ? option.salePrice : null,
              StockQuantity: option.stock || 0,
              AttributeValueIds: [mappedId] 
            };
            
            if (option.variantId && productId) {
               await ProductVariantApi.update(currentProductId, option.variantId, variantDto);
            } else {
               await ProductVariantApi.create(currentProductId, variantDto);
            }
          }
        }
      }

      alert(productId ? "محصول با موفقیت بروزرسانی شد." : "محصول جدید با موفقیت اضافه شد.");
      router.push("/admin/products");
      
    } catch (error: any) {
      console.error("Full Submission Error:", error);
      alert(`خطا: ${error.message || "Unknown Error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 text-[#4A3022] dark:text-[#EAE0D5] font-bold">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
        در حال بارگذاری اطلاعات محصول...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-500 pb-20 text-[#4A3022] dark:text-[#EAE0D5]" dir="rtl">
      <EditProductHeader productTitle={formData.title} isSaving={isSaving} isEditMode={!!productId} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <ProductGeneralPricing formData={formData} setFormData={setFormData} />
          <ProductVariantSpecs formData={formData} setFormData={setFormData} />
        </div>
        <div className="space-y-6 lg:space-y-8">
          <ProductMediaSidebar formData={formData} setFormData={setFormData} />
        </div>
      </div>
    </form>
  );
}

export default function AdminProductEditPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]"><div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div></div>;
  return <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]"><div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div></div>}><ProductEditContent /></Suspense>;
}