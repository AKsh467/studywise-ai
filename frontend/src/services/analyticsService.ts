import {
  Subject,
  Topic,
  StudySession,
  Examination
} from '../types';

export interface SubjectAnalytics {
  subjectId: string;
  name: string;
  code: string;
  color: string;
  totalTopics: number;
  completedTopics: number;
  completionRate: number;
  examDate?: string;
  daysToExam?: number;
}

export interface DayStudyStats {
  dayLabel: string;
  dateStr: string;
  hoursCompleted: number;
  hoursPlanned: number;
}

export const computeAnalytics = (
  subjects: Subject[],
  topics: Topic[],
  examinations: Examination[],
  sessions: StudySession[]
) => {
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.isCompleted).length;
  const overallCompletionRate = totalTopics > 0
    ? Math.round((completedTopics / totalTopics) * 100)
    : 0;

  const today = new Date();
  const examMap = new Map(examinations.map(e => [e.subjectId, e]));

  // Subject-level analytics
  const subjectAnalytics: SubjectAnalytics[] = subjects.map(sub => {
    const subTopics = topics.filter(t => t.subjectId === sub.id);
    const subCompleted = subTopics.filter(t => t.isCompleted).length;
    const rate = subTopics.length > 0 ? Math.round((subCompleted / subTopics.length) * 100) : 0;

    const exam = examMap.get(sub.id);
    let daysToExam: number | undefined = undefined;
    if (exam && exam.date) {
      const examDate = new Date(exam.date);
      const diffTime = examDate.getTime() - today.getTime();
      daysToExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    return {
      subjectId: sub.id,
      name: sub.name,
      code: sub.code,
      color: sub.color,
      totalTopics: subTopics.length,
      completedTopics: subCompleted,
      completionRate: rate,
      examDate: exam?.date,
      daysToExam
    };
  });

  // Study hours computation
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const missedSessions = sessions.filter(s => s.status === 'missed');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const rescheduledSessions = sessions.filter(s => s.status === 'rescheduled');

  const totalCompletedHours = Number(
    (completedSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1)
  );
  const totalPlannedHours = Number(
    (sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1)
  );

  // 7-day trailing activity
  const dayStats: DayStudyStats[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Yest' : dayNames[d.getDay()];

    const dayCompletedMinutes = sessions
      .filter(s => s.date === dateStr && s.status === 'completed')
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    const dayPlannedMinutes = sessions
      .filter(s => s.date === dateStr)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    dayStats.push({
      dayLabel,
      dateStr,
      hoursCompleted: Number((dayCompletedMinutes / 60).toFixed(1)),
      hoursPlanned: Number((dayPlannedMinutes / 60).toFixed(1))
    });
  }

  // Topic priority distribution
  const highPriorityTotal = topics.filter(t => t.priority === 'high').length;
  const highPriorityDone = topics.filter(t => t.priority === 'high' && t.isCompleted).length;
  const mediumPriorityTotal = topics.filter(t => t.priority === 'medium').length;
  const mediumPriorityDone = topics.filter(t => t.priority === 'medium' && t.isCompleted).length;

  return {
    totalTopics,
    completedTopics,
    overallCompletionRate,
    subjectAnalytics,
    totalCompletedHours,
    totalPlannedHours,
    completedSessionsCount: completedSessions.length,
    missedSessionsCount: missedSessions.length,
    upcomingSessionsCount: upcomingSessions.length,
    rescheduledSessionsCount: rescheduledSessions.length,
    dayStats,
    priorityBreakdown: {
      high: { total: highPriorityTotal, done: highPriorityDone },
      medium: { total: mediumPriorityTotal, done: mediumPriorityDone }
    }
  };
};
