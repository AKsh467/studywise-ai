import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const { state, setActivePage, setCommandPaletteOpen, toggleSidebar, refreshFromBackend } = useAppStore();
  const { activePage, profile, sessions, examinations, isBackendConnected, isSyncing, lastSyncedAt } = state;
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Active page title map with Prismatic Atelier character
  const pageTitles: Record<string, { title: string; subtitle: string; code: string }> = {
    dashboard: { title: 'Academic Cockpit', subtitle: 'Real-time telemetry of syllabus velocity & cognitive focus', code: 'MOD-01' },
    academics: { title: 'Curriculum & Syllabi Atlas', subtitle: 'Curriculum structure, concept taxonomy & milestone criteria', code: 'MOD-02' },
    availability: { title: 'Time-Space Availability Matrix', subtitle: 'Weekly focus blocks & cognitive energy scheduling limits', code: 'MOD-03' },
    planner: { title: 'Neural Synthesis Laboratory', subtitle: 'Deterministic academic pathfinding & exam-aligned plan generation', code: 'MOD-04' },
    schedule: { title: 'Dimensional Agenda & Sessions', subtitle: 'Dynamic chronological matrix of prioritized learning blocks', code: 'MOD-05' },
    progress: { title: 'Generative Mastery Telemetry', subtitle: 'Syllabus velocity, subject retention curves & streak continuity', code: 'MOD-06' },
    adaptive: { title: 'Adaptive Quantum Recovery', subtitle: 'Nonlinear workload rebalancing for missed academic targets', code: 'MOD-07' },
    insights: { title: 'Curator Intelligence & Signals', subtitle: 'Autonomous academic nudges, weak-spot diagnostics & strategies', code: 'MOD-08' },
    settings: { title: 'Student Dossier & Configuration', subtitle: 'Identity credentials, pedagogical constraints & workspace parameters', code: 'MOD-09' },
  };

  const current = pageTitles[activePage] || { title: 'StudyWise AI', subtitle: 'Prismatic Academic Atelier', code: 'MOD-00' };

  // Generate dynamic notification items
  const missedCount = sessions.filter(s => s.status === 'missed').length;
  const upcomingExams = examinations.filter(e => {
    const diff = (new Date(e.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= 7;
  });

  const totalNotifications = missedCount + upcomingExams.length;

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#F6F0E6]/85 backdrop-blur-xl border-b border-[#24152F]/10 px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left Title / Editorial Masthead */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border border-[#24152F]/10 text-[#6C5A7A] hover:text-[#24152F] shadow-2xs"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#A66CFF] uppercase tracking-wider">{current.code}</span>
            <span className="text-[10px] text-[#24152F]/30">•</span>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#24152F] tracking-tight flex items-center gap-2">
              <span>{current.title}</span>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-[#3548D4] animate-pulse" />
            </h1>
          </div>
          <p className="text-xs text-[#6C5A7A] hidden md:block">{current.subtitle}</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Backend Connectivity Status Pill */}
        <button
          onClick={() => refreshFromBackend()}
          title={isBackendConnected ? `FastAPI Backend Online (Synced: ${lastSyncedAt || 'Just now'}) - Click to Refresh` : "Backend Offline - Click to Reconnect"}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shadow-2xs ${
            isBackendConnected
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-amber-50/80 border-amber-300 text-amber-800 hover:bg-amber-100'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSyncing
                ? 'bg-blue-500 animate-spin'
                : isBackendConnected
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-amber-500'
            }`}
          />
          <span className="hidden md:inline font-bold">
            {isSyncing ? 'Syncing...' : isBackendConnected ? 'FastAPI API v1' : 'Local / Offline'}
          </span>
        </button>

        {/* Quick Search / Command Palette trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-[#24152F]/10 text-[#6C5A7A] hover:text-[#24152F] hover:border-[#3548D4]/40 transition-all text-xs shadow-2xs group"
        >
          <Search className="w-3.5 h-3.5 text-[#3548D4] group-hover:scale-110 transition-transform" />
          <span className="tracking-wide">Command palette...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#F0EBE0] border border-[#DDD5C5] text-[10px] font-mono text-[#24152F] font-semibold ml-2">
            Ctrl+K
          </kbd>
        </button>

        {/* Generate Study Plan Button */}
        <button
          onClick={() => setActivePage('planner')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3548D4] via-[#7030D6] to-[#A66CFF] hover:brightness-110 text-white font-medium text-xs sm:text-sm shadow-md shadow-[#3548D4]/25 transition-all hover:scale-[1.02] active:scale-[0.98] group"
        >
          <Sparkles className="w-4 h-4 text-[#D6EF72] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Synthesize Plan</span>
          <span className="sm:hidden">Plan</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl bg-white border border-[#24152F]/10 text-[#6C5A7A] hover:text-[#24152F] hover:border-[#3548D4]/40 transition-all shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF784F] text-white text-[10px] font-mono font-bold flex items-center justify-center ring-2 ring-[#F6F0E6] shadow-sm animate-pulse">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl bg-white border border-[#24152F]/12 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#24152F]/8">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-[#24152F]">Atelier Signals</h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#3548D4]/10 text-[#3548D4] font-mono text-[10px] font-bold">
                    {totalNotifications} ACTIVE
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 rounded-lg text-[#6C5A7A] hover:text-[#24152F]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {missedCount > 0 && (
                  <div
                    onClick={() => {
                      setActivePage('adaptive');
                      setNotificationsOpen(false);
                    }}
                    className="p-3 rounded-xl bg-[#FF784F]/10 border border-[#FF784F]/25 hover:bg-[#FF784F]/15 transition-all cursor-pointer flex items-start gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#FF784F] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-[#24152F]">
                        {missedCount} Missed Study {missedCount === 1 ? 'Session' : 'Sessions'}
                      </p>
                      <p className="text-[#6C5A7A] text-[11px] mt-0.5">
                        Adaptive Rebalancer ready to redistribute topics safely.
                      </p>
                    </div>
                  </div>
                )}

                {upcomingExams.map(exam => (
                  <div
                    key={exam.id}
                    onClick={() => {
                      setActivePage('academics');
                      setNotificationsOpen(false);
                    }}
                    className="p-3 rounded-xl bg-[#3548D4]/5 border border-[#3548D4]/15 hover:bg-[#3548D4]/10 transition-all cursor-pointer flex items-start gap-3"
                  >
                    <Calendar className="w-4 h-4 text-[#3548D4] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-[#24152F]">{exam.title}</p>
                      <p className="text-[#6C5A7A] text-[11px] mt-0.5">
                        Scheduled on {new Date(exam.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • Target: {exam.targetScore}%
                      </p>
                    </div>
                  </div>
                ))}

                {totalNotifications === 0 && (
                  <div className="py-6 text-center text-xs text-[#6C5A7A]">
                    <CheckCircle2 className="w-6 h-6 text-[#9DE2CB] mx-auto mb-2" />
                    All study targets are synchronized & on track.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#24152F]/8 flex justify-between items-center text-[11px]">
                <button
                  onClick={() => {
                    setActivePage('schedule');
                    setNotificationsOpen(false);
                  }}
                  className="text-[#3548D4] hover:underline font-medium"
                >
                  View full schedule →
                </button>
                <span className="text-[#9887A4] font-mono">AUTONOMOUS</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <button
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#24152F]/10 hover:border-[#3548D4]/40 transition-all shadow-2xs group"
          aria-label="Profile Settings"
        >
          <div className="w-8 h-8 rounded-lg bg-[#24152F] text-[#D6EF72] font-display font-bold text-xs flex items-center justify-center group-hover:scale-105 transition-transform">
            {profile.name.charAt(0)}
          </div>
          <div className="hidden xl:block text-left pr-2">
            <p className="text-xs font-bold text-[#24152F] leading-tight">{profile.name}</p>
            <p className="text-[10px] text-[#A66CFF] font-mono">{profile.university || 'University'}</p>
          </div>
        </button>
      </div>
    </header>
  );
};
