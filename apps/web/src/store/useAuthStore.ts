import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  title: string;
  fullAddress: string;
}

export interface UserProfile {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  addresses: Address[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (phone: string) => void;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (phone) =>
        set({ isAuthenticated: true, user: { phone, addresses: [] } }),
      logout: () => set({ isAuthenticated: false, user: null }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      addAddress: (address) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: [...state.user.addresses, address] }
            : null,
        })),

      removeAddress: (id) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: state.user.addresses.filter((a) => a.id !== id),
              }
            : null,
        })),
    }),
    { name: "neo-cafe-auth" },
  ),
);
