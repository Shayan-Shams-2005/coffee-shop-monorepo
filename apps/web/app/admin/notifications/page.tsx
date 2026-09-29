// app/admin/notifications/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Bell } from "lucide-react";
import { Notification, NotificationType, initialNotifications } from "./types";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationFilters } from "./components/NotificationFilters";
import { NotificationCard } from "./components/NotificationCard";
import { ReplyModal } from "./components/ReplyModal";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all");

  // Reply Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReply, setActiveReply] = useState<Notification | null>(null);

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.subject.toLowerCase().includes(q) || 
        n.message.toLowerCase().includes(q) || 
        n.userName.toLowerCase().includes(q) ||
        n.phone.includes(q)
      );
    }

    if (filterType !== "all") {
      result = result.filter(n => n.type === filterType);
    }

    if (filterStatus !== "all") {
      const isReadTarget = filterStatus === "read";
      result = result.filter(n => n.isRead === isReadTarget);
    }

    return result;
  }, [notifications, searchQuery, filterType, filterStatus]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    if(confirm("آیا از حذف این پیام اطمینان دارید؟")) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleOpenReplyModal = (notif: Notification) => {
    setActiveReply(notif);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveReply(null);
  };

  const handleSendReply = (replyMessage: string) => {
    if (activeReply) {
      const now = new Date().toISOString();
      
      setNotifications(prev => prev.map(n => 
        n.id === activeReply.id 
          ? { ...n, isRead: true, adminReply: replyMessage, repliedAt: now } 
          : n
      ));
      
      alert(`پاسخ شما با موفقیت برای ${activeReply.userName} ثبت و ارسال شد.`);
      handleCloseModal();
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500" dir="rtl">
      <NotificationHeader />

      <NotificationFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1A0F0C] rounded-[1.5rem] border border-[#F5EFE6] dark:border-[#3c2317] flex flex-col items-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-[#3c2317] mb-4" />
            <p className="font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">پیامی برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationCard 
              key={notif.id}
              notif={notif}
              onDelete={deleteNotification}
              onMarkAsRead={markAsRead}
              onReply={handleOpenReplyModal}
            />
          ))
        )}
      </div>

      <ReplyModal 
        isOpen={isModalOpen}
        activeReply={activeReply}
        onClose={handleCloseModal}
        onSubmit={handleSendReply}
      />
    </div>
  );
}