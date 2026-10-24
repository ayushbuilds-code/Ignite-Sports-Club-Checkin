import React from 'react';
import { X, Download, Trash2, ShieldCheck, User } from 'lucide-react';

interface PhotoViewModalProps {
  photoUrl: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onDeletePhoto?: () => void;
}

export const PhotoViewModal: React.FC<PhotoViewModalProps> = ({
  photoUrl,
  title,
  isOpen,
  onClose,
  onDeletePhoto,
}) => {
  if (!isOpen || !photoUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_photo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel-glow rounded-3xl w-full max-w-lg overflow-hidden border border-purple-500/40 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0c0f1f]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-black text-white text-base truncate">
              {title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image preview */}
        <div className="p-6 flex items-center justify-center bg-black/90">
          <img
            src={photoUrl}
            alt={title}
            className="max-h-[60vh] w-auto rounded-2xl object-contain border-2 border-emerald-500/40 shadow-2xl"
          />
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#0c0f1f] border-t border-purple-500/20 flex items-center justify-between">
          {onDeletePhoto ? (
            <button
              onClick={() => {
                if (window.confirm('Delete this stored leader photo? This will remove the visual proof.')) {
                  onDeletePhoto();
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Photo</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
