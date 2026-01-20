import apiClient from './client';

export interface Hostel {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  settings?: any;
  _count: {
    users: number;
    rooms: number;
    bookings: number;
    guests: number;
  };
}

export interface PaginatedResponse {
  hostels: Hostel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface HostelStats {
  monthlyRevenue: number;
  todayBookings: number;
  availableRooms: number;
  totalRooms: number;
  totalGuests: number;
  totalBookings: number;
  totalStaff: number;
}

export interface HostelFormData {
  name: string;
  slug: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  isActive: boolean;
  settings: {
    address: string;
    phone: string;
    email: string;
    website: string;
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    timezone: string;
    lateCheckoutFee: number;
    cancellationPolicy: string;
  };
}

export const hostelApi = {
  // Get all hostels (Super Admin only)
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    return apiClient.get<PaginatedResponse>(`/hostels?${queryParams.toString()}`);
  },

  // Get current user's hostel
  getMyHostel: () => {
    return apiClient.get<{ hostel: Hostel; stats: HostelStats }>('/hostels/my-hostel');
  },

  // Get hostel by ID
  getById: (id: string) => {
    return apiClient.get<{ hostel: Hostel }>(`/hostels/${id}`);
  },

  // Create new hostel (Super Admin only)
  create: (data: Partial<HostelFormData>) => {
    return apiClient.post<{ hostel: Hostel; message: string }>('/hostels', data);
  },

  // Update hostel
  update: (id: string, data: Partial<HostelFormData>) => {
    return apiClient.put<{ hostel: Hostel; message: string }>(`/hostels/${id}`, data);
  },

  // Delete hostel (Super Admin only)
  delete: (id: string) => {
    return apiClient.delete<{ message: string }>(`/hostels/${id}`);
  },

  // Update hostel status (Super Admin only)
  updateStatus: (id: string, isActive: boolean) => {
    return apiClient.patch<{ hostel: Hostel; message: string }>(
      `/hostels/${id}/status`,
      { isActive }
    );
  },

  // Get hostel statistics
  getStats: (id: string) => {
    return apiClient.get<any>(`/hostels/${id}/stats`);
  },
};
