import apiClient from './client';

export interface BackendStudySession {
  id: number;
  student_id: number;
  topic_id: number;
  study_plan_id: number | null;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface StudySessionStartPayload {
  topic_id: number;
  study_plan_id?: number | null;
}

export interface StudySessionCompletePayload {
  ended_at?: string | null;
}

export const studySessionsApi = {
  list: (studentId: number) =>
    apiClient<BackendStudySession[]>(`/students/${studentId}/study-sessions/`),

  start: (studentId: number, data: StudySessionStartPayload) =>
    apiClient<BackendStudySession>(`/students/${studentId}/study-sessions/start`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  complete: (studentId: number, sessionId: number, data: StudySessionCompletePayload = {}) =>
    apiClient<BackendStudySession>(`/students/${studentId}/study-sessions/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
