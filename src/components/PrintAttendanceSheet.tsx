import React from 'react';
import { Printer, X } from 'lucide-react';
import { Team, TournamentSettings, CheckInStats } from '../types';

interface PrintAttendanceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  settings: TournamentSettings;
  stats: CheckInStats;
}

export const PrintAttendanceSheet: React.FC<PrintAttendanceSheetProps> = ({
  isOpen,
  onClose,
  teams,
  settings,
  stats,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-black rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Screen Controls Header (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-heading font-black text-base text-white">
              Official Tournament Attendance & Verification Sheet
            </h3>
            <p className="text-xs text-slate-400">
              Printer-optimized document ready for physical clipboards, sign-offs, and tournament archives.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document (Ctrl/Cmd + P)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="printable-container p-8 sm:p-10 space-y-6 bg-white text-black">
          
          {/* Header Banner */}
          <div className="border-b-2 border-black pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider text-black">
                {settings.tournamentName}
              </h1>
              <div className="text-xs font-semibold text-slate-700 mt-1 space-x-3">
                <span><strong>Game:</strong> {settings.game}</span>
                <span>•</span>
                <span><strong>Format:</strong> {settings.format}</span>
                <span>•</span>
                <span><strong>Match #:</strong> {settings.matchNumber}</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                <span><strong>Venue:</strong> {settings.venue}</span> | <span><strong>Organizer:</strong> {settings.organizer}</span>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-sm bg-slate-100 p-2 border border-slate-300 rounded">
                OFFICIAL ATTENDANCE ROSTER
              </div>
              <div className="text-slate-600 mt-1 font-mono">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-50 border border-slate-300 rounded-lg">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Registered Teams</span>
              <strong className="text-sm">{stats.total}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Teams Present</span>
              <strong className="text-sm text-emerald-700">{stats.present}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Teams Pending</span>
              <strong className="text-sm text-amber-700">{stats.pending}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Attendance Rate</span>
              <strong className="text-sm text-purple-700">{stats.percentage}%</strong>
            </div>
          </div>

          {/* Attendance Table */}
          <table className="w-full text-left text-xs border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-black uppercase font-bold text-[11px]">
                <th className="border border-slate-400 p-2 text-center w-12">Slot</th>
                <th className="border border-slate-400 p-2 w-20">Team ID</th>
                <th className="border border-slate-400 p-2">Team Name</th>
                <th className="border border-slate-400 p-2">Leader / Captain</th>
                <th className="border border-slate-400 p-2">Contact / Phone</th>
                <th className="border border-slate-400 p-2 text-center w-24">Status</th>
                <th className="border border-slate-400 p-2 text-center w-28">Check-In Time</th>
                <th className="border border-slate-400 p-2 text-center w-32">Captain Signature</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="border-b border-slate-300 hover:bg-slate-50">
                  <td className="border border-slate-400 p-2 text-center font-bold font-mono">
                    #{t.slotNumber}
                  </td>
                  <td className="border border-slate-400 p-2 font-mono font-semibold">
                    {t.id}
                  </td>
                  <td className="border border-slate-400 p-2">
                    <div className="font-bold">{t.name}</div>
                    <div className="text-[10px] text-slate-600 truncate max-w-xs">
                      {t.players.join(', ')}
                    </div>
                  </td>
                  <td className="border border-slate-400 p-2 font-semibold">
                    {t.leaderName}
                  </td>
                  <td className="border border-slate-400 p-2 font-mono text-[11px]">
                    {t.leaderPhone || '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-mono text-[10px]">
                    {t.checkInTimestamp ? new Date(t.checkInTimestamp).toLocaleTimeString() : '-'}
                  </td>
                  <td className="border border-slate-400 p-2 text-center">
                    {t.status === 'Present' ? (
                      <span className="text-[10px] text-slate-700 italic">
                        {t.checkInMethod === 'photo' ? '✓ Photo Verified' : '✓ Manual Verified'}
                      </span>
                    ) : (
                      <div className="h-6 border-b border-dashed border-slate-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signoff Footer */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-xs text-slate-700">
            <div>
              <div className="border-b border-slate-400 h-8 mb-1" />
              <span>Head Referee / Tournament Marshal</span>
            </div>
            <div>
              <div className="border-b border-slate-400 h-8 mb-1" />
              <span>Registration Desk In-Charge</span>
            </div>
            <div>
              <div className="border-b border-slate-400 h-8 mb-1" />
              <span>Date & Official Timestamp</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
