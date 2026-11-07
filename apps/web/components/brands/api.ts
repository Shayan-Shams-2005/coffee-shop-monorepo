// components/brands/api.ts
import { UIBrandGroup } from "./types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

export const PublicBrandApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    let cleaned = url.replace(/\\/g, '/');
    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) return cleaned;
    
    cleaned = cleaned.replace(/^file:\/\/\/?/gi, '/').replace(/^[a-zA-Z]:\//i, '/');
    const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Categories\/|\/Brands\/|\/Products\/).*/i);
    
    if (uploadFolderMatch) cleaned = uploadFolderMatch[0];
    else {
       const parts = cleaned.split('/');
       cleaned = '/' + parts[parts.length - 1];
    }
    return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
  },

  getAllGroupsWithBrands: async (): Promise<UIBrandGroup[]> => {
    // Note: This assumes /api/BrandGroup/GetAll is publicly accessible ([AllowAnonymous])
    const res = await fetch(`${API_BASE_URL}/api/BrandGroup/GetAll`, { 
      next: { revalidate: 3600 } // Cache for 1 hour for better performance
    });
    
    if (!res.ok) throw new Error("Failed to fetch brand groups");
    
    const data = await res.json();
    
    return data.map((g: any) => ({
      id: g.brandGroupId.toString(),
      name: g.name,
      slug: g.slug,
      displayOrder: g.displayOrder,
      brands: (g.brands || []).map((b: any) => ({
        id: b.brandId.toString(),
        name: b.brandName,
        image: b.mainImageUrl ? PublicBrandApi.getImageUrl(b.mainImageUrl) : null,
        groupId: b.brandGroupId.toString(),
      }))
    })).sort((a: UIBrandGroup, b: UIBrandGroup) => a.displayOrder - b.displayOrder);
  }
};