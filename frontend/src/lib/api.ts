import type { Lead, LeadFormData, DashboardStats, Activity, ApiResponse, Notification } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    async login(credentials: any): Promise<ApiResponse<{ token: string }>> {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      return { data, success: true };
    },
    async logout(): Promise<ApiResponse<{ success: boolean }>> {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Logout failed");
      return await res.json();
    },
  },
  leads: {
    async getAll(): Promise<ApiResponse<Lead[]>> {
      const res = await fetch(`${API_BASE_URL}/leads`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch leads");
      return await res.json();
    },

    async create(data: LeadFormData): Promise<ApiResponse<Lead>> {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create lead");
      return await res.json();
    },

    async getById(id: string): Promise<ApiResponse<Lead>> {
      const res = await fetch(`${API_BASE_URL}/leads/${id}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch lead details");
      return await res.json();
    },

    async delete(id: string): Promise<ApiResponse<null>> {
      const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete lead");
      return await res.json();
    },

    async updateStatus(id: string, status: Lead["status"]): Promise<ApiResponse<Lead>> {
      const res = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return await res.json();
    }
  },
  dashboard: {
    async getStats(): Promise<ApiResponse<DashboardStats>> {
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    },
    async getRecentActivity(): Promise<ApiResponse<Activity[]>> {
      const res = await fetch(`${API_BASE_URL}/dashboard/recent-activity`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch activity");
      return await res.json();
    }
  },
  notifications: {
    async getAll(): Promise<ApiResponse<Notification[]>> {
      const res = await fetch(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return await res.json();
    },
    async markAsRead(id: string, read: boolean = true): Promise<ApiResponse<null>> {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error("Failed to update notification");
      return await res.json();
    },
    async markAllAsRead(): Promise<ApiResponse<null>> {
      const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to update notifications");
      return await res.json();
    },
    async delete(id: string): Promise<ApiResponse<null>> {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete notification");
      return await res.json();
    }
  }
};
