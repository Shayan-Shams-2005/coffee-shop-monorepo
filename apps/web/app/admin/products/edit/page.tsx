// app/admin/products/edit/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFormData } from "./types";
import { ProductGeneralPricing } from "./components/ProductGeneralPricing";
import { ProductVariantSpecs } from "./components/ProductVariantSpecs";
import { ProductMediaSidebar } from "./components/ProductMediaSideBar";
import { INITIAL_PRODUCT_DATA } from "./constants";
import { EditProductHeader } from "./components/EditProductHeader";
import { ProductApi } from "../api";

// ============================================================================
// HELPERS
// ============================================================================

const buildSubmitFormData = (formData: ProductFormData, categoryId: number, brandId: number, isDiscountActive: boolean) => {
  const submitData = new FormData();
  
  submitData.append("ProductName", formData.title || "");
  submitData.append("Price", (formData.basePrice || 0).toString());
  submitData.append("Description", formData.description || "");
  submitData.append("StockQuantity", (formData.stock || 0).toString());
  submitData.append("CategoryId", categoryId.toString());
  submitData.append("BrandId", brandId.toString());

  if (isDiscountActive) {
    submitData.append("HasOffer", "true");
    submitData.append("NewPrice", formData.salePrice.toString());
    if (formData.offerEndDate) {
      submitData.append("OfferEndDate", formData.offerEndDate.toISOString());
    }
  }

  formData.specs.forEach((spec, index) => {
    if (spec.key && spec.value) {
       submitData.append(`Specs[${index}].Key`, spec.key);
       submitData.append(`Specs[${index}].Value`, spec.value);
    }
  });

  formData.keyFeatures.forEach((feature, index) => {
     if (feature.key && feature.value) {
       submitData.append(`KeyFeatures[${index}].Key`, feature.key);
       submitData.append(`KeyFeatures[${index}].Value`, feature.value);
     }
  });

  if (formData.mainImageFile) {
    submitData.append("Images", formData.mainImageFile);
  }

  const galleryFiles = formData.galleryFiles || [];
  galleryFiles.forEach((file: File) => {
    submitData.append("Images", file);
  });

  return submitData;
};

// ============================================================================
// MAIN PAGE CONTENT
// ============================================================================

function ProductEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id"); 
  const productId = editId ? Number(editId) : null;
  
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_PRODUCT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Existing Product Data
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

        setFormData({
          ...INITIAL_PRODUCT_DATA,
          title: data.productName || data.name || data.title || "",
          description: data.description || "",
          category: data.categoryId ? data.categoryId.toString() : "",
          brand: data.brandId ? data.brandId.toString() : "",
          basePrice: data.price || data.basePrice || 0,
          salePrice: data.newPrice || data.salePrice || 0,
          offerEndDate: data.offerEndDate ? new Date(data.offerEndDate) : undefined,
          mainImage: mainImgPath,
          gallery: galleryPaths,
          keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : [],
          specs: Array.isArray(data.specs) ? data.specs : [],
          optionGroups: Array.isArray(data.optionGroups) ? data.optionGroups : [],
          stock: data.stockQuantity || data.stock || 0
        });
      })
      .catch(() => alert("خطا در دریافت اطلاعات محصول."))
      .finally(() => setIsLoading(false));
  }, [productId]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const categoryId = parseInt(formData.category) || 0;
      const brandId = parseInt(formData.brand) || 0;
      const isDiscountActive = formData.salePrice > 0 && formData.salePrice < formData.basePrice;

      if (productId) {
        // UPDATE EXISTING PRODUCT
        const updateDto = {
          ProductName: formData.title,
          Price: formData.basePrice,
          Description: formData.description,
          StockQuantity: formData.stock || 0,
          CategoryId: categoryId,
          BrandId: brandId,
          HasOffer: isDiscountActive,
          NewPrice: isDiscountActive ? formData.salePrice : null,
          OfferEndDate: isDiscountActive && formData.offerEndDate ? formData.offerEndDate.toISOString() : null,
          KeyFeatures: formData.keyFeatures,
          Specs: formData.specs,
          OptionGroups: formData.optionGroups
        };
        await ProductApi.update(productId, updateDto);

        if (formData.mainImageFile instanceof File) {
          await ProductApi.addImage(productId, formData.mainImageFile);
        }

        const galleryFiles = formData.galleryFiles || [];
        for (const file of galleryFiles) {
          if (file instanceof File) await ProductApi.addImage(productId, file);
        }

        alert("محصول با موفقیت بروزرسانی شد.");
        router.push("/admin/products");
      } else {
        // CREATE NEW PRODUCT
        if (!formData.mainImageFile) {
          alert("لطفاً تصویر اصلی محصول را انتخاب کنید. (سرور به حداقل یک عکس نیاز دارد)");
          setIsSaving(false);
          return;
        }

        const submitData = buildSubmitFormData(formData, categoryId, brandId, isDiscountActive);
        await ProductApi.create(submitData);
        
        alert("محصول جدید با موفقیت به سیستم اضافه شد.");
        router.push("/admin/products");
      }
    } catch (error: any) {
      console.error(error);
      alert(`خطا در برقراری ارتباط با سرور: ${error.message || "Unknown Error"}`);
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
    <form 
      onSubmit={handleSubmit}
      noValidate
      className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-500 pb-20 text-[#4A3022] dark:text-[#EAE0D5]"
      dir="rtl"
    >
      <EditProductHeader 
        productTitle={formData.title} 
        isSaving={isSaving} 
        isEditMode={!!productId} 
      />

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

// ============================================================================
// PAGE WRAPPER (Handles Client Hydration & Suspense)
// ============================================================================

export default function AdminProductEditPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-[#FCF9F5] dark:bg-[#1A1412]">
        <div className="w-8 h-8 border-4 border-[#C68E58] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductEditContent />
    </Suspense>
  );
}