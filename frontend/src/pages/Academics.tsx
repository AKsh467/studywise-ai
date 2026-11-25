import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Search,
  GraduationCap,
  Layers
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SubjectTotem3D } from '../components/3d/SubjectTotem3D';
import { PriorityBadge, Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Subject, Topic, Examination, Priority, ExamPriority } from '../types';

export const Academics: React.FC = () => {
  const {
    state,
    addSubject,
    deleteSubject,
    addTopic,
    deleteTopic,
    toggleTopicCompletion,
    addExam,
    deleteExam
  } = useAppStore();

  const { subjects, topics, examinations, profile, selectedSubjectId } = state;

  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    selectedSubjectId || (subjects.length > 0 ? subjects[0].id : '')
  );
  const [searchTopicQuery, setSearchTopicQuery] = useState('');

  // Modals state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);

  // Form states
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#3548D4');
  const [newSubPriority, setNewSubPriority] = useState<Priority>('high');
  const [newSubExamDate, setNewSubExamDate] = useState('');

  const [newTopName, setNewTopName] = useState('');
  const [newTopDesc, setNewTopDesc] = useState('');
  const [newTopPriority, setNewTopPriority] = useState<Priority>('high');
  const [newTopHours, setNewTopHours] = useState('2.5');

  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamTime, setNewExamTime] = useState('10:00 AM');
  const [newExamVenue, setNewExamVenue] = useState('Hall A');
  const [newExamPriority, setNewExamPriority] = useState<ExamPriority>('high');
  const [newExamScore, setNewExamScore] = useState('90');

  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];
  const activeSubjectTopics = topics.filter(t => t.subjectId === activeSubject?.id);
  const filteredTopics = activeSubjectTopics.filter(t =>
    t.name.toLowerCase().includes(searchTopicQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTopicQuery.toLowerCase())
  );

  const completedTopicsCount = activeSubjectTopics.filter(t => t.isCompleted).length;
  const subjectProgress = activeSubjectTopics.length > 0
    ? Math.round((completedTopicsCount / activeSubjectTopics.length) * 100)
    : 0;

  // Add Subject Submit
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      code: newSubCode.toUpperCase(),
      name: newSubName,
      color: newSubColor,
      accentGlow: `${newSubColor}25`,
      priority: newSubPriority,
      examDate: newSubExamDate || undefined
    };

    addSubject(newSub);
    setActiveSubjectId(newSub.id);
    setIsAddSubjectOpen(false);
    setNewSubCode('');
    setNewSubName('');
  };

  // Add Topic Submit
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopName.trim() || !activeSubject) return;

    const newTop: Topic = {
      id: `top-${Date.now()}`,
      subjectId: activeSubject.id,
      name: newTopName,
      description: newTopDesc || 'Essential syllabus concept.',
      priority: newTopPriority,
      estimatedHours: parseFloat(newTopHours) || 2.0,
      isCompleted: false
    };

    addTopic(newTop);
    setIsAddTopicOpen(false);
    setNewTopName('');
    setNewTopDesc('');
  };

  // Add Examination Submit
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !activeSubject) return;

    const newEx: Examination = {
      id: `exam-${Date.now()}`,
      subjectId: activeSubject.id,
      title: newExamTitle,
      date: newExamDate || new Date().toISOString().split('T')[0],
      time: newExamTime,
      venue: newExamVenue,
      priority: newExamPriority,
      targetScore: parseInt(newExamScore) || 90
    };

    addExam(newEx);
    setIsAddExamOpen(false);
    setNewExamTitle('');
  };

  const subjectExams = examinations.filter(e => e.subjectId === activeSubject?.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. TOP CURATOR ATLAS BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#3548D4]/10 border border-[#3548D4]/25 flex items-center justify-center text-[#3548D4] shadow-xs">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#A66CFF] tracking-wider">CURRICULUM ATLAS</span>
              <span className="text-xs text-[#24152F]/30">•</span>
              <Badge variant="acid" size="sm">{profile.semester}</Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#24152F] font-heading">{profile.degree}</h2>
            <p className="text-xs text-[#6C5A7A] mt-0.5">
              {profile.university} • Academic Year {profile.academicYear} • <strong className="text-[#3548D4]">{subjects.length} Active Courses Registered</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddSubjectOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#3548D4] to-[#7030D6] hover:brightness-110 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#3548D4]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-[#D6EF72]" />
          <span>Register Course Specimen</span>
        </button>
      </div>

      {/* 2. MAIN ATLAS TAXONOMY LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Course Specimen Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#6C5A7A] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#3548D4]" />
              <span>Cataloged Subjects ({subjects.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {subjects.map(sub => {
              const subTopics = topics.filter(t => t.subjectId === sub.id);
              const subCompleted = subTopics.filter(t => t.isCompleted).length;
              const percent = subTopics.length > 0 ? Math.round((subCompleted / subTopics.length) * 100) : 0;
              const isSelected = sub.id === activeSubjectId;

              return (
                <div
                  key={sub.id}
                  onClick={() => setActiveSubjectId(sub.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white border-[#3548D4] shadow-md shadow-[#3548D4]/12 ring-2 ring-[#3548D4]/20'
                      : 'bg-white/80 border-[#24152F]/8 hover:border-[#24152F]/20 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
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
                        <PriorityBadge priority={sub.priority} />
                      </div>
                      <h4 className="text-sm font-bold text-[#24152F] truncate">{sub.name}</h4>
                    </div>

                    <div className="text-right pl-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-[#3548D4]">{percent}%</span>
                      <span className="text-[10px] text-[#6C5A7A] block font-medium font-mono">{subCompleted}/{subTopics.length}</span>
                    </div>
                  </div>

                  {/* Syllabus progress bar */}
                  <div className="w-full bg-[#EAE4D7] rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Specimen Detail Dossier, 3D Totem & Topics (8 cols) */}
        {activeSubject && (
          <div className="lg:col-span-8 space-y-6">
            {/* Subject Hero Header with 3D Totem */}
            <div className="holographic-frame-dark">
              <div className="rounded-[calc(1.75rem-1.5px)] bg-gradient-to-br from-[#24152F] via-[#1A0D23] to-[#120718] p-6 sm:p-8 relative overflow-hidden text-white shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase border bg-white/10 border-white/20 text-[#D6EF72]"
                      >
                        {activeSubject.code}
                      </span>
                      <PriorityBadge priority={activeSubject.priority} />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{activeSubject.name}</h3>

                    <div className="flex items-center gap-3 text-xs text-[#D9D5E8] pt-1 font-mono">
                      <span><strong className="text-white">{activeSubjectTopics.length}</strong> Topics</span>
                      <span>•</span>
                      <span><strong className="text-[#D6EF72]">{completedTopicsCount}</strong> Mastered</span>
                      <span>•</span>
                      <span className="text-[#9DE2CB] font-bold">{subjectProgress}% Syllabus Progress</span>
                    </div>

                    <div className="flex items-center gap-2.5 pt-3 flex-wrap">
                      <button
                        onClick={() => setIsAddTopicOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#3548D4]/30"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#D6EF72]" />
                        <span>Add Topic</span>
                      </button>
                      <button
                        onClick={() => setIsAddExamOpen(true)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#A66CFF]" />
                        <span>Schedule Exam</span>
                      </button>
                      <button
                        onClick={() => deleteSubject(activeSubject.id)}
                        className="p-2 rounded-xl text-[#9887A4] hover:text-[#FF784F] hover:bg-white/10 transition-colors ml-auto"
                        title="Delete subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 3D Totem */}
                  <div className="md:col-span-4 h-52 flex items-center justify-center">
                    <SubjectTotem3D color={activeSubject.color} />
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Examination Milestones */}
            {subjectExams.length > 0 && (
              <div className="p-5 rounded-3xl bg-white border border-[#24152F]/10 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF784F]" />
                    <h4 className="text-sm font-bold text-[#24152F] font-heading">Course Examination Milestones</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjectExams.map(ex => (
                    <div key={ex.id} className="p-3.5 rounded-2xl bg-[#F6F0E6]/50 border border-[#24152F]/8 flex items-start justify-between shadow-2xs">
                      <div>
                        <p className="text-xs font-bold text-[#24152F]">{ex.title}</p>
                        <p className="text-[11px] font-mono text-[#6C5A7A] mt-1">
                          {ex.date} at {ex.time} ({ex.venue})
                        </p>
                        <p className="text-[10px] text-[#FF784F] font-bold mt-0.5">Target Score: {ex.targetScore}%</p>
                      </div>
                      <button
                        onClick={() => deleteExam(ex.id)}
                        className="text-[#9887A4] hover:text-[#FF784F] p-1"
                        title="Delete exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-base font-bold text-[#24152F] font-heading flex items-center gap-2">
                  <span>Syllabus Taxonomy</span>
                  <Badge variant="silver" size="sm">{activeSubjectTopics.length} Concepts</Badge>
                </h4>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9887A4] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search concepts..."
                    value={searchTopicQuery}
                    onChange={e => setSearchTopicQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#24152F]/12 text-xs text-[#24152F] placeholder-[#9887A4] focus:outline-none focus:border-[#3548D4] w-full sm:w-52 shadow-2xs"
                  />
                </div>
              </div>

              {filteredTopics.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-[#24152F]/10 text-center text-[#6C5A7A] shadow-2xs">
                  <p className="text-xs">No concepts match the search query.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredTopics.map(topic => (
                    <div
                      key={topic.id}
                      className={`p-4 rounded-2xl bg-white transition-all flex items-start justify-between gap-3 border ${
                        topic.isCompleted
                          ? 'border-[#9DE2CB]/60 bg-[#F9FDFB]'
                          : 'border-[#24152F]/10 hover:border-[#3548D4]/30 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => toggleTopicCompletion(topic.id)}
                          className="mt-0.5 text-[#9887A4] hover:text-[#12684F] transition-colors shrink-0"
                          title={topic.isCompleted ? "Mark as pending" : "Mark as completed"}
                        >
                          {topic.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#12684F] fill-[#9DE2CB]/30" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#A66CFF]" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <PriorityBadge priority={topic.priority} />
                            <span className="text-[11px] font-mono text-[#6C5A7A] flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-[#9887A4]" />
                              {topic.estimatedHours} hrs est.
                            </span>
                            {topic.isCompleted && topic.completedAt && (
                              <span className="text-[10px] font-mono text-[#12684F] font-bold">
                                Mastered on {topic.completedAt}
                              </span>
                            )}
                          </div>

                          <h5 className={`text-sm font-bold ${topic.isCompleted ? 'line-through text-[#9887A4]' : 'text-[#24152F]'}`}>
                            {topic.name}
                          </h5>
                          <p className="text-xs text-[#6C5A7A] mt-0.5">{topic.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTopic(topic.id)}
                        className="text-[#9887A4] hover:text-[#FF784F] p-1.5 transition-colors shrink-0"
                        title="Delete topic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD SUBJECT */}
      <Modal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        title="Add Academic Subject Specimen"
        subtitle="Catalog a new course unit into your academic dossier"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Course Code</label>
            <input
              type="text"
              placeholder="e.g. CS 229, MATH 101"
              value={newSubCode}
              onChange={e => setNewSubCode(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Course Name</label>
            <input
              type="text"
              placeholder="e.g. Machine Learning & Neural Networks"
              value={newSubName}
              onChange={e => setNewSubName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Specimen Hue</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newSubColor}
                  onChange={e => setNewSubColor(e.target.value)}
                  className="w-9 h-9 rounded-xl bg-transparent cursor-pointer border border-[#24152F]/15"
                />
                <span className="text-xs font-mono text-[#24152F] font-bold">{newSubColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Priority Weight</label>
              <select
                value={newSubPriority}
                onChange={e => setNewSubPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-medium"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Upcoming Exam Date (Optional)</label>
            <input
              type="date"
              value={newSubExamDate}
              onChange={e => setNewSubExamDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#24152F]/8">
            <button
              type="button"
              onClick={() => setIsAddSubjectOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#EAE4D7] text-[#6C5A7A] text-xs font-bold hover:bg-[#DDD5C5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold shadow-md shadow-[#3548D4]/25"
            >
              Register Specimen
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD TOPIC */}
      <Modal
        isOpen={isAddTopicOpen}
        onClose={() => setIsAddTopicOpen(false)}
        title={`Add Topic to ${activeSubject?.code}`}
        subtitle="Catalog a key concept or chapter for study scheduling"
      >
        <form onSubmit={handleCreateTopic} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Concept Name</label>
            <input
              type="text"
              placeholder="e.g. Graph Algorithms & Dijkstra's Algorithm"
              value={newTopName}
              onChange={e => setNewTopName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Description / Core Axioms</label>
            <textarea
              placeholder="Summary of learning milestones or problem sets..."
              value={newTopDesc}
              onChange={e => setNewTopDesc(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={newTopHours}
                onChange={e => setNewTopHours(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Weightage Priority</label>
              <select
                value={newTopPriority}
                onChange={e => setNewTopPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-medium"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#24152F]/8">
            <button
              type="button"
              onClick={() => setIsAddTopicOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#EAE4D7] text-[#6C5A7A] text-xs font-bold hover:bg-[#DDD5C5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold shadow-md shadow-[#3548D4]/25"
            >
              Save Concept
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD EXAMINATION */}
      <Modal
        isOpen={isAddExamOpen}
        onClose={() => setIsAddExamOpen(false)}
        title="Schedule Evaluation"
        subtitle={`Schedule milestone exam for ${activeSubject?.name}`}
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Evaluation Title</label>
            <input
              type="text"
              placeholder="e.g. Midterm Examination, Final Theory Review"
              value={newExamTitle}
              onChange={e => setNewExamTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Exam Date</label>
              <input
                type="date"
                value={newExamDate}
                onChange={e => setNewExamDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Exam Time</label>
              <input
                type="text"
                placeholder="09:30 AM"
                value={newExamTime}
                onChange={e => setNewExamTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Venue</label>
              <input
                type="text"
                placeholder="e.g. Hall 101, Online"
                value={newExamVenue}
                onChange={e => setNewExamVenue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1">Target Score (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={newExamScore}
                onChange={e => setNewExamScore(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24152F] mb-1">Criticality</label>
            <select
              value={newExamPriority}
              onChange={e => setNewExamPriority(e.target.value as ExamPriority)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#24152F]/15 text-[#24152F] text-sm focus:border-[#3548D4] focus:outline-none font-medium"
            >
              <option value="critical">Critical (Midterm / Final)</option>
              <option value="high">High (Major Quiz / Lab Exam)</option>
              <option value="medium">Medium (Regular Assessment)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#24152F]/8">
            <button
              type="button"
              onClick={() => setIsAddExamOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#EAE4D7] text-[#6C5A7A] text-xs font-bold hover:bg-[#DDD5C5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#3548D4] hover:bg-[#2C3AB3] text-white text-xs font-bold shadow-md shadow-[#3548D4]/25"
            >
              Schedule Milestone
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
