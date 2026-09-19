"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Address = {
  id: string;
  title: string;
  fullAddress: string;
};

export type User = {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string; // عکس پروفایل
  addresses?: Address[]; // لیست آدرس‌ها
} | null;

interface AuthContextType {
  user: User;
  login: (phone: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const login = (phone: string) => setUser({ phone, addresses: [] });
  const logout = () => setUser(null);

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const addAddress = (address: Address) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, addresses: [...(prev.addresses || []), address] };
    });
  };

  const removeAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: (prev.addresses || []).filter((a) => a.id !== id),
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, addAddress, removeAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
