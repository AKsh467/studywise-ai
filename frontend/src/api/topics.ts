import apiClient from './client';

export interface BackendTopic {
  id: number;
  subject_id: number;
  name: string;
  description: string | null;
  is_completed: boolean;
}

export interface TopicCreatePayload {
  name: string;
  description?: string | null;
}

export interface TopicUpdatePayload {
  name?: string | null;
  description?: string | null;
  is_completed?: boolean | null;
}

export const topicsApi = {
  list: (studentId: number, subjectId: number) =>
    apiClient<BackendTopic[]>(`/students/${studentId}/subjects/${subjectId}/topics/`),

  getById: (studentId: number, subjectId: number, topicId: number) =>
    apiClient<BackendTopic>(`/students/${studentId}/subjects/${subjectId}/topics/${topicId}`),

  create: (studentId: number, subjectId: number, data: TopicCreatePayload) =>
    apiClient<BackendTopic>(`/students/${studentId}/subjects/${subjectId}/topics/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (studentId: number, subjectId: number, topicId: number, data: TopicUpdatePayload) =>
    apiClient<BackendTopic>(`/students/${studentId}/subjects/${subjectId}/topics/${topicId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (studentId: number, subjectId: number, topicId: number) =>
    apiClient<{ id: number }>(`/students/${studentId}/subjects/${subjectId}/topics/${topicId}`, {
      method: 'DELETE',
    }),
};
