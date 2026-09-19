"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCartStore, useCartTotal } from "../../src/store/useCartStore";
import { useAuthStore } from "../../src/store/useAuthStore";

import { CheckoutStepper } from "../../components/checkout/CheckoutStepper";
import { CheckoutForm } from "../../components/checkout/CheckoutForm";
import { OrderSummary } from "../../components/checkout/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();

  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = useCartTotal();
  const user = useAuthStore((state) => state.user);

  const [isMounted, setIsMounted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("saman");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "ایران",
    street: "",
    province: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isMounted && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isMounted, cartItems, router]);

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } },
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("لطفاً قوانین و مقررات را تایید کنید.");
      return;
    }
    alert("در حال اتصال به درگاه امن بانکی...");
  };

  if (!isMounted) {
    return (
      <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen flex items-center justify-center transition-colors">
        {/* 🚀 FIXED: Applied Mocha color to the loading spinner */}
        <Loader2 className="w-10 h-10 text-[#D4A373] dark:text-[#6A422D] animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) return null;

  const shippingCost = 80000;
  const finalTotal = cartTotal + shippingCost;

  return (
    <div className="bg-[#FDFCFB] dark:bg-[#1A1412] min-h-screen transition-colors duration-300">
      <div className="container mx-auto max-w-[1200px] px-4 py-12 md:py-16">
        <CheckoutStepper />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start animate-in fade-in duration-500 relative"
        >
          <CheckoutForm formData={formData} handleChange={handleChange} />

          <OrderSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            shippingCost={shippingCost}
            finalTotal={finalTotal}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
          />
        </form>
      </div>
    </div>
  );
}
