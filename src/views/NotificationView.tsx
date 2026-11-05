import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Handshake, 
  Clock, 
  Sparkles, 
  CheckCheck, 
  Filter, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';
import { AppNotification, Project } from '../types';

interface NotificationViewProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
}

export const NotificationView: React.FC<NotificationViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateTab,
  onSelectProject,
  allProjects
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !n.read;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleActionClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.relatedProjectId) {
      const proj = allProjects.find(p => p.id === notif.relatedProjectId);
      if (proj) {
        onSelectProject(proj);
        return;
      }
    }
    if (notif.type === 'duplicate_alert') {
      onNavigateTab('duplicates');
    } else if (notif.type === 'coordination_request') {
      onNavigateTab('coordination');
    } else {
      onNavigateTab('projects');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              DISTRICT ALERT HUB
            </span>
            <span className="text-xs text-slate-400">{unreadCount} Unread Alerts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Notification & Sentinel Center
          </h2>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'ALL' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('UNREAD')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'UNREAD' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilterType('duplicate_alert')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'duplicate_alert' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-rose-300 hover:text-white'
          }`}
        >
          Duplicate Alerts
        </button>
        <button
          onClick={() => setFilterType('coordination_request')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'coordination_request' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Coordination
        </button>
        <button
          onClick={() => setFilterType('approval_required')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'approval_required' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Approvals
        </button>
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
            <Bell className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No notifications match this filter.</p>
          </div>
        ) : (
          filteredNotifications.map(item => (
            <div
              key={item.id}
              onClick={() => handleActionClick(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !item.read 
                  ? 'bg-slate-900 border-teal-500/50 shadow-md shadow-teal-950/20' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  item.type === 'duplicate_alert' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                  item.type === 'coordination_request' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                  item.type === 'approval_required' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {item.type === 'duplicate_alert' ? <ShieldAlert className="w-5 h-5" /> :
                   item.type === 'coordination_request' ? <Handshake className="w-5 h-5" /> :
                   item.type === 'approval_required' ? <Clock className="w-5 h-5" /> :
                   <CheckCircle2 className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[11px] text-slate-500 mt-1.5 block font-mono">{item.timestamp}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs text-teal-400 font-semibold hidden sm:inline">Inspect →</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
