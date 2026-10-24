import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  Clock, 
  Download, 
  Edit3, 
  Trash2, 
  Undo2, 
  User,
  Users, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import { Team } from '../types';
import { downloadLeaderPhoto } from '../utils/csv';

interface TeamCardProps {
  team: Team;
  onOpenCheckIn: (team: Team) => void;
  onOpenManualCheckIn: (team: Team) => void;
  onOpenUndoCheckIn: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
  onViewPhoto: (photoUrl: string, title: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onOpenCheckIn,
  onOpenManualCheckIn,
  onOpenUndoCheckIn,
  onEditTeam,
  onDeleteTeam,
  onViewPhoto,
}) => {
  const [showRoster, setShowRoster] = useState(false);
  const isPresent = team.status === 'Present';

  // Format timestamp
  const formattedTime = team.checkInTimestamp
    ? new Date(team.checkInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className={`rounded-2xl transition-all duration-300 relative flex flex-col justify-between border ${
        isPresent
          ? 'bg-gradient-to-b from-[#0a1f18]/90 via-[#0a141a]/90 to-[#070912]/95 border-emerald-500/40 shadow-lg shadow-emerald-950/30 hover:border-emerald-500/60'
          : 'cyber-panel hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-950/20'
      }`}
    >
      {/* Top Banner / Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {team.id}
            </span>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Slot #{team.slotNumber}
            </span>
            {team.isSample && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Sample
              </span>
            )}
            {team.group && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-500/30">
                {team.group}
              </span>
            )}
          </div>

          {/* Status Badge */}
          {isPresent ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-display">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRESENT</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-display">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>PENDING</span>
            </span>
          )}
        </div>

        {/* Team Name and Leader Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-black font-heading text-white tracking-wide line-clamp-1 group-hover:text-purple-300 transition-colors">
              {team.name}
            </h3>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Leader:</span>
              <span className="font-semibold text-cyan-300">{team.leaderName}</span>
              {team.leaderPhone && (
                <a
                  href={`tel:${team.leaderPhone}`}
                  className="text-[11px] font-mono text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30 transition-colors"
                  title="Call Leader"
                >
                  📞 {team.leaderPhone}
                </a>
              )}
              {team.leaderIgId && (
                <span className="text-[11px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                  {team.leaderIgId}
                </span>
              )}
            </div>
          </div>

          {/* Leader Photo Thumbnail if Present */}
          {isPresent && team.photoUrl && (
            <div className="relative group/photo shrink-0 cursor-pointer" onClick={() => onViewPhoto(team.photoUrl!, `${team.name} Leader`)}>
              <img
                src={team.photoUrl}
                alt={`${team.leaderName}`}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-emerald-500/60 shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity">
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Notes if present */}
        {team.notes && (
          <p className="text-[11px] text-slate-400 mt-2 italic line-clamp-1">
            📌 {team.notes}
          </p>
        )}
      </div>

      {/* Card Middle: Roster & Verification Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Roster Preview */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Squad Roster ({team.rosterSize} players)</span>
            </span>
            <button
              onClick={() => setShowRoster(!showRoster)}
              className="text-purple-400 hover:text-purple-300 text-[11px] underline font-medium"
            >
              {showRoster ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {showRoster ? (
            <div className="bg-[#090b16] rounded-xl p-2.5 border border-slate-800 space-y-1.5 animate-in fade-in duration-200">
              {team.players.map((player, idx) => (
                <div key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-[#0c1022] p-1.5 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] font-mono text-purple-400 font-bold mt-0.5 shrink-0">P{idx + 1}</span>
                  <span className="text-[11px] leading-relaxed break-all">{player}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {team.players.map((p, idx) => {
                const shortName = p.split('(')[0].trim();
                return (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800 truncate max-w-[150px]"
                    title={p}
                  >
                    {shortName || p}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Attendance Verification Details (If Present) */}
        {isPresent && (
          <div className="bg-[#061511] rounded-xl p-2.5 border border-emerald-500/30 text-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {team.checkInMethod === 'photo' ? 'Photo Verified Attendance' : 'Manual Verified (No Photo)'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Checked in: {formattedTime}
              </div>
            </div>

            {team.photoUrl && (
              <button
                onClick={() => downloadLeaderPhoto(team)}
                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 transition-colors"
                title="Download Leader Attendance Photo"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>

      {/* Card Footer: Large Action Buttons */}
      <div className="p-4 sm:p-5 pt-0">
        
        {!isPresent ? (
          <div className="flex items-center gap-2">
            {/* Primary Big Button: Capture & Check In */}
            <button
              onClick={() => onOpenCheckIn(team)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 group"
            >
              <Camera className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
              <span>Capture & Check In</span>
            </button>

            {/* Quick Manual Check-In Button */}
            <button
              onClick={() => onOpenManualCheckIn(team)}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 transition-colors"
              title="Manual Check-In without photo"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Edit / Delete menu */}
            <button
              onClick={() => onEditTeam(team)}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Edit Team"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteTeam(team)}
              className="p-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors"
              title="Delete Team"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Present: Undo Check-in */}
            <button
              onClick={() => onOpenUndoCheckIn(team)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Check-In</span>
            </button>

            {/* Retake Photo / Check In again */}
            <button
              onClick={() => onOpenCheckIn(team)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-800 transition-colors"
              title="Update Leader Photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Edit */}
            <button
              onClick={() => onEditTeam(team)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Edit Team Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
