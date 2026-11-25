import apiClient from './client';

export interface GeneratedScheduleSlot {
  date: string;
  start_time: string;
  end_time: string;
  topic_id: number;
  topic_name: string;
  subject_name: string;
  priority: number;
}

export const schedulesApi = {
  generate: (studentId: number, startDate: string, endDate: string) =>
    apiClient<GeneratedScheduleSlot[]>(
      `/students/${studentId}/schedules/generate?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`
    ),
};
