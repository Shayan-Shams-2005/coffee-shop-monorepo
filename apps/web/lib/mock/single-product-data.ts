export const mockProduct = {
  id: "melo-kenya-01",
  name: "قهوه ملو مدل کنیا ۱۰۰ درصد عربیکا (۲۵۰ گرمی)",
  enName: "Melo Coffee Kenya 100% Arabica - 250g",
  price: 1150000,
  oldPrice: 1450000,
  discount: 20,
  rating: 4.2,
  reviewsCount: 190,
  sku: "melo-kenya-250",
  features: [
    { label: "نوع قهوه", value: "۱۰۰٪ عربیکا" },
    { label: "درجه برشتگی", value: "متوسط" },
    { label: "درجه تلخی", value: "نسبتاً کم" },
    { label: "کافئین", value: "متوسط" },
    { label: "رایحه", value: "زیاد" },
    { label: "طعم یادها", value: "مرکبات، کاکائو، کارامل" },
  ],
  // 🚀 FIXED: Added more images to the array!
  images: ["/p1/1.jpg", "/p2/1.jpg", "/p3/1.jpg", "/p4/1.jpg", "/p5/1.jpg"],
  description:
    "قهوه ملو مدل کنیا، یکی از محبوب‌ترین قهوه‌های تک خاستگاه در جهان است. دانه قهوه کنیا به خاطر اسیدیته‌ی روشن و طعم‌یادهای میوه‌ای و مرکباتی‌اش شناخته می‌شود. این قهوه ۱۰۰٪ عربیکا بوده و در ارتفاعات بالای کنیا رشد می‌کند که همین امر باعث ایجاد پیچیدگی‌های طعمی بی‌نظیر در آن می‌شود. اگر به دنبال یک فنجان قهوه‌ی شفاف، با بادی (Body) متوسط و عطری دل‌انگیز از توت‌های وحشی و شکلات هستید، قهوه کنیا بهترین انتخاب برای شروع روز شماست. درجه برشتگی متوسط این دانه‌ها باعث شده تا تعادل کاملی بین اسیدیته و شیرینی طبیعی قهوه برقرار شود.",
  specifications: [
    { name: "وزن", value: "۲۵۰ گرم" },
    { name: "نوع بسته‌بندی", value: "پاکت سوپاپ‌دار سه لایه" },
    { name: "خاستگاه", value: "آفریقا (کنیا)" },
    { name: "ارتفاع کشت", value: "۱۷۰۰ تا ۱۹۰۰ متر از سطح دریا" },
    { name: "روش فرآوری", value: "شسته شده (Washed)" },
    { name: "مناسب برای", value: "اسپرسو، قهوه دمی، فرنچ پرس، موکاپات" },
    { name: "میزان کافئین", value: "۱.۱ تا ۱.۵ درصد" },
    { name: "تاریخ برشتگی", value: "حداکثر ۷ روز قبل از ارسال" },
  ],
};

export const grindOptions = [
  "دانه قهوه",
  "اسپرسو ساز",
  "موکاپات",
  "فرنچ پرس",
  "قهوه ساز فیلتری",
];

export const mockRelatedProducts = [
  {
    id: "1",
    name: "قهوه تخصصی تک‌خاستگاه لاین 2",
    price: 480000,
    oldPrice: 600000,
    discount: 20,
    hasTimer: true,
  },
  {
    id: "2",
    name: "قهوه عربیکا کلمبیا سوپریمو (۲۵۰ گرم)",
    price: 980000,
    oldPrice: 1100000,
    discount: 11,
    hasTimer: false,
  },
  {
    id: "3",
    name: "دان قهوه اسپرسو ترکیب ویژه (۱ کیلوگرم)",
    price: 2300000,
    oldPrice: 2800000,
    discount: 18,
    hasTimer: true,
  },
  {
    id: "4",
    name: "قهوه فوری گلد نسکافه (۱۰۰ گرم)",
    price: 380000,
    oldPrice: 0,
    discount: 0,
    hasTimer: false,
  },
  {
    id: "5",
    name: "قهوه ترک افندی با هل (۲۵۰ گرم)",
    price: 450000,
    oldPrice: 500000,
    discount: 10,
    hasTimer: false,
  },
  {
    id: "6",
    name: "قهوه روبوستا اندونزی (۲۵۰ گرم)",
    price: 650000,
    oldPrice: 0,
    discount: 0,
    hasTimer: false,
  },
  {
    id: "7",
    name: "پکیج ویژه دیویدوف مدل 8",
    price: 665000,
    oldPrice: 750000,
    discount: 12,
    hasTimer: true,
  },
  {
    id: "8",
    name: "قهوه اسپرسو لاوازا (۲۵۰ گرم)",
    price: 520000,
    oldPrice: 0,
    discount: 0,
    hasTimer: false,
  },
  {
    id: "9",
    name: "پکیج ویژه نسکافه مدل 6",
    price: 575000,
    oldPrice: 650000,
    discount: 15,
    hasTimer: false,
  },
];

// 🚀 Original specific reviews
const initialReviews = [
  {
    id: 1,
    author: "کیومرث حقانی",
    date: "۱۵ مرداد ۱۴۰۵",
    isBuyer: false,
    text: "سلام وقت بخیر: قهوه ملو مدل کنیا، یک محصول با کیفیت است که با هدف ارائه یک تجربه طعمی خوب در رده‌ی قهوه‌های تک خاستگاه طراحی شده. 📊 مشخصات فنی: اسیدیته بالا و طعم‌یادهای مرکباتی. این دانه با کیفیت رست برتر و طراحی منحصر به فرد خود، تجربه‌ای شگفت‌انگیز برای علاقه‌مندان به قهوه‌های دمی ارائه می‌دهد...",
    likes: 57,
    dislikes: 8,
  },
  {
    id: 2,
    author: "عباد پارسا",
    date: "۳ مرداد ۱۴۰۵",
    isBuyer: true,
    text: "واقعا کیفیت خوبی داره نسبت به برند های رقیبش یه سر و گردن بالاتره. عطرش موقع آسیاب کردن کل خونه رو برمیداره. مشکل تلخی زننده اصلا نداره و طعمش خیلی متعادله. و اینکه قیمت دیجیکالا از جا های دیگه خیلی پایین تر هستش در آخر درخواست نصب توی سایت هم دادم کمتر از یک روز به دستم رسید. با تشکر.",
    likes: 124,
    dislikes: 2,
    images: ["/p4/1.jpg", "/p5/1.jpg"],
  },
];

// 🚀 Generate 78 more reviews dynamically to reach 80 total for pagination
const generatedReviews = Array.from({ length: 78 }).map((_, index) => ({
  id: index + 3,
  author: `کاربر تستی ${index + 3}`,
  date: `${(index % 30) + 1} شهریور ۱۴۰۵`,
  isBuyer: index % 3 !== 0, // 2/3 of users are buyers
  text: "این یک دیدگاه تستی برای بررسی عملکرد صفحه‌بندی و بارگذاری کامنت‌های بیشتر است. کیفیت رست قهوه بسیار عالی بود و بسته‌بندی کاملا سالمی داشت. حتما دوباره خرید می‌کنم.",
  likes: Math.floor(Math.random() * 40) + 1,
  dislikes: Math.floor(Math.random() * 5),
}));

export const mockReviews = [...initialReviews, ...generatedReviews];
