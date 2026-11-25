import {
  Subject,
  Topic,
  Examination,
  StudyAvailabilityConfig,
  StudySession,
  DayOfWeek
} from '../types';

export interface PlannerOptions {
  selectedSubjectIds?: string[];
  daysHorizon?: number; // e.g. 7 or 14 days
  maxDailyHours?: number;
  sessionDurationMinutes?: number;
}

export interface PlanGenerationResult {
  sessions: StudySession[];
  summary: {
    totalSessions: number;
    totalHours: number;
    scheduledTopicsCount: number;
    unscheduledTopicsCount: number;
    averageDailyHours: number;
  };
  rationales: {
    topicId: string;
    topicName: string;
    subjectName: string;
    score: number;
    reason: string;
  }[];
  unscheduledTopics: Topic[];
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const generateStudyPlan = (
  subjects: Subject[],
  topics: Topic[],
  examinations: Examination[],
  availability: StudyAvailabilityConfig,
  existingSessions: StudySession[],
  options: PlannerOptions = {}
): PlanGenerationResult => {
  const horizon = options.daysHorizon || 7;
  const maxDailyMinutes = (options.maxDailyHours || availability.maxDailyHours || 4.5) * 60;
  const sessionDuration = options.sessionDurationMinutes || availability.preferredDurationMinutes || 90;

  // Filter relevant subjects
  const activeSubjects = options.selectedSubjectIds && options.selectedSubjectIds.length > 0
    ? subjects.filter(s => options.selectedSubjectIds!.includes(s.id))
    : subjects;

  const subjectMap = new Map(subjects.map(s => [s.id, s]));
  const examMap = new Map(examinations.map(e => [e.subjectId, e]));

  // Find incomplete topics in active subjects
  const incompleteTopics = topics.filter(t =>
    activeSubjects.some(s => s.id === t.subjectId) && !t.isCompleted
  );

  // Score each topic deterministically
  const scoredTopics = incompleteTopics.map(topic => {
    const subject = subjectMap.get(topic.subjectId);
    const exam = examMap.get(topic.subjectId);

    let examUrgencyScore = 1.0;
    let daysToExam = 999;

    if (exam && exam.date) {
      const today = new Date();
      const examDate = new Date(exam.date);
      const diffTime = examDate.getTime() - today.getTime();
      daysToExam = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      if (daysToExam <= 3) examUrgencyScore = 4.0;
      else if (daysToExam <= 7) examUrgencyScore = 3.0;
      else if (daysToExam <= 14) examUrgencyScore = 2.0;
      else if (daysToExam <= 21) examUrgencyScore = 1.5;
    }

    let topicPriorityScore = 1.0;
    if (topic.priority === 'high') topicPriorityScore = 2.5;
    else if (topic.priority === 'medium') topicPriorityScore = 1.6;

    let subjectPriorityScore = 1.0;
    if (subject?.priority === 'high') subjectPriorityScore = 1.5;
    else if (subject?.priority === 'medium') subjectPriorityScore = 1.2;

    const totalScore = examUrgencyScore * topicPriorityScore * subjectPriorityScore;

    let reason = `Priority: ${topic.priority.toUpperCase()}`;
    if (exam && daysToExam <= 21) {
      reason += ` • Exam "${exam.title}" in ${daysToExam} days`;
    }

    return {
      topic,
      subjectName: subject?.name || 'Unknown',
      score: totalScore,
      reason,
      remainingMinutes: topic.estimatedHours * 60
    };
  });

  // Sort by highest score first
  scoredTopics.sort((a, b) => b.score - a.score);

  const generatedSessions: StudySession[] = [];
  const topicQueue = [...scoredTopics];
  const scheduledTopicIds = new Set<string>();

  // Map of daily minutes used
  const dailyScheduledMinutes: Record<string, number> = {};

  // Track existing scheduled sessions to prevent overlaps
  const occupiedSlots = new Set<string>(); // "YYYY-MM-DD_HH:MM"
  existingSessions.forEach(sess => {
    if (sess.status !== 'missed') {
      occupiedSlots.add(`${sess.date}_${sess.startTime}`);
    }
  });

  // Iterate over days from tomorrow to horizon
  const startDate = new Date();

  for (let dayOffset = 1; dayOffset <= horizon; dayOffset++) {
    if (topicQueue.length === 0) break;

    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0];
    const dayName = DAYS_OF_WEEK[targetDate.getDay()];

    const dayAvail = availability.weeklySlots[dayName];
    if (!dayAvail || !dayAvail.isEnabled || !dayAvail.slots.length) {
      continue;
    }

    dailyScheduledMinutes[dateStr] = dailyScheduledMinutes[dateStr] || 0;

    for (const slot of dayAvail.slots) {
      if (topicQueue.length === 0) break;
      if (dailyScheduledMinutes[dateStr] + sessionDuration > maxDailyMinutes) {
        break; // Daily cap reached
      }

      const slotKey = `${dateStr}_${slot.startTime}`;
      if (occupiedSlots.has(slotKey)) {
        continue; // Slot already occupied
      }

      // Pick top topic
      const current = topicQueue[0];
      const sessionDurationToUse = Math.min(sessionDuration, current.remainingMinutes > 0 ? current.remainingMinutes : sessionDuration);

      const newSession: StudySession = {
        id: `gen-sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        subjectId: current.topic.subjectId,
        topicId: current.topic.id,
        title: `${current.topic.name}`,
        date: dateStr,
        startTime: slot.startTime,
        endTime: slot.endTime,
        durationMinutes: sessionDurationToUse,
        status: 'upcoming',
        rationale: `AI Planner: ${current.reason}`
      };

      generatedSessions.push(newSession);
      occupiedSlots.add(slotKey);
      dailyScheduledMinutes[dateStr] += sessionDurationToUse;
      scheduledTopicIds.add(current.topic.id);

      current.remainingMinutes -= sessionDurationToUse;
      if (current.remainingMinutes <= 0) {
        topicQueue.shift(); // Finished this topic
      } else {
        // Move to back or lower priority so student experiences balanced subject variety
        topicQueue.shift();
        topicQueue.push(current);
      }
    }
  }

  const unscheduledTopics = topicQueue.map(item => item.topic).filter(
    (t, idx, self) => self.findIndex(s => s.id === t.id) === idx && !scheduledTopicIds.has(t.id)
  );

  const totalMinutes = generatedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return {
    sessions: generatedSessions,
    summary: {
      totalSessions: generatedSessions.length,
      totalHours: Number((totalMinutes / 60).toFixed(1)),
      scheduledTopicsCount: scheduledTopicIds.size,
      unscheduledTopicsCount: unscheduledTopics.length,
      averageDailyHours: horizon > 0 ? Number((totalMinutes / 60 / horizon).toFixed(1)) : 0
    },
    rationales: scoredTopics.map(st => ({
      topicId: st.topic.id,
      topicName: st.topic.name,
      subjectName: st.subjectName,
      score: Number(st.score.toFixed(2)),
      reason: st.reason
    })),
    unscheduledTopics
  };
};
