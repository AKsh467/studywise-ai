import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Clock,
  Compass,
  ArrowRight,
  X
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const CommandPalette: React.FC = () => {
  const { state, setActivePage, setCommandPaletteOpen, setSelectedSubjectId } = useAppStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!state.commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.commandPaletteOpen, setCommandPaletteOpen]);

  // Filtered results
  const results = useMemo(() => {
    if (!state.commandPaletteOpen) return [];
    const q = query.toLowerCase().trim();
    if (!q) {
      // Default quick suggestions
      return [
        { type: 'page', title: 'AI Study Planner', page: 'planner', desc: 'Synthesize optimal exam-aligned plan', icon: Sparkles },
        { type: 'page', title: 'Adaptive Schedule Recovery', page: 'adaptive', desc: 'Recalculate missed study sessions', icon: RefreshCw },
        { type: 'page', title: 'Time-Space Availability Matrix', page: 'availability', desc: 'Configure focus hours & constraints', icon: Clock },
        { type: 'page', title: 'Generative Progress Tracker', page: 'progress', desc: 'Review syllabus completion & telemetry', icon: TrendingUp },
      ];
    }

    const items: Array<{ type: string; title: string; desc: string; page: string; subjectId?: string; icon: any }> = [];

    // Search subjects
    state.subjects.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
        items.push({
          type: 'subject',
          title: `${s.code}: ${s.name}`,
          desc: `Subject Specimen • Priority: ${s.priority.toUpperCase()}`,
          page: 'academics',
          subjectId: s.id,
          icon: BookOpen
        });
      }
    });

    // Search topics
    state.topics.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
        const sub = state.subjects.find(s => s.id === t.subjectId);
        items.push({
          type: 'topic',
          title: t.name,
          desc: `${sub?.code || 'Course'} • ${t.isCompleted ? 'Mastered' : 'Pending'} • ${t.estimatedHours}h`,
          page: 'academics',
          subjectId: t.subjectId,
          icon: Compass
        });
      }
    });

    // Search examinations
    state.examinations.forEach(e => {
      if (e.title.toLowerCase().includes(q) || (e.venue && e.venue.toLowerCase().includes(q))) {
        items.push({
          type: 'exam',
          title: e.title,
          desc: `Milestone Exam on ${e.date} at ${e.time} • Target: ${e.targetScore}%`,
          page: 'academics',
          subjectId: e.subjectId,
          icon: Calendar
        });
      }
    });

    // Search pages
    const pages = [
      { name: 'Academic Cockpit', page: 'dashboard', desc: 'Overview of syllabus velocity & focus rhythm' },
      { name: 'Curriculum & Syllabi Atlas', page: 'academics', desc: 'Explore courses, concept taxonomy & exams' },
      { name: 'Time-Space Availability Matrix', page: 'availability', desc: 'Weekly cadence & cognitive workload limits' },
      { name: 'Neural Synthesis Laboratory', page: 'planner', desc: 'Autonomous exam-aligned scheduling' },
      { name: 'Dimensional Agenda & Sessions', page: 'schedule', desc: 'Interactive session calendar & log' },
      { name: 'Generative Mastery Telemetry', page: 'progress', desc: 'Curriculum progress & streak analytics' },
      { name: 'Adaptive Quantum Recovery', page: 'adaptive', desc: 'Recalculate missed study blocks' },
      { name: 'Curator Intelligence & Signals', page: 'insights', desc: 'Actionable academic nudges' },
      { name: 'Student Dossier & Configuration', page: 'settings', desc: 'Credentials and workspace data management' },
    ];

    pages.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) {
        items.push({
          type: 'page',
          title: p.name,
          desc: p.desc,
          page: p.page,
          icon: Compass
        });
      }
    });

    return items;
  }, [state.commandPaletteOpen, query, state.subjects, state.topics, state.examinations]);

  if (!state.commandPaletteOpen) return null;

  const handleSelect = (item: any) => {
    setActivePage(item.page);
    if (item.subjectId) {
      setSelectedSubjectId(item.subjectId);
    }
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#180D20]/65 backdrop-blur-md transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Palette Container */}
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#24152F]/15 shadow-2xl p-4 z-10 overflow-hidden text-[#24152F]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#24152F]/8 pb-3 px-2">
          <Search className="w-5 h-5 text-[#3548D4] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search subjects, topics, exams, or jump to any module..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#24152F] placeholder-[#9887A4] focus:outline-none text-base font-sans font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#9887A4] hover:text-[#24152F] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-[#6C5A7A] bg-[#F6F0E6] rounded border border-[#DDD5C5] ml-2">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="mt-3 max-h-80 overflow-y-auto space-y-1 pr-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-[#6C5A7A]">
              <p className="text-sm">No academic matches found for "{query}".</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon || Compass;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F6F0E6]/80 border border-transparent hover:border-[#3548D4]/25 text-left transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#3548D4]/10 border border-[#3548D4]/20 flex items-center justify-center text-[#3548D4] group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#24152F] truncate group-hover:text-[#3548D4]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#6C5A7A] truncate mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#9887A4] group-hover:text-[#3548D4] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-3 border-t border-[#24152F]/8 flex items-center justify-between text-[11px] text-[#6C5A7A] font-mono px-2">
          <span className="font-bold text-[#3548D4]">PRISMATIC ATELIER // QUICKJUMP</span>
          <div className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
