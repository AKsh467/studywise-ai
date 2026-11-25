import apiClient from './client';

export interface PriorityInfo {
  score: number;
  level: 'high' | 'medium' | 'low' | 'completed';
  explanation: string;
}

export interface TopicPriorityItem {
  topic_id: number;
  topic_name: string;
  subject_id: number;
  subject_name: string;
  priority: PriorityInfo;
}

export const prioritiesApi = {
  getStudentPriorities: (studentId: number) =>
    apiClient<TopicPriorityItem[]>(`/students/${studentId}/priorities/`),
};
