import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Flame,
  Zap
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { computeRecommendations } from '../services/recommendationEngine';
import { RecommendationResponse } from '../api';

export const AIInsights: React.FC = () => {
  const { state, setActivePage, getBackendRecommendations } = useAppStore();
  const { subjects, topics, examinations, sessions, profile, isBackendConnected } = state;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [backendRec, setBackendRec] = useState<RecommendationResponse | null>(null);

  useEffect(() => {
    if (isBackendConnected) {
      getBackendRecommendations().then(res => setBackendRec(res));
    }
  }, [isBackendConnected]);

  const recommendations = computeRecommendations(subjects, topics, examinations, sessions, profile);

  const filteredRecs = recommendations.filter(rec => {
    if (activeCategory === 'all') return true;
    return rec.category === activeCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. TOP CURATOR INTELLIGENCE BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3548D4]/10 border border-[#3548D4]/20 text-[#3548D4] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#3548D4]" />
            <span>EXHIBITION CURATOR SIGNALS // DETERMINISTIC DIAGNOSTICS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#24152F]">
            AI Academic Insights & Signals
          </h2>

          <p className="text-sm text-[#6C5A7A] leading-relaxed">
            Real-time actionable academic guidance derived deterministically from your syllabus progress, upcoming deadlines, study velocity, and consistency patterns.
          </p>
        </div>
      </div>

      {/* 1.1 FASTAPI NEURAL RECOMMENDATION CARD */}
      {backendRec && backendRec.recommended_topic && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#24152F] via-[#351F45] to-[#1E1128] text-white border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D6EF72] text-[#1D2506] text-[10px] font-mono font-bold uppercase tracking-wider">
                  FastAPI Engine Recommendation
                </span>
                <span className="text-xs text-white/50 font-mono">
                  Priority: {backendRec.recommended_topic.priority.score}/100 ({backendRec.recommended_topic.priority.level})
                </span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                {backendRec.recommended_topic.topic_name}
              </h3>
              <p className="text-sm text-white/80">
                Course: <span className="font-semibold text-[#A66CFF]">{backendRec.recommended_topic.subject_name}</span> • {backendRec.message}
              </p>
              {backendRec.suggested_slot && (
                <div className="flex items-center gap-3 text-xs font-mono text-[#D6EF72] pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Suggested Slot: {backendRec.suggested_slot.date} @ {backendRec.suggested_slot.start_time.substring(0, 5)} - {backendRec.suggested_slot.end_time.substring(0, 5)}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setActivePage('planner')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D6EF72] hover:bg-[#c9e65f] text-[#1D2506] text-xs font-bold font-mono uppercase tracking-wider transition-all self-start md:self-auto shrink-0 shadow-md"
            >
              <span>Schedule Topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. CATEGORY FILTER PILLS */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {[
          { id: 'all', label: 'All Signals' },
          { id: 'exam', label: 'Exam Alerts' },
          { id: 'missed', label: 'Missed Sessions' },
          { id: 'pacing', label: 'Syllabus Pacing' },
          { id: 'streak', label: 'Study Consistency' },
          { id: 'balance', label: 'Workload Balance' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeCategory === cat.id
                ? 'bg-[#3548D4] text-white border-[#3548D4] shadow-sm'
                : 'bg-white text-[#6C5A7A] border-[#24152F]/10 hover:text-[#24152F] hover:border-[#24152F]/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. CURATED SIGNALS CANVAS */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#9DE2CB] mx-auto" />
            <h4 className="text-base font-bold text-[#24152F]">All Signals In Equilibrium</h4>
            <p className="text-xs text-[#6C5A7A] max-w-sm mx-auto">
              Your preparation velocity is on track across all active curriculum milestones.
            </p>
          </div>
        ) : (
          filteredRecs.map(rec => {
            const isCritical = rec.urgency === 'critical';
            const isHigh = rec.urgency === 'high';

            return (
              <div
                key={rec.id}
                className={`p-6 sm:p-8 rounded-3xl bg-white transition-all space-y-4 border ${
                  isCritical
                    ? 'border-[#FF784F]/50 shadow-sm bg-[#FFF9F7]'
                    : isHigh
                    ? 'border-[#D6EF72] shadow-sm bg-[#FDFFF5]'
                    : 'border-[#24152F]/10 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-[#FF784F] text-white border-[#FF784F] animate-pulse'
                          : isHigh
                          ? 'bg-[#D6EF72] text-[#1D2506] border-[#B5D73F]'
                          : 'bg-[#3548D4]/10 text-[#3548D4] border-[#3548D4]/25'
                      }`}>
                        {rec.urgency.toUpperCase()} LEVEL
                      </span>
                      <span className="text-xs font-mono text-[#6C5A7A] font-bold">Signal Validated for Today</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#24152F] font-heading">{rec.title}</h3>

                    {/* What */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono uppercase text-[#6C5A7A] font-bold">What is occurring</p>
                      <p className="text-sm text-[#24152F] font-semibold">{rec.what}</p>
                    </div>

                    {/* Why */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[11px] font-mono uppercase text-[#6C5A7A] font-bold">Cognitive rationale</p>
                      <p className="text-xs text-[#6C5A7A] leading-relaxed">{rec.why}</p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setActivePage(rec.actionPage)}
                      className="px-6 py-3 rounded-2xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>{rec.actionLabel}</span>
                      <ArrowRight className="w-4 h-4 text-[#D6EF72]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
