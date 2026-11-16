
import { AuthApi } from "../../login/api";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103"
).replace(/\/$/, "");

export interface SupportConversation {
  supportConversationId: number;
  userId: number;
  userName: string;
  assignedAdminId: number | null;
  assignedAdminName: string | null;
  status: number;
  createdAt: string;
  closedAt: string | null;
}

export interface SupportMessage {
  supportMessageId: number;
  supportConversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface AssignConversationRequest {
  adminId: number;
}

export interface UpdateConversationStatusRequest {
  status: number;
}

const ENDPOINTS = {
  conversations: `${API_BASE_URL}/api/SupportChat/GetAll/admin/conversations`,

  messages: (id: number) =>
    `${API_BASE_URL}/api/SupportChat/GetConversationMessages/conversation/${id}/messages`,

  sendMessage: (id: number) =>
    `${API_BASE_URL}/api/SupportChat/SendMessage/conversation/${id}/messages`,

  assign: (id: number) =>
    `${API_BASE_URL}/api/SupportChat/AssignConversation/admin/conversations/${id}/assign`,

  updateStatus: (id: number) =>
    `${API_BASE_URL}/api/SupportChat/UpdateConversationStatus/admin/conversations/${id}/status`,
};

/**
 * Authenticated fetch:
 * - Includes authentication cookies.
 * - Sends the stored JWT as a Bearer token when available.
 * - Refreshes the session after a 401.
 * - Retries the original request once.
 */
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const requestOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  };

  const sendRequest = () => {
    const headers = new Headers(requestOptions.headers);

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return fetch(url, {
      ...requestOptions,
      headers,
    });
  };

  let response = await sendRequest();

  if (response.status === 401) {
    try {
      await AuthApi.refreshToken();

      // Read the token again in case the refresh process updated it.
      response = await sendRequest();
    } catch {
      throw new Error("SESSION_EXPIRED");
    }
  }

  return response;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    throw new Error(
      errorText || `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function getArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;

  return (
    data?.items ??
    data?.Items ??
    data?.data?.items ??
    data?.data?.Items ??
    data?.messages ??
    data?.Messages ??
    data?.data ??
    []
  );
}

export const SupportChatApi = {
  async getConversations(
    page: number,
    pageSize: number
  ): Promise<PagedResult<SupportConversation>> {
    const params = new URLSearchParams({
      Page: String(page),
      PageSize: String(pageSize),
    });

    const response = await fetchWithAuth(
      `${ENDPOINTS.conversations}?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    const data = await handleResponse<any>(response);
    const items = getArray<SupportConversation>(data);

    return {
      items,
      page: Number(data?.page ?? data?.Page ?? page),
      pageSize: Number(data?.pageSize ?? data?.PageSize ?? pageSize),
      totalCount: Number(
        data?.totalCount ??
          data?.TotalCount ??
          data?.data?.totalCount ??
          data?.data?.TotalCount ??
          items.length
      ),
    };
  },

  async getMessages(
    conversationId: number
  ): Promise<SupportMessage[]> {
    const response = await fetchWithAuth(
      ENDPOINTS.messages(conversationId),
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    if (response.status === 204) return [];

    const data = await handleResponse<any>(response);

    return getArray<SupportMessage>(data);
  },

  async sendMessage(
    conversationId: number,
    content: string
  ): Promise<SupportMessage | void> {
    const response = await fetchWithAuth(
      ENDPOINTS.sendMessage(conversationId),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    return handleResponse<SupportMessage | void>(response);
  },

  async assignConversation(
    conversationId: number,
    adminId: number
  ): Promise<void> {
    const response = await fetchWithAuth(
      ENDPOINTS.assign(conversationId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId }),
      }
    );

    await handleResponse<void>(response);
  },

  async updateConversationStatus(
    conversationId: number,
    status: number
  ): Promise<void> {
    const response = await fetchWithAuth(
      ENDPOINTS.updateStatus(conversationId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    await handleResponse<void>(response);
  },
};
