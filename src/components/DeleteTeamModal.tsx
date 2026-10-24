import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { Team } from '../types';

interface DeleteTeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (teamId: string) => void;
}

export const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({
  team,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-md overflow-hidden border border-rose-500/40 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-[#1f0f15]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Delete Team</h3>
              <p className="text-xs text-rose-300/80">Permanent Removal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <p className="font-bold text-rose-200 mb-1">
                Are you sure you want to delete this team from the tournament?
              </p>
              <p>
                All roster records, slot assignment, and attendance photo will be permanently removed from this device.
              </p>
            </div>
          </div>

          <div className="bg-[#090b16] rounded-xl p-4 border border-slate-800 text-xs space-y-1.5">
            <div className="text-white font-bold text-sm">{team.name}</div>
            <div className="text-purple-300 font-mono">{team.id} • Slot #{team.slotNumber}</div>
            <div className="text-slate-400">Leader: {team.leaderName}</div>
            <div className="text-slate-400">Status: <span className={team.status === 'Present' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{team.status}</span></div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0c0f1f] border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmDelete(team.id);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};
