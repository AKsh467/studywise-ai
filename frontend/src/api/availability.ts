import apiClient from './client';

export interface BackendAvailability {
  id: number;
  student_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface AvailabilityCreatePayload {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface AvailabilityUpdatePayload {
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
}

export const availabilityApi = {
  list: (studentId: number) =>
    apiClient<BackendAvailability[]>(`/students/${studentId}/availability/`),

  getById: (studentId: number, availabilityId: number) =>
    apiClient<BackendAvailability>(`/students/${studentId}/availability/${availabilityId}`),

  create: (studentId: number, data: AvailabilityCreatePayload) =>
    apiClient<BackendAvailability>(`/students/${studentId}/availability/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (studentId: number, availabilityId: number, data: AvailabilityUpdatePayload) =>
    apiClient<BackendAvailability>(`/students/${studentId}/availability/${availabilityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (studentId: number, availabilityId: number) =>
    apiClient<{ id: number }>(`/students/${studentId}/availability/${availabilityId}`, {
      method: 'DELETE',
    }),
};
