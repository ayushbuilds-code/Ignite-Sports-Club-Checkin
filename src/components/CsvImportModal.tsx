import React, { useState, useRef } from 'react';
import { Upload, X, Download, FileText, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Team } from '../types';
import { parseTeamsCSV, downloadSampleCSVTemplate, CSVParseResult } from '../utils/csv';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTeams: Team[];
  onCommitImport: (teams: Team[]) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  existingTeams,
  onCommitImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = parseTeamsCSV(text, existingTeams);
      setParseResult(result);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setParseResult({
        validTeams: [],
        errors: ['Failed to read CSV file.'],
        warnings: [],
      });
      setIsProcessing(false);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      processFile(droppedFile);
    }
  };

  const handleConfirm = () => {
    if (parseResult && parseResult.validTeams.length > 0) {
      onCommitImport(parseResult.validTeams);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-2xl overflow-hidden border border-purple-500/30 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0c0f1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Upload className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Import Teams via CSV</h3>
              <p className="text-xs text-slate-400">Bulk register teams from tournament registration spreadsheet</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Download Sample CSV Action */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-slate-300">
                Need the standard tournament roster format? Download our pre-formatted CSV template.
              </span>
            </div>
            <button
              onClick={downloadSampleCSVTemplate}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-purple-500/70 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#080a14]/60"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              {file ? file.name : 'Click to select CSV file or drag and drop here'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports columns: Team ID, Team Name, Leader Name, Phone, Players, Slot, Notes
            </p>
          </div>

          {/* Validation Results Preview */}
          {parseResult && (
            <div className="space-y-3 pt-2">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#0a1813] border border-emerald-500/30">
                  <div className="text-lg font-heading font-black text-emerald-400">
                    {parseResult.validTeams.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Valid Teams</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1c140a] border border-amber-500/30">
                  <div className="text-lg font-heading font-black text-amber-400">
                    {parseResult.warnings.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Warnings</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1c0a0f] border border-rose-500/30">
                  <div className="text-lg font-heading font-black text-rose-400">
                    {parseResult.errors.length}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Errors</div>
                </div>
              </div>

              {/* Errors list */}
              {parseResult.errors.length > 0 && (
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please fix the following issues in your CSV:</span>
                  </div>
                  {parseResult.errors.map((err, idx) => (
                    <div key={idx} className="pl-5 text-[11px]">• {err}</div>
                  ))}
                </div>
              )}

              {/* Warnings list */}
              {parseResult.warnings.length > 0 && (
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Warnings:</span>
                  </div>
                  {parseResult.warnings.map((warn, idx) => (
                    <div key={idx} className="pl-5 text-[11px]">• {warn}</div>
                  ))}
                </div>
              )}

              {/* Valid Teams Preview Table */}
              {parseResult.validTeams.length > 0 && (
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-900/80 px-3 py-2 text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Teams Preview ({parseResult.validTeams.length} ready to import)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Status: Pending</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/80 text-xs">
                    {parseResult.validTeams.map((t, idx) => (
                      <div key={idx} className="px-3 py-2 flex items-center justify-between bg-[#080b14]">
                        <div>
                          <span className="font-mono font-bold text-purple-300 mr-2">{t.id}</span>
                          <span className="font-semibold text-white mr-2">{t.name}</span>
                          <span className="text-slate-400 text-[11px]">({t.leaderName})</span>
                        </div>
                        <span className="font-mono text-cyan-400 text-[11px]">
                          Slot #{t.slotNumber} • {t.players.length} Players
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0c0f1f] border-t border-purple-500/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!parseResult || parseResult.validTeams.length === 0}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Import {parseResult ? parseResult.validTeams.length : 0} Teams</span>
          </button>
        </div>

      </div>
    </div>
  );
};
