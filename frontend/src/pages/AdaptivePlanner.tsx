import React, { useState } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Zap,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { AdaptiveWarp3D } from '../components/3d/AdaptiveWarp3D';
import { generateAdaptiveProposal } from '../services/adaptiveScheduler';
import { AdaptivePlanProposal } from '../types';

export const AdaptivePlanner: React.FC = () => {
  const { state, acceptAdaptivePlan, setActivePage, markSessionStatus } = useAppStore();
  const { subjects, topics, examinations, availability, sessions } = state;

  const [isAdapting, setIsAdapting] = useState<boolean>(false);
  const [proposal, setProposal] = useState<AdaptivePlanProposal | null>(null);
  const [hasApplied, setHasApplied] = useState<boolean>(false);

  const missedSessions = sessions.filter(s => s.status === 'missed');
  const missedMinutes = missedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const missedHours = (missedMinutes / 60).toFixed(1);

  // Run the Adaptive Rescheduling algorithm
  const handleCalculateRecovery = () => {
    setIsAdapting(true);
    setHasApplied(false);

    setTimeout(() => {
      const generatedProposal = generateAdaptiveProposal(
        subjects,
        topics,
        examinations,
        availability,
        sessions
      );

      setProposal(generatedProposal);
      setIsAdapting(false);
    }, 1600);
  };

  // Accept and commit the adaptive plan
  const handleAcceptProposal = () => {
    if (!proposal) return;
    acceptAdaptivePlan(proposal);
    setHasApplied(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D6EF72', '#3548D4', '#A66CFF', '#FF784F']
      });
    } catch {
      // Graceful fallback
    }
  };

  // Helper to simulate a missed session for demonstration if none are missed
  const handleSimulateMissed = () => {
    const upcoming = sessions.find(s => s.status === 'upcoming');
    if (upcoming) {
      markSessionStatus(upcoming.id, 'missed');
      setProposal(null);
      setHasApplied(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. 3D ADAPTIVE RECOVERY HERO */}
      <div className="holographic-frame-dark">
        <div className="rounded-[calc(1.75rem-1.5px)] bg-gradient-to-br from-[#24152F] via-[#1A0D23] to-[#120718] p-6 sm:p-10 relative overflow-hidden text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF784F]/20 border border-[#FF784F]/35 text-[#FFB69E] text-xs font-mono">
                <RefreshCw className="w-3.5 h-3.5 text-[#FF784F] animate-spin" />
                <span>DYNAMIC SCHEDULE RECOVERY // QUANTUM REBALANCER</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
                Adaptive Schedule Recovery
              </h2>

              <p className="text-sm text-[#D9D5E8] leading-relaxed max-w-xl">
                Life happens. When study sessions are missed, StudyWise AI recalculates your calendar to recover lost academic ground without overloading upcoming days or compromising exam readiness.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                {missedSessions.length > 0 ? (
                  <button
                    onClick={handleCalculateRecovery}
                    disabled={isAdapting}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF784F] via-[#E11D48] to-[#3548D4] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#FF784F]/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 ${isAdapting ? 'animate-spin' : ''}`} />
                    <span>{isAdapting ? 'Calculating Optimal Rebalance...' : `Rebalance ${missedSessions.length} Missed Block(s)`}</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#9DE2CB]/20 border border-[#9DE2CB]/40 text-[#9DE2CB] text-xs font-bold font-mono">
                    <ShieldCheck className="w-4 h-4 text-[#9DE2CB]" />
                    <span>Zero missed sessions. Calendar is in perfect balance!</span>
                  </div>
                )}

                {missedSessions.length === 0 && (
                  <button
                    onClick={handleSimulateMissed}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/20 text-xs font-semibold transition-colors"
                  >
                    Simulate Missed Session Demo
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 h-68 sm:h-76 flex items-center justify-center">
              <AdaptiveWarp3D isAdapting={isAdapting} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. IMPACT ASSESSMENT CARD */}
      {missedSessions.length > 0 && !hasApplied && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FF784F]/10 border border-[#FF784F]/30 shadow-2xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FF784F]/20 border border-[#FF784F]/40 flex items-center justify-center text-[#FF784F] shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#24152F] font-heading">
                  Impact Assessment: {missedSessions.length} Study Block(s) Uncompleted ({missedHours} Hours)
                </h3>
                <p className="text-xs text-[#D4471B] mt-0.5 font-bold">
                  Unstudied material detected. Without recovery, retention rate drops and final exam readiness is compromised.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {missedSessions.map(sess => {
              const sub = subjects.find(s => s.id === sess.subjectId);
              return (
                <div key={sess.id} className="p-4 rounded-2xl bg-white border border-[#24152F]/10 shadow-2xs">
                  <div className="flex items-center gap-2 mb-1.5">
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
                    <span className="text-xs font-mono text-[#6C5A7A] font-medium">
                      Was scheduled: {sess.date} ({sess.startTime})
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#24152F]">{sess.title}</h4>
                  <p className="text-xs text-[#6C5A7A] mt-0.5">{sess.rationale}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CONFIRMATION SUCCESS BANNER */}
      {hasApplied && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#9DE2CB] shadow-2xs space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#9DE2CB]/30 border border-[#9DE2CB] flex items-center justify-center text-[#12684F]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#24152F] font-heading">
                Adaptive Schedule Successfully Applied!
              </h3>
              <p className="text-xs text-[#12684F] font-bold">
                All missed topics have been seamlessly redistributed across your upcoming availability blocks.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActivePage('schedule')}
              className="px-6 py-2.5 rounded-2xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/20 transition-all"
            >
              <span>View Updated Calendar</span>
              <ArrowRight className="w-4 h-4 text-[#D6EF72]" />
            </button>
          </div>
        </div>
      )}

      {/* 4. BEFORE VS AFTER SCHEDULE COMPARISON */}
      {proposal && !hasApplied && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#24152F] font-heading">
                Proposed Adaptive Reschedule Plan
              </h3>
              <p className="text-xs text-[#6C5A7A] mt-0.5">
                Review how your schedule dynamically adapts before accepting the changes.
              </p>
            </div>

            <button
              onClick={handleAcceptProposal}
              className="px-6 py-3 rounded-2xl bg-[#D6EF72] hover:bg-[#C2E057] text-[#1D2506] border border-[#B5D73F] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#D6EF72]/30 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#1D2506]" />
              <span>Accept & Apply Adapted Schedule</span>
            </button>
          </div>

          {/* Comparison Cards */}
          <div className="space-y-4">
            {proposal.changes.map((change, idx) => (
              <div
                key={change.sessionId}
                className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs relative overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#3548D4]" />
                  <span className="text-xs font-mono font-bold uppercase text-[#3548D4]">
                    Adaptation #{idx + 1} • {change.subjectName}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Before */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-[#FF784F]/10 border border-[#FF784F]/30 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#D4471B]">
                      Before (Missed Slot)
                    </span>
                    <h5 className="text-sm font-bold text-[#24152F]">{change.topicName}</h5>
                    <p className="text-xs font-mono text-[#6C5A7A] flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#FF784F]" />
                      <span>{change.oldDate} at {change.oldTime}</span>
                    </p>
                  </div>

                  {/* Shift Transition Icon */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#3548D4]/10 border border-[#3548D4]/20 flex items-center justify-center text-[#3548D4] shadow-xs">
                      <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-[#9DE2CB]/20 border border-[#9DE2CB]/60 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#12684F]">
                      After (Adapted & Recovered)
                    </span>
                    <h5 className="text-sm font-bold text-[#24152F]">{change.topicName}</h5>
                    <p className="text-xs font-mono text-[#12684F] flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#12684F]" />
                      <span>{change.newDate} at {change.newTime}</span>
                    </p>
                  </div>
                </div>

                {/* Algorithmic Rationale */}
                <div className="mt-4 pt-3 border-t border-[#24152F]/8 text-xs text-[#6C5A7A] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#3548D4] shrink-0" />
                  <span><strong>Reasoning:</strong> {change.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
