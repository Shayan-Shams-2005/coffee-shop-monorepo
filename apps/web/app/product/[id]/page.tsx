"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useCartStore } from "../../../src/store/useCartStore";
import {
  mockProduct,
  grindOptions,
  mockRelatedProducts,
  mockReviews,
} from "../../../lib/mock/single-product-data";

import { StickyBottomBar } from "../../../components/product/StickyBottomBar";
import { ProductGallery } from "../../../components/product-page/ProductGallery";
import { ProductReviews } from "../../../components/product-page/ProductReviews";
import { RelatedProductsSlider } from "../../../components/product-page/RelatedProducts/RelatedProductsSlider";
import { ProductDetails } from "../../../components/product-page/ProductDetails";
import { ProductOverview } from "../../../components/product-page/ProductOverview";
import { ProductOrderCard } from "../../../components/product-page/ProductOrderCard";

export default function ProductPage({ params }: { params: { id: string } }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  const [selectedGrind, setSelectedGrind] = useState("دانه قهوه");
  const [showBottomBar, setShowBottomBar] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      // 1. Check if the user scrolled past the main Add To Cart button
      let isPastButton = false;
      if (addToCartBtnRef.current) {
        const rect = addToCartBtnRef.current.getBoundingClientRect();
        isPastButton = rect.bottom <= 0;
      }

      // 2. Check if the user is at the absolute bottom of the page
      // Changed threshold from 400 to 50 so it only disappears when reaching the footer
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;

      // 3. Only show the bar if past the button AND not at the bottom
      setShowBottomBar(isPastButton && !isAtBottom);
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);

    checkVisibility();

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  const handleAddToCart = () => {
    if (!selectedGrind) {
      alert("لطفاً نوع آسیاب را انتخاب کنید.");
      return;
    }
    addToCart({
      id: mockProduct.id,
      name: `${mockProduct.name} - ${selectedGrind}`,
      price: mockProduct.price,
      imageUrl: mockProduct.images[0] ?? "",
      roastLevel: "متوسط",
      description: mockProduct.description,
      rating: mockProduct.rating,
    });
    alert("محصول با موفقیت به سبد خرید اضافه شد!");
  };

  return (
    <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen transition-colors duration-300">
      <div className="container mx-auto max-w-[1400px] px-4 py-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C7A6B] dark:text-[#ba8d71] mb-10 font-medium transition-colors">
          <Link
            href="/"
            className="hover:text-[#D4A373] dark:hover:text-[#FFD7BA] transition-colors"
          >
            خانه
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#D4A373]/50 dark:text-[#C68E58]/50" />
          <Link
            href="/category/coffee"
            className="hover:text-[#D4A373] dark:hover:text-[#FFD7BA] transition-colors"
          >
            قهوه
          </Link>
          <ChevronLeft className="w-3 h-3 text-[#D4A373]/50 dark:text-[#C68E58]/50" />
          <span className="text-[#4A3022] dark:text-[#EAE0D5] font-bold transition-colors">
            {mockProduct.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          <div className="lg:col-span-9 flex flex-col gap-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <ProductGallery
                images={mockProduct.images}
                productName={mockProduct.name}
              />

              <ProductDetails
                product={mockProduct}
                selectedGrind={selectedGrind}
                setSelectedGrind={setSelectedGrind}
                grindOptions={grindOptions}
              />
            </div>

            <ProductOverview product={mockProduct} />
          </div>

          <ProductOrderCard
            product={mockProduct}
            onAddToCart={handleAddToCart}
            addToCartBtnRef={addToCartBtnRef}
          />
        </div>

        <RelatedProductsSlider products={mockRelatedProducts} />
        <ProductReviews
          reviews={mockReviews}
          rating={mockProduct.rating}
          reviewsCount={mockProduct.reviewsCount}
        />

        <StickyBottomBar
          product={mockProduct}
          isVisible={showBottomBar}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
