import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-purple-500/50';
        let bgClass = 'bg-[#0f1426]/95';
        let Icon = Info;
        let iconColor = 'text-purple-400';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/60 shadow-lg shadow-emerald-950/40';
          bgClass = 'bg-[#061c14]/95';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/60 shadow-lg shadow-rose-950/40';
          bgClass = 'bg-[#1c080d]/95';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/60 shadow-lg shadow-amber-950/40';
          bgClass = 'bg-[#1c1308]/95';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 border backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 flex items-start justify-between gap-3 ${borderClass} ${bgClass}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div>
                <h4 className="text-xs font-bold text-white font-heading">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[11px] text-slate-300 mt-0.5">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white shrink-0 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
