// components/brands/types.ts

export interface UIBrand {
  id: string;
  name: string;
  image: string | null;
  groupId: string;
}

export interface UIBrandGroup {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  brands: UIBrand[];
}