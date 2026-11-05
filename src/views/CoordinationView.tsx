import React, { useState } from 'react';
import { 
  Handshake, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Send, 
  ArrowRight, 
  Filter, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import { CoordinationRequest, DepartmentInfo, Project, User } from '../types';
import { DEPARTMENTS } from '../data/sampleProjects';
import { formatDate } from '../utils/formatters';

interface CoordinationViewProps {
  coordinationRequests: CoordinationRequest[];
  onUpdateCoordinationRequest: (req: CoordinationRequest) => void;
  onAddCoordinationRequest: (req: CoordinationRequest) => void;
  projects: Project[];
  currentUser: User;
  onSelectProject: (project: Project) => void;
}

export const CoordinationView: React.FC<CoordinationViewProps> = ({
  coordinationRequests,
  onUpdateCoordinationRequest,
  onAddCoordinationRequest,
  projects,
  currentUser,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'directory'>('requests');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Pending' | 'Accepted' | 'Resolved'>('ALL');

  // New Request Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [sourceProjectId, setSourceProjectId] = useState(projects[0]?.id || '');
  const [targetProjectId, setTargetProjectId] = useState(projects[1]?.id || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [resolutionProposal, setResolutionProposal] = useState<'Merge' | 'Reschedule' | 'Re-scope' | 'Cancel Duplicate' | 'Proceed with Conditions'>('Merge');

  // Resolution Notes Modal State
  const [resolvingRequest, setResolvingRequest] = useState<CoordinationRequest | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const filteredRequests = coordinationRequests.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceP = projects.find(p => p.id === sourceProjectId);
    const targetP = projects.find(p => p.id === targetProjectId);

    if (!sourceP || !targetP) return;

    const newReq: CoordinationRequest = {
      id: `CR-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      sourceProjectId: sourceP.id,
      sourceProjectName: sourceP.projectName,
      sourceDepartment: sourceP.department,
      targetProjectId: targetP.id,
      targetProjectName: targetP.projectName,
      targetDepartment: targetP.department,
      subject: subject || `Interdepartmental Sync: ${sourceP.village} Works`,
      message: message || 'Initiating formal synchronization between departments to avoid overlap.',
      proposedResolution: resolutionProposal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      senderName: currentUser.name,
      senderDesignation: currentUser.designation
    };

    onAddCoordinationRequest(newReq);
    setShowNewModal(false);
    setSubject('');
    setMessage('');
  };

  const handleResolveAction = (req: CoordinationRequest, newStatus: 'Accepted' | 'Resolved') => {
    onUpdateCoordinationRequest({
      ...req,
      status: newStatus,
      resolutionNotes: resolutionNotes || `Formally approved by ${currentUser.name} (${currentUser.designation}).`,
      updatedAt: new Date().toISOString()
    });
    setResolvingRequest(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              CROSS-DEPARTMENT SYNC
            </span>
            <span className="text-xs text-slate-400">Bharuch Inter-Agency Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Department Coordination & Conflict Resolution
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Streamlining formal communications, NOC clearances, site inspections, and resolution of overlapping developmental works.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'requests' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coordination ({coordinationRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'directory' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Official Directory (6)
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-900/30 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Coordination Requests */}
      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {/* Status Filter Strip */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filter by Status:</span>
              {(['ALL', 'Pending', 'Accepted', 'Resolved'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    filterStatus === status 
                      ? 'bg-slate-800 text-teal-300 border-teal-500/50 font-bold' 
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-slate-400 text-[11px]">
              Showing {filteredRequests.length} requests
            </span>
          </div>

          {/* Request Cards */}
          <div className="space-y-3.5">
            {filteredRequests.map(req => {
              const sourceP = projects.find(p => p.id === req.sourceProjectId);
              const targetP = projects.find(p => p.id === req.targetProjectId);

              return (
                <div 
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5 transition-all hover:border-slate-700"
                >
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-bold border border-slate-700">
                        {req.id}
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        req.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        req.status === 'Accepted' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        Logged {formatDate(req.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Action Suggested:</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {req.proposedResolution}
                      </span>
                    </div>
                  </div>

                  {/* Subject & Message */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{req.subject}</h3>
                    <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
                      {req.message}
                    </p>
                  </div>

                  {/* Involving Projects Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-teal-400 block">Initiating Department</span>
                      <div className="font-semibold text-white">{req.sourceDepartment}</div>
                      <div className="text-slate-300 truncate">Work: {req.sourceProjectName}</div>
                      <div className="text-[11px] text-slate-400">Officer: {req.senderName} ({req.senderDesignation})</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">Recipient Department</span>
                      <div className="font-semibold text-white">{req.targetDepartment}</div>
                      <div className="text-slate-300 truncate">Work: {req.targetProjectName}</div>
                      <div className="text-[11px] text-slate-400">Project Ref: {req.targetProjectId}</div>
                    </div>
                  </div>

                  {/* Resolution Notes if added */}
                  {req.resolutionNotes && (
                    <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs text-teal-200">
                      <span className="font-bold block text-teal-300">Official Resolution Minutes:</span>
                      <p className="mt-0.5 text-slate-300">{req.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {sourceP && (
                        <button
                          onClick={() => onSelectProject(sourceP)}
                          className="text-xs text-teal-400 hover:underline cursor-pointer"
                        >
                          View Work 1 Details →
                        </button>
                      )}
                      {targetP && (
                        <button
                          onClick={() => onSelectProject(targetP)}
                          className="text-xs text-cyan-400 hover:underline cursor-pointer"
                        >
                          View Work 2 Details →
                        </button>
                      )}
                    </div>

                    {req.status === 'Pending' && currentUser.role !== 'citizen' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setResolvingRequest(req)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Resolve</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* View Mode 2: Official Directory */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEPARTMENTS.map(dept => {
            const deptProjects = projects.filter(p => p.department === dept.name);
            return (
              <div 
                key={dept.code}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md" style={{ backgroundColor: dept.color }}>
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{dept.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Bharuch Division</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    {deptProjects.length} Works
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="font-semibold text-white">{dept.headOfficer}</div>
                  <div className="text-teal-400">{dept.designation}</div>
                  <div className="flex items-center gap-2 text-slate-300 pt-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dept.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400 text-[11px] pt-1 border-t border-slate-700/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{dept.officeAddress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Sanctioned Portfolio:</span>
                  <span className="font-bold text-emerald-400">
                    ₹{(deptProjects.reduce((a, b) => a + (b.sanctionedBudget || 0), 0) / 10000000).toFixed(2)} Cr
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Create Interdepartmental Coordination Request</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Your Project / Originating Work *</label>
                <select
                  value={sourceProjectId}
                  onChange={e => setSourceProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.projectName} ({p.department})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Target Project for Coordination *</label>
                <select
                  value={targetProjectId}
                  onChange={e => setTargetProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.projectName} ({p.department})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Coordination Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Joint Site Inspection / Alignment Conflict"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Proposed Resolution *</label>
                <select
                  value={resolutionProposal}
                  onChange={e => setResolutionProposal(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Merge">Merge Work Scopes</option>
                  <option value="Cancel Duplicate">Cancel Duplicate Proposal</option>
                  <option value="Re-scope">Re-scope to Alternate Village</option>
                  <option value="Reschedule">Reschedule Phase</option>
                  <option value="Proceed with Conditions">Proceed with Conditions</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Detailed Notes & Minutes *</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Explain why coordination is required, joint inspection date, or suggested scope adjustment..."
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution Notes Modal */}
      {resolvingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-teal-500/50 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Approve & Resolve Coordination Request</h3>
            <p className="text-xs text-slate-300">
              Formally close conflict <strong className="text-teal-300">{resolvingRequest.id}</strong> under DDO Bharuch records.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Resolution Minutes / Notes *</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder="e.g. Scope modified in joint survey. R&B executed main road, Panchayat shifted to feeder lane. Savings confirmed."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResolvingRequest(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveAction(resolvingRequest, 'Resolved')}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
