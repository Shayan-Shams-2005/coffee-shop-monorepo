const categoriesData = [
  {
    id: "coffee-types",
    title: "قهوه (ترکیبی و دمی)",
    sections: [
      {
        title: "خرید قهوه اسپرسو",
        items: ["پیشنهاد شده برای اسپرسو", "پیشنهادات ترکیبی", "کافئین بالا"],
      },
    ],
  },
  {
    id: "single-origin",
    title: "قهوه تک خاستگاه، غیرترکیبی",
    sections: [
      { title: "آمریکای لاتین", items: ["برزیل", "کلمبیا", "گواتمالا"] },
    ],
  },
  {
    id: "brands",
    title: "برند ها",
    sections: [
      {
        title: "برندهای محبوب قهوه",
        items: ["استارباکس", "ایلی", "لاوازا", "جاکوبز", "نسپرسو"],
      },
      {
        title: "سایر برندهای قهوه",
        items: ["علی‌کافه", "تورابیکا", "مزتا", "نستله"],
      },
    ],
  },
];

const brandCategory = categoriesData.find((c) => c.id === "brands");
export const ALL_BRANDS = brandCategory
  ? brandCategory.sections.flatMap((s) => s.items)
  : [];
export const PRODUCT_CATEGORIES = categoriesData.filter(
  (c) => c.id !== "brands",
);

export const DISCOUNTED_PRODUCTS = Array.from({ length: 24 }).map((_, i) => {
  const isExpiringSoon = i % 4 === 0;
  const price = 450000 + i * 45000;
  const discount = 15 + (i % 6) * 5;
  const oldPrice = Math.round(price / (1 - discount / 100));

  const randomBrand = ALL_BRANDS[i % ALL_BRANDS.length] || "برند متفرقه";
  const randomCategory =
    PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length]?.title ||
    "دسته‌بندی عمومی";

  return {
    id: `disc-${i + 1}`,
    name:
      i % 2 === 0
        ? `قهوه تخصصی تک‌خاستگاه لاین ${i + 1}`
        : `پکیج ویژه ${randomBrand} مدل ${i + 1}`,
    brand: randomBrand,
    category: randomCategory,
    price: price,
    oldPrice: oldPrice,
    discount: discount,
    rating: 3.5 + (i % 16) / 10,
    hoursLeft: isExpiringSoon ? (i % 11) + 1 : 24 + (i % 72),
    sales: 50 + i * 12,
  };
});
