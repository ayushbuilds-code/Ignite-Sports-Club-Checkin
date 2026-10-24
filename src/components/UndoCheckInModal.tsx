import React from 'react';
import { Undo2, X, AlertTriangle, Clock, Camera } from 'lucide-react';
import { Team } from '../types';

interface UndoCheckInModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmUndo: (teamId: string) => void;
}

export const UndoCheckInModal: React.FC<UndoCheckInModalProps> = ({
  team,
  isOpen,
  onClose,
  onConfirmUndo,
}) => {
  if (!isOpen || !team) return null;

  const handleConfirm = () => {
    onConfirmUndo(team.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-lg overflow-hidden border border-rose-500/40 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-[#1f0f15]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Undo2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Undo Check-In</h3>
              <p className="text-xs text-rose-300/80">Revert Team to Pending Status</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-rose-200">
                Are you sure you want to revert {team.name}'s attendance?
              </p>
              <p>
                This will reset the team status to <span className="text-amber-400 font-bold">Pending</span>, remove the check-in timestamp, and remove the photo verification record.
              </p>
            </div>
          </div>

          {/* Current Check-in Details */}
          <div className="bg-[#090b16] rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              {team.photoUrl ? (
                <img
                  src={team.photoUrl}
                  alt={team.name}
                  className="w-14 h-14 rounded-lg object-cover border border-purple-500/40"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                  No Photo
                </div>
              )}
              <div className="text-xs">
                <div className="font-bold text-white text-sm">{team.name}</div>
                <div className="text-purple-300 font-mono">{team.id} • Slot #{team.slotNumber}</div>
                <div className="text-slate-400">Leader: <span className="text-cyan-300">{team.leaderName}</span></div>
              </div>
            </div>

            <div className="text-xs pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Checked in at: {team.checkInTimestamp ? new Date(team.checkInTimestamp).toLocaleTimeString() : 'N/A'}
              </span>
              <span className="font-mono text-purple-300 uppercase">
                {team.checkInMethod === 'photo' ? 'Photo Verified' : 'Manual Verified'}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0c0f1f] border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Keep Present
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5"
          >
            <Undo2 className="w-4 h-4" />
            <span>Confirm Undo Check-In</span>
          </button>
        </div>

      </div>
    </div>
  );
};
