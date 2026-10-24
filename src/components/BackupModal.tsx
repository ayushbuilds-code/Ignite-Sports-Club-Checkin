import React, { useState, useEffect, useRef } from 'react';
import { Database, Download, Upload, HardDrive, AlertTriangle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { dbService } from '../services/db';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackupRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onBackupRestored,
}) => {
  const [storageInfo, setStorageInfo] = useState<{
    usageMB: string;
    quotaMB: string;
    percentUsed: number;
  }>({ usageMB: '0.0', quotaMB: '0.0', percentUsed: 0 });

  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      dbService.getStorageEstimate().then((info) => setStorageInfo(info));
      setRestoreStatus(null);
      setErrorStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    try {
      const fullBackup = await dbService.exportFullBackup();
      const jsonStr = JSON.stringify(fullBackup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      link.href = url;
      link.download = `Ignite_Esports_Tournament_Backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorStatus(`Backup export failed: ${error.message}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = await dbService.restoreFullBackup(parsed);
        setRestoreStatus(`Successfully restored ${result.teamsCount} teams and ${result.logsCount} activity logs!`);
        onBackupRestored();
      } catch (err: unknown) {
        const error = err as Error;
        setErrorStatus(`Restore failed: ${error.message}`);
      }
    };
    reader.onerror = () => {
      setErrorStatus('Failed to read the backup JSON file.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-xl overflow-hidden border border-purple-500/30 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0c0f1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                IndexedDB Storage & Backup
              </h3>
              <p className="text-xs text-slate-400">
                100% Offline Local Device Persistence & Safety
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* Storage Meter */}
          <div className="bg-[#090b16] rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300 font-semibold">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span>Local IndexedDB Usage</span>
              </span>
              <span className="font-mono text-purple-300">
                {storageInfo.usageMB} MB / ~{storageInfo.quotaMB} MB available
              </span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                style={{ width: `${Math.max(storageInfo.percentUsed, 1)}%` }}
              />
            </div>
          </div>

          {/* Privacy & Browser Limitations Note */}
          <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Cloud Privacy Guarantee</span>
            </div>
            <p>
              Leader photographs and attendance logs are stored purely in your browser's local IndexedDB. They are <strong>never</strong> transmitted to any external server or third-party cloud.
            </p>
            <div className="flex items-start gap-2 pt-2 border-t border-purple-500/20 text-slate-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Important:</strong> Clearing browser cookies/cache or opening in an incognito window can reset local IndexedDB. Download a JSON backup below before closing your session.
              </p>
            </div>
          </div>

          {/* Status Feedback */}
          {restoreStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{restoreStatus}</span>
            </div>
          )}

          {errorStatus && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Export & Restore Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Export */}
            <div className="p-4 rounded-xl bg-[#090b16] border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-heading font-bold text-white text-sm mb-1">
                  Export JSON Backup
                </h4>
                <p className="text-[11px] text-slate-400">
                  Save all teams, attendance timestamps, leader photos, and match settings to a portable file.
                </p>
              </div>
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Backup</span>
              </button>
            </div>

            {/* Restore */}
            <div className="p-4 rounded-xl bg-[#090b16] border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-heading font-bold text-white text-sm mb-1">
                  Restore Backup
                </h4>
                <p className="text-[11px] text-slate-400">
                  Restore an exported tournament JSON file. Replaces current database with backup state.
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Select Backup JSON</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0c0f1f] border-t border-purple-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
