import React from 'react';
import { 
  Trophy, 
  Printer, 
  Download, 
  Upload, 
  Database, 
  RotateCcw, 
  Settings, 
  Tv, 
  PlusCircle, 
  Volume2, 
  VolumeX,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { TournamentSettings } from '../types';

interface HeaderProps {
  settings: TournamentSettings;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAddTeam: () => void;
  onOpenImportCsv: () => void;
  onExportCsv: () => void;
  onOpenBackup: () => void;
  onOpenSettings: () => void;
  onOpenResetDemo: () => void;
  onOpenStageScreen: () => void;
  onPrint: () => void;
  quickDeskMode: boolean;
  onToggleQuickDeskMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  soundEnabled,
  onToggleSound,
  onOpenAddTeam,
  onOpenImportCsv,
  onExportCsv,
  onOpenBackup,
  onOpenSettings,
  onOpenResetDemo,
  onOpenStageScreen,
  onPrint,
  quickDeskMode,
  onToggleQuickDeskMode,
}) => {
  return (
    <header className="no-print bg-[#090b14]/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tournament Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1020] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="/ignite-logo.png"
                    alt="Ignite Sports Club"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#090b14]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-heading tracking-wider bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
                  IGNITE CLUB
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 font-display">
                  LIVE DESK
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-2">
                <span>{settings.tournamentName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-mono text-xs">{settings.game}</span>
              </p>
            </div>
          </div>

          {/* Quick Desk Mode Toggle & Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Desk Fast Mode Toggle */}
            <button
              onClick={onToggleQuickDeskMode}
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                quickDeskMode
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-purple-500/40 hover:text-white'
              }`}
              title="Toggle Large Touch / Speed Check-In view for registration desk rush"
            >
              <Zap className={`w-4 h-4 ${quickDeskMode ? 'text-yellow-300 animate-pulse' : 'text-purple-400'}`} />
              <span>{quickDeskMode ? 'Desk Mode: Active' : 'Speed Desk Mode'}</span>
            </button>

            {/* Stage Screen (Projector View) */}
            <button
              onClick={onOpenStageScreen}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Open Stage Projector / Arena Display Mode"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Arena Stage</span>
            </button>

            {/* Add Team */}
            <button
              onClick={onOpenAddTeam}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Team</span>
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
              title={soundEnabled ? 'Sound FX On (click to mute)' : 'Sound FX Muted (click to enable)'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* More Menu Dropdown or action group */}
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={onOpenImportCsv}
                className="p-2 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors"
                title="Import Teams from CSV"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={onExportCsv}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
                title="Export Attendance Register (CSV)"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onPrint}
                className="p-2 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
                title="Print Official Attendance & Sign Sheet"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenBackup}
                className="p-2 rounded-lg text-slate-400 hover:text-yellow-300 hover:bg-yellow-950/40 transition-colors"
                title="Database Storage & Full Backup / Restore"
              >
                <Database className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 transition-colors"
                title="Tournament Room & Match Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenResetDemo}
                className="p-2 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                title="Reset to 12 Demo Teams (Confirmation Protected)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
