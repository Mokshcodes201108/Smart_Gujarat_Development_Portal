import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Sliders, 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  UserCheck, 
  Search, 
  Trash2, 
  RotateCcw, 
  Download, 
  Plus, 
  Lock,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User, AuditLog } from '../types';
import { 
  getStoredUsers, 
  saveStoredUsers, 
  getStoredAuditLogs, 
  addAuditLog, 
  getStoredConfig, 
  saveStoredConfig, 
  DistrictConfig,
  resetToDemoDefaults
} from '../utils/storage';

interface AdminViewProps {
  currentUser: User;
  onResetData: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'approvals' | 'audit' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>(getStoredUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getStoredAuditLogs);
  const [config, setConfig] = useState<DistrictConfig>(getStoredConfig);
  const [searchUser, setSearchUser] = useState('');
  const [configSaved, setConfigSaved] = useState(false);

  // New User Quick Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'officer' | 'citizen'>('officer');
  const [newUserDept, setNewUserDept] = useState('Roads and Buildings Department');
  const [newUserDesignation, setNewUserDesignation] = useState('Assistant Engineer');

  // Filter users
  const filteredUsers = users.filter(u => 
    !searchUser.trim() ||
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(searchUser.toLowerCase()))
  );

  const pendingApprovals = users.filter(u => u.status === 'pending_approval');

  // Toggle user status
  const handleToggleStatus = (targetUser: User) => {
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    const updated = users.map(u => u.id === targetUser.id ? { ...u, status: newStatus as any } : u);
    setUsers(updated);
    saveStoredUsers(updated);
    addAuditLog({
      action: `User Status: ${newStatus.toUpperCase()}`,
      user: currentUser.name,
      role: currentUser.role,
      department: currentUser.department,
      details: `Changed status of ${targetUser.name} (${targetUser.email}) to ${newStatus}.`,
      category: 'admin'
    });
    setAuditLogs(getStoredAuditLogs());
  };

  // Change user role
  const handleChangeRole = (targetUser: User, newRole: 'admin' | 'officer' | 'citizen') => {
    const updated = users.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u);
    setUsers(updated);
    saveStoredUsers(updated);
    addAuditLog({
      action: 'Role Modified',
      user: currentUser.name,
      role: currentUser.role,
      department: currentUser.department,
      details: `Updated role of ${targetUser.name} to ${newRole.toUpperCase()}.`,
      category: 'admin'
    });
    setAuditLogs(getStoredAuditLogs());
  };

  // Approve pending officer
  const handleApproveOfficer = (targetUser: User) => {
    const updated = users.map(u => u.id === targetUser.id ? { ...u, status: 'active' as const } : u);
    setUsers(updated);
    saveStoredUsers(updated);
    addAuditLog({
      action: 'Officer Approved',
      user: currentUser.name,
      role: currentUser.role,
      department: currentUser.department,
      details: `Approved official credentials for ${targetUser.name} (${targetUser.department}).`,
      category: 'admin'
    });
    setAuditLogs(getStoredAuditLogs());
  };

  // Delete User
  const handleDeleteUser = (targetUser: User) => {
    if (targetUser.id === currentUser.id) {
      alert('You cannot delete your own active admin account.');
      return;
    }
    const updated = users.filter(u => u.id !== targetUser.id);
    setUsers(updated);
    saveStoredUsers(updated);
    addAuditLog({
      action: 'User Deleted',
      user: currentUser.name,
      role: currentUser.role,
      department: currentUser.department,
      details: `Removed account record for ${targetUser.name} (${targetUser.email}).`,
      category: 'admin'
    });
    setAuditLogs(getStoredAuditLogs());
  };

  // Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const created: User = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      department: newUserRole === 'officer' ? newUserDept : newUserRole === 'admin' ? 'District Administration' : 'General Public',
      designation: newUserDesignation.trim(),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updated = [created, ...users];
    setUsers(updated);
    saveStoredUsers(updated);
    addAuditLog({
      action: 'User Added by Admin',
      user: currentUser.name,
      role: currentUser.role,
      department: currentUser.department,
      details: `Admin provisioned ${created.name} as ${created.role}.`,
      category: 'admin'
    });
    setAuditLogs(getStoredAuditLogs());
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  // Save AI Config
  const handleSaveConfig = () => {
    saveStoredConfig(config);
    setConfigSaved(true);
    addAuditLog({
      action: 'AI Config Updated',
      user: currentUser.name,
      role: currentUser.role,
      department: currentUser.department,
      details: `Threshold set to ${config.duplicateThreshold}%, proximity to ${config.proximityRadiusKm}km.`,
      category: 'duplicate'
    });
    setAuditLogs(getStoredAuditLogs());
    setTimeout(() => setConfigSaved(false), 2000);
  };

  // Export full JSON database backup
  const handleExportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      exportedBy: currentUser.name,
      users: users,
      auditLogs: auditLogs,
      config: config
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SGDP_Bharuch_Admin_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-slate-400">DDO Bharuch District Administration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Governance, User Access & AI Configuration
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Supervise registered officers, public citizen access, security audit trails, and algorithmic duplicate thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-teal-900/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision User</span>
          </button>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'users' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Registry ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
            activeTab === 'approvals' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Officer Clearances</span>
          {pendingApprovals.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingApprovals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'audit' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>AI Sentinel & District Config</span>
        </button>
      </div>

      {/* Tab 1: User Registry */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                placeholder="Search registered users by name, role or dept..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredUsers.length} registered accounts
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Role & Authority</th>
                    <th className="py-3 px-4">Department / Village</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          {u.email === 'patelmoksh201108@gmail.com' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500 text-slate-950 font-black">
                              PRO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={e => handleChangeRole(u, e.target.value as any)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            u.role === 'admin' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
                            u.role === 'officer' ? 'bg-blue-950 text-blue-300 border-blue-500/40' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="admin">Administrator</option>
                          <option value="officer">Department Officer</option>
                          <option value="citizen">Public Citizen</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">{u.department || 'General Public'}</div>
                        <div className="text-[11px] text-slate-400">{u.designation || u.village || 'Resident'}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          u.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className="px-2 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Officer Approvals Queue */}
      {activeTab === 'approvals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Pending Department Officer Authorizations</h3>
              <p className="text-xs text-slate-400">Newly registered officers require DDO validation before submitting work proposals.</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {pendingApprovals.length} Awaiting Review
            </span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-white">All Officer Accounts Verified</p>
              <p className="text-xs text-slate-400 mt-0.5">No pending authorizations in the district queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map(u => (
                <div key={u.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-white">{u.name}</h4>
                    <p className="text-xs text-teal-300">{u.designation} • {u.department}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email} | ID: {u.employeeId || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveOfficer(u)}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authorize Access</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Security & Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">System Security & Action Logs</h3>
              <p className="text-xs text-slate-400">Immutable district log tracking logins, duplicate interventions, and sanctions.</p>
            </div>
            <span className="text-xs font-mono text-teal-400">Live Sentinel Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action Event</th>
                  <th className="py-2.5 px-3">Actor / Officer</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{log.action}</td>
                    <td className="py-2.5 px-3 text-teal-300">{log.user} ({log.role})</td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-sm truncate">{log.details}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.category === 'duplicate' ? 'bg-rose-500/20 text-rose-300' :
                        log.category === 'auth' ? 'bg-blue-500/20 text-blue-300' :
                        log.category === 'coordination' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {log.category.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: AI Sentinel Configuration & District Tuning */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">AI Duplicate Sentinel Algorithm Settings</h3>
              <p className="text-xs text-slate-400">Calibrate mathematical weights and geospatial thresholds for Bharuch district.</p>
            </div>
            {configSaved && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Config Applied!</span>
              </span>
            )}
          </div>

          <div className="space-y-5 text-xs">
            {/* Threshold Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-200 font-bold">
                  Duplicate Sensitivity Score Threshold ({config.duplicateThreshold}%)
                </label>
                <span className="text-teal-400 font-mono font-bold text-sm">{config.duplicateThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={config.duplicateThreshold}
                onChange={e => setConfig(prev => ({ ...prev, duplicateThreshold: parseInt(e.target.value) }))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Projects scoring above this composite threshold trigger an immediate High-Risk modal blocker.
              </p>
            </div>

            {/* Proximity Radius */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-200 font-bold">
                  Geospatial Proximity Match Buffer ({config.proximityRadiusKm} km)
                </label>
                <span className="text-teal-400 font-mono font-bold text-sm">{config.proximityRadiusKm} km</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={config.proximityRadiusKm}
                onChange={e => setConfig(prev => ({ ...prev, proximityRadiusKm: parseFloat(e.target.value) }))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Haversine radius for detecting adjacent civil works in the same village or taluka.
              </p>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Auto-Flag Redundant Proposals</span>
                  <span className="text-slate-400 text-[11px]">Automatically mark potential duplicates during creation</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoFlagOnSubmission}
                  onChange={e => setConfig(prev => ({ ...prev, autoFlagOnSubmission: e.target.checked }))}
                  className="w-4 h-4 accent-teal-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Enforce Coordination Before Sanction</span>
                  <span className="text-slate-400 text-[11px]">Require interdepartmental signoff before DDO budget approval</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.blockDuplicateSanctions}
                  onChange={e => setConfig(prev => ({ ...prev, blockDuplicateSanctions: e.target.checked }))}
                  className="w-4 h-4 accent-teal-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onResetData}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer"
              >
                Reset Database to Demo Defaults
              </button>

              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg cursor-pointer"
              >
                Save Algorithm Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Provision New User Account</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">User Full Name *</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  required
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Email Address *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  required
                  placeholder="e.g. ramesh@gujarat.gov.in"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Assigned Role *</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option value="officer">Department Officer</option>
                  <option value="admin">Administrator / DDO</option>
                  <option value="citizen">Public Citizen</option>
                </select>
              </div>

              {newUserRole === 'officer' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Department *</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={e => setNewUserDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Designation / Title</label>
                <input
                  type="text"
                  value={newUserDesignation}
                  onChange={e => setNewUserDesignation(e.target.value)}
                  placeholder="e.g. Executive Engineer"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
