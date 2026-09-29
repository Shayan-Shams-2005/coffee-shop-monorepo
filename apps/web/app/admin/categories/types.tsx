// app/admin/categories/types.tsx
import { MenuCategory, megaMenuCategories } from "../../../config/menu"; // مسیر را در صورت نیاز اصلاح کنید

export const toFarsiNumber = (num: number | string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};

export type Category = {
  id: number;
  name: string;
  parentId: number | null; // null means it's a Main Category
  image: string | null;
  productCount: number;
};

export const generateInitialCategories = (data: MenuCategory[]): Category[] => {
  let currentId = 1;
  const flatCategories: Category[] = [];

  data.forEach(mainCat => {
    const mainCatId = currentId++;
    flatCategories.push({
      id: mainCatId,
      name: mainCat.title,
      parentId: null,
      image: null,
      productCount: (mainCatId * 7) % 50 + 10,
    });

    mainCat.sections.forEach(section => {
      const sectionId = currentId++;
      flatCategories.push({
        id: sectionId,
        name: section.title,
        parentId: mainCatId,
        image: null,
        productCount: (sectionId * 5) % 20 + 5,
      });

      section.items.forEach(item => {
        const itemId = currentId++;
        flatCategories.push({
          id: itemId,
          name: item,
          parentId: sectionId, 
          image: null,
          productCount: (itemId * 3) % 15 + 1,
        });
      });
    });
  });

  return flatCategories;
};

export const initialCategories = generateInitialCategories(megaMenuCategories);