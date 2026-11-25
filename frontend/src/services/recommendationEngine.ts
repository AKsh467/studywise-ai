import {
  Subject,
  Topic,
  Examination,
  StudySession,
  StudentProfile,
  Recommendation
} from '../types';

export const computeRecommendations = (
  subjects: Subject[],
  topics: Topic[],
  examinations: Examination[],
  sessions: StudySession[],
  profile: StudentProfile
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Check for missed sessions (Adaptive recovery alert)
  const missedSessions = sessions.filter(s => s.status === 'missed');
  if (missedSessions.length > 0) {
    recommendations.push({
      id: 'rec-missed-sessions',
      title: `${missedSessions.length} Missed Study Session${missedSessions.length > 1 ? 's' : ''} Detected`,
      category: 'missed',
      urgency: 'critical',
      what: `You missed ${missedSessions.length} session(s) totaling ${missedSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60} hours.`,
      why: 'Unaddressed missed sessions snowball into pre-exam panic and lower topic retention.',
      actionLabel: 'Launch Adaptive Rescheduler',
      actionPage: 'adaptive',
      dateGenerated: todayStr
    });
  }

  // 2. Exam proximity & completion alert
  const today = new Date();
  examinations.forEach(exam => {
    const examDate = new Date(exam.date);
    const diffTime = examDate.getTime() - today.getTime();
    const daysUntilExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const subjectTopics = topics.filter(t => t.subjectId === exam.subjectId);
    const completedTopics = subjectTopics.filter(t => t.isCompleted);
    const completionRate = subjectTopics.length > 0
      ? Math.round((completedTopics.length / subjectTopics.length) * 100)
      : 0;

    const subject = subjects.find(s => s.id === exam.subjectId);
    const subjectName = subject?.name || exam.title;

    if (daysUntilExam > 0 && daysUntilExam <= 7 && completionRate < 70) {
      recommendations.push({
        id: `rec-exam-urgent-${exam.id}`,
        title: `Exam in ${daysUntilExam} Days: ${subjectName}`,
        category: 'exam',
        urgency: 'critical',
        what: `Your syllabus for ${subjectName} is only ${completionRate}% complete with the exam on ${exam.date}.`,
        why: `${subjectTopics.length - completedTopics.length} topics remain pending. Prioritize high-weightage topics now to reach target score of ${exam.targetScore}%.`,
        actionLabel: 'Generate Priority Study Plan',
        actionPage: 'planner',
        actionPayload: { subjectId: exam.subjectId },
        dateGenerated: todayStr
      });
    } else if (daysUntilExam > 7 && daysUntilExam <= 14 && completionRate < 50) {
      recommendations.push({
        id: `rec-exam-prep-${exam.id}`,
        title: `Pacing Alert: ${subjectName} Exam Approaching`,
        category: 'pacing',
        urgency: 'high',
        what: `14-day countdown initiated for "${exam.title}". Current progress is at ${completionRate}%.`,
        why: 'Stepping up daily study sessions now prevents cramming in the final 72 hours.',
        actionLabel: 'Review Topics & Availability',
        actionPage: 'academics',
        dateGenerated: todayStr
      });
    }
  });

  // 3. High priority pending topics
  const highPriorityPending = topics.filter(t => t.priority === 'high' && !t.isCompleted);
  if (highPriorityPending.length >= 3) {
    recommendations.push({
      id: 'rec-high-priority-topics',
      title: `${highPriorityPending.length} High-Weightage Topics Pending`,
      category: 'pacing',
      urgency: 'high',
      what: `Top critical concepts like "${highPriorityPending[0].name}" are waiting to be mastered.`,
      why: 'High-priority topics carry up to 60% of exam mark distributions according to typical university criteria.',
      actionLabel: 'View Academic Syllabus',
      actionPage: 'academics',
      dateGenerated: todayStr
    });
  }

  // 4. Study streak & consistency
  if (profile.streakDays >= 5) {
    recommendations.push({
      id: 'rec-streak-boost',
      title: `🔥 Momentum High: ${profile.streakDays}-Day Study Streak!`,
      category: 'streak',
      urgency: 'info',
      what: `You have maintained an active study rhythm for ${profile.streakDays} consecutive days.`,
      why: 'Consistent daily intervals boost long-term memory consolidation by over 40% compared to sporadic marathon sessions.',
      actionLabel: "View Today's Schedule",
      actionPage: 'schedule',
      dateGenerated: todayStr
    });
  }

  // 5. Daily workload balance
  const todaysSessions = sessions.filter(s => s.date === todayStr);
  const todaysCompleted = todaysSessions.filter(s => s.status === 'completed');
  if (todaysSessions.length > 0 && todaysCompleted.length === 0) {
    recommendations.push({
      id: 'rec-today-sessions',
      title: `You Have ${todaysSessions.length} Study Session${todaysSessions.length > 1 ? 's' : ''} Today`,
      category: 'balance',
      urgency: 'medium',
      what: `First session begins at ${todaysSessions[0].startTime} for "${todaysSessions[0].title}".`,
      why: 'Completing the first session early sets a productive tone for the rest of your academic day.',
      actionLabel: 'Open Today Session',
      actionPage: 'schedule',
      dateGenerated: todayStr
    });
  }

  return recommendations;
};
