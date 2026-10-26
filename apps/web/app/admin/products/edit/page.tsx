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
  specs: [], optionGroups: []
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
        if (Array.isArray(data.specifications)) {
          data.specifications.forEach((spec: any) => {
            loadedSpecs.push({ id: spec.productSpecificationId || spec.id, key: spec.key || spec.name, value: spec.value });
          });
        }

        const mappedGroups: OptionGroup[] = [];
        if (Array.isArray(data.variants)) {
           const groupMap = new Map<string, ProductOption[]>();
           
           data.variants.forEach((v: any) => {
             const attrVal = v.attributeValues?.[0]; 
             if (!attrVal) return;
             
             let parentAttrName = "No Group";
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

             let parsedVariantEndDate = undefined;
             const rawDate = v.saleEndAt || v.saleEndDate || v.offerEndDate || v.discountEndDate;
             if (rawDate) {
                 parsedVariantEndDate = new Date(rawDate);
             } else if (v.saleDurationMinutes) {
                 parsedVariantEndDate = new Date(Date.now() + v.saleDurationMinutes * 60000);
             }
             
             // 🚀 FIX: Strictly check that the backend sale price is actually LOWER than the original price
             const origPrice = v.originalPrice || v.price || 0;
             const rawSalePrice = v.salePrice || 0;
             const isLegitDiscount = rawSalePrice > 0 && rawSalePrice < origPrice;
             
             groupMap.get(parentAttrName)!.push({
                variantId: v.productVariantId || v.id,
                name: optionName,
                price: origPrice,
                stock: v.stockQuantity || 0,
                hasOffer: isLegitDiscount, // Only turn on if mathematically true
                salePrice: isLegitDiscount ? rawSalePrice : 0,
                offerEndDate: isLegitDiscount ? parsedVariantEndDate : undefined
             });
           });
           
           groupMap.forEach((options, title) => {
             mappedGroups.push({ title, options });
           });
        }

        // 🚀 FIX: Apply the same mathematical safety check to the main product base price
        const baseRawDate = data.saleEndAt || data.offerEndDate;
        const rawBasePrice = data.price || data.originalPrice || data.basePrice || 0;
        const rawMainSalePrice = data.salePrice || data.newPrice || 0;
        const isMainLegitDiscount = rawMainSalePrice > 0 && rawMainSalePrice < rawBasePrice;

        setFormData({
          ...LOCAL_INITIAL_DATA,
          title: data.productName || data.name || data.title || "",
          description: data.description || "",
          category: data.categoryId ? data.categoryId.toString() : "",
          brand: data.brandId ? data.brandId.toString() : "",
          basePrice: rawBasePrice,
          salePrice: isMainLegitDiscount ? rawMainSalePrice : 0,
          offerEndDate: (isMainLegitDiscount && baseRawDate) ? new Date(baseRawDate) : undefined,
          stock: data.stockQuantity || data.stock || 0,
          mainImage: mainImgPath,
          gallery: galleryPaths,
          specs: loadedSpecs,
          optionGroups: mappedGroups,
        });
      })
      .catch(() => alert("Error fetching product information."))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const categoryId = parseInt(formData.category);
      const brandId = parseInt(formData.brand);

      if (!categoryId || isNaN(categoryId) || !brandId || isNaN(brandId)) {
        alert("Please select a valid category and brand.");
        setIsSaving(false); return;
      }

      if (!formData.title || formData.title.trim() === "") {
        alert("Please enter the product name.");
        setIsSaving(false); return;
      }

      let parsedBasePrice = Number(formData.basePrice) || 0;

      if (parsedBasePrice <= 0 && formData.optionGroups && formData.optionGroups.length > 0) {
        const allVariantPrices = formData.optionGroups
          .flatMap(g => g.options.map(o => Number(o.price) || 0))
          .filter(p => p > 0);
          
        if (allVariantPrices.length > 0) {
          parsedBasePrice = Math.min(...allVariantPrices);
        }
      }

      const parsedSalePrice = Number(formData.salePrice) || 0;
      const isGlobalDiscountActive = parsedSalePrice > 0 && parsedSalePrice < parsedBasePrice;
      let currentProductId = productId;

      let mainSaleDurationMinutes = null;
      if (isGlobalDiscountActive) {
        const isoDate = formatToISODate(formData.offerEndDate);
        if (isoDate) {
           const diffMs = new Date(isoDate).getTime() - new Date().getTime();
           mainSaleDurationMinutes = diffMs > 0 ? Math.floor(diffMs / 60000) : (30 * 24 * 60);
        } else {
           mainSaleDurationMinutes = 30 * 24 * 60; 
        }
      }

      if (!currentProductId) {
        if (!formData.mainImageFile) {
          alert("Please select a main product image.");
          setIsSaving(false); return;
        }

        const submitData = new FormData();
        submitData.append("ProductName", formData.title);
        submitData.append("OriginalPrice", parsedBasePrice.toString());
        
        if (isGlobalDiscountActive) {
          submitData.append("SalePrice", parsedSalePrice.toString());
          submitData.append("HasOffer", "true");
          const isoDate = formatToISODate(formData.offerEndDate);
          if (isoDate) submitData.append("OfferEndDate", isoDate);
          if (mainSaleDurationMinutes) submitData.append("SaleDurationMinutes", mainSaleDurationMinutes.toString());
        } else {
          submitData.append("HasOffer", "false");
        }

        submitData.append("Description", formData.description);
        submitData.append("StockQuantity", (formData.stock || 0).toString());
        submitData.append("CategoryId", categoryId.toString());
        submitData.append("BrandId", brandId.toString());
        
        submitData.append("Images", formData.mainImageFile);
        (formData.galleryFiles || []).forEach(file => submitData.append("Images", file));

        const createdData = await ProductApi.create(submitData);
        currentProductId = createdData.productId || createdData.id; 
      } else {
        await ProductApi.update(currentProductId, {
          ProductName: formData.title,
          OriginalPrice: parsedBasePrice,
          SalePrice: isGlobalDiscountActive ? parsedSalePrice : null,
          Description: formData.description || "",
          StockQuantity: formData.stock || 0,
          CategoryId: categoryId,
          BrandId: brandId,
          HasOffer: isGlobalDiscountActive,
          OfferEndDate: isGlobalDiscountActive ? formatToISODate(formData.offerEndDate) : null,
          SaleDurationMinutes: mainSaleDurationMinutes 
        });

        if (formData.mainImageFile instanceof File) await ProductApi.addImage(currentProductId, formData.mainImageFile, true);
        for (const file of (formData.galleryFiles || [])) {
          if (file instanceof File) await ProductApi.addImage(currentProductId, file, false);
        }
      }

      if (!currentProductId) throw new Error("Error: Could not retrieve product ID.");

      const validSpecs = formData.specs
        .map((s, i) => ({ 
          Key: (s.key || "").trim(), 
          Value: (s.value || "").trim(), 
          DisplayOrder: i, 
          IsMain: i < 4 
        }))
        .filter(spec => spec.Key !== "" && spec.Value !== "");
      
      const specsPayload = validSpecs.slice(0, 30);

      if (specsPayload.length > 0) {
        await ProductApi.setSpecifications(currentProductId, specsPayload);
      } else {
        await ProductApi.setSpecifications(currentProductId, []);
      }

      if (productId) {
         const existingProduct = await ProductApi.getById(currentProductId);
         if (Array.isArray(existingProduct.variants)) {
             for (const v of existingProduct.variants) {
                 const vId = v.productVariantId || v.id;
                 if (vId) await ProductVariantApi.delete(currentProductId, vId);
             }
         }
      }

      if (formData.optionGroups && formData.optionGroups.length > 0) {
        let attributeValuesMap = new Map<string, number>(); 
        const attributesPayload = formData.optionGroups.map(g => ({
          name: (g.title || "").trim(),
          values: Array.from(new Set(g.options.map(o => (o.name || "").trim()).filter(Boolean)))
        })).filter(a => a.name && a.values.length > 0);

        if (attributesPayload.length > 0) {
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

          let variantCounter = 1; 
          const createdSignatures = new Set<string>(); 

          for (const group of formData.optionGroups) {
            for (const option of group.options) {
              const optionName = (option.name || "").trim();
              if (!optionName) continue; 
              
              const mappedId = attributeValuesMap.get(`${(group.title || "").trim()}:${optionName}`);
              if (!mappedId) continue; 

              if (createdSignatures.has(mappedId.toString())) continue;
              createdSignatures.add(mappedId.toString());

              const originalPrice = option.price || parsedBasePrice;
              const hasActiveDiscount = option.hasOffer && option.salePrice > 0 && option.salePrice < originalPrice;
              let saleDurationMinutes = null;

              if (hasActiveDiscount) {
                const endDate = option.offerEndDate || formData.offerEndDate;
                const isoString = formatToISODate(endDate); 
                
                if (isoString) {
                   const diffMs = new Date(isoString).getTime() - new Date().getTime();
                   saleDurationMinutes = diffMs > 0 ? Math.floor(diffMs / 60000) : 30 * 24 * 60; 
                } else {
                   saleDurationMinutes = 30 * 24 * 60; 
                }
              }

              const variantDto = {
                Sku: `PRD-${currentProductId}-${Math.floor(Math.random() * 100000)}-${variantCounter++}`,
                OriginalPrice: originalPrice,
                SalePrice: hasActiveDiscount ? option.salePrice : null,
                SaleDurationMinutes: saleDurationMinutes, 
                StockQuantity: option.stock || 0,
                AttributeValueIds: [mappedId] 
              };
              
              try {
                await ProductVariantApi.create(currentProductId, variantDto);
              } catch (variantErr: any) {
                console.warn(`Skipped creating variant ${optionName}:`, variantErr.message || variantErr);
              }
            }
          }
        }
      }

      alert(productId ? "Product successfully updated." : "New product successfully added.");
      router.push("/admin/products");
      
    } catch (error: any) {
      console.error("Full Submission Error:", error);
      alert(`Error: ${error.message || "Unknown Error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 text-[#4A3022] dark:text-[#EAE0D5] font-bold">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
        Loading product information...
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