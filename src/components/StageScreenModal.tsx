import React, { useState } from 'react';
import { Tv, X, Maximize, Minimize, Trophy, CheckCircle2, Clock, Users } from 'lucide-react';
import { Team, TournamentSettings, CheckInStats } from '../types';
import { TacticalBackground } from './TacticalBackground';

interface StageScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  settings: TournamentSettings;
  stats: CheckInStats;
}

export const StageScreenModal: React.FC<StageScreenModalProps> = ({
  isOpen,
  onClose,
  teams,
  settings,
  stats,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#05060b] text-white p-4 sm:p-8 animate-in fade-in duration-300 overflow-y-auto relative">
      {/* Background Matrix & Rotating Watermark */}
      <TacticalBackground />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <div className="w-full h-full bg-[#090b14] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-wider bg-gradient-to-r from-white via-purple-200 to-cyan-400 bg-clip-text text-transparent">
                {settings.tournamentName}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                LIVE CHECK-IN
              </span>
            </div>
            <p className="text-sm text-slate-400 font-mono mt-0.5">
              {settings.game} • {settings.format} • {settings.venue}
            </p>
          </div>
        </div>

        {/* Room Credentials Banner & Window controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 bg-[#0a0f24] px-4 py-2.5 rounded-2xl border border-purple-500/30 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">ROOM ID</span>
              <span className="text-cyan-300 font-black text-base">{settings.roomId}</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">PASSWORD</span>
              <span className="text-purple-300 font-black text-base">{settings.roomPassword}</span>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Close Stage View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress & Stats Bar */}
      <div className="my-6 cyber-panel rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold font-heading uppercase tracking-wider text-slate-200">
              Tournament Lobby Attendance
            </span>
            <span className="text-sm font-mono px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {stats.present} / {stats.total} Teams Present
            </span>
          </div>
          <span className="text-2xl font-black font-heading text-cyan-400">
            {stats.percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-6 bg-black rounded-full p-1 border border-purple-500/30 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-400 transition-all duration-700 ease-out relative"
            style={{ width: `${stats.percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* 12 Slot Arena Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
        {teams.map((team) => {
          const isPresent = team.status === 'Present';

          return (
            <div
              key={team.id}
              className={`rounded-2xl p-5 border-2 flex flex-col justify-between transition-all ${
                isPresent
                  ? 'bg-gradient-to-br from-[#062419] to-[#071520] border-emerald-500/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-[#090c1a] border-slate-800/80 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-black text-sm px-2.5 py-1 rounded-lg bg-black/60 text-cyan-300 border border-cyan-500/40">
                    SLOT #{team.slotNumber}
                  </span>
                  {isPresent ? (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CHECKED IN</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>PENDING</span>
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-lg text-white truncate mb-1">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-300">
                  Captain: <strong className="text-cyan-300">{team.leaderName}</strong>
                </p>
              </div>

              {/* Leader Photo Thumbnail if verified */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {team.players.length} Players
                </span>
                {isPresent && team.photoUrl ? (
                  <img
                    src={team.photoUrl}
                    alt={team.leaderName}
                    className="w-10 h-10 rounded-lg object-cover border border-emerald-400 shadow-sm"
                  />
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {team.id}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

    </div>
  );
};
