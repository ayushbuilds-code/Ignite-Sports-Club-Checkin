import React, { useState } from 'react';
import { UserCheck, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Team } from '../types';

interface ManualCheckInModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmManualCheckIn: (teamId: string, notes?: string) => void;
}

export const ManualCheckInModal: React.FC<ManualCheckInModalProps> = ({
  team,
  isOpen,
  onClose,
  onConfirmManualCheckIn,
}) => {
  const [manualNote, setManualNote] = useState<string>('Physical ID card verified at registration desk.');

  if (!isOpen || !team) return null;

  const handleConfirm = () => {
    onConfirmManualCheckIn(team.id, manualNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-lg overflow-hidden border border-amber-500/30 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-[#16130b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Manual Check-In</h3>
              <p className="text-xs text-amber-300/80">No Photo Verification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-amber-200">
                You are performing a manual attendance check-in.
              </p>
              <p>
                This team will be clearly flagged in all records and the export register as{' '}
                <span className="font-bold text-amber-300">"Manual (No Photo)"</span>.
              </p>
            </div>
          </div>

          <div className="bg-[#090b16] rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Team:</span>
              <span className="font-bold text-white">{team.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Team ID:</span>
              <span className="font-mono font-bold text-purple-300">{team.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Leader Name:</span>
              <span className="font-bold text-cyan-300">{team.leaderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Slot:</span>
              <span className="font-mono text-emerald-400 font-bold">Slot #{team.slotNumber}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reason / Manual Verification Note:
            </label>
            <input
              type="text"
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Physical Govt ID verified, Camera unavailable..."
              className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
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
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Confirm Manual Check-In</span>
          </button>
        </div>

      </div>
    </div>
  );
};
