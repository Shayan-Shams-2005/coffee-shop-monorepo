// app/admin/orders/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Order, OrderStatus, initialOrders } from "./types";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrdersControlBar } from "./components/OrdersControlBar";
import { OrdersTable } from "./components/OrdersTable";
import { OrderDetailsModal } from "./components/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Filtering and Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "price_desc" | "price_asc">("date_desc");
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: "cancelled" } : null);
    }
  };

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

      <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#F5EFE6] dark:border-[#3c2317] overflow-hidden shadow-[0_2px_15px_rgba(198,142,88,0.03)] dark:shadow-none">
        <OrdersTable 
          orders={filteredAndSortedOrders} 
          onViewDetails={(order) => setSelectedOrder(order)} 
        />
      </div>

      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onCancelOrder={handleCancelOrder} 
      />
    </div>
  );
}