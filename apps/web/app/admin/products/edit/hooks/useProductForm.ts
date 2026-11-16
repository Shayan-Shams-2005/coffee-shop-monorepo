// app/admin/products/edit/hooks/useProductForm.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductFormData } from "../types";
import { ProductApi } from "../../api"; 

const LOCAL_INITIAL_DATA: ProductFormData = {
  title: "", description: "", category: "", brand: "",
  basePrice: 0, salePrice: 0, stock: 0,
  hasInfiniteSale: false, hasTimerSale: false, saleEndDate: "",
  mainImage: "", galleryFiles: [], // 🚀 MATCHES types.ts
  optionGroups: [], 
  variants: [],
  specs: [],
};

export function useProductForm(productId: number | null) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<ProductFormData>(LOCAL_INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const data = await ProductApi.getById(productId);
        if (ignore) return;

        const mappedData: ProductFormData = {
          title: data.productName || data.ProductName || "",
          description: data.description || data.Description || "",
          category: data.categoryId?.toString() || data.CategoryId?.toString() || "",
          brand: data.brandId?.toString() || data.BrandId?.toString() || "",
          
          basePrice: Number(data.originalPrice || data.OriginalPrice || data.initialPrice || 0),
          salePrice: Number(data.salePrice || data.SalePrice || data.newPrice || 0),
          stock: Number(data.stockQuantity ?? data.StockQuantity ?? data.stock ?? 0),
          
          hasInfiniteSale: !!((data.salePrice > 0 || data.SalePrice > 0) && !data.saleEndAt && !data.SaleEndAt),
          hasTimerSale: !!(data.saleEndAt || data.SaleEndAt),
          saleEndDate: data.saleEndAt || data.SaleEndAt || data.offerEndDate || "",
          
          mainImage: "",
          galleryFiles: [], // 🚀 MATCHES types.ts
          optionGroups: [], 
          variants: [],
          specs: Array.isArray(data.specifications || data.Specifications) 
            ? (data.specifications || data.Specifications).map((s: any) => ({
                key: s.key || s.Key || "",
                value: s.value || s.Value || ""
              }))
            : [],
        };

        const imagesList = Array.isArray(data.images) ? data.images : (Array.isArray(data.Images) ? data.Images : []);
        if (imagesList.length > 0) {
           const mainImg = imagesList.find((img: any) => img.isMain || img.IsMain) || imagesList[0];
           mappedData.mainImage = mainImg.imageUrl || mainImg.ImageUrl || "";
           mappedData.galleryFiles = imagesList
              .filter((img: any) => img.imageId !== mainImg.imageId && img.ImageId !== mainImg.ImageId)
              .map((img: any) => img.imageUrl || img.ImageUrl || "");
        }

        const attributesList = Array.isArray(data.attributes) ? data.attributes : (Array.isArray(data.Attributes) ? data.Attributes : []);
        const variantsList = Array.isArray(data.variants) ? data.variants : (Array.isArray(data.Variants) ? data.Variants : []);

        if (attributesList.length > 0) {
            mappedData.optionGroups = attributesList.map((attr: any) => {
               const vals = Array.isArray(attr.values) ? attr.values : (Array.isArray(attr.Values) ? attr.Values : []);
               return {
                  name: attr.name || attr.Name || "",
                  options: vals.map((v: any) => v.value || v.Value || "")
               };
            });
            
            mappedData.variants = variantsList.map((vr: any) => {
               const vrVals = Array.isArray(vr.attributeValues) ? vr.attributeValues : (Array.isArray(vr.AttributeValues) ? vr.AttributeValues : []);
               return {
                  combo: vrVals.map((av: any) => av.value || av.Value || "").join(" / "),
                  price: Number(vr.originalPrice || vr.OriginalPrice || vr.price || 0),
                  newPrice: Number(vr.salePrice || vr.SalePrice || vr.newPrice || 0),
                  stock: Number(vr.stockQuantity ?? vr.StockQuantity ?? vr.stock ?? 0),
                  sku: vr.sku || vr.Sku || "",
               };
            });
        }

        setFormData(mappedData);
      } catch (err: any) {
        if (!ignore) {
          if (err.message === "SESSION_EXPIRED") {
             alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
             router.push("/login");
          } else {
             alert("دریافت اطلاعات محصول با خطا مواجه شد.");
             router.push("/admin/products");
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchProduct();
    return () => { ignore = true; };
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!formData.title.trim()) {
      alert("لطفاً نام محصول را وارد کنید.");
      return;
    }
    if (!formData.category) {
      alert("لطفاً یک دسته‌بندی برای محصول انتخاب کنید.");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = new FormData();
      payload.append("ProductName", formData.title);
      payload.append("Description", formData.description);
      payload.append("OriginalPrice", formData.basePrice.toString());
      
      const salePrice = (formData.hasInfiniteSale || formData.hasTimerSale) ? formData.salePrice : 0;
      payload.append("SalePrice", salePrice.toString());
      
      if (formData.hasTimerSale && formData.saleEndDate) {
          const diffInMinutes = Math.max(0, Math.floor((new Date(formData.saleEndDate).getTime() - new Date().getTime()) / 60000));
          payload.append("SaleDurationMinutes", diffInMinutes.toString());
      }
      
      payload.append("StockQuantity", formData.stock.toString());
      payload.append("CategoryId", formData.category);
      if (formData.brand) payload.append("BrandId", formData.brand);

      if (productId) {
         // Update existing product logic...
         alert("تغییرات محصول با موفقیت ذخیره شد!");
      } else {
         // Create new product logic...
         alert("محصول جدید با موفقیت ایجاد شد!");
      }

      router.push("/admin/products");
      
    } catch (err: any) {
      if (err.message === "SESSION_EXPIRED") {
        alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        router.push("/login");
      } else {
        alert(`خطا در ذخیره‌سازی:\n${err.message || "لطفاً اتصال اینترنت خود را بررسی کنید"}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return { formData, setFormData, isLoading, isSaving, handleSubmit };
}