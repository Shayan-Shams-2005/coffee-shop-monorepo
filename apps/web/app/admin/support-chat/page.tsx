// app/admin/support-chat/page.tsx
// cSpell:disable
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Send,
  Search,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { useAuthStore } from "../../../src/store/useAuthStore";
import {
  SupportChatApi,
  SupportConversation,
  SupportMessage,
} from "./api";

const PAGE_SIZE = 20;

const toFarsiNumber = (value: number | string): string => {
  return String(value).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit
  );
};

const getConversationId = (conversation: SupportConversation) =>
  conversation.supportConversationId;

const formatDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return "باز";
    case 1:
      return "در حال بررسی";
    case 2:
      return "بسته شده";
    default:
      return "نامشخص";
  }
};

export default function AdminLiveChatPage() {
  const user = useAuthStore((state: any) => state.user);

  const currentAdminId = Number(user?.id ?? user?.userId);

  const [conversations, setConversations] = useState<SupportConversation[]>(
    []
  );
  const [selectedConv, setSelectedConv] =
    useState<SupportConversation | null>(null);

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Conversation pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Loading states
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [listError, setListError] = useState("");
  const [messageError, setMessageError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedConvRef = useRef<SupportConversation | null>(null);

  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

  // Load one server-paginated page of conversations.
  const fetchConversations = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsLoadingList(true);

      setListError("");

      const result = await SupportChatApi.getConversations(page, PAGE_SIZE);

      setConversations(result.items);
      setTotalCount(result.totalCount);

      // Keep the selected conversation synchronized with refreshed data.
      const selected = selectedConvRef.current;

      if (selected) {
        const selectedId = getConversationId(selected);

        const updatedConversation = result.items.find(
          (conversation) => getConversationId(conversation) === selectedId
        );

        if (updatedConversation) {
          setSelectedConv(updatedConversation);
        }
      }

      // If the current page is no longer valid, go back to the last page.
      const lastPage = Math.max(
        1,
        Math.ceil(result.totalCount / PAGE_SIZE)
      );

      if (page > lastPage) {
        setPage(lastPage);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setListError("دریافت مکالمات با خطا مواجه شد.");
    } finally {
      if (showLoader) setIsLoadingList(false);
    }
  }, [page]);

  // Fetch conversations when the page changes.
  useEffect(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  // Refresh the current conversation page periodically.
  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchConversations(false);
    }, 15000);

    return () => window.clearInterval(interval);
  }, [fetchConversations]);

  // Fetch messages when a conversation is selected.
  const fetchMessages = useCallback(
    async (conversationId: number, showLoader = false) => {
      try {
        if (showLoader) setIsLoadingMessages(true);

        setMessageError("");

        const data = await SupportChatApi.getMessages(conversationId);

        // Prevent messages from a previous conversation replacing
        // the messages of the currently selected conversation.
        const currentlySelected = selectedConvRef.current;

        if (
          currentlySelected &&
          getConversationId(currentlySelected) === conversationId
        ) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessageError("دریافت پیام‌ها با خطا مواجه شد.");
      } finally {
        if (showLoader) setIsLoadingMessages(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      return;
    }

    const conversationId = getConversationId(selectedConv);

    fetchMessages(conversationId, true);

    const interval = window.setInterval(() => {
      fetchMessages(conversationId, false);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [selectedConv?.supportConversationId, fetchMessages]);

  // Scroll to the latest message when messages change.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSelectConversation = (conversation: SupportConversation) => {
    setSelectedConv(conversation);
    setMessages([]);
    setMessageError("");
  };

  // Assign the selected conversation to the current admin.
  const handleAssignChat = async () => {
    if (!selectedConv || !Number.isInteger(currentAdminId) || currentAdminId <= 0) {
      return;
    }

    const conversationId = getConversationId(selectedConv);

    setIsAssigning(true);

    try {
      await SupportChatApi.assignConversation(
        conversationId,
        currentAdminId
      );

      await fetchConversations(false);

      // Refresh the selected conversation and its messages.
      const result = await SupportChatApi.getConversations(page, PAGE_SIZE);

      const updatedConversation = result.items.find(
        (conversation) =>
          getConversationId(conversation) === conversationId
      );

      if (updatedConversation) {
        setSelectedConv(updatedConversation);
      }
    } catch (error) {
      console.error("Assignment error:", error);
      alert("اختصاص مکالمه با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsAssigning(false);
    }
  };

  // Send a message.
  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newMessage.trim() || !selectedConv || isSending) return;

    const conversationId = getConversationId(selectedConv);
    const messageText = newMessage.trim();

    setIsSending(true);
    setNewMessage("");

    try {
      await SupportChatApi.sendMessage(conversationId, messageText);

      await fetchMessages(conversationId, false);
    } catch (error) {
      console.error("Error sending message:", error);

      setNewMessage(messageText);
      alert("ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSending(false);
    }
  };

  // Search is applied to the currently loaded server page.
  const filteredConversations = conversations.filter((conversation) =>
    conversation.userName
      ?.toLocaleLowerCase()
      .includes(searchQuery.toLocaleLowerCase())
  );

  const isAssignedToMe = selectedConv
    ? selectedConv.assignedAdminId === currentAdminId
    : false;

  return (
    <div
      className="max-w-7xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500"
      dir="rtl"
    >
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5]">
          پشتیبانی آنلاین
        </h1>

        <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
          مدیریت و پاسخگویی به چت‌های کاربران
        </p>
      </div>

      <div className="flex flex-col md:flex-row h-[75vh] min-h-[600px] bg-white dark:bg-[#1A110F] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-3xl shadow-sm overflow-hidden">

        {/* Conversation list */}
        <div
          className={`w-full md:w-1/3 flex flex-col border-l border-[#E3C3A4]/60 dark:border-[#3c2317] bg-[#FDFCFB] dark:bg-[#231511] ${
            selectedConv ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-[#E3C3A4]/60 dark:border-[#3c2317]">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجوی نام کاربر در این صفحه..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-white dark:bg-[#1A110F] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-[#4A3022] dark:text-white focus:outline-none focus:border-[#C68E58]"
              />

              <Search className="absolute right-3 top-3 w-4 h-4 text-[#8C7A6B]" />
            </div>

            <div className="flex justify-between items-center mt-3 text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
              <span>
                مجموع مکالمات: {toFarsiNumber(totalCount)}
              </span>

              <span>
                صفحه {toFarsiNumber(page)} از {toFarsiNumber(totalPages)}
              </span>
            </div>
          </div>

          {/* Conversation items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {isLoadingList ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-[#C68E58] animate-spin" />
              </div>
            ) : listError ? (
              <div className="text-center py-10 px-4">
                <p className="text-sm text-red-500 font-bold">
                  {listError}
                </p>

                <button
                  onClick={() => fetchConversations(true)}
                  className="mt-4 text-sm font-bold text-[#C68E58]"
                >
                  تلاش مجدد
                </button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-10 text-[#8C7A6B] text-sm font-bold">
                مکالمه‌ای یافت نشد.
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const conversationId = getConversationId(conversation);

                const assignedToMe =
                  conversation.assignedAdminId === currentAdminId;

                return (
                  <button
                    key={conversationId}
                    onClick={() =>
                      handleSelectConversation(conversation)
                    }
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-right ${
                      selectedConv &&
                      getConversationId(selectedConv) === conversationId
                        ? "bg-[#C68E58]/10 dark:bg-[#C68E58]/20 border border-[#C68E58]/30"
                        : "hover:bg-white dark:hover:bg-[#1A110F] border border-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E3C3A4]/30 dark:bg-[#3c2317] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#C68E58]" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1 gap-2">
                        <span className="font-bold text-[#4A3022] dark:text-[#EAE0D5] truncate">
                          {conversation.userName || "کاربر ناشناس"}
                        </span>

                        <span className="text-[10px] text-[#8C7A6B] shrink-0">
                          {formatDate(conversation.createdAt)}
                        </span>
                      </div>

                      <div className="text-xs text-[#8C7A6B] dark:text-[#A1A1A1] flex justify-between items-center gap-2">
                        <span className="truncate">
                          {getStatusLabel(conversation.status)}
                        </span>

                        {assignedToMe && (
                          <span className="text-[10px] text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded shrink-0">
                            اختصاص‌یافته به من
                          </span>
                        )}
                      </div>

                      {conversation.assignedAdminName && !assignedToMe && (
                        <p className="text-[10px] text-[#A18B78] mt-1 truncate">
                          مسئول: {conversation.assignedAdminName}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination controls */}
          <div className="p-3 border-t border-[#E3C3A4]/60 dark:border-[#3c2317] flex items-center justify-between gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || isLoadingList}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-white dark:bg-[#1A110F] border border-[#E3C3A4]/60 dark:border-[#3c2317] text-[#8C7A6B] hover:text-[#C68E58] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
              قبلی
            </button>

            <span className="text-xs font-bold text-[#8C7A6B] dark:text-[#A1A1A1]">
              {toFarsiNumber(page)} / {toFarsiNumber(totalPages)}
            </span>

            <button
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages || isLoadingList}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-white dark:bg-[#1A110F] border border-[#E3C3A4]/60 dark:border-[#3c2317] text-[#8C7A6B] hover:text-[#C68E58] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              بعدی
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat window */}
        <div
          className={`w-full md:w-2/3 flex flex-col bg-white dark:bg-[#1A110F] ${
            !selectedConv ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedConv ? (
            <>
              {/* Chat header */}
              <div className="min-h-16 flex items-center gap-4 px-6 py-3 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] bg-[#FDFCFB] dark:bg-[#231511]">
                <button
                  className="md:hidden p-2 -mr-2 text-[#8C7A6B]"
                  onClick={() => setSelectedConv(null)}
                  aria-label="بازگشت به فهرست مکالمات"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="w-10 h-10 rounded-full bg-[#E3C3A4]/30 dark:bg-[#3c2317] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#C68E58]" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-black text-[#4A3022] dark:text-white truncate">
                    {selectedConv.userName}
                  </h2>

                  <p className="text-xs font-bold text-[#8C7A6B]">
                    {getStatusLabel(selectedConv.status)}
                    {selectedConv.assignedAdminName
                      ? ` · مسئول: ${selectedConv.assignedAdminName}`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-[#C68E58] animate-spin" />
                  </div>
                ) : messageError ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-red-500 font-bold">
                      {messageError}
                    </p>

                    <button
                      onClick={() =>
                        fetchMessages(
                          getConversationId(selectedConv),
                          true
                        )
                      }
                      className="mt-4 text-sm font-bold text-[#C68E58]"
                    >
                      تلاش مجدد
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-50">
                    <Clock className="w-12 h-12 text-[#C68E58] mb-2" />

                    <p className="text-[#8C7A6B] font-bold">
                      پیامی در این مکالمه وجود ندارد.
                    </p>
                  </div>
                ) : (
                  (() => {
                    let lastRenderedDate = "";

                    return messages.map((message, index) => {
                      const isCustomer =
                        message.senderId === selectedConv.userId;

                      const messageDate = formatDate(message.sentAt);
                      const messageTime = formatTime(message.sentAt);

                      const showDateSeparator =
                        messageDate !== "" &&
                        messageDate !== lastRenderedDate;

                      if (showDateSeparator) {
                        lastRenderedDate = messageDate;
                      }

                      return (
                        <div
                          key={message.supportMessageId || `message-${index}`}
                          className="flex flex-col"
                        >
                          {showDateSeparator && (
                            <div className="flex justify-center my-4">
                              <span className="bg-[#F5EFE6] dark:bg-[#2C1A14] text-[#8C7A6B] dark:text-[#BA8D71] text-[11px] font-bold px-3 py-1 rounded-full border border-[#E3C3A4]/30 dark:border-[#3c2317]">
                                {messageDate}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex ${
                              isCustomer ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-4 rounded-2xl ${
                                isCustomer
                                  ? "bg-[#F5EFE6] text-[#2C1E16] dark:bg-[#2C1A14] dark:text-[#E3C3A4] rounded-tl-sm border border-[#E3C3A4]/30 dark:border-[#3c2317]"
                                  : "bg-[#C68E58] text-white rounded-tr-sm shadow-md"
                              }`}
                            >
                              <p className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap break-words">
                                {message.content}
                              </p>

                              <div
                                className={`text-[10px] mt-2 font-bold flex items-center justify-end gap-1 ${
                                  isCustomer
                                    ? "text-[#8C7A6B] dark:text-[#BA8D71]"
                                    : "text-white/70"
                                }`}
                              >
                                {messageTime}

                                {!isCustomer &&
                                  (message.isRead ? (
                                    <CheckCircle2 className="w-3 h-3 text-blue-200" />
                                  ) : (
                                    <CheckCircle2 className="w-3 h-3 opacity-60" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message input / assignment */}
              <div className="p-4 bg-white dark:bg-[#1A110F] border-t border-[#E3C3A4]/60 dark:border-[#3c2317]">
                {selectedConv.status === 2 ? (
                  <div className="h-12 flex items-center justify-center bg-gray-100 dark:bg-[#231511] rounded-xl text-gray-500 dark:text-[#8C7A6B] text-sm font-bold">
                    این مکالمه بسته شده است.
                  </div>
                ) : isAssignedToMe ? (
                  <form
                    onSubmit={handleSendMessage}
                    className="relative flex items-center"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(event) =>
                        setNewMessage(event.target.value)
                      }
                      placeholder="پاسخ خود را بنویسید..."
                      disabled={isSending}
                      maxLength={4000}
                      className="w-full h-12 bg-[#FDFCFB] dark:bg-[#231511] border border-[#E3C3A4]/50 dark:border-[#3c2317] rounded-full pr-6 pl-14 text-sm font-medium text-[#2C1E16] dark:text-white focus:outline-none focus:border-[#C68E58] transition-all disabled:opacity-50"
                    />

                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="absolute left-1.5 top-1.5 bottom-1.5 w-9 h-9 flex items-center justify-center bg-[#C68E58] text-white rounded-full hover:bg-[#A87242] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 rtl:-scale-x-100" />
                      )}
                    </button>
                  </form>
                ) : selectedConv.assignedAdminId ? (
                  <div className="h-12 flex items-center justify-center bg-gray-100 dark:bg-[#231511] rounded-xl text-gray-500 dark:text-[#8C7A6B] text-sm font-bold text-center px-3">
                    این چت در حال بررسی توسط ادمین دیگری (
                    {selectedConv.assignedAdminName || "نامشخص"}) است.
                  </div>
                ) : (
                  <button
                    onClick={handleAssignChat}
                    disabled={
                      isAssigning ||
                      !Number.isInteger(currentAdminId) ||
                      currentAdminId <= 0
                    }
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#C68E58] text-white font-bold rounded-xl hover:bg-[#A87242] transition-colors disabled:opacity-50"
                  >
                    {isAssigning ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserCheck className="w-5 h-5" />
                    )}

                    شروع بررسی و پاسخ به این کاربر
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-50 text-center p-6">
              <User className="w-20 h-20 text-[#C68E58] mb-4 opacity-50" />

              <p className="text-lg font-black text-[#4A3022] dark:text-[#EAE0D5]">
                مکالمه‌ای انتخاب نشده است
              </p>

              <p className="text-sm font-bold text-[#8C7A6B] mt-2">
                برای مشاهده و ارسال پیام، از لیست سمت راست یک کاربر را انتخاب کنید.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}