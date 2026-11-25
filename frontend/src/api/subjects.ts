import apiClient from './client';

export interface BackendSubject {
  id: number;
  student_id: number;
  name: string;
  description: string | null;
  color: string | null;
}

export interface SubjectCreatePayload {
  name: string;
  description?: string | null;
  color?: string | null;
}

export interface SubjectUpdatePayload {
  name?: string | null;
  description?: string | null;
  color?: string | null;
}

export const subjectsApi = {
  list: (studentId: number) =>
    apiClient<BackendSubject[]>(`/students/${studentId}/subjects/`),

  getById: (studentId: number, subjectId: number) =>
    apiClient<BackendSubject>(`/students/${studentId}/subjects/${subjectId}`),

  create: (studentId: number, data: SubjectCreatePayload) =>
    apiClient<BackendSubject>(`/students/${studentId}/subjects/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (studentId: number, subjectId: number, data: SubjectUpdatePayload) =>
    apiClient<BackendSubject>(`/students/${studentId}/subjects/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (studentId: number, subjectId: number) =>
    apiClient<{ id: number }>(`/students/${studentId}/subjects/${subjectId}`, {
      method: 'DELETE',
    }),
};
