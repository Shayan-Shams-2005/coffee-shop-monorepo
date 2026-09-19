"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Share2, Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>(images[0] ?? "");
  const [isLiked, setIsLiked] = useState(false);

  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const currentIndex = images.indexOf(activeImage);

  useEffect(() => {
    if (thumbnailsRef.current && thumbnailsRef.current.children[currentIndex]) {
      const activeThumbnail = thumbnailsRef.current.children[
        currentIndex
      ] as HTMLElement;
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  const handleNext = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setActiveImage(images[nextIndex] ?? "");
  };

  const handlePrev = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setActiveImage(images[prevIndex] ?? "");
  };

  return (
    <div className="md:col-span-5 flex flex-col gap-4">
      {/* ================= Main Image View ================= */}
      {/* 🚀 FIXED: Applied Latte gradient background in dark mode */}
      <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-[#F0EBE1] dark:border-transparent flex items-center justify-center group transition-colors overflow-hidden">
        {/* Floating Action Buttons */}
        <div className="absolute top-5 right-5 flex flex-col gap-3 z-10">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="w-12 h-12 bg-white dark:bg-[#1A110F] rounded-full flex items-center justify-center shadow-md dark:shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-[#F0EBE1] dark:border-[#3c2317] text-gray-400 dark:text-[#A1A1A1] hover:text-[#D95D39] dark:hover:text-[#D95D39] transition-all hover:scale-105"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? "fill-[#D95D39] text-[#D95D39]" : ""
              }`}
            />
          </button>

          <button className="w-12 h-12 bg-white dark:bg-[#1A110F] rounded-full flex items-center justify-center shadow-md dark:shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-[#F0EBE1] dark:border-[#3c2317] text-gray-400 dark:text-[#A1A1A1] hover:text-[#D4A373] dark:hover:text-[#C68E58] transition-all hover:scale-105">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Chevrons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white dark:bg-[#1A110F] rounded-full flex items-center justify-center shadow-md dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)] border border-[#F0EBE1] dark:border-[#3c2317] text-gray-500 dark:text-[#A1A1A1] hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-all hover:scale-110 active:scale-95 z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white dark:bg-[#1A110F] rounded-full flex items-center justify-center shadow-md dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)] border border-[#F0EBE1] dark:border-[#3c2317] text-gray-500 dark:text-[#A1A1A1] hover:text-[#C68E58] dark:hover:text-[#FFD7BA] transition-all hover:scale-110 active:scale-95 z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Clickable Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 dir-ltr">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? "w-6 h-2 bg-[#D4A373] dark:bg-[#C68E58]"
                    : "w-2 h-2 bg-[#D1C8B8] dark:bg-[#3c2317] hover:bg-gray-400 dark:hover:bg-[#C68E58]"
                }`}
              />
            ))}
          </div>
        )}

        {/* Image */}
        <div className="relative w-full h-full p-4">
          <Image
            src={activeImage}
            alt={productName}
            fill
            // 🚀 FIXED: Added mix-blend-multiply to blend the JPG background
            className="object-contain p-2 mix-blend-multiply transition-transform duration-300"
          />
        </div>
      </div>

      {/* ================= Thumbnails ================= */}
      <div
        ref={thumbnailsRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 scroll-smooth"
      >
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`relative w-24 h-24 rounded-3xl flex-shrink-0 transition-all flex items-center justify-center p-1 ${
              activeImage === img
                ? "border-2 border-[#C68E58] dark:border-[#C68E58]"
                : "border-2 border-transparent hover:border-gray-200 dark:hover:border-[#3c2317]"
            }`}
          >
            {/* 🚀 FIXED: Applied Latte gradient background in dark mode */}
            <div className="relative w-full h-full bg-gradient-to-br from-[#FFFDFB] to-[#FCF9F5] dark:from-[#D4C5B0] dark:to-[#C6B59D] rounded-[18px] shadow-sm border border-[#F0EBE1] dark:border-transparent overflow-hidden transition-colors">
              <Image
                src={img}
                alt={`تصویر ${idx + 1}`}
                fill
                // 🚀 FIXED: Added mix-blend-multiply to blend the JPG background
                className="object-contain p-2 mix-blend-multiply"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}