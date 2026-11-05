import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Send, 
  Star, 
  Sparkles, 
  Compass, 
  Check,
  Info
} from 'lucide-react';
import { Project, CitizenFeedback } from '../types';
import { TALUKAS_LIST } from '../data/sampleProjects';
import { formatDate, getStatusBadgeProps } from '../utils/formatters';

interface CitizenPortalViewProps {
  projects: Project[];
  feedbackList: CitizenFeedback[];
  onSubmitFeedback: (feedback: CitizenFeedback) => void;
  onNavigateTab: (tab: any) => void;
  onSelectProject: (project: Project) => void;
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({
  projects,
  feedbackList,
  onSubmitFeedback,
  onNavigateTab,
  onSelectProject
}) => {
  const [searchVillage, setSearchVillage] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState('All Talukas');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Ongoing' | 'Completed'>('ALL');

  // Feedback Form State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProjectForFeedback, setSelectedProjectForFeedback] = useState<Project | null>(null);
  const [citizenName, setCitizenName] = useState('');
  const [citizenContact, setCitizenContact] = useState('');
  const [feedbackType, setFeedbackType] = useState<any>('Appreciation');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Filter projects for citizen public display
  const publicProjects = projects.filter(p => {
    // Only show active, in progress, or completed (hide internal drafts/cancelled)
    if (p.status === 'Cancelled') return false;

    const matchesVillage = !searchVillage.trim() || 
      p.village.toLowerCase().includes(searchVillage.toLowerCase().trim()) ||
      p.projectName.toLowerCase().includes(searchVillage.toLowerCase().trim());

    const matchesTaluka = selectedTaluka === 'All Talukas' || p.taluka === selectedTaluka;

    if (activeFilter === 'Ongoing') {
      return matchesVillage && matchesTaluka && (p.status === 'In Progress' || p.status === 'Approved');
    }
    if (activeFilter === 'Completed') {
      return matchesVillage && matchesTaluka && p.status === 'Completed';
    }
    return matchesVillage && matchesTaluka;
  });

  const handleOpenFeedback = (project: Project) => {
    setSelectedProjectForFeedback(project);
    setShowFeedbackModal(true);
    setFeedbackSubmitted(false);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForFeedback || !citizenName || !comment) return;

    const newFeedback: CitizenFeedback = {
      id: `FB-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      projectId: selectedProjectForFeedback.id,
      projectName: selectedProjectForFeedback.projectName,
      citizenName,
      citizenContact: citizenContact || 'Anonymous',
      village: selectedProjectForFeedback.village,
      feedbackType,
      rating,
      comment,
      submittedAt: new Date().toISOString(),
      status: 'New'
    };

    onSubmitFeedback(newFeedback);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setCitizenName('');
      setCitizenContact('');
      setComment('');
      setFeedbackSubmitted(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Citizen Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-500/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 font-black tracking-wide">
              PUBLIC TRANSPARENCY PORTAL
            </span>
            <span className="text-xs text-teal-300 font-semibold">ગુજરાત વિકાસ પોર્ટલ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bharuch Citizen Project Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Track developmental works in your village, verify government execution progress, report duplicate works, and share ground-level feedback directly with District Administration.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('map')}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-900/40 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Bharuch Map</span>
        </button>
      </div>

      {/* Citizen Search & Village Filter Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchVillage}
            onChange={e => setSearchVillage(e.target.value)}
            placeholder="Type your Village or Locality (e.g. Vagra, Piraman, Suklatirth, Kavi)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedTaluka}
            onChange={e => setSelectedTaluka(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
          >
            {TALUKAS_LIST.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center justify-end gap-1.5">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeFilter === 'ALL' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Works
          </button>
          <button
            onClick={() => setActiveFilter('Ongoing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeFilter === 'Ongoing' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveFilter('Completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeFilter === 'Completed' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Projects Grid for Citizens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicProjects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
            <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm">No developmental works found for the selected village.</p>
            <button
              onClick={() => { setSearchVillage(''); setSelectedTaluka('All Talukas'); }}
              className="mt-2 text-xs text-teal-400 hover:underline cursor-pointer"
            >
              Show all works in Bharuch
            </button>
          </div>
        ) : (
          publicProjects.map(project => {
            const statusProps = getStatusBadgeProps(project.status);
            return (
              <div 
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span>{project.village}, {project.taluka}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusProps.bg} ${statusProps.text} ${statusProps.border}`}>
                      {project.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white line-clamp-2 mb-2 leading-snug">
                    {project.projectName}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {project.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Executing Agency:</span>
                      <span className="font-medium text-slate-200">{project.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Scheme:</span>
                      <span className="font-medium text-slate-300 truncate max-w-[170px]">{project.scheme}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Target Date:</span>
                      <span className="font-semibold text-teal-300">{formatDate(project.expectedCompletionDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="text-xs text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
                  >
                    View Details →
                  </button>

                  <button
                    onClick={() => handleOpenFeedback(project)}
                    className="px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Citizen Feedback</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Citizen Feedbacks Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Citizen Ground Reality & Quality Reports</h3>
          </div>
          <span className="text-xs text-slate-400">Public Grievance Redressal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {feedbackList.map(item => (
            <div key={item.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{item.citizenName} ({item.village})</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.feedbackType === 'Duplicate Work Report' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  item.feedbackType === 'Appreciation' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {item.feedbackType}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed italic">"{item.comment}"</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700">
                <span>Ref: {item.projectName}</span>
                <span className="text-teal-400 font-semibold">Status: {item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Feedback Modal */}
      {showFeedbackModal && selectedProjectForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Submit Citizen Quality or Duplicate Report</h3>
            <p className="text-xs text-slate-300">
              For: <strong className="text-teal-300">{selectedProjectForFeedback.projectName}</strong> ({selectedProjectForFeedback.village})
            </p>

            {feedbackSubmitted ? (
              <div className="p-6 text-center text-emerald-300 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="font-bold text-base text-white">Feedback Submitted!</h4>
                <p className="text-xs text-slate-300">
                  Your ground report has been recorded and routed to the District Development Office Bharuch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Your Full Name *</label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={e => setCitizenName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Contact Phone (Optional)</label>
                    <input
                      type="text"
                      value={citizenContact}
                      onChange={e => setCitizenContact(e.target.value)}
                      placeholder="e.g. 98250 12345"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Nature of Feedback / Report *</label>
                  <select
                    value={feedbackType}
                    onChange={e => setFeedbackType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Duplicate Work Report">Duplicate Work Report (Another department doing same work!)</option>
                    <option value="Appreciation">Appreciation (Good work completed)</option>
                    <option value="Poor Quality">Work Quality Concern / Inspection Request</option>
                    <option value="Delayed Work">Work Stalled / Delayed Progress</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Work Quality Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">{rating} out of 5 stars</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Your Comments / Details *</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe ground reality, road condition, or why this work overlaps with another scheme..."
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
