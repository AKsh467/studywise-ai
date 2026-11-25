import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  PlusCircle,
  Target,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { Hero3DCore } from '../components/3d/Hero3DCore';
import { computeAnalytics } from '../services/analyticsService';
import { computeRecommendations } from '../services/recommendationEngine';
import { PriorityBadge, SessionStatusBadge, Badge } from '../components/common/Badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { state, setActivePage, markSessionStatus } = useAppStore();
  const { profile, subjects, topics, examinations, sessions } = state;

  const analytics = computeAnalytics(subjects, topics, examinations, sessions);
  const recommendations = computeRecommendations(subjects, topics, examinations, sessions, profile);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = sessions.filter(s => s.date === todayStr);

  // Trigger celebration confetti
  const handleCompleteSession = (sessionId: string) => {
    markSessionStatus(sessionId, 'completed');
    try {
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#D6EF72', '#3548D4', '#A66CFF', '#FF784F']
      });
    } catch {
      // Graceful fallback
    }
  };

  // Nearest examination
  const sortedExams = [...examinations].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const nextExam = sortedExams[0];
  let daysToNextExam = 0;
  if (nextExam) {
    const diff = new Date(nextExam.date).getTime() - new Date().getTime();
    daysToNextExam = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  }

  const missedSessions = sessions.filter(s => s.status === 'missed');

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-12">
      {/* 1. EDITORIAL OVERSIZED GREETING MASTHEAD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#24152F]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-[#A66CFF] tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#D6EF72] animate-pulse" />
            <span>PRISMATIC ATELIER // EDITION 2026</span>
            <span className="text-[#24152F]/30">•</span>
            <span className="text-[#24152F]/70">{profile.semester}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#24152F] tracking-tight leading-[1.08]">
            {getGreeting()},{' '}
            <span className="font-editorial italic font-normal text-[#3548D4] underline decoration-[#D6EF72] decoration-wavy decoration-2">
              {profile.name.split(' ')[0]}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-white border border-[#24152F]/10 shadow-2xs text-right">
            <p className="text-[10px] font-mono uppercase text-[#6C5A7A]">Cognitive Sync</p>
            <p className="text-xs font-bold font-mono text-[#3548D4]">98.4% OPTIMAL</p>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-[#D6EF72] border border-[#B5D73F] text-[#1D2506] shadow-2xs">
            <p className="text-[10px] font-mono uppercase font-bold">Workload Rhythm</p>
            <p className="text-xs font-extrabold font-mono">{profile.targetDailyHours}H / DAY</p>
          </div>
        </div>
      </div>

      {/* 2. ASYMMETRIC PRISMATIC 3D HERO MONOLITH */}
      <div className="holographic-frame-dark">
        <div className="rounded-[calc(1.75rem-1.5px)] bg-gradient-to-br from-[#24152F] via-[#1A0D23] to-[#120718] p-6 sm:p-10 relative overflow-hidden text-white">
          {/* Ambient luminous color flares */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3548D4]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#A66CFF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-10 w-72 h-72 bg-[#D6EF72]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Core Narrative & Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#D6EF72] text-xs font-mono">
                <Zap className="w-3.5 h-3.5 text-[#D6EF72]" />
                <span className="tracking-wide">NEURAL PATHFINDING ENGINE ACTIVE</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Master your curriculum through{' '}
                <span className="gradient-text-prismatic font-display">generative precision</span> & adaptive momentum.
              </h2>

              <p className="text-sm text-[#D9D5E8] max-w-xl leading-relaxed">
                Overall syllabus completion stands at{' '}
                <strong className="text-[#D6EF72] font-mono font-bold">{analytics.overallCompletionRate}%</strong>.
                {nextExam ? (
                  <> Next critical exam checkpoint: <strong className="text-[#FF784F]">{nextExam.title}</strong> is approaching in <strong className="text-white underline decoration-[#FF784F]">{daysToNextExam} days</strong>.</>
                ) : ' All upcoming academic deliverables are in equilibrium.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setActivePage('planner')}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#3548D4] via-[#7030D6] to-[#A66CFF] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#3548D4]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-[#D6EF72] animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Synthesize Autonomous Plan</span>
                </button>

                {missedSessions.length > 0 && (
                  <button
                    onClick={() => setActivePage('adaptive')}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#FF784F]/20 hover:bg-[#FF784F]/30 border border-[#FF784F]/50 text-[#FFA697] font-bold text-xs sm:text-sm transition-all"
                  >
                    <AlertCircle className="w-4 h-4 text-[#FF784F] animate-pulse" />
                    <span>Recover {missedSessions.length} Missed {missedSessions.length === 1 ? 'Slot' : 'Slots'}</span>
                  </button>
                )}

                <button
                  onClick={() => setActivePage('schedule')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#F6F0E6] font-medium text-xs sm:text-sm transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#A66CFF]" />
                  <span>Interactive Agenda</span>
                </button>
              </div>
            </div>

            {/* Right Column: 3D Centerpiece Interactive Sculpture */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full h-80 sm:h-92">
                <Hero3DCore />
              </div>

              {/* Floating Academic Badges interacting with the 3D core */}
              <div className="absolute top-4 left-2 sm:left-4 px-3 py-1.5 rounded-xl bg-[#24152F]/80 backdrop-blur-md border border-[#3548D4]/40 text-[11px] font-mono text-[#D9D5E8] shadow-lg flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#3548D4]" />
                <span>VELOCITY: +18%</span>
              </div>

              <div className="absolute bottom-4 right-2 sm:right-4 px-3.5 py-2 rounded-xl bg-[#1A0D23]/85 backdrop-blur-md border border-[#D6EF72]/40 text-xs font-mono text-[#D6EF72] shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D6EF72] animate-ping" />
                <span>{analytics.totalCompletedHours}H LOGGED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. VISUALLY DIFFERENTIATED STATISTICAL COLLAGE (Not 4 identical white rectangles!) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Metric 1 (5 cols): Large Syllabus Completion Architectural Monolith */}
        <div
          onClick={() => setActivePage('progress')}
          className="md:col-span-5 rounded-3xl bg-white border border-[#24152F]/10 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6C5A7A] font-bold">Metric 01 // Curriculum</span>
              <h3 className="text-base font-bold font-heading text-[#24152F] mt-0.5">Syllabus Completion</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#3548D4]/10 border border-[#3548D4]/20 flex items-center justify-center text-[#3548D4] group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="my-6 flex items-baseline gap-4">
            <span className="text-6xl font-extrabold font-display tracking-tight text-[#24152F]">
              {analytics.overallCompletionRate}%
            </span>
            <div className="space-y-0.5">
              <Badge variant="mint" size="sm">{analytics.completedTopics} of {analytics.totalTopics} concepts</Badge>
              <p className="text-xs text-[#6C5A7A]">verified mastered</p>
            </div>
          </div>

          <div>
            <div className="w-full bg-[#EAE4D7] rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3548D4] via-[#A66CFF] to-[#D6EF72] transition-all duration-700"
                style={{ width: `${analytics.overallCompletionRate}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#6C5A7A] mt-2 font-mono">
              <span>ACTIVE PACING</span>
              <span className="text-[#3548D4] font-bold flex items-center gap-1">
                View telemetry <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 (3 cols): Acid Lime Study Streak Ticket Pass */}
        <div
          onClick={() => setActivePage('progress')}
          className="md:col-span-3 rounded-3xl bg-[#D6EF72] border-2 border-dashed border-[#1D2506]/30 p-6 text-[#1D2506] shadow-sm hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold bg-[#1D2506] text-[#D6EF72] px-2 py-0.5 rounded-md">
              PASS TICKET
            </span>
            <Flame className="w-6 h-6 text-[#1D2506] fill-[#1D2506]" />
          </div>

          <div className="my-4">
            <p className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">Daily Streak</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-5xl font-extrabold font-display leading-none">{profile.streakDays}</span>
              <span className="text-sm font-bold font-mono">DAYS</span>
            </div>
            <p className="text-xs font-medium mt-1">🔥 Unbroken academic continuity</p>
          </div>

          <div className="pt-3 border-t border-[#1D2506]/20 flex items-center justify-between text-xs font-mono font-bold">
            <span>{analytics.totalCompletedHours}h logged</span>
            <span>VOL. 26</span>
          </div>
        </div>

        {/* Metric 3 (4 cols): Exam Milestone Monolith */}
        <div
          onClick={() => setActivePage('academics')}
          className="md:col-span-4 rounded-3xl bg-[#24152F] text-white p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Subtle background glow */}
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#FF784F]/25 rounded-full blur-2xl" />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A66CFF]">Milestone 01</span>
              <h3 className="text-sm font-bold font-heading text-white mt-0.5">Upcoming Evaluation</h3>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-[#FF784F]/20 border border-[#FF784F]/40 text-[#FF784F] text-xs font-mono font-bold">
              {daysToNextExam}d remaining
            </div>
          </div>

          <div className="my-4 relative z-10">
            {nextExam ? (
              <>
                <p className="text-xs text-[#D9D5E8] truncate">
                  {subjects.find(s => s.id === nextExam.subjectId)?.name || 'Major Course'}
                </p>
                <h4 className="text-xl font-extrabold font-heading text-white mt-1 group-hover:text-[#D6EF72] transition-colors">
                  {nextExam.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="tangerine" size="sm">Target: {nextExam.targetScore}%</Badge>
                  <span className="text-[11px] font-mono text-[#A66CFF]">{nextExam.date}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#D9D5E8]">No evaluations recorded</p>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
            <span className="text-[#D9D5E8]">{subjects.length} Active Courses</span>
            <span className="text-[#D6EF72] font-semibold flex items-center gap-1">
              Atlas <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S CHRONOLOGICAL AGENDA & EXAMINATION RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Focus Agenda (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3548D4] animate-pulse" />
              <h3 className="text-lg font-bold text-[#24152F] font-heading">Today's Focus Agenda</h3>
              <Badge variant="silver" size="sm">{todaysSessions.length} Blocks</Badge>
            </div>
            <button
              onClick={() => setActivePage('schedule')}
              className="text-xs font-bold text-[#3548D4] hover:underline flex items-center gap-1 transition-all"
            >
              <span>Full calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todaysSessions.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-[#24152F]/10 text-center space-y-3 shadow-2xs">
                <CheckCircle2 className="w-10 h-10 text-[#9DE2CB] mx-auto" />
                <h4 className="text-base font-bold text-[#24152F]">Schedule is clear for today</h4>
                <p className="text-xs text-[#6C5A7A] max-w-sm mx-auto">
                  Run the autonomous planner to schedule focus slots aligned with your upcoming exam dates and weekly rhythm.
                </p>
                <button
                  onClick={() => setActivePage('planner')}
                  className="px-4 py-2 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D6EF72]" />
                  <span>Generate Plan</span>
                </button>
              </div>
            ) : (
              todaysSessions.map(session => {
                const subject = subjects.find(s => s.id === session.subjectId);
                const isDone = session.status === 'completed';

                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-2xl bg-white transition-all border ${
                      isDone
                        ? 'border-[#9DE2CB]/60 bg-[#F9FDFB] opacity-80'
                        : 'border-[#24152F]/10 hover:border-[#3548D4]/40 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border"
                            style={{
                              backgroundColor: `${subject?.color || '#3548D4'}15`,
                              borderColor: `${subject?.color || '#3548D4'}35`,
                              color: subject?.color || '#3548D4'
                            }}
                          >
                            {subject?.code || 'Course'}
                          </span>
                          <span className="text-xs font-mono text-[#6C5A7A] flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#A66CFF]" />
                            {session.startTime} - {session.endTime} ({session.durationMinutes}m)
                          </span>
                          <SessionStatusBadge status={session.status} />
                        </div>

                        <h4 className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-[#9887A4]' : 'text-[#24152F]'}`}>
                          {session.title}
                        </h4>
                        <p className="text-xs text-[#6C5A7A] mt-1 line-clamp-1">{session.rationale}</p>
                      </div>

                      {/* Interactive Session Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!isDone && (
                          <button
                            onClick={() => handleCompleteSession(session.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#D6EF72] hover:bg-[#C2E057] border border-[#B5D73F] text-[#1D2506] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                            title="Mark session as completed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#1D2506]" />
                            <span>Done</span>
                          </button>
                        )}
                        {isDone && (
                          <span className="text-xs font-mono text-[#12684F] font-bold flex items-center gap-1 bg-[#9DE2CB]/30 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Finished
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Examination Radar & Readiness (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#24152F] font-heading">Upcoming Evaluations</h3>
            <button
              onClick={() => setActivePage('academics')}
              className="text-xs font-bold text-[#3548D4] hover:underline flex items-center gap-1 transition-all"
            >
              <span>Manage exams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {examinations.slice(0, 3).map(exam => {
              const sub = subjects.find(s => s.id === exam.subjectId);
              const diffDays = Math.max(0, Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
              const subAnalytics = analytics.subjectAnalytics.find(sa => sa.subjectId === exam.subjectId);

              return (
                <div
                  key={exam.id}
                  className="p-4 rounded-2xl bg-white border border-[#24152F]/10 hover:border-[#3548D4]/30 shadow-2xs transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <PriorityBadge priority={exam.priority} />
                        <span className="text-xs font-mono text-[#6C5A7A] font-medium">{exam.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#24152F] truncate group-hover:text-[#3548D4] transition-colors">
                        {exam.title}
                      </h4>
                      <p className="text-xs text-[#6C5A7A] truncate">{sub?.name}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="px-2.5 py-1 rounded-xl bg-[#3548D4]/10 border border-[#3548D4]/20 text-[#3548D4] text-xs font-mono font-bold">
                        {diffDays}d left
                      </div>
                      <span className="text-[10px] text-[#6C5A7A] block mt-1 font-medium">Target: {exam.targetScore}%</span>
                    </div>
                  </div>

                  {/* Preparation progress */}
                  <div className="mt-3 pt-2.5 border-t border-[#24152F]/8 flex items-center justify-between text-xs">
                    <span className="text-[#6C5A7A]">Syllabus Readiness:</span>
                    <span className="font-bold text-[#3548D4]">{subAnalytics?.completionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-[#EAE4D7] rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3548D4] via-[#A66CFF] to-[#FF784F]"
                      style={{ width: `${subAnalytics?.completionRate || 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. COURSE BREAKDOWN & 7-DAY VELOCITY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Course Syllabus Progress (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#24152F] font-heading">Course Mastery Breakdown</h3>
            <span className="text-xs font-mono text-[#6C5A7A] font-semibold">{subjects.length} registered</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-4">
            {analytics.subjectAnalytics.map(sub => (
              <div key={sub.subjectId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                    <span className="font-bold text-[#24152F] truncate max-w-[220px]">{sub.name}</span>
                    <span className="text-[11px] font-mono text-[#6C5A7A]">({sub.code})</span>
                  </div>
                  <span className="font-mono text-[#24152F] font-semibold">
                    {sub.completedTopics}/{sub.totalTopics} ({sub.completionRate}%)
                  </span>
                </div>
                <div className="w-full bg-[#EAE4D7] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${sub.completionRate}%`,
                      backgroundColor: sub.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Study Velocity Stream (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#24152F] font-heading">7-Day Study Velocity</h3>
            <span className="text-xs font-mono text-[#3548D4] font-bold">Goal: {profile.targetDailyHours}h / day</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs h-68 flex flex-col justify-between">
            <div className="flex-1 w-full min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dayStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3548D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3548D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dayLabel" stroke="#9887A4" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9887A4" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#DDD5C5',
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px -5px rgba(36, 21, 47, 0.1)',
                      color: '#24152F',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hoursCompleted"
                    stroke="#3548D4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#velocityGrad)"
                    name="Hours Studied"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-2 border-t border-[#24152F]/8 flex items-center justify-between text-[11px] text-[#6C5A7A]">
              <span>Telemetry: Past 7 days</span>
              <span className="text-[#3548D4] font-mono font-bold">Total: {analytics.totalCompletedHours}h recorded</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. REAL-TIME AI SIGNALS & ACTION LAUNCHPAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Curated AI Signals (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3548D4]" />
            <h3 className="text-lg font-bold text-[#24152F] font-heading">Real-Time Atelier Signals</h3>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 2).map(rec => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-white border border-[#24152F]/10 shadow-2xs relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        rec.urgency === 'critical' ? 'bg-[#FF784F]/15 text-[#D4471B] border-[#FF784F]/35 animate-pulse' :
                        rec.urgency === 'high' ? 'bg-[#D6EF72] text-[#1D2506] border-[#B5D73F]' :
                        'bg-[#3548D4]/10 text-[#3548D4] border-[#3548D4]/25'
                      }`}>
                        {rec.urgency} Action
                      </span>
                      <span className="text-xs text-[#6C5A7A] font-mono font-semibold">{rec.title}</span>
                    </div>

                    <p className="text-sm font-bold text-[#24152F]">{rec.what}</p>
                    <p className="text-xs text-[#6C5A7A] leading-relaxed">{rec.why}</p>
                  </div>

                  <button
                    onClick={() => setActivePage(rec.actionPage)}
                    className="px-4 py-2.5 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md shadow-[#3548D4]/20"
                  >
                    <span>{rec.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Launchpad (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-[#24152F] font-heading">Module Launchpad</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActivePage('academics')}
              className="p-4 rounded-2xl bg-white border border-[#24152F]/10 hover:border-[#3548D4]/40 text-left transition-all group shadow-2xs"
            >
              <PlusCircle className="w-5 h-5 text-[#3548D4] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-[#24152F]">Atlas</p>
              <p className="text-[10px] text-[#6C5A7A]">Map syllabus</p>
            </button>

            <button
              onClick={() => setActivePage('availability')}
              className="p-4 rounded-2xl bg-white border border-[#24152F]/10 hover:border-[#3548D4]/40 text-left transition-all group shadow-2xs"
            >
              <Clock className="w-5 h-5 text-[#A66CFF] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-[#24152F]">Availability</p>
              <p className="text-[10px] text-[#6C5A7A]">Energy matrix</p>
            </button>

            <button
              onClick={() => setActivePage('planner')}
              className="p-4 rounded-2xl bg-white border border-[#24152F]/10 hover:border-[#3548D4]/40 text-left transition-all group shadow-2xs"
            >
              <Sparkles className="w-5 h-5 text-[#3548D4] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-[#24152F]">Synthesizer</p>
              <p className="text-[10px] text-[#6C5A7A]">Build plan</p>
            </button>

            <button
              onClick={() => setActivePage('adaptive')}
              className="p-4 rounded-2xl bg-white border border-[#24152F]/10 hover:border-[#3548D4]/40 text-left transition-all group shadow-2xs"
            >
              <AlertCircle className="w-5 h-5 text-[#FF784F] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-[#24152F]">Adaptive</p>
              <p className="text-[10px] text-[#6C5A7A]">Recover slots</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
