import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';

import { Dashboard } from './pages/Dashboard';
import { Academics } from './pages/Academics';
import { StudyAvailability } from './pages/StudyAvailability';
import { StudyPlanner } from './pages/StudyPlanner';
import { Schedule } from './pages/Schedule';
import { ProgressTracker } from './pages/ProgressTracker';
import { AdaptivePlanner } from './pages/AdaptivePlanner';
import { AIInsights } from './pages/AIInsights';
import { ProfileSettings } from './pages/ProfileSettings';

export function App() {
  const { state } = useAppStore();
  const { activePage, isSidebarCollapsed } = state;

  const renderActivePage = () => {
    switch (activePage) {
      case 'academics':
        return <Academics />;
      case 'availability':
        return <StudyAvailability />;
      case 'planner':
        return <StudyPlanner />;
      case 'schedule':
        return <Schedule />;
      case 'progress':
        return <ProgressTracker />;
      case 'adaptive':
        return <AdaptivePlanner />;
      case 'insights':
        return <AIInsights />;
      case 'settings':
        return <ProfileSettings />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#24152F] flex relative overflow-x-hidden selection:bg-[#D6EF72] selection:text-[#180D20]">
      {/* Background ambient lighting and subtle halftone texture */}
      <div className="fixed inset-0 bg-halftone-pattern pointer-events-none opacity-40 z-0" />
      <div className="atelier-bloom-ultramarine top-[-100px] left-[-100px]" />
      <div className="atelier-bloom-acid top-[35%] right-[-150px]" />
      <div className="atelier-bloom-tangerine bottom-[-150px] left-[15%]" />

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Application Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative z-10 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-16">
          <div key={activePage} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
