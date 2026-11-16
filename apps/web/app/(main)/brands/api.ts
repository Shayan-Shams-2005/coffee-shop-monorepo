// app/(main)/brands/api.ts

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

export const PublicBrandApi = {
  getImageUrl: (url: string | null | undefined): string => {
    if (!url) return "";
    
    if (/^(https?:\/\/|data:image|blob:)/i.test(url)) return url;
    
    let cleaned = url.replace(/\\/g, '/'); 
    cleaned = cleaned.replace(/^file:[\/]*:?/i, ''); 
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/'); 
    if (cleaned.toLowerCase().startsWith('file')) {
       cleaned = cleaned.replace(/^file.*/i, '/');
    }
    
    const match = cleaned.match(/(Categories|Brands|BrandGroups|Products|uploads|images)\/.*/i);
    if (match) cleaned = `/${match[0]}`;
    else cleaned = `/${cleaned.split('/').pop()}`;
    
    return `${API_BASE_URL}${cleaned}`;
  },

  getAllGroupsWithBrands: async (page = 1, pageSize = 10) => {
    const res = await fetch(`${API_BASE_URL}/api/BrandGroup/GetAll?Page=${page}&PageSize=${pageSize}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) throw new Error("Failed to fetch brand groups");
    return res.json();
  }
};