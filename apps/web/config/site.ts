// apps/web/config/site.ts

export const siteConfig = {
  name: "نئو کافه",
  description: "طعم واقعی قهوه، مستقیماً از مزرعه تا فنجان شما.",
  navLinks: [
    { id: 1, label: "محصولات", href: "/shop" },
    { id: 2, label: "تخفیف‌های ویژه", href: "/offers", isOffer: true },
    { id: 3, label: "پرفروش‌ترین‌ها", href: "/bestsellers" },
    { id: 4, label: "درباره ما", href: "/about" },
  ],
};
