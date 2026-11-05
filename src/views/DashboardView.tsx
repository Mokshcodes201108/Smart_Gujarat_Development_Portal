import React from 'react';
import { 
  Building2, 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldAlert, 
  Handshake, 
  ArrowRight,
  ExternalLink,
  Plus,
  Compass
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { Project, CoordinationRequest, AppNotification, User } from '../types';
import { formatCurrencyINR, formatDate, getStatusBadgeProps } from '../utils/formatters';

interface DashboardViewProps {
  projects: Project[];
  coordinationRequests: CoordinationRequest[];
  notifications: AppNotification[];
  currentUser: User;
  duplicateCount: number;
  totalSavings: number;
  onNavigateTab: (tab: any) => void;
  onOpenNewProject: () => void;
  onSelectProject: (project: Project) => void;
}

const DEPT_COLORS: { [key: string]: string } = {
  'Roads and Buildings Department': '#0284c7',
  'Panchayat Department': '#16a34a',
  'Gujarat Industrial Development Corporation (GIDC)': '#d97706',
  'District Mineral Foundation (DMF)': '#9333ea',
  'Tribal Development Department': '#ea580c',
  'Gujarat Water Supply & Sewerage Board': '#0d9488'
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  coordinationRequests,
  notifications,
  currentUser,
  duplicateCount,
  totalSavings,
  onNavigateTab,
  onOpenNewProject,
  onSelectProject
}) => {
  // Live computed metrics directly from stored data
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const pendingApprovals = projects.filter(p => p.status === 'Pending Approval' || p.status === 'Proposed').length;

  const totalSanctioned = projects.reduce((acc, p) => acc + (p.sanctionedBudget || 0), 0);
  const totalUtilized = projects.reduce((acc, p) => acc + (p.utilizedFunds || 0), 0);
  const overallUtilizationPercent = totalSanctioned > 0 ? Math.round((totalUtilized / totalSanctioned) * 100) : 0;

  // Department-wise project count
  const deptCountMap: { [key: string]: number } = {};
  projects.forEach(p => {
    deptCountMap[p.department] = (deptCountMap[p.department] || 0) + 1;
  });

  const deptDistributionData = Object.entries(deptCountMap).map(([dept, count]) => ({
    name: dept.replace(' Department', '').replace('Gujarat Industrial Development Corporation (GIDC)', 'GIDC').replace('Gujarat Water Supply & Sewerage Board', 'GWSSB').replace('District Mineral Foundation (DMF)', 'DMF'),
    fullName: dept,
    value: count,
    color: DEPT_COLORS[dept] || '#64748b'
  }));

  // Budget comparison by Department
  const deptBudgetMap: { [key: string]: { sanctioned: number; utilized: number } } = {};
  projects.forEach(p => {
    const key = p.department.replace(' Department', '').replace('Gujarat Industrial Development Corporation (GIDC)', 'GIDC').replace('Gujarat Water Supply & Sewerage Board', 'GWSSB').replace('District Mineral Foundation (DMF)', 'DMF');
    if (!deptBudgetMap[key]) {
      deptBudgetMap[key] = { sanctioned: 0, utilized: 0 };
    }
    deptBudgetMap[key].sanctioned += (p.sanctionedBudget || 0) / 10000000; // in Crores
    deptBudgetMap[key].utilized += (p.utilizedFunds || 0) / 10000000;
  });

  const budgetBarData = Object.entries(deptBudgetMap).map(([dept, data]) => ({
    department: dept,
    sanctionedCr: parseFloat(data.sanctioned.toFixed(2)),
    utilizedCr: parseFloat(data.utilized.toFixed(2))
  }));

  // Monthly development timeline data
  const monthlyActivityData = [
    { month: 'Aug 2025', count: 4, sanctionedCr: 8.4 },
    { month: 'Sep 2025', count: 7, sanctionedCr: 14.2 },
    { month: 'Oct 2025', count: 11, sanctionedCr: 21.0 },
    { month: 'Nov 2025', count: 15, sanctionedCr: 32.5 },
    { month: 'Dec 2025', count: 18, sanctionedCr: 45.8 },
    { month: 'Jan 2026', count: 22, sanctionedCr: 68.2 },
    { month: 'Feb 2026', count: totalProjects, sanctionedCr: parseFloat((totalSanctioned / 10000000).toFixed(1)) }
  ];

  const pendingRequests = coordinationRequests.filter(r => r.status === 'Pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              DDO BHARUCH CENTRAL HUB
            </span>
            <span className="text-xs text-slate-400">Live Synchronized View</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            District Developmental Works Synchronization
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time interdepartmental registry monitoring all civil works, roads, water supply, lighting and infrastructure across 9 Talukas of Bharuch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {currentUser.role !== 'citizen' && (
            <button
              onClick={onOpenNewProject}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Propose New Work</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('duplicates')}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Duplicate Scanner ({duplicateCount})</span>
          </button>
        </div>
      </div>

      {/* Critical Duplicate Interceptor Banner */}
      {duplicateCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/40 border border-rose-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  {duplicateCount} Overlapping Works Intercepted in Bharuch
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-black">
                  URGENT ACTION
                </span>
              </div>
              <p className="text-xs text-rose-200 mt-0.5">
                Redundant sanctions avoided in <strong className="text-white">Vagra, Ankleshwar GIDC, Hansot, Amod & Valia</strong>. Estimated taxpayer funds safeguarded: <strong className="text-emerald-400 font-bold">{formatCurrencyINR(totalSavings)}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('duplicates')}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-md cursor-pointer"
          >
            <span>Resolve Conflicts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalProjects}</div>
          <p className="text-[10px] text-slate-400 mt-1">Across 6 Departments</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Ongoing Works</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{inProgressProjects}</div>
          <p className="text-[10px] text-slate-400 mt-1">Under physical execution</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{completedProjects}</div>
          <p className="text-[10px] text-slate-400 mt-1">Handed over to public</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Approvals</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingApprovals}</div>
          <p className="text-[10px] text-slate-400 mt-1">Awaiting DDO sanction</p>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Sanctioned</span>
            <IndianRupee className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-black text-white">{formatCurrencyINR(totalSanctioned)}</div>
          <p className="text-[10px] text-slate-400 mt-1">Sanctioned allocation</p>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Funds Utilized</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-black text-teal-400">{formatCurrencyINR(totalUtilized)}</div>
          <p className="text-[10px] text-slate-400 mt-1">{overallUtilizationPercent}% cumulative spent</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Department Distribution Chart */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Department-Wise Distribution</h3>
              <p className="text-xs text-slate-400">Total active works logged across departments</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              6 Agencies
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deptDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any, item: any) => [
                    `${val} Projects (${Math.round((val / totalProjects) * 100)}%)`, 
                    item.payload.fullName
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Mini Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {deptDistributionData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-300 truncate">{d.name}:</span>
                <span className="font-bold text-white ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sanctioned vs Utilized Budget Comparison Chart */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Budget Allocation vs Utilization</h3>
              <p className="text-xs text-slate-400">Financial progress by department (in ₹ Crores)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-teal-500"></span> Sanctioned
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span> Utilized
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetBarData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  unit=" Cr"
                />
                <Tooltip 
                  formatter={(val: any) => [`₹${val} Cr`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="sanctionedCr" fill="#0d9488" name="Sanctioned (₹ Cr)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilizedCr" fill="#10b981" name="Utilized (₹ Cr)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Timeline & Activity Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Monthly Development Timeline */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Development Trajectory</h3>
              <p className="text-xs text-slate-400">Cumulative sanctioned works in Bharuch</p>
            </div>
            <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +28% YoY
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSanctioned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" Cr" />
                <Tooltip 
                  formatter={(val: any) => [`₹${val} Cr Sanctioned`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sanctionedCr" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorSanctioned)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pending Coordination Requests & Live Activity */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pending Coordination Callout */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Interdepartmental Requests</h3>
              </div>
              <button
                onClick={() => onNavigateTab('coordination')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium"
              >
                View All ({coordinationRequests.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingRequests.slice(0, 3).map(req => (
                <div 
                  key={req.id}
                  onClick={() => onNavigateTab('coordination')}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-rose-400">{req.sourceDepartment}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {req.proposedResolution}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-1 font-medium">{req.subject}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Target: {req.targetDepartment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Jump to Interactive Map */}
          <div 
            onClick={() => onNavigateTab('map')}
            className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-cyan-950/40 border border-teal-500/30 flex items-center justify-between cursor-pointer hover:border-teal-500/60 transition-colors shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Open Bharuch GIS Map</h4>
                <p className="text-[11px] text-slate-300">View project clusters & conflict zones geographically</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </div>
        </div>
      </div>

      {/* Recent Project Activities Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Developmental Projects in Bharuch</h3>
            <p className="text-xs text-slate-400">Live project entries synchronized across district departments</p>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
          >
            <span>All Projects ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Project Ref & Name</th>
                <th className="py-2.5 px-3">Executing Dept</th>
                <th className="py-2.5 px-3">Taluka & Village</th>
                <th className="py-2.5 px-3">Sanctioned Budget</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.slice(0, 6).map(project => {
                const statusProps = getStatusBadgeProps(project.status);
                return (
                  <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-[10px] text-teal-400">{project.id}</div>
                      <div className="font-semibold text-white max-w-xs truncate">{project.projectName}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-300">{project.department}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-200">{project.village}</div>
                      <div className="text-[10px] text-slate-400">{project.taluka} Taluka</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-400">
                      {formatCurrencyINR(project.sanctionedBudget)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusProps.bg} ${statusProps.text} ${statusProps.border}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
