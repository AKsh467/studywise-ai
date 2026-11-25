import React from 'react';
import {
  Target,
  Award,
  Clock,
  Flame,
  Activity
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProgressHologram3D } from '../components/3d/ProgressHologram3D';
import { computeAnalytics } from '../services/analyticsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const ProgressTracker: React.FC = () => {
  const { state } = useAppStore();
  const { subjects, topics, examinations, sessions, profile } = state;

  const analytics = computeAnalytics(subjects, topics, examinations, sessions);

  // Subject comparison data for BarChart
  const subjectBarData = analytics.subjectAnalytics.map(sub => ({
    name: sub.code,
    fullName: sub.name,
    completion: sub.completionRate,
    topicsCount: sub.totalTopics,
    color: sub.color
  }));

  // Achievement milestones
  const achievements = [
    {
      id: 'ach-1',
      title: 'Cadence Vanguard',
      desc: 'Maintain a 5+ day uninterrupted study rhythm',
      unlocked: profile.streakDays >= 5,
      icon: Flame,
      variant: 'tangerine' as const
    },
    {
      id: 'ach-2',
      title: 'Syllabus Pathfinder',
      desc: 'Master at least 5 key curriculum concepts',
      unlocked: analytics.completedTopics >= 5,
      icon: Target,
      variant: 'acid' as const
    },
    {
      id: 'ach-3',
      title: 'Deep Quantum Focus',
      desc: 'Log 5+ hours of verified focus sessions',
      unlocked: analytics.totalCompletedHours >= 5,
      icon: Clock,
      variant: 'ultramarine' as const
    },
    {
      id: 'ach-4',
      title: 'Evaluation Resilient',
      desc: 'Map all active subjects to examination targets',
      unlocked: examinations.length >= 3,
      icon: Award,
      variant: 'mint' as const
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. 3D HOLOGRAPHIC PROGRESS HERO */}
      <div className="holographic-frame-dark">
        <div className="rounded-[calc(1.75rem-1.5px)] bg-gradient-to-br from-[#24152F] via-[#1A0D23] to-[#120718] p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#D6EF72] text-xs font-mono">
                <Activity className="w-3.5 h-3.5 text-[#D6EF72]" />
                <span>COGNITIVE RETENTION TELEMETRY // REAL-TIME METRICS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
                Generative Mastery Telemetry
              </h2>

              <p className="text-sm text-[#D9D5E8] leading-relaxed max-w-xl">
                High-fidelity telemetry on your syllabus completion velocity, concept retention horizons, and consistency vectors.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-[#A66CFF] font-bold">Total Hours</span>
                  <p className="text-2xl font-extrabold font-display text-white mt-0.5">{analytics.totalCompletedHours}h</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-[#A66CFF] font-bold">Mastered Topics</span>
                  <p className="text-2xl font-extrabold font-display text-[#D6EF72] mt-0.5">
                    {analytics.completedTopics} <span className="text-xs text-[#D9D5E8] font-mono">/ {analytics.totalTopics}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-[#A66CFF] font-bold">Daily Streak</span>
                  <p className="text-2xl font-extrabold font-display text-[#FF784F] mt-0.5">{profile.streakDays} Days</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-68 sm:h-76 flex items-center justify-center">
              <ProgressHologram3D completionRate={analytics.overallCompletionRate} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUR DIFFERENTIATED METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs">
          <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Overall Syllabus</span>
          <p className="text-4xl font-extrabold text-[#24152F] font-display mt-1">
            {analytics.overallCompletionRate}%
          </p>
          <div className="w-full bg-[#EAE4D7] rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3548D4] via-[#A66CFF] to-[#D6EF72] rounded-full transition-all duration-500"
              style={{ width: `${analytics.overallCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs">
          <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Completed Sessions</span>
          <p className="text-4xl font-extrabold text-[#3548D4] font-display mt-1">
            {analytics.completedSessionsCount}
          </p>
          <p className="text-xs text-[#6C5A7A] mt-1 font-mono">
            {analytics.upcomingSessionsCount} scheduled forward
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs">
          <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">High-Priority Coverage</span>
          <p className="text-4xl font-extrabold text-[#FF784F] font-display mt-1">
            {analytics.priorityBreakdown.high.done} / {analytics.priorityBreakdown.high.total}
          </p>
          <p className="text-xs text-[#6C5A7A] mt-1">Key examination topics cleared</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs">
          <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Rescheduled Sessions</span>
          <p className="text-4xl font-extrabold text-[#A66CFF] font-display mt-1">
            {analytics.rescheduledSessionsCount}
          </p>
          <p className="text-xs text-[#6C5A7A] mt-1">Recovered via Adaptive Engine</p>
        </div>
      </div>

      {/* 3. CHARTS: COURSE COMPARISON & 7-DAY VELOCITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Subject Mastery Comparison Bar Chart (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#24152F] font-heading">Course Mastery Differential</h3>
            <span className="text-xs font-mono text-[#6C5A7A] font-bold">% Completion</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs h-84 flex flex-col justify-between">
            <div className="flex-1 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#9887A4" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9887A4" fontSize={11} domain={[0, 100]} tickLine={false} />
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
                    formatter={(val: any) => [`${val}%`, 'Completion Rate']}
                  />
                  <Bar
                    dataKey="completion"
                    fill="#3548D4"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-[#24152F]/8 text-[11px] text-[#6C5A7A] flex items-center justify-between">
              <span>Preparedness Threshold: 80%</span>
              <span className="text-[#3548D4] font-mono font-bold">Active Cohort Baseline</span>
            </div>
          </div>
        </div>

        {/* 7-Day Study Hours Distribution (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#24152F] font-heading">Daily Focus Stream</h3>
            <span className="text-xs font-mono text-[#3548D4] font-bold">{analytics.totalCompletedHours}h recorded</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs h-84 flex flex-col justify-between">
            <div className="flex-1 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dayStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="progressAreaGrad" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#progressAreaGrad)"
                    name="Completed Hours"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-[#24152F]/8 text-[11px] text-[#6C5A7A] flex items-center justify-between">
              <span>Cognitive velocity telemetry</span>
              <span className="text-[#3548D4] font-mono font-bold">Streak: {profile.streakDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACADEMIC MASTERY BADGES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#3548D4]" />
          <h3 className="text-lg font-bold text-[#24152F] font-heading">Mastery Milestones & Credentials</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map(ach => {
            const Icon = ach.icon;

            return (
              <div
                key={ach.id}
                className={`p-6 rounded-3xl bg-white transition-all border ${
                  ach.unlocked
                    ? 'border-[#D6EF72] shadow-sm ring-1 ring-[#D6EF72]/40'
                    : 'border-[#24152F]/10 opacity-55'
                }`}
              >
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    ach.unlocked ? 'bg-[#D6EF72] text-[#1D2506] shadow-xs' : 'bg-[#FAF8F5] text-[#9887A4]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#24152F] font-heading">{ach.title}</h5>
                    <span className={`text-[10px] font-mono font-extrabold uppercase ${
                      ach.unlocked ? 'text-[#12684F]' : 'text-[#9887A4]'
                    }`}>
                      {ach.unlocked ? '✓ Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#6C5A7A] mt-1">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
