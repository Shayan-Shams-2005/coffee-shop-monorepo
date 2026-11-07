// components/product-page/RelatedProducts/api.ts

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103").replace(/\/$/, "");

export const ProductApi = {
  getImageUrl: (path: string | null | undefined): string => {
    if (!path) return "";
    let cleaned = path.replace(/\\/g, '/');
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

  getSimilarProducts: async (productId: string | number, count = 8) => {
    const res = await fetch(`${API_BASE_URL}/api/Product/GetSimilarProducts/${productId}?count=${count}`, {
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch similar products");
    return res.json();
  }
};