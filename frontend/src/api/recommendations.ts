import apiClient from './client';
import { TopicPriorityItem } from './priorities';

export interface RecommendedSlot {
  date: string;
  start_time: string;
  end_time: string;
}

export interface RecommendationResponse {
  recommended_topic: TopicPriorityItem | null;
  suggested_slot: RecommendedSlot | null;
  other_pending_topics: TopicPriorityItem[];
  message: string;
}

export const recommendationsApi = {
  get: (studentId: number) =>
    apiClient<RecommendationResponse>(`/students/${studentId}/recommendations/`),
};
