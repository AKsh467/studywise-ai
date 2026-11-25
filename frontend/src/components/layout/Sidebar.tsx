import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  Sparkles,
  Calendar,
  TrendingUp,
  RefreshCw,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'acid' | 'tangerine' | 'orchid';
}

export const Sidebar: React.FC = () => {
  const { state, setActivePage, toggleSidebar } = useAppStore();
  const { isSidebarCollapsed, activePage, sessions, profile } = state;

  const missedCount = sessions.filter(s => s.status === 'missed').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'academics', label: 'My Academics', icon: BookOpen },
    { id: 'availability', label: 'Study Availability', icon: Clock },
    { id: 'planner', label: 'AI Study Planner', icon: Sparkles, badge: 'ATELIER AI', badgeType: 'acid' },
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
    {
      id: 'adaptive',
      label: 'Adaptive Planner',
      icon: RefreshCw,
      badge: missedCount > 0 ? `${missedCount} Missed` : undefined,
      badgeType: 'tangerine'
    },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#180D20] text-[#F6F0E6] border-r border-[#382448]/70 flex flex-col transition-all duration-300 ease-in-out shadow-2xl shadow-[#180D20]/50 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[#382448]/60 relative">
        {/* Holographic light accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#A66CFF]/40 to-transparent" />

        <div
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          {/* Prismatic Atelier Emblem */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3548D4] via-[#A66CFF] to-[#D6EF72] p-[1.5px] shrink-0 shadow-lg shadow-[#3548D4]/30 group-hover:shadow-[#A66CFF]/50 transition-all duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#1A0D23] rounded-[14px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#D6EF72] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg text-white tracking-tight">StudyWise</span>
                <span className="px-1.5 py-0.2 rounded bg-[#D6EF72] text-[#1A0D23] text-[9px] font-mono font-extrabold tracking-wider">ATELIER</span>
              </div>
              <span className="text-[10px] text-[#A66CFF] font-mono uppercase tracking-widest">Prismatic v3.0</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex w-7 h-7 rounded-xl bg-[#261633] border border-[#3E294E] text-[#B0A1BE] hover:text-white hover:bg-[#382349] hover:border-[#A66CFF]/40 items-center justify-center transition-all"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {navItems.map(item => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-[#3548D4]/35 to-[#A66CFF]/20 text-white font-semibold border border-[#A66CFF]/40 shadow-sm shadow-[#3548D4]/25'
                  : 'text-[#B8A8C8] hover:text-white hover:bg-[#281836] border border-transparent'
              }`}
            >
              {/* Active holographic indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#D6EF72] shadow-[0_0_8px_#D6EF72]" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#D6EF72]' : 'text-[#8E7C9E] group-hover:text-[#F6F0E6]'
                }`}
              />

              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate tracking-wide">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold tracking-wider ml-1.5 shrink-0 ${
                        item.badgeType === 'acid'
                          ? 'bg-[#D6EF72] text-[#180D20]'
                          : item.badgeType === 'tangerine'
                          ? 'bg-[#FF784F] text-white animate-pulse'
                          : 'bg-[#A66CFF]/30 text-[#D9D5E8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Atelier Student Passport Card at Bottom */}
      <div className="p-3 border-t border-[#382448]/60">
        {!isSidebarCollapsed ? (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#261533] to-[#1C0E28] border border-[#3E294E] flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3548D4] to-[#A66CFF] flex items-center justify-center font-display font-bold text-white text-xs shrink-0 shadow-xs">
                {profile.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
                <p className="text-[10px] text-[#A66CFF] font-mono truncate">{profile.degree || 'B.Tech CS'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#3548D4]/30 border border-[#3548D4]/40 text-[#D6EF72] text-[10px] font-mono font-bold shrink-0">
              <Flame className="w-3 h-3 text-[#FF784F] fill-[#FF784F]" />
              <span>{profile.streakDays}d</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3548D4] to-[#A66CFF] flex items-center justify-center font-display font-bold text-white text-xs shadow-xs">
              {profile.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
