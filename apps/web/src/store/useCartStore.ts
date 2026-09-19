import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types/products"; // از فایلی که در مرحله قبل ساختیم می‌آید

export interface CartItem extends Product {
  quantity: number;
}

// تعریف ساختار Store
interface CartState {
  cartItems: CartItem[];
  // اکشن‌ها
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  // میدل‌وِر persist جادوی Zustand است: سبد خرید را در LocalStorage ذخیره می‌کند!
  persist(
    (set) => ({
      cartItems: [],

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          // محصول جدید
          return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return {
              cartItems: state.cartItems.filter(
                (item) => item.id !== productId,
              ),
            };
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === productId ? { ...item, quantity } : item,
            ),
          };
        }),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "neo-cafe-cart", // اسمی که در LocalStorage مرورگر ذخیره می‌شود
    },
  ),
);

// ==========================================
// Selectors (تکنیک پیشرفته برای جلوگیری از Re-render)
// ==========================================
// به جای اینکه متغیرها را داخل استیت نگه داریم، آن‌ها را به صورت هوکِ مشتق‌شده می‌نویسیم
export const useCartCount = () =>
  useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + item.quantity, 0),
  );

export const useCartTotal = () =>
  useCartStore((state) =>
    state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
  );
