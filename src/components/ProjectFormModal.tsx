import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  IndianRupee, 
  Calendar,
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, DuplicateMatch } from '../types';
import { DEPARTMENTS, TALUKAS_LIST, CATEGORIES_LIST } from '../data/sampleProjects';
import { findDuplicates } from '../utils/duplicateDetector';
import { formatCurrencyINR } from '../utils/formatters';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initialProject?: Project | null;
  existingProjects: Project[];
  onTriggerDuplicateWarning: (matches: DuplicateMatch[], candidate: Partial<Project>) => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
  existingProjects,
  onTriggerDuplicateWarning
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialProject);

  const [formData, setFormData] = useState<Partial<Project>>({
    id: initialProject?.id || `GJ-BH-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
    projectName: initialProject?.projectName || '',
    department: initialProject?.department || DEPARTMENTS[0].name,
    scheme: initialProject?.scheme || 'Mukhya Mantri Gram Sadak Yojana (MMGSY)',
    district: 'Bharuch',
    taluka: initialProject?.taluka || 'Vagra',
    village: initialProject?.village || 'Vagra',
    category: initialProject?.category || 'Road & Transportation',
    description: initialProject?.description || '',
    estimatedBudget: initialProject?.estimatedBudget || 3500000,
    sanctionedBudget: initialProject?.sanctionedBudget || 3500000,
    utilizedFunds: initialProject?.utilizedFunds || 0,
    startDate: initialProject?.startDate || '2026-04-01',
    expectedCompletionDate: initialProject?.expectedCompletionDate || '2026-12-31',
    status: initialProject?.status || 'Proposed',
    responsibleOfficer: initialProject?.responsibleOfficer || 'Er. Rajesh K. Patel (EE R&B)',
    officerContact: initialProject?.officerContact || '+91 98250 11221',
    latitude: initialProject?.latitude || 21.8480,
    longitude: initialProject?.longitude || 72.8420
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [liveMatches, setLiveMatches] = useState<DuplicateMatch[]>([]);

  // Real-time dynamic duplicate detection whenever key fields change
  useEffect(() => {
    if ((formData.projectName && formData.projectName.length >= 4) || formData.village) {
      const matches = findDuplicates(formData, existingProjects);
      setLiveMatches(matches);
    } else {
      setLiveMatches([]);
    }
  }, [formData.projectName, formData.village, formData.taluka, formData.category, formData.description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.projectName?.trim()) errors.projectName = 'Project name is required';
    if (!formData.village?.trim()) errors.village = 'Village name is required';
    if (!formData.taluka?.trim()) errors.taluka = 'Taluka is required';
    if (!formData.description?.trim()) errors.description = 'Work description is required';
    if (!formData.estimatedBudget || formData.estimatedBudget <= 0) errors.estimatedBudget = 'Budget must be greater than zero';
    if (!formData.startDate) errors.startDate = 'Start date required';
    if (!formData.expectedCompletionDate) errors.expectedCompletionDate = 'Completion date required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check duplicate risk
    const criticalMatches = liveMatches.filter(m => m.overallScore >= 70);
    if (criticalMatches.length > 0 && !isEditing) {
      // Trigger modal alert to block immediate duplicate waste
      onTriggerDuplicateWarning(criticalMatches, formData);
      return;
    }

    const completedProject: Project = {
      ...(formData as Project),
      updatedAt: new Date().toISOString(),
      createdAt: initialProject?.createdAt || new Date().toISOString(),
      isFlaggedDuplicate: liveMatches.length > 0 && liveMatches[0].overallScore >= 70,
      duplicateConfidence: liveMatches.length > 0 ? liveMatches[0].overallScore : undefined,
      duplicateOfProjectId: liveMatches.length > 0 && liveMatches[0].overallScore >= 70 ? liveMatches[0].existingProject.id : undefined
    };

    onSave(completedProject);
    onClose();
  };

  const topMatch = liveMatches[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Developmental Work Proposal' : 'Register New Developmental Work'}
              </h3>
              <p className="text-xs text-slate-400">
                District Development Office Bharuch • AI Synchronization & Cross-Departmental Verification
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Real-time Dynamic AI Duplicate Detection Bar */}
          {topMatch && (
            <div className={`p-4 rounded-xl border transition-all ${
              topMatch.overallScore >= 70 
                ? 'bg-rose-950/40 border-rose-500 text-rose-200' 
                : 'bg-amber-950/40 border-amber-500 text-amber-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${topMatch.overallScore >= 70 ? 'text-rose-400' : 'text-amber-400'}`} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <span>AI Sentinel: {topMatch.overallScore}% Potential Overlap Detected!</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        topMatch.overallScore >= 70 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-900'
                      }`}>
                        {topMatch.riskLevel} RISK
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">
                      Existing project: <strong className="text-white">"{topMatch.existingProject.projectName}"</strong> under <strong>{topMatch.existingProject.department}</strong> in {topMatch.existingProject.village}.
                    </p>
                    <div className="text-[11px] text-slate-300 mt-1 flex flex-wrap gap-2">
                      {topMatch.matchingFactors.slice(0, 3).map((f, i) => (
                        <span key={i} className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700">
                          • {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <span className="text-[10px] text-slate-400 block">Conflicting Funds</span>
                  <span className="text-sm font-bold text-rose-300">{formatCurrencyINR(topMatch.potentialSavings)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Project Title / Developmental Work Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. Construction of CC Road from Temple to Gram Panchayat..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {validationErrors.projectName && (
                <p className="text-[11px] text-rose-400">{validationErrors.projectName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Project Reference ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm font-mono text-teal-300"
              />
            </div>
          </div>

          {/* Section 2: Department, Scheme & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Executing Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.code} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Government Scheme *</label>
              <input
                type="text"
                name="scheme"
                value={formData.scheme}
                onChange={handleChange}
                placeholder="e.g. MMGSY, DMF, 15th Finance Commission..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Infrastructure Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {CATEGORIES_LIST.filter(c => c !== 'All Categories').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Location Details (Taluka, Village, GPS) */}
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Location & Coordinates (Bharuch District)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Taluka *</label>
                <select
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-teal-500"
                >
                  {TALUKAS_LIST.filter(t => t !== 'All Talukas').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Village / Locality *</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Vagra, Zadeshwar, Piraman"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-teal-500"
                />
                {validationErrors.village && (
                  <p className="text-[10px] text-rose-400">{validationErrors.village}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Scope & Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Technical Description & Scope of Work *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed technical specifications, materials (e.g. CC pavement M25, asphalt overlay, solar LED wattage, pipe diameter)..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
            {validationErrors.description && (
              <p className="text-[11px] text-rose-400">{validationErrors.description}</p>
            )}
          </div>

          {/* Section 5: Financials & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Estimated Budget (₹) *</label>
              <input
                type="number"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-teal-300 font-semibold"
              />
              <span className="text-[10px] text-slate-400 block">{formatCurrencyINR(formData.estimatedBudget || 0)}</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Sanctioned Budget (₹)</label>
              <input
                type="number"
                name="sanctionedBudget"
                value={formData.sanctionedBudget}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-emerald-300 font-semibold"
              />
              <span className="text-[10px] text-slate-400 block">{formatCurrencyINR(formData.sanctionedBudget || 0)}</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Funds Utilized (₹)</label>
              <input
                type="number"
                name="utilizedFunds"
                value={formData.utilizedFunds}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Workflow Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Proposed">Proposed</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Section 6: Timeline & Officer in Charge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Target Completion Date</label>
              <input
                type="date"
                name="expectedCompletionDate"
                value={formData.expectedCompletionDate}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Responsible Engineer / Officer</label>
              <input
                type="text"
                name="responsibleOfficer"
                value={formData.responsibleOfficer}
                onChange={handleChange}
                placeholder="Name & Designation"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Real-time cross-departmental verification is active.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Submit for Synchronization'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
