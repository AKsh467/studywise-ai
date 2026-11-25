export type Priority = 'low' | 'medium' | 'high';
export type ExamPriority = 'critical' | 'high' | 'medium';
export type SessionStatus = 'upcoming' | 'completed' | 'missed' | 'rescheduled';

export interface StudentProfile {
  name: string;
  email: string;
  university: string;
  degree: string;
  academicYear: string;
  semester: string;
  avatarUrl?: string;
  targetDailyHours: number;
  preferredSessionMinutes: number;
  streakDays: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  priority: Priority;
  estimatedHours: number;
  isCompleted: boolean;
  completedAt?: string; // ISO date string
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color: string; // hex or tailwind-friendly
  accentGlow: string;
  priority: Priority;
  examDate?: string; // YYYY-MM-DD
  topicsCount?: number;
  completedCount?: number;
}

export interface Examination {
  id: string;
  subjectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  venue?: string;
  priority: ExamPriority;
  targetScore: number; // e.g. 90
  notes?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string;   // "11:00"
  label?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DayAvailability {
  day: DayOfWeek;
  isEnabled: boolean;
  slots: TimeSlot[];
}

export interface StudyAvailabilityConfig {
  weeklySlots: Record<DayOfWeek, DayAvailability>;
  maxDailyHours: number;
  preferredDurationMinutes: number;
  breakDurationMinutes: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  topicId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string;   // "15:30"
  durationMinutes: number;
  status: SessionStatus;
  notes?: string;
  rationale: string;
  isAdapted?: boolean;
  originalDate?: string;
  originalTime?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'exam' | 'pacing' | 'streak' | 'missed' | 'balance';
  urgency: 'critical' | 'high' | 'medium' | 'info';
  what: string;
  why: string;
  actionLabel: string;
  actionPage: string;
  actionPayload?: Record<string, unknown>;
  dateGenerated: string;
}

export interface AdaptivePlanProposal {
  id: string;
  generatedAt: string;
  missedSessionsCount: number;
  recoveredHours: number;
  changes: {
    sessionId: string;
    topicName: string;
    subjectName: string;
    subjectColor: string;
    oldDate: string;
    oldTime: string;
    newDate: string;
    newTime: string;
    reason: string;
  }[];
  newSessions: StudySession[];
}
