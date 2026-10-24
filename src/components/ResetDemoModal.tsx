import React, { useState } from 'react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface ResetDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetDemoModal: React.FC<ResetDemoModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'RESET';

  const handleReset = () => {
    if (isConfirmed) {
      onConfirmReset();
      setConfirmText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-md overflow-hidden border border-rose-500/40 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-[#1f0f15]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Reset Demo Data</h3>
              <p className="text-xs text-rose-300/80">Protected Confirmation Required</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex gap-3 text-slate-300">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-200 mb-1">
                Warning: This will reset attendance for all tournament teams!
              </p>
              <p>
                The database will be restored to the 12 registered tournament squads (VOID REAPERS, VOID, Team Avengers, RCB, gods reign, PANEL USERS, etc.) ready for live check-in today.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              To confirm, type <span className="text-rose-400 font-mono font-bold">RESET</span> below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type RESET to confirm"
              className="w-full bg-[#090b16] border border-rose-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-400"
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
            onClick={handleReset}
            disabled={!isConfirmed}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </div>
    </div>
  );
};
