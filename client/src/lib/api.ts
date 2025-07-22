import { useAuth } from "@clerk/clerk-react";
import type { 
  InvitationWithRelations, 
  CreateInvitationInput,
  ApiSuccessResponse,
  ApiErrorResponse,
  User,
  AcceptInvitationInput
} from "@shared/types";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }


  async request<T = any>(
    path: string,
    options: RequestInit & { token?: string | null } = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiErrorResponse;
      throw new Error(error.error?.message || "API request failed");
    }

    return (data as ApiSuccessResponse<T>).data;
  }

  // User permissions
  async getUserPermissions(token: string) {
    return this.request("/api/user/permissions", { token });
  }

  // Invitations
  async getInvitations(token: string): Promise<{ invitations: InvitationWithRelations[] }> {
    return this.request("/api/invitations", { token });
  }

  async createInvitation(token: string, data: CreateInvitationInput) {
    return this.request("/api/invitations", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  }

  async revokeInvitation(token: string, invitationId: string) {
    return this.request(`/api/invitations/${invitationId}/revoke`, {
      method: "POST",
      token,
    });
  }

  async resendInvitation(token: string, invitationId: string) {
    return this.request(`/api/invitations/${invitationId}/resend`, {
      method: "POST",
      token,
    });
  }

  async getInvitationByToken(invitationToken: string) {
    return this.request(`/api/invitations/token/${invitationToken}`);
  }

  async acceptInvitation(data: AcceptInvitationInput) {
    return this.request("/api/invitations/accept", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers(token: string): Promise<{ users: User[] }> {
    return this.request("/api/users", { token });
  }

  async updateUserRole(token: string, userId: string, role: User["role"]) {
    return this.request(`/api/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
      token,
    });
  }

  async deleteUser(token: string, userId: string) {
    return this.request(`/api/users/${userId}`, {
      method: "DELETE",
      token,
    });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL || "http://localhost:3000"
);

// Hook to use the API client with automatic token injection
export function useApiClient() {
  const { getToken } = useAuth();

  const makeRequest = async <T = any>(
    requestFn: (token: string) => Promise<T>
  ): Promise<T> => {
    const token = await getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }
    return requestFn(token);
  };

  return {
    getUserPermissions: () => makeRequest((token) => apiClient.getUserPermissions(token)),
    getInvitations: () => makeRequest((token) => apiClient.getInvitations(token)),
    createInvitation: (data: CreateInvitationInput) =>
      makeRequest((token) => apiClient.createInvitation(token, data)),
    revokeInvitation: (invitationId: string) =>
      makeRequest((token) => apiClient.revokeInvitation(token, invitationId)),
    resendInvitation: (invitationId: string) =>
      makeRequest((token) => apiClient.resendInvitation(token, invitationId)),
    getInvitationByToken: (invitationToken: string) =>
      apiClient.getInvitationByToken(invitationToken),
    acceptInvitation: (data: AcceptInvitationInput) =>
      apiClient.acceptInvitation(data),
    getUsers: () => makeRequest((token) => apiClient.getUsers(token)),
    updateUserRole: (userId: string, role: User["role"]) =>
      makeRequest((token) => apiClient.updateUserRole(token, userId, role)),
    deleteUser: (userId: string) =>
      makeRequest((token) => apiClient.deleteUser(token, userId)),
  };
}