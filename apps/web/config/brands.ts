export interface Brand {
  id: string;
  name: string;
  enName: string;
  category: "coffee" | "equipment";
}

export const brandsData: Brand[] = [
  // ----------------- برندهای قهوه -----------------
  { id: "b1", name: "استارباکس", enName: "Starbucks", category: "coffee" },
  { id: "b2", name: "ایلی", enName: "Illy", category: "coffee" },
  { id: "b3", name: "لاوازا", enName: "Lavazza", category: "coffee" },
  { id: "b4", name: "جاکوبز", enName: "Jacobs", category: "coffee" },
  { id: "b5", name: "نسپرسو", enName: "Nespresso", category: "coffee" },
  { id: "b6", name: "نسکافه", enName: "Nescafe", category: "coffee" },
  { id: "b7", name: "دولچه گوستو", enName: "Dolce Gusto", category: "coffee" },
  { id: "b8", name: "دیویدوف", enName: "Davidoff", category: "coffee" },
  { id: "b9", name: "مولیناری", enName: "Molinari", category: "coffee" },
  { id: "b10", name: "سگافردو زانتی", enName: "Segafredo", category: "coffee" },
  { id: "b11", name: "علی‌کافه", enName: "Alicafe", category: "coffee" },
  { id: "b12", name: "تورابیکا", enName: "Torabika", category: "coffee" },
  { id: "b13", name: "مزتا", enName: "Meseta", category: "coffee" },
  { id: "b14", name: "نستله", enName: "Nestle", category: "coffee" },
  { id: "b15", name: "بلمیو", enName: "Belmio", category: "coffee" },
  { id: "b16", name: "تیمز", enName: "Tims", category: "coffee" },
  { id: "b17", name: "جنوا", enName: "Genoa", category: "coffee" },
  { id: "b18", name: "موونا", enName: "Moona", category: "coffee" },
  { id: "b19", name: "توگنانا", enName: "Tognana", category: "coffee" },

  // ------------- برندهای تجهیزات و اکسسوری -------------
  { id: "b20", name: "بیالتی", enName: "Bialetti", category: "equipment" },
  { id: "b21", name: "هاریو", enName: "Hario", category: "equipment" },
  { id: "b22", name: "واکاکو", enName: "Wacaco", category: "equipment" },
  { id: "b23", name: "استنلی", enName: "Stanley", category: "equipment" },
  { id: "b24", name: "اسمگ", enName: "Smeg", category: "equipment" },
  { id: "b25", name: "کاراجا", enName: "Karaca", category: "equipment" },
  { id: "b26", name: "گتر", enName: "Gater", category: "equipment" },
];
