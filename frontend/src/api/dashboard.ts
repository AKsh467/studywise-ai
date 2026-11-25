import apiClient from './client';

export interface SubjectProgressItem {
  subject_id: number;
  subject_name: string;
  total_topics: number;
  completed_topics: number;
  progress_percentage: number;
}

export interface UpcomingExamItem {
  exam_id: number;
  exam_name: string;
  subject_id: number;
  exam_date: string;
}

export interface BackendDashboardData {
  total_study_minutes: number;
  today_study_minutes: number;
  weekly_study_minutes: number;
  total_topics: number;
  completed_topics: number;
  pending_topics: number;
  overall_progress_percentage: number;
  subject_progress: SubjectProgressItem[];
  upcoming_exams: UpcomingExamItem[];
  study_streak_days: number;
}

export const dashboardApi = {
  get: (studentId: number) =>
    apiClient<BackendDashboardData>(`/students/${studentId}/dashboard/`),
};
