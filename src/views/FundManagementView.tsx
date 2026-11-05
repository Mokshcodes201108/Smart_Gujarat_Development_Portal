import React from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight, 
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { Project } from '../types';
import { DEPARTMENTS } from '../data/sampleProjects';
import { formatCurrencyINR, formatFullINR } from '../utils/formatters';

interface FundManagementViewProps {
  projects: Project[];
  totalSavings: number;
}

const SCHEME_COLORS = [
  '#0284c7', '#0d9488', '#16a34a', '#d97706', '#9333ea', 
  '#ea580c', '#06b6d4', '#4f46e5', '#e11d48'
];

export const FundManagementView: React.FC<FundManagementViewProps> = ({
  projects,
  totalSavings
}) => {
  const totalSanctioned = projects.reduce((sum, p) => sum + (p.sanctionedBudget || 0), 0);
  const totalUtilized = projects.reduce((sum, p) => sum + (p.utilizedFunds || 0), 0);
  const totalRemaining = Math.max(0, totalSanctioned - totalUtilized);
  const utilizationPercentage = totalSanctioned > 0 ? Math.round((totalUtilized / totalSanctioned) * 100) : 0;

  // Scheme-wise breakdown
  const schemeMap: { [key: string]: { sanctioned: number; utilized: number; count: number } } = {};
  projects.forEach(p => {
    const s = p.scheme || 'Other Schemes';
    if (!schemeMap[s]) schemeMap[s] = { sanctioned: 0, utilized: 0, count: 0 };
    schemeMap[s].sanctioned += p.sanctionedBudget || 0;
    schemeMap[s].utilized += p.utilizedFunds || 0;
    schemeMap[s].count += 1;
  });

  const schemeChartData = Object.entries(schemeMap)
    .map(([scheme, data], i) => ({
      name: scheme.length > 25 ? scheme.substring(0, 22) + '...' : scheme,
      fullName: scheme,
      value: parseFloat((data.sanctioned / 10000000).toFixed(2)),
      utilizedCr: parseFloat((data.utilized / 10000000).toFixed(2)),
      count: data.count,
      color: SCHEME_COLORS[i % SCHEME_COLORS.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  // Department-wise financial breakdown
  const deptFinancials = DEPARTMENTS.map(dept => {
    const deptProjects = projects.filter(p => p.department === dept.name);
    const sanctioned = deptProjects.reduce((s, p) => s + (p.sanctionedBudget || 0), 0);
    const utilized = deptProjects.reduce((s, p) => s + (p.utilizedFunds || 0), 0);
    const percent = sanctioned > 0 ? Math.round((utilized / sanctioned) * 100) : 0;
    return {
      department: dept.name,
      code: dept.code,
      color: dept.color,
      count: deptProjects.length,
      sanctioned,
      utilized,
      remaining: sanctioned - utilized,
      percent,
      sanctionedCr: parseFloat((sanctioned / 10000000).toFixed(2)),
      utilizedCr: parseFloat((utilized / 10000000).toFixed(2))
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              DISTRICT EXCHEQUER
            </span>
            <span className="text-xs text-slate-400">Fiscal Audit & Sanction Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Fund Management & Utilization Tracking
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time financial analytics of developmental works, scheme-wise allocations, and public funds saved through AI duplicate prevention.
          </p>
        </div>

        {/* Duplicate Waste Avoidance Banner */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Duplicate Waste Prevented</span>
            <span className="text-lg font-black text-white">{formatCurrencyINR(totalSavings)}</span>
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">Total Sanctioned Allocation</span>
          <div className="text-2xl font-black text-white">{formatCurrencyINR(totalSanctioned)}</div>
          <span className="text-[11px] font-mono text-slate-400 block mt-1">{formatFullINR(totalSanctioned)}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">Utilized Expenditure</span>
          <div className="text-2xl font-black text-teal-400">{formatCurrencyINR(totalUtilized)}</div>
          <span className="text-[11px] text-teal-300 block mt-1">{utilizationPercentage}% cumulative burn rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">Remaining Sanction Balance</span>
          <div className="text-2xl font-black text-cyan-400">{formatCurrencyINR(totalRemaining)}</div>
          <span className="text-[11px] text-slate-400 block mt-1">{100 - utilizationPercentage}% unspent balance</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">Overall Fiscal Health</span>
          <div className="text-2xl font-black text-emerald-400">Optimal (A+)</div>
          <span className="text-[11px] text-emerald-300 block mt-1">Zero uncoordinated overlaps</span>
        </div>
      </div>

      {/* Progress Bar of Overall Utilization */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold">Bharuch District Development Fund Burn Rate</span>
          <span className="font-bold text-teal-400">{utilizationPercentage}% Completed ({formatCurrencyINR(totalUtilized)} / {formatCurrencyINR(totalSanctioned)})</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${utilizationPercentage}%` }}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Scheme-wise Distribution */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Top Scheme-Wise Allocations</h3>
              <p className="text-xs text-slate-400">Sanctioned capital volume by grant scheme (in ₹ Cr)</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Top Schemes</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={schemeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {schemeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any, item: any) => [
                    `₹${val} Cr Sanctioned (${item.payload.count} works)`, 
                    item.payload.fullName
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            {schemeChartData.map(s => (
              <div key={s.fullName} className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                  <span className="text-slate-300 truncate">{s.fullName}</span>
                </div>
                <span className="font-bold text-white shrink-0">₹{s.value} Cr</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department-wise Financial Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Departmental Expenditure & Absorption</h3>
              <p className="text-xs text-slate-400">Sanctioned vs Utilized capital (in ₹ Cr)</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">6 Departments</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptFinancials} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="code" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
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

      {/* Department Financial Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-3">Departmental Financial Audit Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Active Works</th>
                <th className="py-2.5 px-3">Sanctioned (₹)</th>
                <th className="py-2.5 px-3">Utilized (₹)</th>
                <th className="py-2.5 px-3">Remaining (₹)</th>
                <th className="py-2.5 px-3">Utilization Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {deptFinancials.map(d => (
                <tr key={d.code} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                    {d.department}
                  </td>
                  <td className="py-2.5 px-3 font-mono">{d.count}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">{formatCurrencyINR(d.sanctioned)}</td>
                  <td className="py-2.5 px-3 text-teal-300">{formatCurrencyINR(d.utilized)}</td>
                  <td className="py-2.5 px-3 text-slate-400">{formatCurrencyINR(d.remaining)}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${d.percent}%` }}></div>
                      </div>
                      <span className="font-bold text-white text-[11px]">{d.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
