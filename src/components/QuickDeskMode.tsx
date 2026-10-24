import React, { useState } from 'react';
import { Camera, Check, Clock, Zap, Search, Eye, ShieldCheck, UserCheck } from 'lucide-react';
import { Team } from '../types';

interface QuickDeskModeProps {
  teams: Team[];
  onOpenCheckIn: (team: Team) => void;
  onOpenManualCheckIn: (team: Team) => void;
  onOpenUndoCheckIn: (team: Team) => void;
  onViewPhoto: (photoUrl: string, title: string) => void;
}

export const QuickDeskMode: React.FC<QuickDeskModeProps> = ({
  teams,
  onOpenCheckIn,
  onOpenManualCheckIn,
  onOpenUndoCheckIn,
  onViewPhoto,
}) => {
  const [deskSearch, setDeskSearch] = useState('');

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(deskSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(deskSearch.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(deskSearch.toLowerCase()) ||
      t.slotNumber.toString() === deskSearch.trim()
  );

  return (
    <div className="cyber-panel rounded-3xl p-5 sm:p-6 border border-purple-500/40 shadow-2xl relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
              <Zap className="w-5 h-5 animate-bounce" />
            </span>
            <h2 className="text-lg sm:text-xl font-heading font-black text-white tracking-wider">
              REGISTRATION DESK SPEED MODE
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              FAST-CHECK-IN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tap any slot or team card below to launch instant camera capture. Designed for maximum throughput at the entry gate.
          </p>
        </div>

        {/* Quick Slot Search / ID Lookup */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={deskSearch}
            onChange={(e) => setDeskSearch(e.target.value)}
            placeholder="Type Slot #, ID, or Leader..."
            className="w-full bg-[#0a0d1a] border-2 border-purple-500/40 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Grid of Slots / Large Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {filteredTeams.map((team) => {
          const isPresent = team.status === 'Present';

          return (
            <div
              key={team.id}
              className={`rounded-2xl p-4 transition-all border-2 relative flex flex-col justify-between ${
                isPresent
                  ? 'bg-gradient-to-br from-[#062016]/90 to-[#07131a]/95 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                  : 'bg-gradient-to-br from-[#121629]/90 to-[#0c0f1c]/95 border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-950/40'
              }`}
            >
              {/* Slot & Status Line */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black font-heading px-2.5 py-1 rounded-lg bg-black/60 text-cyan-300 border border-cyan-500/40 shadow-sm">
                      SLOT #{team.slotNumber}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {team.id}
                    </span>
                  </div>

                  {isPresent ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Check className="w-3.5 h-3.5" />
                      <span>PRESENT</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>PENDING</span>
                    </span>
                  )}
                </div>

                {/* Team Name */}
                <h4 className="font-heading font-black text-white text-base truncate mb-1">
                  {team.name}
                </h4>

                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Leader: <strong className="text-cyan-300">{team.leaderName}</strong></span>
                  {isPresent && team.photoUrl && (
                    <button
                      onClick={() => onViewPhoto(team.photoUrl!, `${team.name} Leader`)}
                      className="text-[11px] text-purple-300 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Photo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Big Fast Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                {!isPresent ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenCheckIn(team)}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4 text-cyan-300" />
                      <span>CAMERA CHECK-IN</span>
                    </button>
                    <button
                      onClick={() => onOpenManualCheckIn(team)}
                      className="px-3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30"
                      title="Manual Check-In"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{team.checkInMethod === 'photo' ? 'Photo Verified' : 'Manual Verified'}</span>
                    </span>
                    <button
                      onClick={() => onOpenUndoCheckIn(team)}
                      className="text-rose-400 hover:text-rose-300 font-bold hover:underline"
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
