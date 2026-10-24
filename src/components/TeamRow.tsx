import React from 'react';
import { 
  Camera, 
  CheckCircle2, 
  Clock, 
  Download, 
  Edit3, 
  Trash2, 
  Undo2, 
  User, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import { Team } from '../types';
import { downloadLeaderPhoto } from '../utils/csv';

interface TeamRowProps {
  team: Team;
  onOpenCheckIn: (team: Team) => void;
  onOpenManualCheckIn: (team: Team) => void;
  onOpenUndoCheckIn: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
  onViewPhoto: (photoUrl: string, title: string) => void;
}

export const TeamRow: React.FC<TeamRowProps> = ({
  team,
  onOpenCheckIn,
  onOpenManualCheckIn,
  onOpenUndoCheckIn,
  onEditTeam,
  onDeleteTeam,
  onViewPhoto,
}) => {
  const isPresent = team.status === 'Present';
  const formattedTime = team.checkInTimestamp
    ? new Date(team.checkInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '-';

  return (
    <tr
      className={`border-b border-slate-800/80 transition-colors ${
        isPresent
          ? 'bg-[#0a1a14]/40 hover:bg-[#0a1a14]/70'
          : 'hover:bg-slate-900/60'
      }`}
    >
      {/* Slot */}
      <td className="py-3.5 px-4 text-center">
        <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
          #{team.slotNumber}
        </span>
      </td>

      {/* Team ID */}
      <td className="py-3.5 px-4">
        <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
          {team.id}
        </span>
      </td>

      {/* Team Name & Roster Count */}
      <td className="py-3.5 px-4">
        <div className="font-bold text-white text-sm">{team.name}</div>
        <div className="text-[11px] text-slate-400 truncate max-w-xs" title={team.players.join(' | ')}>
          {team.players.length} players • {team.players.map(p => p.split('(')[0].trim()).join(', ')}
        </div>
      </td>

      {/* Leader & Photo */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          {team.photoUrl ? (
            <div
              className="relative cursor-pointer group shrink-0"
              onClick={() => onViewPhoto(team.photoUrl!, `${team.name} Leader`)}
            >
              <img
                src={team.photoUrl}
                alt={team.leaderName}
                className="w-9 h-9 rounded-lg object-cover border border-emerald-500/50"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-200 text-xs">{team.leaderName}</div>
            {team.leaderPhone && (
              <div className="text-[10px] text-slate-400 font-mono">{team.leaderPhone}</div>
            )}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        {isPresent ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-display">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PRESENT</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-display">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>PENDING</span>
          </span>
        )}
      </td>

      {/* Check-In Method & Time */}
      <td className="py-3.5 px-4 text-xs font-mono">
        {isPresent ? (
          <div>
            <div className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{team.checkInMethod === 'photo' ? 'Photo Verified' : 'Manual'}</span>
            </div>
            <div className="text-[11px] text-slate-400">{formattedTime}</div>
          </div>
        ) : (
          <span className="text-slate-500">-</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {!isPresent ? (
            <>
              <button
                onClick={() => onOpenCheckIn(team)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                title="Camera Check-In"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Check In</span>
              </button>
              <button
                onClick={() => onOpenManualCheckIn(team)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors"
                title="Manual Check-In"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenUndoCheckIn(team)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
                title="Undo Check-In"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
              {team.photoUrl && (
                <button
                  onClick={() => downloadLeaderPhoto(team)}
                  className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30"
                  title="Download Photo"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          <button
            onClick={() => onEditTeam(team)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteTeam(team)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
