import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Search, 
  ShieldCheck, 
  RotateCcw, 
  UserCheck, 
  ChevronDown, 
  ExternalLink,
  Layers,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { User, AppNotification, Project } from '../types';
import { DEMO_USERS } from '../utils/storage';
import { formatCurrencyINR } from '../utils/formatters';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onResetData: () => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
  duplicateCount: number;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  notifications,
  onOpenNotifications,
  onResetData,
  onSelectProject,
  allProjects,
  duplicateCount,
  onToggleSidebar,
  isSidebarOpen,
  onLogout
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifPreview, setShowNotifPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const lower = q.toLowerCase();
    const results = allProjects.filter(p => 
      p.projectName.toLowerCase().includes(lower) ||
      p.village.toLowerCase().includes(lower) ||
      p.taluka.toLowerCase().includes(lower) ||
      p.department.toLowerCase().includes(lower) ||
      p.id.toLowerCase().includes(lower)
    ).slice(0, 6);
    setSearchResults(results);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top micro-bar for Gujarat Govt accreditation */}
      <div className="bg-slate-950 px-4 py-1 text-[11px] text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">GUJARAT SEVA FIRST INNOVATION CHALLENGE (SFIC 2026–27)</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">Problem Statement PS000010: Synchronization of Developmental Works</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-teal-400 font-medium">District Development Office – Bharuch</span>
          <button 
            onClick={onResetData}
            title="Reset dataset to default demo state"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-black text-xl border border-teal-400/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">SGDP</span>
                <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-medium hidden sm:inline">
                  GUJARAT
                </span>
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Sync Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                Smart Gujarat Development Portal <span className="text-teal-400 font-semibold">• Bharuch</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Project Search */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Quick search Bharuch projects by village, name, or scheme..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearching(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Popover */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Matching Works in Bharuch ({searchResults.length})</span>
                <span>Press ESC to close</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-400">
                    No developmental projects found matching "{searchQuery}".
                  </div>
                ) : (
                  searchResults.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p);
                        setIsSearching(false);
                        setSearchQuery('');
                      }}
                      className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-teal-400 font-semibold">{p.id}</span>
                        <span className="text-slate-400">{p.taluka} • {p.village}</span>
                      </div>
                      <div className="font-medium text-sm text-slate-100 line-clamp-1">{p.projectName}</div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                        <span>{p.department}</span>
                        <span className="font-semibold text-emerald-400">{formatCurrencyINR(p.sanctionedBudget)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions, Notifications & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Duplicate Sentinel Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>{duplicateCount} Duplicates Prevented</span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifPreview(!showNotifPreview)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors relative cursor-pointer"
              title="System Notifications & Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow-lg border-2 border-slate-900 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Preview */}
            {showNotifPreview && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-400" />
                    <span>Real-time District Alerts</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowNotifPreview(false);
                      onOpenNotifications();
                    }}
                    className="text-xs text-teal-400 hover:text-teal-300 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                  {notifications.slice(0, 4).map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setShowNotifPreview(false);
                        onOpenNotifications();
                      }}
                      className={`p-3 text-xs hover:bg-slate-800/80 cursor-pointer transition-colors ${!n.read ? 'bg-teal-950/20' : ''}`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-200 mb-0.5">
                        <span className="line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-400 line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 bg-slate-950 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setShowNotifPreview(false);
                      onOpenNotifications();
                    }}
                    className="text-xs text-teal-400 hover:underline font-medium"
                  >
                    Open Notification Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher for Hackathon Judges */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-200 transition-colors text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs uppercase shadow-sm">
                {currentUser.role === 'admin' ? 'DDO' : currentUser.role === 'officer' ? 'EE' : 'CIT'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold leading-tight text-white flex items-center gap-1">
                  <span>{currentUser.name.split(',')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-teal-400 font-medium capitalize">
                  {currentUser.role === 'admin' ? 'Admin / DDO Bharuch' : currentUser.role === 'officer' ? 'Officer (R&B)' : 'Public Citizen'}
                </div>
              </div>
            </button>

            {/* Role switch menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch User Profile</span>
                  <span className="text-teal-400 font-mono text-[10px]">Instant Demo</span>
                </div>
                <div className="space-y-1 mt-1">
                  {/* Moksh Patel Priority Profile */}
                  <button
                    onClick={() => {
                      onSwitchUser(DEMO_USERS.moksh);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                      currentUser.name === 'Moksh Patel' ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold' : 'text-slate-200 hover:bg-slate-800 border border-teal-500/30'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-teal-500/20 text-teal-300 font-black text-xs flex items-center justify-center border border-teal-400/40">
                      MP
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Moksh Patel</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">Lead</span>
                      </div>
                      <div className="text-[10px] text-teal-300 opacity-90">District Innovation Architect & Admin</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUser(DEMO_USERS.admin);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                      currentUser.role === 'admin' && currentUser.name !== 'Moksh Patel' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold">District Administrator (DDO)</div>
                      <div className="text-[10px] opacity-80">Full approval authority & duplicate oversight</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUser(DEMO_USERS.officer);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                      currentUser.role === 'officer' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">Department Officer (R&B)</div>
                      <div className="text-[10px] opacity-80">Propose projects, view sync alerts</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUser(DEMO_USERS.citizen);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                      currentUser.role === 'citizen' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-bold">Citizen Public View</div>
                      <div className="text-[10px] opacity-80">Village project transparency & feedback</div>
                    </div>
                  </button>

                  {onLogout && (
                    <div className="pt-1 mt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          onLogout();
                        }}
                        className="w-full p-2 rounded-lg text-left text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Sign Out / Switch Account</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
