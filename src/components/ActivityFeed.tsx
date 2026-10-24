import React from 'react';
import { Activity, Clock, CheckCircle2, Undo2, Plus, Edit2, Camera, Trash2 } from 'lucide-react';
import { ActivityLog, Team } from '../types';

interface ActivityFeedProps {
  logs: ActivityLog[];
  teams: Team[];
  onOpenUndoCheckIn: (team: Team) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  logs,
  teams,
  onOpenUndoCheckIn,
}) => {
  const getActionBadge = (action: ActivityLog['action'], method?: string) => {
    switch (action) {
      case 'CHECK_IN':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
            {method === 'photo' ? <Camera className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            <span>{method === 'photo' ? 'Photo Verified' : 'Manual Verified'}</span>
          </span>
        );
      case 'UNDO_CHECK_IN':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
            <Undo2 className="w-3 h-3" />
            <span>Attendance Reverted</span>
          </span>
        );
      case 'ADD_TEAM':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
            <Plus className="w-3 h-3" />
            <span>Team Registered</span>
          </span>
        );
      case 'EDIT_TEAM':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
            <Edit2 className="w-3 h-3" />
            <span>Roster Edited</span>
          </span>
        );
      case 'DELETE_TEAM':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            <Trash2 className="w-3 h-3" />
            <span>Team Removed</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-slate-400 font-mono">
            {action}
          </span>
        );
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1m ago';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div className="cyber-panel rounded-2xl p-4 sm:p-5 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
            Live Check-In Feed
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/30 animate-pulse">
          LIVE DESK SYNC
        </span>
      </div>

      {/* Logs List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No tournament activity recorded yet today.
          </div>
        ) : (
          logs.map((log) => {
            const teamObj = teams.find((t) => t.id === log.teamId);
            const canUndo = log.action === 'CHECK_IN' && teamObj && teamObj.status === 'Present';

            return (
              <div
                key={log.id}
                className="bg-[#090b16] rounded-xl p-3 border border-slate-800/80 hover:border-purple-500/30 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getActionBadge(log.action, log.method)}
                    <span className="font-mono text-purple-300 font-bold">
                      {log.teamId}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatRelativeTime(log.timestamp)}
                  </span>
                </div>

                <div className="text-slate-200 font-medium truncate">
                  <span className="font-bold text-white">{log.teamName}</span> • Leader: <span className="text-cyan-300">{log.leaderName}</span>
                </div>

                {log.details && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {log.details}
                  </p>
                )}

                {canUndo && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex justify-end">
                    <button
                      onClick={() => onOpenUndoCheckIn(teamObj)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Undo this check-in</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
