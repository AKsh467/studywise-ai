import apiClient from './client';

export interface BackendExam {
  id: number;
  student_id: number;
  subject_id: number;
  name: string;
  exam_date: string;
  total_marks: number;
  target_marks: number;
}

export interface ExamCreatePayload {
  subject_id: number;
  name: string;
  exam_date: string;
  total_marks: number;
  target_marks: number;
}

export interface ExamUpdatePayload {
  subject_id?: number;
  name?: string;
  exam_date?: string;
  total_marks?: number;
  target_marks?: number;
}

export const examsApi = {
  list: (studentId: number) =>
    apiClient<BackendExam[]>(`/students/${studentId}/exams/`),

  getById: (studentId: number, examId: number) =>
    apiClient<BackendExam>(`/students/${studentId}/exams/${examId}`),

  create: (studentId: number, data: ExamCreatePayload) =>
    apiClient<BackendExam>(`/students/${studentId}/exams/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (studentId: number, examId: number, data: ExamUpdatePayload) =>
    apiClient<BackendExam>(`/students/${studentId}/exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (studentId: number, examId: number) =>
    apiClient<{ id: number }>(`/students/${studentId}/exams/${examId}`, {
      method: 'DELETE',
    }),
};
