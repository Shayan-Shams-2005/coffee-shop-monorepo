// components/ui/CarouselCartButton.tsx
"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../src/store/useCartStore";
import { Product } from "../../src/types/products";

export function CarouselCartButton({ product }: { product: any }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    const cartItem: Product = {
      ...product,
      id: product.productId || product.id,
      name: product.productName || product.name,
      price: product.salePrice || product.originalPrice || product.price,
      image: product.images?.find((img: any) => img.isMain)?.imageUrl 
             || product.images?.[0]?.imageUrl 
             || `/p${((product.productId || product.id) % 5) + 1}/1.jpg`
    } as Product;

    addToCart(cartItem);
  };

  const displayName = product.productName || product.name;

  return (
    <button
      onClick={handleAddToCart}
      className="w-full py-2 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition-all duration-300
                 bg-[#C68E58] text-white border border-[#C68E58] hover:bg-[#A87242] hover:border-[#A87242]
                 dark:bg-[#6A422D] dark:border-[#6A422D] dark:text-[#F3E8E0] dark:hover:bg-[#7B4E36] dark:hover:border-[#7B4E36] dark:shadow-[0_4px_12px_rgba(106,66,45,0.2)]"
      aria-label={`افزودن ${displayName} به سبد خرید`}
    >
      <ShoppingBag className="w-4 h-4" />
      افزودن به سبد
    </button>
  );
}