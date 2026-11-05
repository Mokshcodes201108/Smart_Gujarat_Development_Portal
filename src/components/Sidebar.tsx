import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Layers, 
  MapPin, 
  Handshake, 
  IndianRupee, 
  Users, 
  Bell, 
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Landmark,
  FileText,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab = 
  | 'dashboard' 
  | 'projects' 
  | 'duplicates' 
  | 'map' 
  | 'coordination' 
  | 'funds' 
  | 'citizen' 
  | 'notifications'
  | 'admin';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  duplicateCount: number;
  unreadNotifications: number;
  pendingApprovalsCount: number;
  pendingCoordinationCount: number;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  duplicateCount,
  unreadNotifications,
  pendingApprovalsCount,
  pendingCoordinationCount,
  isOpen = false,
  onClose,
  onLogout
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard Overview',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'duplicates' as NavTab,
      label: 'AI Duplicate Detection',
      shortLabel: 'AI Detection',
      icon: Sparkles,
      badge: duplicateCount > 0 ? { text: `${duplicateCount} Active`, color: 'bg-rose-500 text-white animate-pulse' } : null,
      highlight: true
    },
    {
      id: 'projects' as NavTab,
      label: 'Project Management',
      shortLabel: 'Projects',
      icon: FolderKanban,
      badge: pendingApprovalsCount > 0 ? { text: `${pendingApprovalsCount} Pending`, color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' } : null
    },
    {
      id: 'map' as NavTab,
      label: 'Interactive GIS Map',
      shortLabel: 'District Map',
      icon: MapPin,
      badge: { text: 'Bharuch', color: 'bg-teal-500/10 text-teal-300' }
    },
    {
      id: 'coordination' as NavTab,
      label: 'Dept. Coordination',
      shortLabel: 'Coordination',
      icon: Handshake,
      badge: pendingCoordinationCount > 0 ? { text: `${pendingCoordinationCount} Req`, color: 'bg-blue-500/20 text-blue-300' } : null
    },
    {
      id: 'funds' as NavTab,
      label: 'Fund Management',
      shortLabel: 'Financials',
      icon: IndianRupee,
      badge: null
    },
    {
      id: 'citizen' as NavTab,
      label: 'Citizen Portal',
      shortLabel: 'Citizen View',
      icon: Users,
      badge: { text: 'Public', color: 'bg-emerald-500/20 text-emerald-300' }
    },
    {
      id: 'admin' as NavTab,
      label: 'Admin Control Center',
      shortLabel: 'Admin',
      icon: ShieldCheck,
      badge: { text: 'Gov', color: 'bg-teal-500/20 text-teal-300 border border-teal-500/30' }
    },
    {
      id: 'notifications' as NavTab,
      label: 'Notifications',
      shortLabel: 'Alerts',
      icon: Bell,
      badge: unreadNotifications > 0 ? { text: `${unreadNotifications}`, color: 'bg-rose-500 text-white font-bold' } : null
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside className={`fixed lg:sticky top-0 lg:top-[85px] left-0 h-screen lg:h-[calc(100vh-85px)] w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-35 transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-3.5 space-y-4 overflow-y-auto">
          {/* Quick Header info */}
          <div className="px-2 pt-1 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Landmark className="w-3.5 h-3.5 text-teal-400" />
              <span>DDO Bharuch • Core Modules</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-900/40 font-semibold' 
                      : item.highlight
                      ? 'bg-slate-800/80 text-rose-300 hover:bg-slate-800 hover:text-white border border-rose-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-rose-400' : 'text-slate-400 group-hover:text-teal-400'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.badge.color}`}>
                      {item.badge.text}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: AI Sentinel & SFIC Status Box */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 shadow-inner">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-[11px] font-bold text-slate-200">PS000010 AI Sentinel</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Synchronizing 6 Departments in Bharuch. 
              <span className="text-teal-300 font-semibold block mt-0.5">₹8.45 Cr Duplicate Waste Prevented</span>
            </p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Switch User</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
