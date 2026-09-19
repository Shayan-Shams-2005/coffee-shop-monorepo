import { Hero } from "../components/home/Hero";
import { QuickLinks } from "../components/home/QuickLinks";
import { SpecialOffers } from "../components/home/special-offers/SpecialOffers";
import { AdBanners } from "../components/home/AdBanners";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { NewestProducts } from "../components/home/newest-products/NewestProducts";
import { Bestsellers } from "../components/home/best-sellers/BestSellers";
import { PopularBrands } from "../components/home/PopularBrands";

// 🚀 ایمپورت دیتای استاتیک
import {
  promoBanners4,
  promoBanners2,
  promoBanners3,
} from "../lib/mock/home-data";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">
      {/* 
        رنگ پس‌زمینه bg-[#FDFCFB] حذف شد چون توسط globals.css مدیریت می‌شود.
        عرض 1440 پیکسل برای یکپارچگی المان‌های صفحه اصلی حفظ شد.
      */}
      <div className="w-full max-w-[1440px] mx-auto pb-20">
        <Hero />
        <QuickLinks />
        <SpecialOffers />

        <AdBanners banners={promoBanners4} />

        <CategoryGrid />
        <NewestProducts />

        <AdBanners banners={promoBanners2} />

        <Bestsellers />
        <PopularBrands />

        <AdBanners banners={promoBanners3} />
      </div>
    </main>
  );
}
