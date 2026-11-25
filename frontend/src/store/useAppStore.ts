import { useState, useEffect } from 'react';
import {
  StudentProfile,
  Subject,
  Topic,
  Examination,
  StudyAvailabilityConfig,
  StudySession,
  AdaptivePlanProposal,
  SessionStatus,
  DayOfWeek
} from '../types';
import {
  initialStudentProfile,
  initialSubjects,
  initialTopics,
  initialExaminations,
  initialAvailability,
  initialSessions
} from '../data/mockData';
import {
  studentsApi,
  subjectsApi,
  topicsApi,
  examsApi,
  availabilityApi,
  studySessionsApi,
  schedulesApi,
  recommendationsApi,
  dashboardApi,
  BackendSubject,
  BackendTopic,
  BackendExam,
  BackendAvailability,
  BackendStudySession,
  GeneratedScheduleSlot,
  RecommendationResponse,
  BackendDashboardData,
  ApiError
} from '../api';

const STORAGE_KEY = 'studywise_ai_state_v1';
const STUDENT_ID_KEY = 'studywise_student_id';

export interface AppState {
  studentId: number;
  isBackendConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  profile: StudentProfile;
  subjects: Subject[];
  topics: Topic[];
  examinations: Examination[];
  availability: StudyAvailabilityConfig;
  sessions: StudySession[];
  activePage: string;
  selectedSubjectId: string | null;
  isSidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  pendingAdaptivePlan: AdaptivePlanProposal | null;
  backendDashboard: BackendDashboardData | null;
}

const DAY_INDEX_MAP: Record<number, DayOfWeek> = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
};

const DAY_NAME_TO_INDEX: Record<DayOfWeek, number> = {
  'Monday': 0,
  'Tuesday': 1,
  'Wednesday': 2,
  'Thursday': 3,
  'Friday': 4,
  'Saturday': 5,
  'Sunday': 6
};

// Initial default state
const getStoredState = (): AppState => {
  const storedStudentId = localStorage.getItem(STUDENT_ID_KEY);
  const studentId = storedStudentId ? parseInt(storedStudentId, 10) : 1;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        studentId: parsed.studentId || studentId,
        isBackendConnected: false,
        isSyncing: false,
        lastSyncedAt: null,
        activePage: parsed.activePage || 'dashboard',
        selectedSubjectId: null,
        commandPaletteOpen: false,
        pendingAdaptivePlan: null,
        backendDashboard: null
      };
    }
  } catch (e) {
    console.error("Error loading stored StudyWise data:", e);
  }

  return {
    studentId,
    isBackendConnected: false,
    isSyncing: false,
    lastSyncedAt: null,
    profile: initialStudentProfile,
    subjects: initialSubjects,
    topics: initialTopics,
    examinations: initialExaminations,
    availability: initialAvailability,
    sessions: initialSessions,
    activePage: 'dashboard',
    selectedSubjectId: null,
    isSidebarCollapsed: false,
    commandPaletteOpen: false,
    pendingAdaptivePlan: null,
    backendDashboard: null
  };
};

// Global event bus for lightweight reactivity across components
let globalState = getStoredState();
const listeners = new Set<(state: AppState) => void>();

const notify = () => {
  listeners.forEach(fn => fn(globalState));
  try {
    localStorage.setItem(STUDENT_ID_KEY, String(globalState.studentId));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      studentId: globalState.studentId,
      profile: globalState.profile,
      subjects: globalState.subjects,
      topics: globalState.topics,
      examinations: globalState.examinations,
      availability: globalState.availability,
      sessions: globalState.sessions,
      isSidebarCollapsed: globalState.isSidebarCollapsed
    }));
  } catch (e) {
    console.error("Error saving state to localStorage:", e);
  }
};

const update = (updater: (prev: AppState) => AppState) => {
  globalState = updater(globalState);
  notify();
};

// Sync helpers to convert backend responses into frontend UI models
function mapBackendData(
  backendSubjects: BackendSubject[],
  backendTopics: BackendTopic[],
  backendExams: BackendExam[],
  backendAvails: BackendAvailability[],
  backendSessions: BackendStudySession[],
  currentAvailability: StudyAvailabilityConfig
): {
  subjects: Subject[];
  topics: Topic[];
  examinations: Examination[];
  availability: StudyAvailabilityConfig;
  sessions: StudySession[];
} {
  // 1. Subjects
  const subjects: Subject[] = backendSubjects.map(sub => {
    const exam = backendExams.find(e => e.subject_id === sub.id);
    const subTopics = backendTopics.filter(t => t.subject_id === sub.id);
    const completed = subTopics.filter(t => t.is_completed).length;

    return {
      id: String(sub.id),
      code: sub.description || `SUB-${sub.id}`,
      name: sub.name,
      color: sub.color || '#5145E8',
      accentGlow: `${sub.color || '#5145E8'}40`,
      priority: 'high',
      examDate: exam ? exam.exam_date : undefined,
      topicsCount: subTopics.length,
      completedCount: completed
    };
  });

  // 2. Topics
  const topics: Topic[] = backendTopics.map(t => ({
    id: String(t.id),
    subjectId: String(t.subject_id),
    name: t.name,
    description: t.description || '',
    priority: 'high',
    estimatedHours: 2.5,
    isCompleted: t.is_completed,
    completedAt: t.is_completed ? new Date().toISOString().split('T')[0] : undefined
  }));

  // 3. Exams
  const examinations: Examination[] = backendExams.map(ex => ({
    id: String(ex.id),
    subjectId: String(ex.subject_id),
    title: ex.name,
    date: ex.exam_date,
    time: '10:00 AM',
    priority: 'high',
    targetScore: ex.target_marks
  }));

  // 4. Availability
  const weeklySlots = { ...currentAvailability.weeklySlots };
  Object.keys(DAY_INDEX_MAP).forEach(idxStr => {
    const idx = parseInt(idxStr, 10);
    const dayName = DAY_INDEX_MAP[idx];
    const slotsForDay = backendAvails.filter(a => a.day_of_week === idx);

    if (slotsForDay.length > 0) {
      weeklySlots[dayName] = {
        day: dayName,
        isEnabled: true,
        slots: slotsForDay.map(a => ({
          id: String(a.id),
          startTime: a.start_time.substring(0, 5),
          endTime: a.end_time.substring(0, 5),
          label: 'Deep Focus Slot'
        }))
      };
    }
  });

  const availability: StudyAvailabilityConfig = {
    ...currentAvailability,
    weeklySlots
  };

  // 5. Sessions
  const topicMap = new Map(backendTopics.map(t => [t.id, t]));
  const sessions: StudySession[] = backendSessions.map(sess => {
    const topic = topicMap.get(sess.topic_id);
    const dateStr = sess.started_at.split('T')[0];
    const startTime = sess.started_at.includes('T')
      ? sess.started_at.split('T')[1].substring(0, 5)
      : '09:00';
    const endTime = sess.ended_at && sess.ended_at.includes('T')
      ? sess.ended_at.split('T')[1].substring(0, 5)
      : '10:30';

    return {
      id: String(sess.id),
      subjectId: topic ? String(topic.subject_id) : '1',
      topicId: String(sess.topic_id),
      title: topic ? topic.name : `Topic #${sess.topic_id}`,
      date: dateStr,
      startTime,
      endTime,
      durationMinutes: sess.duration_minutes || 90,
      status: sess.status === 'completed' ? 'completed' : sess.status === 'in_progress' ? 'upcoming' : 'missed',
      rationale: 'Active synchronized backend study session'
    };
  });

  return { subjects, topics, examinations, availability, sessions };
}

// Master sync function from backend
export const syncWithBackend = async (): Promise<boolean> => {
  const studentId = globalState.studentId;
  update(s => ({ ...s, isSyncing: true }));

  try {
    // 1. Verify student exists, or find/create Alex Rivera
    let student: import('../api').BackendStudent;
    try {
      student = await studentsApi.getById(studentId);
    } catch {
      // Try to create or find default student
      try {
        student = await studentsApi.create({
          name: globalState.profile.name || "Alex Rivera",
          email: globalState.profile.email || "alex.rivera@stanford.edu"
        });
        update(s => ({ ...s, studentId: student.id }));
      } catch {
        // If duplicate email, get id 1
        student = await studentsApi.getById(1);
        update(s => ({ ...s, studentId: 1 }));
      }
    }

    const currentStudentId = student.id;

    // 2. Fetch all collections in parallel
    const [
      backendSubjects,
      backendExams,
      backendAvails,
      backendSessions,
      dashboardStats
    ] = await Promise.all([
      subjectsApi.list(currentStudentId).catch(() => []),
      examsApi.list(currentStudentId).catch(() => []),
      availabilityApi.list(currentStudentId).catch(() => []),
      studySessionsApi.list(currentStudentId).catch(() => []),
      dashboardApi.get(currentStudentId).catch(() => null)
    ]);

    // Fetch topics for all subjects
    const topicsPromises = backendSubjects.map(sub =>
      topicsApi.list(currentStudentId, sub.id).catch(() => [])
    );
    const topicsResults = await Promise.all(topicsPromises);
    const backendTopics: BackendTopic[] = topicsResults.flat();

    // Map backend entities to frontend model
    if (backendSubjects.length > 0) {
      const mapped = mapBackendData(
        backendSubjects,
        backendTopics,
        backendExams,
        backendAvails,
        backendSessions,
        globalState.availability
      );

      update(s => ({
        ...s,
        isBackendConnected: true,
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString(),
        profile: {
          ...s.profile,
          name: student.name,
          email: student.email,
          streakDays: dashboardStats ? dashboardStats.study_streak_days : s.profile.streakDays
        },
        subjects: mapped.subjects,
        topics: mapped.topics,
        examinations: mapped.examinations,
        availability: mapped.availability,
        sessions: mapped.sessions.length > 0 ? mapped.sessions : s.sessions,
        backendDashboard: dashboardStats
      }));
    } else {
      update(s => ({
        ...s,
        isBackendConnected: true,
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString(),
        profile: {
          ...s.profile,
          name: student.name,
          email: student.email
        },
        backendDashboard: dashboardStats
      }));
    }

    return true;
  } catch (error) {
    console.warn("Backend currently unreachable, using offline state:", error);
    update(s => ({
      ...s,
      isBackendConnected: false,
      isSyncing: false
    }));
    return false;
  }
};

// Auto-trigger sync on load once
let hasAttemptedInitialSync = false;

export const useAppStore = () => {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    listeners.add(setState);

    if (!hasAttemptedInitialSync) {
      hasAttemptedInitialSync = true;
      syncWithBackend();
    }

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    state,

    // Navigation
    setActivePage: (activePage: string) => update(s => ({ ...s, activePage })),
    setSelectedSubjectId: (selectedSubjectId: string | null) => update(s => ({ ...s, selectedSubjectId })),
    setSidebarCollapsed: (isSidebarCollapsed: boolean) => update(s => ({ ...s, isSidebarCollapsed })),
    toggleSidebar: () => update(s => ({ ...s, isSidebarCollapsed: !s.isSidebarCollapsed })),
    setCommandPaletteOpen: (commandPaletteOpen: boolean) => update(s => ({ ...s, commandPaletteOpen })),

    // Manual Refresh
    refreshFromBackend: () => syncWithBackend(),

    // Profile
    updateProfile: async (data: Partial<StudentProfile>) => {
      update(s => ({
        ...s,
        profile: { ...s.profile, ...data }
      }));

      if (state.isBackendConnected && (data.name || data.email)) {
        try {
          await studentsApi.update(state.studentId, {
            name: data.name,
            email: data.email
          });
        } catch (e) {
          console.error("Failed to update student profile on backend:", e);
        }
      }
    },

    // Subjects
    addSubject: async (subject: Subject) => {
      // Optimistic update
      update(s => ({
        ...s,
        subjects: [...s.subjects, subject]
      }));

      if (state.isBackendConnected) {
        try {
          const created = await subjectsApi.create(state.studentId, {
            name: subject.name,
            description: subject.code,
            color: subject.color
          });

          // Update local subject id with real backend id
          update(s => ({
            ...s,
            subjects: s.subjects.map(sub => sub.id === subject.id ? { ...sub, id: String(created.id) } : sub)
          }));
        } catch (e) {
          console.error("Failed to add subject on backend:", e);
        }
      }
    },

    updateSubject: async (id: string, data: Partial<Subject>) => {
      update(s => ({
        ...s,
        subjects: s.subjects.map(sub => sub.id === id ? { ...sub, ...data } : sub)
      }));

      const numId = parseInt(id, 10);
      if (state.isBackendConnected && !isNaN(numId)) {
        try {
          await subjectsApi.update(state.studentId, numId, {
            name: data.name,
            description: data.code,
            color: data.color
          });
        } catch (e) {
          console.error("Failed to update subject on backend:", e);
        }
      }
    },

    deleteSubject: async (id: string) => {
      update(s => ({
        ...s,
        subjects: s.subjects.filter(sub => sub.id !== id),
        topics: s.topics.filter(top => top.subjectId !== id),
        examinations: s.examinations.filter(ex => ex.subjectId !== id),
        sessions: s.sessions.filter(sess => sess.subjectId !== id)
      }));

      const numId = parseInt(id, 10);
      if (state.isBackendConnected && !isNaN(numId)) {
        try {
          await subjectsApi.delete(state.studentId, numId);
        } catch (e) {
          console.error("Failed to delete subject on backend:", e);
        }
      }
    },

    // Topics
    addTopic: async (topic: Topic) => {
      update(s => ({
        ...s,
        topics: [...s.topics, topic]
      }));

      const numSubjId = parseInt(topic.subjectId, 10);
      if (state.isBackendConnected && !isNaN(numSubjId)) {
        try {
          const created = await topicsApi.create(state.studentId, numSubjId, {
            name: topic.name,
            description: topic.description
          });

          update(s => ({
            ...s,
            topics: s.topics.map(t => t.id === topic.id ? { ...t, id: String(created.id) } : t)
          }));
        } catch (e) {
          console.error("Failed to create topic on backend:", e);
        }
      }
    },

    updateTopic: async (id: string, data: Partial<Topic>) => {
      update(s => ({
        ...s,
        topics: s.topics.map(t => t.id === id ? { ...t, ...data } : t)
      }));

      const topic = state.topics.find(t => t.id === id);
      const numTopicId = parseInt(id, 10);
      const numSubjId = topic ? parseInt(topic.subjectId, 10) : NaN;

      if (state.isBackendConnected && !isNaN(numTopicId) && !isNaN(numSubjId)) {
        try {
          await topicsApi.update(state.studentId, numSubjId, numTopicId, {
            name: data.name,
            description: data.description,
            is_completed: data.isCompleted
          });
        } catch (e) {
          console.error("Failed to update topic on backend:", e);
        }
      }
    },

    deleteTopic: async (id: string) => {
      const topic = state.topics.find(t => t.id === id);
      update(s => ({
        ...s,
        topics: s.topics.filter(t => t.id !== id),
        sessions: s.sessions.filter(sess => sess.topicId !== id)
      }));

      const numTopicId = parseInt(id, 10);
      const numSubjId = topic ? parseInt(topic.subjectId, 10) : NaN;

      if (state.isBackendConnected && !isNaN(numTopicId) && !isNaN(numSubjId)) {
        try {
          await topicsApi.delete(state.studentId, numSubjId, numTopicId);
        } catch (e) {
          console.error("Failed to delete topic on backend:", e);
        }
      }
    },

    toggleTopicCompletion: async (id: string) => {
      const topic = state.topics.find(t => t.id === id);
      if (!topic) return;

      const nextCompleted = !topic.isCompleted;

      update(s => ({
        ...s,
        topics: s.topics.map(t => t.id === id ? {
          ...t,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined
        } : t)
      }));

      const numTopicId = parseInt(id, 10);
      const numSubjId = parseInt(topic.subjectId, 10);

      if (state.isBackendConnected && !isNaN(numTopicId) && !isNaN(numSubjId)) {
        try {
          await topicsApi.update(state.studentId, numSubjId, numTopicId, {
            is_completed: nextCompleted
          });
        } catch (e) {
          console.error("Failed to update topic completion on backend:", e);
        }
      }
    },

    // Examinations
    addExam: async (exam: Examination) => {
      update(s => ({
        ...s,
        examinations: [...s.examinations, exam]
      }));

      const numSubjId = parseInt(exam.subjectId, 10);
      if (state.isBackendConnected && !isNaN(numSubjId)) {
        try {
          const created = await examsApi.create(state.studentId, {
            subject_id: numSubjId,
            name: exam.title,
            exam_date: exam.date,
            total_marks: 100,
            target_marks: exam.targetScore || 90
          });

          update(s => ({
            ...s,
            examinations: s.examinations.map(e => e.id === exam.id ? { ...e, id: String(created.id) } : e)
          }));
        } catch (e) {
          console.error("Failed to create exam on backend:", e);
        }
      }
    },

    updateExam: async (id: string, data: Partial<Examination>) => {
      update(s => ({
        ...s,
        examinations: s.examinations.map(e => e.id === id ? { ...e, ...data } : e)
      }));

      const numExamId = parseInt(id, 10);
      if (state.isBackendConnected && !isNaN(numExamId)) {
        try {
          await examsApi.update(state.studentId, numExamId, {
            name: data.title,
            exam_date: data.date,
            target_marks: data.targetScore
          });
        } catch (e) {
          console.error("Failed to update exam on backend:", e);
        }
      }
    },

    deleteExam: async (id: string) => {
      update(s => ({
        ...s,
        examinations: s.examinations.filter(e => e.id !== id)
      }));

      const numExamId = parseInt(id, 10);
      if (state.isBackendConnected && !isNaN(numExamId)) {
        try {
          await examsApi.delete(state.studentId, numExamId);
        } catch (e) {
          console.error("Failed to delete exam on backend:", e);
        }
      }
    },

    // Availability
    updateAvailability: async (availability: StudyAvailabilityConfig) => {
      update(s => ({
        ...s,
        availability
      }));

      if (state.isBackendConnected) {
        try {
          // Fetch existing availability to replace with new slots
          const existing = await availabilityApi.list(state.studentId).catch(() => []);
          for (const ex of existing) {
            await availabilityApi.delete(state.studentId, ex.id).catch(() => null);
          }

          // Create new availability records in backend
          for (const [dayName, dayData] of Object.entries(availability.weeklySlots)) {
            if (dayData.isEnabled && dayData.slots.length > 0) {
              const dow = DAY_NAME_TO_INDEX[dayName as DayOfWeek];
              for (const slot of dayData.slots) {
                await availabilityApi.create(state.studentId, {
                  day_of_week: dow,
                  start_time: `${slot.startTime}:00`,
                  end_time: `${slot.endTime}:00`
                }).catch(() => null);
              }
            }
          }
        } catch (e) {
          console.error("Failed to synchronize availability to backend:", e);
        }
      }
    },

    // Sessions & Scheduling
    addSession: (session: StudySession) => update(s => ({
      ...s,
      sessions: [...s.sessions, session]
    })),

    updateSession: (id: string, data: Partial<StudySession>) => update(s => ({
      ...s,
      sessions: s.sessions.map(sess => sess.id === id ? { ...sess, ...data } : sess)
    })),

    deleteSession: (id: string) => update(s => ({
      ...s,
      sessions: s.sessions.filter(sess => sess.id !== id)
    })),

    markSessionStatus: async (id: string, status: SessionStatus) => {
      const session = state.sessions.find(sess => sess.id === id);
      const isNowCompleted = status === 'completed';

      let updatedTopics = state.topics;
      if (isNowCompleted && session) {
        updatedTopics = state.topics.map(t =>
          t.id === session.topicId ? { ...t, isCompleted: true, completedAt: new Date().toISOString().split('T')[0] } : t
        );
      }

      update(s => ({
        ...s,
        topics: updatedTopics,
        sessions: s.sessions.map(sess =>
          sess.id === id ? { ...sess, status } : sess
        )
      }));

      // Backend sync for session completion
      const numTopicId = session ? parseInt(session.topicId, 10) : NaN;
      if (state.isBackendConnected && session && isNowCompleted && !isNaN(numTopicId)) {
        try {
          // If session id is numeric, complete it; otherwise start and complete
          const numSessId = parseInt(id, 10);
          if (!isNaN(numSessId)) {
            await studySessionsApi.complete(state.studentId, numSessId);
          } else {
            const started = await studySessionsApi.start(state.studentId, { topic_id: numTopicId });
            await studySessionsApi.complete(state.studentId, started.id);
          }

          // Also mark topic completed in backend
          const topic = state.topics.find(t => t.id === session.topicId);
          if (topic) {
            const numSubjId = parseInt(topic.subjectId, 10);
            if (!isNaN(numSubjId)) {
              await topicsApi.update(state.studentId, numSubjId, numTopicId, { is_completed: true });
            }
          }
        } catch (e) {
          console.error("Failed to complete session on backend:", e);
        }
      }
    },

    commitGeneratedPlan: (newSessions: StudySession[]) => update(s => {
      const filteredExisting = s.sessions.filter(sess => sess.status !== 'upcoming');
      return {
        ...s,
        sessions: [...filteredExisting, ...newSessions]
      };
    }),

    // Adaptive Planner
    setPendingAdaptivePlan: (pendingAdaptivePlan: AdaptivePlanProposal | null) => update(s => ({
      ...s,
      pendingAdaptivePlan
    })),

    acceptAdaptivePlan: (proposal: AdaptivePlanProposal) => update(s => {
      const adaptedSessionIds = new Set(proposal.changes.map(c => c.sessionId));
      const untouchedSessions = s.sessions.filter(sess => !adaptedSessionIds.has(sess.id));
      return {
        ...s,
        sessions: [...untouchedSessions, ...proposal.newSessions],
        pendingAdaptivePlan: null
      };
    }),

    dismissAdaptivePlan: () => update(s => ({
      ...s,
      pendingAdaptivePlan: null
    })),

    // Advanced Backend Service Calls
    generateBackendSchedule: async (startDate: string, endDate: string): Promise<GeneratedScheduleSlot[]> => {
      if (!state.isBackendConnected) return [];
      try {
        return await schedulesApi.generate(state.studentId, startDate, endDate);
      } catch (e) {
        console.error("Failed to generate schedule from backend:", e);
        return [];
      }
    },

    getBackendRecommendations: async (): Promise<RecommendationResponse | null> => {
      if (!state.isBackendConnected) return null;
      try {
        return await recommendationsApi.get(state.studentId);
      } catch (e) {
        console.error("Failed to fetch recommendations from backend:", e);
        return null;
      }
    },

    getBackendDashboard: async (): Promise<BackendDashboardData | null> => {
      if (!state.isBackendConnected) return null;
      try {
        return await dashboardApi.get(state.studentId);
      } catch (e) {
        console.error("Failed to fetch dashboard stats from backend:", e);
        return null;
      }
    },

    // Reset and Seed
    resetToDemoData: () => update(() => {
      localStorage.removeItem(STORAGE_KEY);
      return {
        studentId: 1,
        isBackendConnected: false,
        isSyncing: false,
        lastSyncedAt: null,
        profile: initialStudentProfile,
        subjects: initialSubjects,
        topics: initialTopics,
        examinations: initialExaminations,
        availability: initialAvailability,
        sessions: initialSessions,
        activePage: 'dashboard',
        selectedSubjectId: null,
        isSidebarCollapsed: false,
        commandPaletteOpen: false,
        pendingAdaptivePlan: null,
        backendDashboard: null
      };
    }),

    clearAllData: () => update(s => ({
      ...s,
      subjects: [],
      topics: [],
      examinations: [],
      sessions: [],
      pendingAdaptivePlan: null,
      backendDashboard: null
    }))
  };
};
