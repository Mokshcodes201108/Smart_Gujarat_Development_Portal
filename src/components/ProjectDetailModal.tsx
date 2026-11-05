import React from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  IndianRupee, 
  Calendar, 
  UserCheck, 
  Phone, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { Project, UserRole } from '../types';
import { formatCurrencyINR, formatFullINR, formatDate, getStatusBadgeProps } from '../utils/formatters';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onViewDuplicate?: (duplicateOfId: string) => void;
  userRole: UserRole;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onViewDuplicate,
  userRole
}) => {
  if (!isOpen || !project) return null;

  const statusProps = getStatusBadgeProps(project.status);
  const utilizationPercent = project.sanctionedBudget > 0 
    ? Math.min(100, Math.round((project.utilizedFunds / project.sanctionedBudget) * 100))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-teal-300 font-bold border border-slate-700">
                {project.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${statusProps.bg} ${statusProps.text} ${statusProps.border}`}>
                {project.status}
              </span>
              {project.isFlaggedDuplicate && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  Flagged Overlap ({project.duplicateConfidence}% Match)
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white pt-1">
              {project.projectName}
            </h3>
            <p className="text-xs text-slate-400">
              {project.department} • <span className="text-teal-400 font-medium">{project.scheme}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Duplicate Notice Banner if applicable */}
          {project.isFlaggedDuplicate && project.duplicateOfProjectId && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-rose-300 block">Identified Cross-Departmental Duplicate Work</span>
                  <span className="text-slate-300">
                    Matches with existing project ID <span className="font-mono font-bold text-white">{project.duplicateOfProjectId}</span>.
                  </span>
                </div>
              </div>
              {onViewDuplicate && (
                <button
                  onClick={() => onViewDuplicate(project.duplicateOfProjectId!)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1 shrink-0 cursor-pointer shadow-md"
                >
                  <span>Compare Conflict</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Work Description & Scope
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
              {project.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Sanctioned Budget</span>
              <span className="text-base font-bold text-emerald-400">{formatCurrencyINR(project.sanctionedBudget)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{formatFullINR(project.sanctionedBudget)}</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Funds Utilized</span>
              <span className="text-base font-bold text-teal-400">{formatCurrencyINR(project.utilizedFunds)}</span>
              <span className="text-[10px] text-teal-300 block mt-0.5">{utilizationPercent}% spent</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Start Date</span>
              <span className="text-xs font-bold text-slate-200">{formatDate(project.startDate)}</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Target Completion</span>
              <span className="text-xs font-bold text-slate-200">{formatDate(project.expectedCompletionDate)}</span>
            </div>
          </div>

          {/* Financial Utilization Progress Bar */}
          <div className="space-y-1.5 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Financial Progress Bar</span>
              <span className="font-semibold text-teal-400">{utilizationPercent}% Utilized</span>
            </div>
            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  utilizationPercent >= 80 ? 'bg-emerald-500' : utilizationPercent >= 40 ? 'bg-teal-500' : 'bg-blue-500'
                }`}
                style={{ width: `${utilizationPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Remaining: {formatCurrencyINR(project.sanctionedBudget - project.utilizedFunds)}</span>
              <span>Sanctioned: {formatCurrencyINR(project.sanctionedBudget)}</span>
            </div>
          </div>

          {/* Location & Officer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Geographical Location
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div><span className="text-slate-400">Village:</span> <span className="font-semibold text-white">{project.village}</span></div>
                <div><span className="text-slate-400">Taluka:</span> <span className="font-semibold text-white">{project.taluka}</span></div>
                <div><span className="text-slate-400">District:</span> Bharuch, Gujarat</div>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  GPS: {project.latitude.toFixed(4)}°N, {project.longitude.toFixed(4)}°E
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Administrative Authority
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div><span className="text-slate-400">Responsible Officer:</span> <span className="font-semibold text-white">{project.responsibleOfficer}</span></div>
                <div><span className="text-slate-400">Executing Dept:</span> {project.department}</div>
                {project.officerContact && (
                  <div className="flex items-center gap-1.5 text-teal-300 pt-1">
                    <Phone className="w-3 h-3" />
                    <span>{project.officerContact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Last modified: {formatDate(project.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            {userRole !== 'citizen' && onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Work</span>
              </button>
            )}

            {userRole === 'admin' && onDelete && (
              <button
                onClick={() => onDelete(project)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
