import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { SessionStatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { StudySession } from '../types';

export const Schedule: React.FC = () => {
  const { state, markSessionStatus, deleteSession, addSession, setActivePage } = useAppStore();
  const { sessions, subjects, topics } = state;

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('week');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(0);

  // Add session modal
  const [isAddSessionOpen, setIsAddSessionOpen] = useState<boolean>(false);
  const [newSessSubjectId, setNewSessSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newSessTopicId, setNewSessTopicId] = useState<string>('');
  const [newSessDate, setNewSessDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [newSessStart, setNewSessStart] = useState<string>('14:00');
  const [newSessEnd, setNewSessEnd] = useState<string>('15:30');
  const [newSessTitle, setNewSessTitle] = useState<string>('');

  // Selected date reference
  const selectedDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + selectedDateOffset);
    return d.toISOString().split('T')[0];
  }, [selectedDateOffset]);

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Complete session celebration
  const handleMarkComplete = (id: string) => {
    markSessionStatus(id, 'completed');
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

  // Filtered sessions
  const filteredSessions = sessions.filter(sess => {
    if (selectedSubjectFilter !== 'all' && sess.subjectId !== selectedSubjectFilter) {
      return false;
    }
    if (selectedStatusFilter !== 'all' && sess.status !== selectedStatusFilter) {
      return false;
    }
    if (viewMode === 'day') {
      return sess.date === selectedDateStr;
    }
    return true;
  });

  // Sort by date and startTime
  filteredSessions.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  // Group by Date for Week/List view
  const sessionsByDate: Record<string, StudySession[]> = {};
  filteredSessions.forEach(sess => {
    if (!sessionsByDate[sess.date]) sessionsByDate[sess.date] = [];
    sessionsByDate[sess.date].push(sess);
  });

  // Handle Add Session submit
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = topics.find(t => t.id === newSessTopicId);
    const subject = subjects.find(s => s.id === newSessSubjectId);

    const [sh, sm] = newSessStart.split(':').map(Number);
    const [eh, em] = newSessEnd.split(':').map(Number);
    const duration = (eh * 60 + em) - (sh * 60 + sm);

    const newSess: StudySession = {
      id: `manual-sess-${Date.now()}`,
      subjectId: newSessSubjectId,
      topicId: newSessTopicId || (topic?.id || 'manual'),
      title: newSessTitle || (topic?.name || `${subject?.code || 'Course'} Study Session`),
      date: newSessDate,
      startTime: newSessStart,
      endTime: newSessEnd,
      durationMinutes: duration > 0 ? duration : 90,
      status: 'upcoming',
      rationale: 'Student scheduled manually.'
    };

    addSession(newSess);
    setIsAddSessionOpen(false);
    setNewSessTitle('');
  };

  const subjectTopics = topics.filter(t => t.subjectId === newSessSubjectId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. TOP CONTROLS & MASTHEAD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-[#3548D4] tracking-widest uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-[#D6EF72] animate-pulse" />
            <span>DIMENSIONAL AGENDA // VOL. 26</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#24152F]">Study Sessions & Chronological Agenda</h2>
          <p className="text-xs text-[#6C5A7A] mt-0.5">
            Manage your daily focus blocks, record syllabus completions, or trigger autonomous recovery for missed sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View switcher */}
          <div className="p-1 rounded-2xl bg-[#F6F0E6]/80 border border-[#24152F]/10 flex items-center">
            {(['day', 'week', 'list'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-[#3548D4] text-white shadow-xs'
                    : 'text-[#6C5A7A] hover:text-[#24152F]'
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddSessionOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#3548D4] to-[#7030D6] hover:brightness-110 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#D6EF72]" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER & DATE NAVIGATION TOOLBAR */}
      <div className="p-4 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#3548D4]" />
            <span className="text-xs text-[#6C5A7A] font-mono font-bold">Filters:</span>
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={e => setSelectedSubjectFilter(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-[#F6F0E6]/60 border border-[#24152F]/12 text-xs text-[#24152F] focus:outline-none focus:border-[#3548D4] font-bold"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-[#F6F0E6]/60 border border-[#24152F]/12 text-xs text-[#24152F] focus:outline-none focus:border-[#3548D4] font-bold"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="rescheduled">Rescheduled / Adapted</option>
          </select>
        </div>

        {/* Date Nav for Day View */}
        {viewMode === 'day' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDateOffset(prev => prev - 1)}
              className="p-1.5 rounded-xl bg-[#F6F0E6]/80 text-[#6C5A7A] hover:text-[#24152F] border border-[#24152F]/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-[#24152F] px-2">
              {selectedDateOffset === 0 ? `Today (${selectedDateStr})` : selectedDateStr}
            </span>
            <button
              onClick={() => setSelectedDateOffset(prev => prev + 1)}
              className="p-1.5 rounded-xl bg-[#F6F0E6]/80 text-[#6C5A7A] hover:text-[#24152F] border border-[#24152F]/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. SESSIONS TIMELINE AGILITY */}
      {Object.keys(sessionsByDate).length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-3">
          <CalendarIcon className="w-12 h-12 text-[#9887A4] mx-auto opacity-50" />
          <h4 className="text-base font-bold text-[#24152F]">No sessions match your filter criteria</h4>
          <p className="text-xs text-[#6C5A7A] max-w-sm mx-auto">
            Try adjusting your subject/status filters, or run the AI Study Planner to generate new sessions.
          </p>
          <button
            onClick={() => setActivePage('planner')}
            className="px-5 py-2.5 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md shadow-[#3548D4]/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D6EF72]" />
            <span>Generate Study Plan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(sessionsByDate).map(([date, dateSessions]) => {
            const isToday = date === todayIso;

            return (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#3548D4]" />
                  <h4 className="text-sm font-bold font-mono text-[#24152F] tracking-wide">
                    {date} {isToday && <span className="text-[#3548D4] text-xs font-sans font-bold">(Today)</span>}
                  </h4>
                  <span className="text-xs text-[#6C5A7A] font-mono">
                    • {dateSessions.length} session{dateSessions.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dateSessions.map(session => {
                    const subject = subjects.find(s => s.id === session.subjectId);
                    const isDone = session.status === 'completed';
                    const isMissed = session.status === 'missed';
                    const isAdapted = session.status === 'rescheduled';

                    return (
                      <div
                        key={session.id}
                        className={`p-5 rounded-2xl bg-white transition-all border ${
                          isDone ? 'border-[#9DE2CB]/60 bg-[#F9FDFB]' :
                          isMissed ? 'border-[#FF784F]/40 bg-[#FFF9F7]' :
                          isAdapted ? 'border-[#A66CFF]/40 bg-[#FAF8FF]' :
                          'border-[#24152F]/10 hover:border-[#3548D4]/30 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                                style={{
                                  backgroundColor: `${subject?.color || '#3548D4'}15`,
                                  borderColor: `${subject?.color || '#3548D4'}35`,
                                  color: subject?.color || '#3548D4'
                                }}
                              >
                                {subject?.code || 'Course'}
                              </span>

                              <span className="text-xs font-mono text-[#6C5A7A] flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3 text-[#9887A4]" />
                                {session.startTime} - {session.endTime} ({session.durationMinutes}m)
                              </span>

                              <SessionStatusBadge status={session.status} />
                            </div>

                            <h5 className={`text-base font-bold ${isDone ? 'line-through text-[#9887A4]' : 'text-[#24152F]'}`}>
                              {session.title}
                            </h5>
                            <p className="text-xs text-[#6C5A7A] mt-1 line-clamp-2">{session.rationale}</p>

                            {isAdapted && session.originalDate && (
                              <p className="text-[11px] font-mono text-[#3548D4] mt-1.5 flex items-center gap-1 font-semibold">
                                <RefreshCw className="w-3 h-3" />
                                Rescheduled from {session.originalDate} ({session.originalTime})
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => deleteSession(session.id)}
                            className="text-[#9887A4] hover:text-[#FF784F] p-1.5 transition-colors shrink-0"
                            title="Delete session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Session Actions Footer */}
                        <div className="mt-4 pt-3 border-t border-[#24152F]/8 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {session.status !== 'completed' && (
                              <button
                                onClick={() => handleMarkComplete(session.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#D6EF72] hover:bg-[#C2E057] border border-[#B5D73F] text-[#1D2506] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1D2506]" />
                                <span>Complete</span>
                              </button>
                            )}

                            {session.status === 'upcoming' && (
                              <button
                                onClick={() => markSessionStatus(session.id, 'missed')}
                                className="px-3 py-1.5 rounded-xl bg-[#FF784F]/10 hover:bg-[#FF784F]/20 text-[#D4471B] border border-[#FF784F]/30 text-xs font-semibold transition-all"
                              >
                                Mark Missed
                              </button>
                            )}

                            {isMissed && (
                              <button
                                onClick={() => setActivePage('adaptive')}
                                className="px-3 py-1.5 rounded-xl bg-[#3548D4]/10 hover:bg-[#3548D4]/20 text-[#3548D4] border border-[#3548D4]/25 text-xs font-bold flex items-center gap-1 transition-all"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Adapt Schedule</span>
                              </button>
                            )}
                          </div>

                          <span className="text-[10px] text-[#9887A4] font-mono">
                            ID: {session.id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD STUDY SESSION */}
      <Modal
        isOpen={isAddSessionOpen}
        onClose={() => setIsAddSessionOpen(false)}
        title="Schedule Focus Session"
        subtitle="Manually allocate a study block into your master agenda"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Subject</label>
            <select
              value={newSessSubjectId}
              onChange={e => {
                setNewSessSubjectId(e.target.value);
                setNewSessTopicId('');
              }}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-bold"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Topic (Optional)</label>
            <select
              value={newSessTopicId}
              onChange={e => {
                setNewSessTopicId(e.target.value);
                const t = topics.find(top => top.id === e.target.value);
                if (t) setNewSessTitle(t.name);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            >
              <option value="">Select a concept from course syllabus...</option>
              {subjectTopics.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.priority} priority)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Session Title</label>
            <input
              type="text"
              placeholder="e.g. Distributed Consensus Algorithms Review"
              value={newSessTitle}
              onChange={e => setNewSessTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Date</label>
              <input
                type="date"
                value={newSessDate}
                onChange={e => setNewSessDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-xs font-mono focus:border-[#3548D4] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Start Time</label>
              <input
                type="time"
                value={newSessStart}
                onChange={e => setNewSessStart(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-xs font-mono focus:border-[#3548D4] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">End Time</label>
              <input
                type="time"
                value={newSessEnd}
                onChange={e => setNewSessEnd(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-xs font-mono focus:border-[#3548D4] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#24152F]/8">
            <button
              type="button"
              onClick={() => setIsAddSessionOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#EAE4D7] text-[#6C5A7A] text-xs font-bold hover:bg-[#DDD5C5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold shadow-md shadow-[#3548D4]/25"
            >
              Schedule Block
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
