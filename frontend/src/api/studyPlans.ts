import apiClient from './client';

export interface BackendStudyPlan {
  id: number;
  student_id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface StudyPlanCreatePayload {
  name: string;
  start_date: string;
  end_date: string;
}

export interface StudyPlanUpdatePayload {
  name?: string;
  start_date?: string;
  end_date?: string;
}

export const studyPlansApi = {
  list: (studentId: number) =>
    apiClient<BackendStudyPlan[]>(`/students/${studentId}/study-plans/`),

  getById: (studentId: number, planId: number) =>
    apiClient<BackendStudyPlan>(`/students/${studentId}/study-plans/${planId}`),

  create: (studentId: number, data: StudyPlanCreatePayload) =>
    apiClient<BackendStudyPlan>(`/students/${studentId}/study-plans/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (studentId: number, planId: number, data: StudyPlanUpdatePayload) =>
    apiClient<BackendStudyPlan>(`/students/${studentId}/study-plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (studentId: number, planId: number) =>
    apiClient<{ id: number }>(`/students/${studentId}/study-plans/${planId}`, {
      method: 'DELETE',
    }),
};
