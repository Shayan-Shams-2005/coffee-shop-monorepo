import { Hero } from "../../components/home/Hero";
import { QuickLinks } from "../../components/home/QuickLinks";
import { SpecialOffers } from "../../components/home/special-offers/SpecialOffers";
import { AdBanners } from "../../components/home/AdBanners";
import { CategoryGrid } from "../../components/home/CategoryGrid";
import { NewestProducts } from "../../components/home/newest-products/NewestProducts";
import { Bestsellers } from "../../components/home/best-sellers/BestSellers";
import { PopularBrands } from "../../components/brands/PopularBrands";
import { LatestBlogs } from "../../components/home/LatestBlogs";

import {
  promoBanners4,
  promoBanners2,
  promoBanners3,
} from "../../lib/mock/home-data";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">
      
      {/* 🚀 FIXED: کامپوننت Hero از محدودیت ۱۴۴۰ پیکسل خارج شد تا ۱۰۰٪ عرض صفحه را بگیرد */}
      <div className="w-full">
        <Hero />
      </div>

      {/* 🚀 بقیه سایت در محدودیت ۱۴۴۰ پیکسل باقی می‌ماند تا چیدمان به هم نریزد */}
      <div className="w-full max-w-[1440px] mx-auto pb-20 px-4 md:px-6">
        <QuickLinks />
        <SpecialOffers />

        <AdBanners banners={promoBanners4} />

        <CategoryGrid />
        <NewestProducts />

        <AdBanners banners={promoBanners2} />

        <Bestsellers />
        <PopularBrands />
      
        <AdBanners banners={promoBanners3} />

        <LatestBlogs />
      </div>
    </main>
  );
}