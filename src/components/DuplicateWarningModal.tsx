import React from 'react';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  Handshake, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  IndianRupee, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { DuplicateMatch, Project } from '../types';
import { formatCurrencyINR, getStatusBadgeProps } from '../utils/formatters';

interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: DuplicateMatch[];
  candidateProject: Partial<Project>;
  onProceedAnyway: () => void;
  onInitiateCoordination: (match: DuplicateMatch) => void;
}

export const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({
  isOpen,
  onClose,
  matches,
  candidateProject,
  onProceedAnyway,
  onInitiateCoordination
}) => {
  if (!isOpen || matches.length === 0) return null;

  const topMatch = matches[0];
  const existing = topMatch.existingProject;
  const statusProps = getStatusBadgeProps(existing.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-b border-rose-500/40 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/40 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Potential Duplicate Project Detected!
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black tracking-wide">
                  {topMatch.overallScore}% SIMILARITY
                </span>
              </div>
              <p className="text-xs text-rose-200 mt-1">
                SGDP AI Sentinel has identified an overlapping developmental work in the same vicinity.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Risk Alert Callout */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Risk Classification: {topMatch.riskLevel} RISK OF FINANCIAL DUPLICATION
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {topMatch.recommendedAction}
              </p>
            </div>
            <div className="shrink-0 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-rose-500/30 text-right">
              <span className="text-[10px] uppercase text-slate-400 block">Funds at Overlap Risk</span>
              <span className="text-sm font-bold text-rose-400">{formatCurrencyINR(topMatch.potentialSavings)}</span>
            </div>
          </div>

          {/* Side by Side Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Candidate Project (Being Entered) */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-3">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Your New Proposal
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  New Entry
                </span>
              </div>
              <h4 className="font-semibold text-sm text-white mb-2 leading-snug">
                {candidateProject.projectName || 'Untitled Proposal'}
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Dept:</span>
                  <span className="font-medium text-slate-200">{candidateProject.department || 'Not selected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium text-slate-200">{candidateProject.village}, Taluka {candidateProject.taluka}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-semibold text-teal-400">{formatCurrencyINR(candidateProject.estimatedBudget || candidateProject.sanctionedBudget || 0)}</span>
                </div>
              </div>
            </div>

            {/* Existing Conflicting Project */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/30 mb-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Existing Conflicting Work
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${statusProps.bg} ${statusProps.text} ${statusProps.border}`}>
                  {existing.status}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-white mb-2 leading-snug">
                {existing.projectName}
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Dept:</span>
                  <span className="font-medium text-rose-200">{existing.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium text-slate-200">{existing.village}, Taluka {existing.taluka}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Sanctioned:</span>
                  <span className="font-semibold text-emerald-400">{formatCurrencyINR(existing.sanctionedBudget)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Matching Factors breakdown */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Algorithmic Detection Evidence
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topMatch.matchingFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700"
          >
            Revise Proposal Scope
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onInitiateCoordination(topMatch)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
            >
              <Handshake className="w-4 h-4" />
              <span>Initiate Coordination Request</span>
            </button>

            <button
              onClick={onProceedAnyway}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-500/30 transition-colors cursor-pointer"
              title="Only for authorized officers with written DDO exemption"
            >
              Force Save (Exempted)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
