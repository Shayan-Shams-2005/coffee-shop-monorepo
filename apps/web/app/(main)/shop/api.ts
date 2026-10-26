// app/shop/api.ts

// 🚀 Adjust this port if your backend runs on a different one (e.g., 5000)
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

export const ShopPublicApi = {
  getProducts: async () => {
    const res = await fetch(`${API_BASE_URL}/api/Product/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/api/Category/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  getBrands: async () => {
    const res = await fetch(`${API_BASE_URL}/api/Brand/GetAll`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  },

  getImageUrl: (path: string) => {
    if (!path) return "";
    let cleaned = path.replace(/\\/g, '/');
    if (/^(https?:\/\/|data:image|blob:)/i.test(cleaned)) return cleaned;
    
    cleaned = cleaned.replace(/^file:\/\/\//i, '');
    cleaned = cleaned.replace(/^[a-zA-Z]:\//i, '/'); // Strip local C:/ paths just in case
    
    const uploadFolderMatch = cleaned.match(/(\/uploads\/|\/images\/|\/Categories\/|\/Brands\/).*/i);
    if (uploadFolderMatch) {
       cleaned = uploadFolderMatch[0];
    }
    return cleaned.startsWith("/") ? `${API_BASE_URL}${cleaned}` : `${API_BASE_URL}/${cleaned}`;
  }
};