import apiClient from './client';

export interface BackendStudent {
  id: number;
  name: string;
  email: string;
}

export interface StudentCreatePayload {
  name: string;
  email: string;
}

export interface StudentUpdatePayload {
  name?: string;
  email?: string;
}

export const studentsApi = {
  create: (data: StudentCreatePayload) =>
    apiClient<BackendStudent>('/students/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: number) =>
    apiClient<BackendStudent>(`/students/${id}`),

  update: (id: number, data: StudentUpdatePayload) =>
    apiClient<BackendStudent>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
