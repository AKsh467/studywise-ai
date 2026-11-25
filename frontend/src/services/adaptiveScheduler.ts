import {
  Subject,
  Topic,
  Examination,
  StudyAvailabilityConfig,
  StudySession,
  AdaptivePlanProposal,
  DayOfWeek
} from '../types';

const DAYS_OF_WEEK: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const generateAdaptiveProposal = (
  subjects: Subject[],
  topics: Topic[],
  examinations: Examination[],
  availability: StudyAvailabilityConfig,
  sessions: StudySession[]
): AdaptivePlanProposal | null => {
  // Find all missed sessions that have not been rescheduled
  const missedSessions = sessions.filter(s => s.status === 'missed');

  if (missedSessions.length === 0) {
    return null;
  }

  const subjectMap = new Map(subjects.map(s => [s.id, s]));
  const topicMap = new Map(topics.map(t => [t.id, t]));
  const examMap = new Map(examinations.map(e => [e.subjectId, e]));

  // Track currently occupied upcoming slots
  const occupiedSlots = new Set<string>();
  const dailyScheduledMinutes: Record<string, number> = {};

  sessions.forEach(sess => {
    if (sess.status === 'upcoming' || sess.status === 'rescheduled') {
      occupiedSlots.add(`${sess.date}_${sess.startTime}`);
      dailyScheduledMinutes[sess.date] = (dailyScheduledMinutes[sess.date] || 0) + sess.durationMinutes;
    }
  });

  const maxDailyMinutes = (availability.maxDailyHours || 4.5) * 60;
  const changes: AdaptivePlanProposal['changes'] = [];
  const newSessions: StudySession[] = [];

  let recoveredMinutes = 0;
  const today = new Date();

  // For each missed session, find the earliest available upcoming slot starting tomorrow
  for (const missed of missedSessions) {
    const topic = topicMap.get(missed.topicId);
    const subject = subjectMap.get(missed.subjectId);
    const exam = examMap.get(missed.subjectId);

    let slotFound = false;

    // Search ahead up to 14 days
    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      if (slotFound) break;

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayOffset);
      const dateStr = targetDate.toISOString().split('T')[0];
      const dayName = DAYS_OF_WEEK[targetDate.getDay()];

      const dayAvail = availability.weeklySlots[dayName];
      if (!dayAvail || !dayAvail.isEnabled) continue;

      dailyScheduledMinutes[dateStr] = dailyScheduledMinutes[dateStr] || 0;

      for (const slot of dayAvail.slots) {
        const slotKey = `${dateStr}_${slot.startTime}`;

        if (occupiedSlots.has(slotKey)) continue;
        if (dailyScheduledMinutes[dateStr] + missed.durationMinutes > maxDailyMinutes) continue;

        // Slot is open and safe!
        occupiedSlots.add(slotKey);
        dailyScheduledMinutes[dateStr] += missed.durationMinutes;
        slotFound = true;
        recoveredMinutes += missed.durationMinutes;

        const adaptedSession: StudySession = {
          ...missed,
          id: `adapted-${missed.id}-${Date.now()}`,
          date: dateStr,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'rescheduled',
          isAdapted: true,
          originalDate: missed.date,
          originalTime: missed.startTime,
          rationale: `Adaptive Recovery: Rescheduled from ${missed.date} (${missed.startTime}). Prioritized for ${exam ? `upcoming "${exam.title}"` : 'academic completion'}.`
        };

        newSessions.push(adaptedSession);

        changes.push({
          sessionId: missed.id,
          topicName: topic?.name || missed.title,
          subjectName: subject?.name || 'Academic Subject',
          subjectColor: subject?.color || '#6366f1',
          oldDate: missed.date,
          oldTime: missed.startTime,
          newDate: dateStr,
          newTime: slot.startTime,
          reason: exam
            ? `Recovers urgent study topic prior to ${exam.title} (${exam.date})`
            : `Fills nearest open study slot without exceeding daily limit`
        });

        break;
      }
    }
  }

  return {
    id: `prop-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    missedSessionsCount: missedSessions.length,
    recoveredHours: Number((recoveredMinutes / 60).toFixed(1)),
    changes,
    newSessions
  };
};
