import React, { useState } from 'react';
import { Settings, X, Save, Copy, Check, KeyRound, Trophy, MapPin, Clock } from 'lucide-react';
import { TournamentSettings } from '../types';

interface TournamentSettingsModalProps {
  settings: TournamentSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: TournamentSettings) => void;
}

export const TournamentSettingsModal: React.FC<TournamentSettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<TournamentSettings>(settings);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCredentials = () => {
    const text = `🏆 ${formData.tournamentName}
🎮 Game: ${formData.game}
🔑 Custom Room ID: ${formData.roomId}
🔒 Password: ${formData.roomPassword}
⏰ Time: ${formData.scheduledTime}
📍 Venue: ${formData.venue}
⚡ Checked-In Captains: Please join the lobby in your designated Slot!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-xl overflow-hidden border border-purple-500/30 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0c0f1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                Tournament & Room Controls
              </h3>
              <p className="text-xs text-slate-400">
                Esports match configuration and custom room broadcast
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Quick Broadcast Card */}
          <div className="bg-[#090b16] rounded-2xl p-4 border border-purple-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-heading text-purple-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Captain Room Broadcast Card</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to Chat'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/50 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">ROOM ID</span>
                <span className="text-cyan-300 font-bold text-sm">{formData.roomId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PASSWORD</span>
                <span className="text-purple-300 font-bold text-sm">{formData.roomPassword}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tournament Title
              </label>
              <input
                type="text"
                value={formData.tournamentName}
                onChange={(e) => setFormData({ ...formData, tournamentName: e.target.value })}
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Game Title</label>
                <input
                  type="text"
                  value={formData.game}
                  onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Match / Game #</label>
                <input
                  type="number"
                  min="1"
                  value={formData.matchNumber}
                  onChange={(e) => setFormData({ ...formData, matchNumber: parseInt(e.target.value, 10) || 1 })}
                  className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Room ID</label>
                <input
                  type="text"
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Room Password</label>
                <input
                  type="text"
                  value={formData.roomPassword}
                  onChange={(e) => setFormData({ ...formData, roomPassword: e.target.value })}
                  className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Scheduled Time</label>
                <input
                  type="text"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Venue / Stage Location</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Organizer Desk Name</label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
