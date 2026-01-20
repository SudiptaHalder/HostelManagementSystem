import apiClient from './client';

export const healthCheck = () => apiClient.get('/health');
export const testDbConnection = () => apiClient.get('/db-test');
export const getTestData = () => apiClient.get('/test');

// Hostel services (to be implemented later)
export const hostelApi = {
  create: (data: any) => apiClient.post('/hostels', data),
  getAll: () => apiClient.get('/hostels'),
  getById: (id: string) => apiClient.get(`/hostels/${id}`),
  update: (id: string, data: any) => apiClient.put(`/hostels/${id}`, data),
  delete: (id: string) => apiClient.delete(`/hostels/${id}`),
};
