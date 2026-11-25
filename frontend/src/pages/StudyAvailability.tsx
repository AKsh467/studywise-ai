import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Save,
  Calendar
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { DayOfWeek, TimeSlot, StudyAvailabilityConfig } from '../types';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const StudyAvailability: React.FC = () => {
  const { state, updateAvailability } = useAppStore();
  const { availability } = state;

  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');
  const [config, setConfig] = useState<StudyAvailabilityConfig>(availability);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New slot inputs
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:30');
  const [newSlotLabel, setNewSlotLabel] = useState('Deep Work Block');

  // Calculate total weekly capacity
  const calculateTotalWeeklyHours = () => {
    let totalMinutes = 0;
    DAYS.forEach(day => {
      const dayData = config.weeklySlots[day];
      if (dayData && dayData.isEnabled) {
        dayData.slots.forEach(slot => {
          const [sh, sm] = slot.startTime.split(':').map(Number);
          const [eh, em] = slot.endTime.split(':').map(Number);
          const diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
          if (diffMinutes > 0) totalMinutes += diffMinutes;
        });
      }
    });
    return (totalMinutes / 60).toFixed(1);
  };

  // Toggle Day Enable/Disable
  const handleToggleDay = (day: DayOfWeek) => {
    setConfig(prev => ({
      ...prev,
      weeklySlots: {
        ...prev.weeklySlots,
        [day]: {
          ...prev.weeklySlots[day],
          isEnabled: !prev.weeklySlots[day].isEnabled
        }
      }
    }));
  };

  // Add slot to current day
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimeSlot = {
      id: `slot-${activeDay.toLowerCase()}-${Date.now()}`,
      startTime: newStartTime,
      endTime: newEndTime,
      label: newSlotLabel || 'Study Slot'
    };

    setConfig(prev => ({
      ...prev,
      weeklySlots: {
        ...prev.weeklySlots,
        [activeDay]: {
          ...prev.weeklySlots[activeDay],
          slots: [...prev.weeklySlots[activeDay].slots, newSlot]
        }
      }
    }));
  };

  // Delete slot from day
  const handleDeleteSlot = (day: DayOfWeek, slotId: string) => {
    setConfig(prev => ({
      ...prev,
      weeklySlots: {
        ...prev.weeklySlots,
        [day]: {
          ...prev.weeklySlots[day],
          slots: prev.weeklySlots[day].slots.filter(s => s.id !== slotId)
        }
      }
    }));
  };

  // Preset Configurations
  const applyPreset = (presetType: 'morning' | 'evening' | 'balanced') => {
    const updatedWeekly = { ...config.weeklySlots };

    DAYS.forEach(day => {
      if (presetType === 'morning') {
        updatedWeekly[day] = {
          day,
          isEnabled: true,
          slots: [
            { id: `slot-${day}-m1`, startTime: '08:00', endTime: '09:30', label: 'Morning Deep Focus' },
            { id: `slot-${day}-m2`, startTime: '10:00', endTime: '11:30', label: 'Revision Sprint' }
          ]
        };
      } else if (presetType === 'evening') {
        updatedWeekly[day] = {
          day,
          isEnabled: true,
          slots: [
            { id: `slot-${day}-e1`, startTime: '18:00', endTime: '19:30', label: 'Evening Study' },
            { id: `slot-${day}-e2`, startTime: '20:00', endTime: '21:30', label: 'Night Recall' }
          ]
        };
      } else {
        // Balanced
        updatedWeekly[day] = {
          day,
          isEnabled: true,
          slots: [
            { id: `slot-${day}-b1`, startTime: '09:30', endTime: '11:00', label: 'Morning Block' },
            { id: `slot-${day}-b2`, startTime: '15:00', endTime: '16:30', label: 'Afternoon Focus' },
            { id: `slot-${day}-b3`, startTime: '19:30', endTime: '21:00', label: 'Evening Review' }
          ]
        };
      }
    });

    setConfig(prev => ({
      ...prev,
      weeklySlots: updatedWeekly
    }));
  };

  // Save changes to global store
  const handleSave = () => {
    updateAvailability(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-[#3548D4] tracking-widest uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-[#D6EF72] animate-pulse" />
            <span>TIME-SPACE MATRIX // CADENCE CONFIG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#24152F]">Study Availability & Focus Matrix</h2>
          <p className="text-xs text-[#6C5A7A] mt-1 max-w-xl">
            Configure your recurring focus horizons. The AI Study Planner synthesizes sessions strictly within these cognitive energy bounds.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3548D4] to-[#7030D6] hover:brightness-110 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-[#D6EF72]" /> : <Save className="w-4 h-4 text-[#D6EF72]" />}
          <span>{saveSuccess ? 'Parameters Synchronized!' : 'Save Matrix'}</span>
        </button>
      </div>

      {/* 2. THREE ARCHITECTURAL METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Capacity Monolith */}
        <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#3548D4]/10 border border-[#3548D4]/25 flex items-center justify-center text-[#3548D4] shrink-0 shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Weekly Study Capacity</p>
            <p className="text-3xl font-extrabold text-[#24152F] font-display">{calculateTotalWeeklyHours()} hrs</p>
            <p className="text-[11px] text-[#3548D4] font-semibold">Across active cadence days</p>
          </div>
        </div>

        {/* Card 2: Daily Workload Cap */}
        <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Max Daily Cap</span>
            <span className="text-xs font-extrabold text-[#24152F] font-mono bg-[#D6EF72] px-2 py-0.5 rounded text-[#1D2506]">
              {config.maxDailyHours} hrs / day
            </span>
          </div>
          <input
            type="range"
            min="1.5"
            max="8.0"
            step="0.5"
            value={config.maxDailyHours}
            onChange={e => setConfig({ ...config, maxDailyHours: parseFloat(e.target.value) })}
            className="w-full accent-[#3548D4] cursor-pointer"
          />
          <p className="text-[11px] text-[#6C5A7A]">Prevents cognitive fatigue and retention degradation</p>
        </div>

        {/* Card 3: Session Duration Quantum */}
        <div className="p-6 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6C5A7A] uppercase font-bold">Focus Quantum</span>
            <span className="text-xs font-bold text-[#3548D4] font-mono">{config.preferredDurationMinutes} mins</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[45, 60, 90, 120].map(mins => (
              <button
                key={mins}
                onClick={() => setConfig({ ...config, preferredDurationMinutes: mins })}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                  config.preferredDurationMinutes === mins
                    ? 'bg-[#3548D4] text-white border-[#3548D4] shadow-xs'
                    : 'bg-[#F6F0E6]/60 text-[#6C5A7A] border-[#24152F]/10 hover:text-[#24152F]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#6C5A7A]">Optimal Pomodoro block for long-term encoding</p>
        </div>
      </div>

      {/* 3. PRESETS BAR */}
      <div className="p-4 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3548D4]" />
          <span className="text-xs font-bold text-[#24152F]">Apply Schedule Archetype:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('morning')}
            className="px-3.5 py-1.5 rounded-xl bg-[#F6F0E6]/80 border border-[#24152F]/12 text-[#24152F] hover:border-[#3548D4] text-xs font-bold transition-colors shadow-2xs"
          >
            Early Dawn (8 AM - 12 PM)
          </button>
          <button
            onClick={() => applyPreset('evening')}
            className="px-3.5 py-1.5 rounded-xl bg-[#F6F0E6]/80 border border-[#24152F]/12 text-[#24152F] hover:border-[#3548D4] text-xs font-bold transition-colors shadow-2xs"
          >
            Twilight Focus (6 PM - 10 PM)
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-3.5 py-1.5 rounded-xl bg-[#F6F0E6]/80 border border-[#24152F]/12 text-[#24152F] hover:border-[#3548D4] text-xs font-bold transition-colors shadow-2xs"
          >
            Triple Interval Balanced
          </button>
        </div>
      </div>

      {/* 4. INTERACTIVE 7-DAY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Day Selector Tabs (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-mono uppercase text-[#6C5A7A] mb-2 font-bold tracking-wider flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#3548D4]" />
            <span>Weekly Schedule Matrix</span>
          </h3>

          <div className="space-y-2">
            {DAYS.map(day => {
              const dayData = config.weeklySlots[day];
              const isSelected = activeDay === day;
              const slotCount = dayData?.slots.length || 0;

              return (
                <div
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-[#3548D4] shadow-md shadow-[#3548D4]/12 ring-2 ring-[#3548D4]/20'
                      : 'bg-white/80 border-[#24152F]/8 hover:border-[#24152F]/20 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleDay(day);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors border ${
                        dayData?.isEnabled
                          ? 'bg-[#9DE2CB]/30 text-[#12684F] border-[#9DE2CB]/60'
                          : 'bg-[#EAE4D7] text-[#9887A4] border-[#DDD5C5]'
                      }`}
                      title={dayData?.isEnabled ? "Pause day" : "Enable day"}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <span className={`text-sm font-bold ${dayData?.isEnabled ? 'text-[#24152F]' : 'text-[#9887A4] line-through'}`}>
                        {day}
                      </span>
                      <p className="text-[11px] text-[#6C5A7A] font-mono">
                        {dayData?.isEnabled ? `${slotCount} active slot${slotCount === 1 ? '' : 's'}` : 'Cadence paused'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-[#3548D4] font-bold">
                    {isSelected ? 'Active' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Slots & Add Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#24152F]/8">
              <div>
                <h4 className="text-xl font-bold text-[#24152F] font-heading">{activeDay} Focus Intervals</h4>
                <p className="text-xs text-[#6C5A7A] mt-0.5">
                  Define when you are available to study on {activeDay}s.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6C5A7A] font-medium">Day Cadence:</span>
                <button
                  onClick={() => handleToggleDay(activeDay)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                    config.weeklySlots[activeDay]?.isEnabled
                      ? 'bg-[#9DE2CB]/30 text-[#12684F] border-[#9DE2CB]/60'
                      : 'bg-[#FF784F]/15 text-[#D4471B] border-[#FF784F]/35'
                  }`}
                >
                  {config.weeklySlots[activeDay]?.isEnabled ? 'ENABLED' : 'PAUSED'}
                </button>
              </div>
            </div>

            {/* List of current slots */}
            <div className="space-y-3">
              {config.weeklySlots[activeDay]?.slots.length === 0 ? (
                <div className="py-8 text-center text-[#6C5A7A]">
                  <Clock className="w-8 h-8 text-[#9887A4] mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No time slots allocated for {activeDay}. Add one below.</p>
                </div>
              ) : (
                config.weeklySlots[activeDay]?.slots.map(slot => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-2xl bg-[#F6F0E6]/50 border border-[#24152F]/8 flex items-center justify-between group hover:border-[#3548D4]/30 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#3548D4]/10 border border-[#3548D4]/20 flex items-center justify-center text-[#3548D4]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold font-mono text-[#24152F]">
                          {slot.startTime} — {slot.endTime}
                        </span>
                        <p className="text-xs text-[#6C5A7A]">{slot.label || 'Study Block'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSlot(activeDay, slot.id)}
                      className="p-2 text-[#9887A4] hover:text-[#FF784F] transition-colors"
                      title="Remove time block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New Time Slot Form */}
            <form onSubmit={handleAddSlot} className="pt-4 border-t border-[#24152F]/8 space-y-3">
              <h5 className="text-xs font-bold text-[#24152F] font-heading uppercase tracking-wider">
                Add Study Block to {activeDay}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6C5A7A] mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-xs font-mono focus:border-[#3548D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6C5A7A] mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-xs font-mono focus:border-[#3548D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6C5A7A] mb-1">Block Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Afternoon Focus"
                    value={newSlotLabel}
                    onChange={e => setNewSlotLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-xs focus:border-[#3548D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#3548D4]/20"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D6EF72]" />
                  <span>Add Focus Interval</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
