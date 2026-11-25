import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Trash2,
  Check,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Modal } from '../components/common/Modal';

export const ProfileSettings: React.FC = () => {
  const { state, updateProfile, resetToDemoData, clearAllData } = useAppStore();
  const { profile } = state;

  const [formData, setFormData] = useState(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetConfirm = () => {
    resetToDemoData();
    setIsResetConfirmOpen(false);
    setFormData(state.profile);
    window.location.reload();
  };

  const handleClearConfirm = () => {
    clearAllData();
    setIsClearConfirmOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl pb-12">
      {/* 1. TOP DOSSIER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-[#3548D4] tracking-widest uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-[#D6EF72] animate-pulse" />
            <span>STUDENT DOSSIER // CREDENTIAL PROFILE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#24152F]">Academic Dossier & Settings</h2>
          <p className="text-xs text-[#6C5A7A] mt-0.5">
            Manage your academic credentials, cognitive rhythm preferences, and workspace storage.
          </p>
        </div>
      </div>

      {/* 2. PROFILE FORM */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-[#24152F] font-heading pb-3 border-b border-[#24152F]/8 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#3548D4]" />
          <span>Student Credentials & Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Academic Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">University / Institution</label>
            <input
              type="text"
              value={formData.university}
              onChange={e => setFormData({ ...formData, university: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Degree & Major</label>
            <input
              type="text"
              value={formData.degree}
              onChange={e => setFormData({ ...formData, degree: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Academic Year</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Current Semester</label>
            <input
              type="text"
              value={formData.semester}
              onChange={e => setFormData({ ...formData, semester: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>
        </div>

        {/* Study Rhythm Defaults */}
        <h3 className="text-base font-bold text-[#24152F] font-heading pt-4 pb-3 border-b border-[#24152F]/8">
          Workload Cadence Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">
              Target Daily Hours ({formData.targetDailyHours}h)
            </label>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={formData.targetDailyHours}
              onChange={e => setFormData({ ...formData, targetDailyHours: parseFloat(e.target.value) })}
              className="w-full accent-[#3548D4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">
              Preferred Focus Quantum ({formData.preferredSessionMinutes} mins)
            </label>
            <select
              value={formData.preferredSessionMinutes}
              onChange={e => setFormData({ ...formData, preferredSessionMinutes: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-bold"
            >
              <option value="45">45 Minutes (Sprint Focus)</option>
              <option value="60">60 Minutes (Standard Hour)</option>
              <option value="90">90 Minutes (Deep Work Optimal)</option>
              <option value="120">120 Minutes (Marathon Block)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-[#D6EF72]" /> : <Save className="w-4 h-4 text-[#D6EF72]" />}
            <span>{savedSuccess ? 'Dossier Updated!' : 'Save Credentials'}</span>
          </button>
        </div>
      </form>

      {/* 3. SYSTEM ENGINE NOTICE */}
      <div className="p-6 rounded-3xl bg-white border border-[#3548D4]/20 flex items-start gap-3.5 shadow-2xs">
        <Cpu className="w-6 h-6 text-[#3548D4] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-[#24152F] uppercase font-mono tracking-wider">
            Deterministic Rule-Based Intelligence Core
          </h4>
          <p className="text-xs text-[#6C5A7A] leading-relaxed">
            StudyWise AI is currently driven by an honest, explainable heuristic scheduling engine that aligns exams, availability constraints, and syllabus weights mathematically. The codebase architecture is modular and fully prepared for plug-and-play LLM backend API endpoints.
          </p>
        </div>
      </div>

      {/* 4. DATA MANAGEMENT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-[#24152F] font-heading">Data Management & Reset</h3>
        <p className="text-xs text-[#6C5A7A]">
          Reset to realistic Stanford CS curriculum sample data or clear all local browser storage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F6F0E6]/80 hover:bg-[#EAE4D7] border border-[#24152F]/12 text-[#3548D4] text-xs font-bold flex items-center gap-2 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Realistic College Demo Data</span>
          </button>

          <button
            type="button"
            onClick={() => setIsClearConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FF784F]/10 hover:bg-[#FF784F]/20 border border-[#FF784F]/25 text-[#D4471B] text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Saved Data</span>
          </button>
        </div>
      </div>

      {/* CONFIRM RESET MODAL */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset to Realistic Demo Data?"
        subtitle="This will restore all 5 subjects, topics, exams, and schedule sessions"
      >
        <div className="space-y-4 text-xs text-[#6C5A7A]">
          <p>
            This action will restore the full sample state: 5 computer science courses, topics with priorities, upcoming exams, and schedule sessions including intentionally missed sessions to test the Adaptive Planner.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#24152F]/8">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#EAE4D7] text-[#6C5A7A] hover:bg-[#DDD5C5] text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleResetConfirm}
              className="px-5 py-2 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold shadow-md shadow-[#3548D4]/25"
            >
              Yes, Reset Data
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRM CLEAR MODAL */}
      <Modal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        title="Clear All Academic Data?"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4 text-xs text-[#6C5A7A]">
          <p>
            Are you sure you want to clear all subjects, topics, examinations, and calendar sessions?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#24152F]/8">
            <button
              onClick={() => setIsClearConfirmOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#EAE4D7] text-[#6C5A7A] hover:bg-[#DDD5C5] text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleClearConfirm}
              className="px-5 py-2 rounded-xl bg-[#FF784F] hover:bg-[#E05E35] text-white text-xs font-bold"
            >
              Confirm Clear All
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
