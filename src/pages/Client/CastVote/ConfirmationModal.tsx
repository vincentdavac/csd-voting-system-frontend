import { ShieldCheck, XCircle } from 'lucide-react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#020d26] shadow-2xl border-4 border-slate-100 dark:border-white/5 flex flex-col items-center p-8 sm:p-10">
        {/* Top Tactical Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-40" />

        {/* Subtle Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition-colors p-1"
          aria-label="Abort"
        >
          <XCircle size={22} strokeWidth={1.5} />
        </button>

        {/* ICON HUB - Tactical Pulse */}
        <div className="relative mb-8">
          {/* Triple Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping" />
          <div className="absolute -inset-4 rounded-full bg-blue-600/5 animate-pulse" />

          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 dark:bg-blue-500/10 border-2 border-slate-100 dark:border-blue-500/20 shadow-inner">
            <ShieldCheck
              size={40}
              className="text-blue-600 dark:text-blue-400 filter drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
            />
          </div>
        </div>

        {/* TEXT CONTENT - System Protocol Language */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 mb-1">
            <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">
              Verification Check
            </p>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Confirm Action?
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed px-1">
            {message ||
              'Reviewing system parameters. Proceed with data transmission?'}
          </p>
        </div>

        {/* ACTION BUTTONS - Mobile Optimized */}
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            Confirm Entry
          </button>

          <button
            onClick={onCancel}
            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-white/5 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>

        {/* System Footer Metadata */}
        <div className="mt-6">
          <p className="text-[8px] font-mono text-slate-300 dark:text-white/10 uppercase tracking-[0.2em]">
            SECURE-ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
