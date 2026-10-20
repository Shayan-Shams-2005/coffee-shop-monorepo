// app/admin/orders/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus, mapBackendStatusToFrontend } from "./types";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrdersControlBar } from "./components/OrdersControlBar";
import { OrdersTable } from "./components/OrdersTable";
import { OrderDetailsModal } from "./components/OrderDetailsModal";
import { OrderAdminApi } from "./api";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "price_desc" | "price_asc">("date_desc");
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await OrderAdminApi.getAll();
      
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: `ORD-${o.orderId}`,
        numericId: o.orderId,
        customerName: o.recipientName || "نامشخص",
        phone: o.phoneNumber || "-",
        date: o.createdAt || new Date().toISOString(),
        totalAmount: o.totalAmount || 0,
        status: mapBackendStatusToFrontend(o.status),
        address: `${o.province || ''}، ${o.city || ''}، ${o.addressLine || ''}`.replace(/^[،\s]+|[،\s]+$/g, ''),
        items: (o.items || []).map((i: any) => ({
          id: i.orderItemId || Math.random(),
          name: i.productName + (i.variantSku ? ` (${i.variantSku})` : ''),
          quantity: i.quantity || 1,
          price: i.unitPrice || 0
        }))
      }));

      setOrders(mappedOrders);
    } catch (err: any) {
      console.error(err);
      if (err.message === "SESSION_EXPIRED") {
        alert("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customerName.toLowerCase().includes(q) || 
        o.phone.includes(q)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter(o => o.status === filterStatus);
    }

    result.sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "price_desc") return b.totalAmount - a.totalAmount;
      if (sortBy === "price_asc") return a.totalAmount - b.totalAmount;
      return 0;
    });

    return result;
  }, [orders, searchQuery, filterStatus, sortBy]);

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <OrdersHeader />

      <OrdersControlBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-[0_4px_20px_rgba(198,142,88,0.03)] dark:shadow-none min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-[#8C7A6B] font-bold">
            در حال دریافت اطلاعات سفارشات...
          </div>
        ) : (
          <OrdersTable 
            orders={filteredAndSortedOrders} 
            onViewDetails={(order) => setSelectedOrder(order)} 
          />
        )}
      </div>

      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onSuccess={() => {
          setSelectedOrder(null);
          fetchOrders(); // Refresh table after update/cancel
        }} 
      />
    </div>
  );
}