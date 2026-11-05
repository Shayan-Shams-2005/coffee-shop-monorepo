// app/admin/products/edit/hooks/useProductForm.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductFormData, OptionGroup, ProductOption } from "../types";
import { ProductApi, ProductVariantApi } from "../../api";

const LOCAL_INITIAL_DATA: ProductFormData = {
  title: "", description: "", category: "", brand: "",
  basePrice: 0, salePrice: 0, stock: 0,
  mainImage: "", mainImageFile: null, gallery: [], galleryFiles: [],
  specs: [], optionGroups: []
};

const formatToISODate = (dateVal: Date | string | null | undefined): string | null => {
  if (!dateVal) return null;
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

export function useProductForm(productId: number | null) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(LOCAL_INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // 🚀 1. Fetch & Map Data (Adapter Pattern)
  // ==========================================
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
          galleryPaths = data.images
            .filter((img: any) => !img.isMain && img.imageUrl)
            .map((img: any) => ProductApi.getImageUrl(img.imageUrl));
        }

        const loadedSpecs = Array.isArray(data.specifications) 
          ? data.specifications.map((spec: any) => ({
              id: spec.productSpecificationId || spec.id,
              key: spec.key || spec.name,
              value: spec.value
            }))
          : [];

        const mappedGroups: OptionGroup[] = [];
        if (Array.isArray(data.variants)) {
           const groupMap = new Map<string, ProductOption[]>();
           
           data.variants.forEach((v: any) => {
             const attrVal = v.attributeValues?.[0]; 
             if (!attrVal) return;
             
             let parentAttrName = "No Group";
             const optionName = attrVal.value;

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
             
             const origPrice = v.originalPrice || v.price || 0;
             const rawSalePrice = v.salePrice || 0;
             const isLegitDiscount = rawSalePrice > 0 && rawSalePrice < origPrice;
             
             groupMap.get(parentAttrName)!.push({
                variantId: v.productVariantId || v.id,
                name: optionName,
                price: origPrice,
                stock: v.stockQuantity || 0,
                hasOffer: isLegitDiscount, 
                salePrice: isLegitDiscount ? rawSalePrice : 0,
                offerEndDate: isLegitDiscount ? parsedVariantEndDate : undefined
             });
           });
           
           groupMap.forEach((options, title) => mappedGroups.push({ title, options }));
        }

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
      .catch(() => alert("خطا در دریافت اطلاعات محصول."))
      .finally(() => setIsLoading(false));
  }, [productId]);

  // ==========================================
  // 🚀 2. Submit Logic & API Orchestration
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const categoryId = parseInt(formData.category);
      const brandId = parseInt(formData.brand);

      if (!categoryId || isNaN(categoryId) || !brandId || isNaN(brandId)) {
        alert("لطفا دسته‌بندی و برند معتبری انتخاب کنید.");
        setIsSaving(false); return;
      }

      if (!formData.title || formData.title.trim() === "") {
        alert("لطفا نام محصول را وارد کنید.");
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
           const diffMs = new Date(isoDate).getTime() - Date.now();
           mainSaleDurationMinutes = Math.max(1, Math.floor(diffMs / 60000));
        }
      }

      // Step 1: Create or Update Base Product
      if (!currentProductId) {
        if (!formData.mainImageFile) {
          alert("لطفا عکس اصلی محصول را انتخاب کنید.");
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
          if (mainSaleDurationMinutes !== null) submitData.append("SaleDurationMinutes", mainSaleDurationMinutes.toString());
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

      // Step 2: Set Specifications
      const validSpecs = formData.specs
        .map((s, i) => ({ 
          Key: (s.key || "").trim(), 
          Value: (s.value || "").trim(), 
          DisplayOrder: i, 
          IsMain: i < 4 
        }))
        .filter(spec => spec.Key !== "" && spec.Value !== "");
      
      const specsPayload = validSpecs.slice(0, 30);
      await ProductApi.setSpecifications(currentProductId, specsPayload.length > 0 ? specsPayload : []);

      // Step 3: Handle Attributes & Variants
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
                   const diffMs = new Date(isoString).getTime() - Date.now();
                   saleDurationMinutes = Math.max(1, Math.floor(diffMs / 60000)); 
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

      alert(productId ? "محصول با موفقیت ویرایش شد." : "محصول جدید با موفقیت ثبت شد.");
      router.push("/admin/products");
      
    } catch (error: any) {
      console.error("Full Submission Error:", error);
      alert(`Error: ${error.message || "Unknown Error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    handleSubmit
  };
}