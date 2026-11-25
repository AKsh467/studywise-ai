import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Check,
  Cpu
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { NeuralPlanner3D } from '../components/3d/NeuralPlanner3D';
import { generateStudyPlan, PlanGenerationResult } from '../services/plannerEngine';
import { StudySession } from '../types';
import { studyPlansApi } from '../api';
import confetti from 'canvas-confetti';

export const StudyPlanner: React.FC = () => {
  const { state, commitGeneratedPlan, setActivePage, generateBackendSchedule } = useAppStore();
  const { subjects, topics, examinations, availability, sessions, isBackendConnected, studentId } = state;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(subjects.map(s => s.id));
  const [horizonDays, setHorizonDays] = useState<number>(7);
  const [customDailyHours, setCustomDailyHours] = useState<number>(availability.maxDailyHours || 4.5);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<PlanGenerationResult | null>(null);
  const [isCommitted, setIsCommitted] = useState<boolean>(false);

  // Toggle subject selection
  const handleToggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  // Run the generation engine
  const handleGenerate = async () => {
    setIsSynthesizing(true);
    setIsCommitted(false);

    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + horizonDays * 86400000).toISOString().split('T')[0];

      let result: PlanGenerationResult;

      if (isBackendConnected) {
        const backendSlots = await generateBackendSchedule(startDate, endDate);

        if (backendSlots && backendSlots.length > 0) {
          const subjectMap = new Map(subjects.map(s => [s.name, s.id]));
          const generatedSessions: StudySession[] = backendSlots.map((slot, idx) => ({
            id: `backend-slot-${Date.now()}-${idx}`,
            subjectId: subjectMap.get(slot.subject_name) || (subjects[0]?.id || '1'),
            topicId: String(slot.topic_id),
            title: slot.topic_name,
            date: slot.date,
            startTime: slot.start_time.substring(0, 5),
            endTime: slot.end_time.substring(0, 5),
            durationMinutes: 90,
            status: 'upcoming',
            rationale: `Scheduled by FastAPI Engine • Subject: ${slot.subject_name} • Priority Score: ${slot.priority}`
          }));

          const totalHours = generatedSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;
          result = {
            sessions: generatedSessions,
            summary: {
              totalSessions: generatedSessions.length,
              totalHours: Math.round(totalHours * 10) / 10,
              scheduledTopicsCount: new Set(generatedSessions.map(s => s.topicId)).size,
              unscheduledTopicsCount: Math.max(0, topics.filter(t => !t.isCompleted).length - generatedSessions.length),
              averageDailyHours: Math.round((totalHours / horizonDays) * 10) / 10
            },
            rationales: backendSlots.map(slot => ({
              topicId: String(slot.topic_id),
              topicName: slot.topic_name,
              subjectName: slot.subject_name,
              score: slot.priority,
              reason: `FastAPI Algorithm Score: ${slot.priority} / 100`
            })),
            unscheduledTopics: []
          };
        } else {
          result = generateStudyPlan(
            subjects,
            topics,
            examinations,
            availability,
            sessions,
            {
              selectedSubjectIds: selectedSubjects,
              daysHorizon: horizonDays,
              maxDailyHours: customDailyHours,
              sessionDurationMinutes: availability.preferredDurationMinutes
            }
          );
        }
      } else {
        result = generateStudyPlan(
          subjects,
          topics,
          examinations,
          availability,
          sessions,
          {
            selectedSubjectIds: selectedSubjects,
            daysHorizon: horizonDays,
            maxDailyHours: customDailyHours,
            sessionDurationMinutes: availability.preferredDurationMinutes
          }
        );
      }

      setGenerationResult(result);
      setIsSynthesizing(false);
      setStep(3);
    } catch {
      const fallbackResult = generateStudyPlan(
        subjects,
        topics,
        examinations,
        availability,
        sessions,
        {
          selectedSubjectIds: selectedSubjects,
          daysHorizon: horizonDays,
          maxDailyHours: customDailyHours,
          sessionDurationMinutes: availability.preferredDurationMinutes
        }
      );
      setGenerationResult(fallbackResult);
      setIsSynthesizing(false);
      setStep(3);
    }
  };

  // Commit plan to calendar
  const handleCommit = async () => {
    if (!generationResult) return;
    commitGeneratedPlan(generationResult.sessions);
    setIsCommitted(true);

    if (isBackendConnected) {
      try {
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + horizonDays * 86400000).toISOString().split('T')[0];
        await studyPlansApi.create(studentId, {
          name: `Sprint Horizon (${horizonDays} Days)`,
          start_date: startDate,
          end_date: endDate
        });
      } catch (e) {
        console.warn("Could not save study plan to backend:", e);
      }
    }

    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D6EF72', '#3548D4', '#A66CFF', '#FF784F']
      });
    } catch {
      // Graceful fallback
    }
  };

  const pendingTopicsCount = topics.filter(t => !t.isCompleted && selectedSubjects.includes(t.subjectId)).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. NEURAL SYNTHESIS LABORATORY 3D HERO MONOLITH */}
      <div className="holographic-frame-dark">
        <div className="rounded-[calc(1.75rem-1.5px)] bg-gradient-to-br from-[#24152F] via-[#1A0D23] to-[#120718] p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#D6EF72] text-xs font-mono">
                <Cpu className="w-3.5 h-3.5 text-[#D6EF72]" />
                <span className="tracking-wide">AUTONOMOUS SYNTHESIS TERMINAL // DETERMINISTIC LOGIC</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
                Neural Study Planner
              </h2>

              <p className="text-sm text-[#D9D5E8] leading-relaxed max-w-xl">
                Synthesizes examination dates, conceptual weightage, and your configured study availability into an optimal, conflict-free academic roadmap.
              </p>

              {/* Stepper indicators */}
              <div className="flex items-center gap-2 pt-3 flex-wrap">
                <span className={`px-3.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  step === 1 ? 'bg-[#3548D4] text-white border-[#3548D4] shadow-md shadow-[#3548D4]/30' : 'bg-white/10 text-[#D9D5E8] border-white/15'
                }`}>
                  1. Curriculum Scope
                </span>
                <span className="text-[#A66CFF]">→</span>
                <span className={`px-3.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  step === 2 ? 'bg-[#3548D4] text-white border-[#3548D4] shadow-md shadow-[#3548D4]/30' : 'bg-white/10 text-[#D9D5E8] border-white/15'
                }`}>
                  2. Planning Horizon
                </span>
                <span className="text-[#A66CFF]">→</span>
                <span className={`px-3.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  step === 3 ? 'bg-[#3548D4] text-white border-[#3548D4] shadow-md shadow-[#3548D4]/30' : 'bg-white/10 text-[#D9D5E8] border-white/15'
                }`}>
                  3. Synthesized Plan
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 h-68 sm:h-76 flex items-center justify-center">
              <NeuralPlanner3D isGenerating={isSynthesizing} />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: SUBJECT SELECTION */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#24152F]/8">
            <div>
              <h3 className="text-lg font-bold text-[#24152F] font-heading">Step 1: Select Subjects for Planning</h3>
              <p className="text-xs text-[#6C5A7A] mt-0.5">
                Choose courses to include in this planning cycle ({selectedSubjects.length} of {subjects.length} selected).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedSubjects(subjects.map(s => s.id))}
                className="text-xs font-mono font-bold text-[#3548D4] hover:underline transition-colors"
              >
                Select All
              </button>
              <span className="text-[#9887A4]">•</span>
              <button
                onClick={() => setSelectedSubjects([])}
                className="text-xs font-mono text-[#6C5A7A] hover:text-[#24152F] transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(sub => {
              const subTopics = topics.filter(t => t.subjectId === sub.id && !t.isCompleted);
              const isSelected = selectedSubjects.includes(sub.id);

              return (
                <div
                  key={sub.id}
                  onClick={() => handleToggleSubject(sub.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white border-[#3548D4] shadow-md shadow-[#3548D4]/12 ring-2 ring-[#3548D4]/20'
                      : 'bg-[#F6F0E6]/50 border-[#24152F]/10 opacity-70 hover:opacity-100 hover:border-[#24152F]/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                          style={{
                            backgroundColor: `${sub.color}15`,
                            borderColor: `${sub.color}35`,
                            color: sub.color
                          }}
                        >
                          {sub.code}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#24152F]">{sub.name}</h4>
                      <p className="text-xs text-[#6C5A7A] mt-1 font-mono">{subTopics.length} pending topics</p>
                    </div>

                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-[#3548D4] text-white border-[#3548D4]' : 'border-[#24152F]/20 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D6EF72]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#24152F]/8">
            <span className="text-xs text-[#6C5A7A] font-mono font-bold">
              {pendingTopicsCount} total pending concepts queued for distribution
            </span>
            <button
              onClick={() => setStep(2)}
              disabled={selectedSubjects.length === 0}
              className="px-6 py-3 rounded-2xl bg-[#3548D4] hover:bg-[#2C3AB3] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Proceed to Horizon & Load</span>
              <ArrowRight className="w-4 h-4 text-[#D6EF72]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONSTRAINTS & GENERATE */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#24152F]/8">
            <div>
              <h3 className="text-lg font-bold text-[#24152F] font-heading">Step 2: Configure Planning Horizon & Constraints</h3>
              <p className="text-xs text-[#6C5A7A] mt-0.5">
                Set scheduling duration and daily workload boundary conditions.
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-[#3548D4] hover:underline"
            >
              ← Back to subjects
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Horizon */}
            <div className="p-5 rounded-2xl bg-[#F6F0E6]/50 border border-[#24152F]/8 space-y-3">
              <label className="block text-xs font-mono uppercase text-[#24152F] font-bold">
                Planning Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[7, 14, 21].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setHorizonDays(days)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      horizonDays === days
                        ? 'bg-[#3548D4] text-white border-[#3548D4] shadow-xs'
                        : 'bg-white text-[#6C5A7A] border-[#24152F]/12 hover:text-[#24152F]'
                    }`}
                  >
                    {days} Days {days === 7 ? '(Sprint)' : days === 14 ? '(Standard)' : '(Full)'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#6C5A7A]">
                Schedules revision blocks starting from tomorrow across {horizonDays} days.
              </p>
            </div>

            {/* Daily Hours Slider */}
            <div className="p-5 rounded-2xl bg-[#F6F0E6]/50 border border-[#24152F]/8 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase text-[#24152F] font-bold">
                  Daily Workload Cap
                </label>
                <span className="text-xs font-bold text-[#3548D4] font-mono bg-[#D6EF72] px-2 py-0.5 rounded text-[#1D2506]">
                  {customDailyHours} hrs / day
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="7.0"
                step="0.5"
                value={customDailyHours}
                onChange={e => setCustomDailyHours(parseFloat(e.target.value))}
                className="w-full accent-[#3548D4]"
              />
              <p className="text-[11px] text-[#6C5A7A]">
                Ensures you do not exceed realistic study limits on any single calendar day.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#24152F]/8">
            <button
              onClick={handleGenerate}
              disabled={isSynthesizing}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#3548D4] via-[#7030D6] to-[#A66CFF] hover:brightness-110 text-white text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xl shadow-[#3548D4]/30 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#D6EF72] animate-spin" style={{ animationDuration: '4s' }} />
              <span>{isSynthesizing ? 'Synthesizing Pathfinding Vectors...' : 'Synthesize Study Schedule'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: GENERATED PLAN REVIEW */}
      {step === 3 && generationResult && (
        <div className="space-y-6">
          {/* Plan Summary KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs text-center">
              <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Sessions Scheduled</span>
              <p className="text-3xl font-extrabold text-[#24152F] font-display mt-1">
                {generationResult.summary.totalSessions}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs text-center">
              <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Total Study Time</span>
              <p className="text-3xl font-extrabold text-[#3548D4] font-display mt-1">
                {generationResult.summary.totalHours} hrs
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs text-center">
              <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Topics Covered</span>
              <p className="text-3xl font-extrabold text-[#A66CFF] font-display mt-1">
                {generationResult.summary.scheduledTopicsCount}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs text-center">
              <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Avg Daily Load</span>
              <p className="text-3xl font-extrabold text-[#FF784F] font-display mt-1">
                {generationResult.summary.averageDailyHours} hrs/d
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-[#24152F] font-heading">
                {isCommitted ? '✓ Plan Successfully Activated!' : 'Generated Study Schedule Ready for Review'}
              </h4>
              <p className="text-xs text-[#6C5A7A] mt-0.5">
                {isCommitted
                  ? 'All sessions have been committed into your master academic agenda.'
                  : 'Review the explainable rationale below and commit to activate in your calendar.'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-[#EAE4D7] text-[#6C5A7A] text-xs font-bold hover:bg-[#DDD5C5] transition-colors"
              >
                Reconfigure
              </button>

              {!isCommitted ? (
                <button
                  onClick={handleCommit}
                  className="px-6 py-2.5 rounded-xl bg-[#D6EF72] hover:bg-[#C2E057] text-[#1D2506] border border-[#B5D73F] text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#D6EF72]/30 transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1D2506]" />
                  <span>Commit to Master Schedule</span>
                </button>
              ) : (
                <button
                  onClick={() => setActivePage('schedule')}
                  className="px-6 py-2.5 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/25 transition-all"
                >
                  <span>Open Calendar View</span>
                  <ArrowRight className="w-4 h-4 text-[#D6EF72]" />
                </button>
              )}
            </div>
          </div>

          {/* Generated Sessions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#6C5A7A] uppercase font-mono tracking-wider">
              Synthesized Sessions Timeline ({generationResult.sessions.length})
            </h4>

            <div className="space-y-2.5">
              {generationResult.sessions.map((sess, idx) => {
                const sub = subjects.find(s => s.id === sess.subjectId);

                return (
                  <div
                    key={sess.id}
                    className="p-4 rounded-2xl bg-white border border-[#24152F]/10 shadow-2xs flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#9887A4]">#{idx + 1}</span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                          style={{
                            backgroundColor: `${sub?.color || '#3548D4'}15`,
                            borderColor: `${sub?.color || '#3548D4'}35`,
                            color: sub?.color || '#3548D4'
                          }}
                        >
                          {sub?.code}
                        </span>
                        <span className="text-xs font-mono text-[#3548D4] font-semibold">
                          {sess.date} • {sess.startTime} - {sess.endTime} ({sess.durationMinutes}m)
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-[#24152F]">{sess.title}</h5>
                      <p className="text-xs text-[#6C5A7A] mt-0.5 font-mono">{sess.rationale}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
