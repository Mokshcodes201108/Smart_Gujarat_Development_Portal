import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  LayoutList, 
  LayoutGrid, 
  X, 
  CheckCircle2,
  MapPin,
  Building2,
  Calendar,
  IndianRupee,
  Layers
} from 'lucide-react';
import { Project, UserRole, ProjectCategory, ProjectStatus } from '../types';
import { DEPARTMENTS, TALUKAS_LIST, CATEGORIES_LIST } from '../data/sampleProjects';
import { formatCurrencyINR, formatDate, getStatusBadgeProps } from '../utils/formatters';

interface ProjectManagementViewProps {
  projects: Project[];
  onOpenNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onSelectProject: (project: Project) => void;
  userRole: UserRole;
  onNavigateTab: (tab: any) => void;
}

export const ProjectManagementView: React.FC<ProjectManagementViewProps> = ({
  projects,
  onOpenNewProject,
  onEditProject,
  onDeleteProject,
  onSelectProject,
  userRole,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedTaluka, setSelectedTaluka] = useState('All Talukas');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Deletion Confirmation Modal State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Filter & Search projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Search
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        p.projectName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.taluka.toLowerCase().includes(q) ||
        p.scheme.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q);

      // Dept
      const matchesDept = selectedDept === 'All Departments' || p.department === selectedDept;

      // Taluka
      const matchesTaluka = selectedTaluka === 'All Talukas' || p.taluka === selectedTaluka;

      // Category
      const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;

      // Status
      const matchesStatus = selectedStatus === 'All Statuses' || p.status === selectedStatus;

      return matchesSearch && matchesDept && matchesTaluka && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'budget') {
        comparison = a.sanctionedBudget - b.sanctionedBudget;
      } else if (sortBy === 'name') {
        comparison = a.projectName.localeCompare(b.projectName);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else {
        // Date
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [projects, searchTerm, selectedDept, selectedTaluka, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['Project ID', 'Project Name', 'Department', 'Scheme', 'Taluka', 'Village', 'Category', 'Sanctioned Budget (INR)', 'Status'];
    const rows = filteredProjects.map(p => [
      `"${p.id}"`,
      `"${p.projectName.replace(/"/g, '""')}"`,
      `"${p.department}"`,
      `"${p.scheme}"`,
      `"${p.taluka}"`,
      `"${p.village}"`,
      `"${p.category}"`,
      p.sanctionedBudget,
      `"${p.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SGDP_Bharuch_Projects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">Project Management</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              {filteredProjects.length} of {projects.length} Works
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centralized repository of all civil, road, water, and social infrastructure projects across Bharuch.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {userRole !== 'citizen' && (
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 shadow-lg shadow-teal-900/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title, ID, village, scheme..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="All Departments">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d.code} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Taluka Filter */}
          <div className="sm:col-span-2">
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

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Proposed">Proposed</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="sm:col-span-1 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Table view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Grid card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Active Filters & Sorting Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <button
              onClick={() => {
                if (sortBy === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('date'); setSortOrder('desc'); }
              }}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer ${
                sortBy === 'date' ? 'bg-slate-800 text-teal-300 border-teal-500/40' : 'border-slate-800 text-slate-400'
              }`}
            >
              <span>Date</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                if (sortBy === 'budget') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('budget'); setSortOrder('desc'); }
              }}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer ${
                sortBy === 'budget' ? 'bg-slate-800 text-teal-300 border-teal-500/40' : 'border-slate-800 text-slate-400'
              }`}
            >
              <span>Budget</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('name'); setSortOrder('asc'); }
              }}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer ${
                sortBy === 'name' ? 'bg-slate-800 text-teal-300 border-teal-500/40' : 'border-slate-800 text-slate-400'
              }`}
            >
              <span>Name</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>

          {(searchTerm || selectedDept !== 'All Departments' || selectedTaluka !== 'All Talukas' || selectedStatus !== 'All Statuses') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All Departments');
                setSelectedTaluka('All Talukas');
                setSelectedStatus('All Statuses');
                setSelectedCategory('All Categories');
              }}
              className="text-xs text-rose-400 hover:underline cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Display: Table Mode */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ref ID & Project Name</th>
                  <th className="py-3 px-4">Department & Scheme</th>
                  <th className="py-3 px-4">Taluka & Village</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Sanctioned Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <FolderKanban className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p className="text-sm">No developmental works match the selected criteria.</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedDept('All Departments');
                          setSelectedTaluka('All Talukas');
                          setSelectedStatus('All Statuses');
                        }}
                        className="mt-2 text-xs text-teal-400 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map(project => {
                    const statusProps = getStatusBadgeProps(project.status);
                    return (
                      <tr 
                        key={project.id} 
                        className={`hover:bg-slate-800/50 transition-colors ${
                          project.isFlaggedDuplicate ? 'bg-rose-950/15' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-[10px] text-teal-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                              {project.id}
                            </span>
                            {project.isFlaggedDuplicate && (
                              <span 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateTab('duplicates');
                                }}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white flex items-center gap-1 cursor-pointer"
                                title="Overlapping duplicate detected"
                              >
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>Overlap</span>
                              </span>
                            )}
                          </div>
                          <div 
                            onClick={() => onSelectProject(project)}
                            className="font-bold text-white max-w-sm line-clamp-1 hover:text-teal-300 cursor-pointer"
                          >
                            {project.projectName}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200 line-clamp-1">{project.department}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{project.scheme}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{project.village}</div>
                          <div className="text-[11px] text-slate-400">{project.taluka} Taluka</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-300 text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                            {project.category}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-emerald-400">
                            {formatCurrencyINR(project.sanctionedBudget)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {Math.round((project.utilizedFunds / (project.sanctionedBudget || 1)) * 100)}% utilized
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusProps.bg} ${statusProps.text} ${statusProps.border}`}>
                            {project.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSelectProject(project)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {userRole !== 'citizen' && (
                              <button
                                onClick={() => onEditProject(project)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                                title="Edit Project"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {userRole === 'admin' && (
                              <button
                                onClick={() => setProjectToDelete(project)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Projects Display: Card Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => {
            const statusProps = getStatusBadgeProps(project.status);
            return (
              <div 
                key={project.id}
                className={`p-4 rounded-2xl bg-slate-900 border transition-all hover:border-slate-700 shadow-lg flex flex-col justify-between ${
                  project.isFlaggedDuplicate ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="font-mono text-[10px] text-teal-400 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {project.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusProps.bg} ${statusProps.text} ${statusProps.border}`}>
                      {project.status}
                    </span>
                  </div>

                  {project.isFlaggedDuplicate && (
                    <div className="mb-2 px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        Overlap Risk ({project.duplicateConfidence}%)
                      </span>
                      <button 
                        onClick={() => onNavigateTab('duplicates')}
                        className="underline hover:text-white"
                      >
                        Inspect
                      </button>
                    </div>
                  )}

                  <h3 
                    onClick={() => onSelectProject(project)}
                    className="font-bold text-sm text-white line-clamp-2 hover:text-teal-300 cursor-pointer mb-2"
                  >
                    {project.projectName}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{project.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{project.village}, {project.taluka}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sanctioned</span>
                    <span className="text-xs font-bold text-emerald-400">{formatCurrencyINR(project.sanctionedBudget)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700"
                    >
                      Details
                    </button>
                    {userRole !== 'citizen' && (
                      <button
                        onClick={() => onEditProject(project)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Project Deletion</h3>
                <p className="text-xs text-slate-400">This action will remove the record from district registry.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
              <p className="font-semibold text-white">{projectToDelete.projectName}</p>
              <p className="text-slate-400 mt-0.5">{projectToDelete.id} • {projectToDelete.department}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
