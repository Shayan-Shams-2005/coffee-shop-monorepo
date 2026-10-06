// app/admin/products/edit/components/ProductMediaSideBar.tsx
"use client";

import { ProductFormData } from "../types";
import { ImageSection } from "./sidebar/ImageSection";
import { CategoryBrandSection } from "./sidebar/CategoryBrandSection";
import { StockSection } from "./sidebar/StockSection";

interface Props {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function ProductMediaSidebar({ formData, setFormData }: Props) {
  return (
    <>
      <ImageSection formData={formData} setFormData={setFormData} />
      <CategoryBrandSection formData={formData} setFormData={setFormData} />
      <StockSection formData={formData} setFormData={setFormData} />
    </>
  );
}