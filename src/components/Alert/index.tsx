import { X, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

type AlertStatus = 'success' | 'warning' | 'error';

interface AlertProps {
  status: AlertStatus;
  title?: string;
  message: string;
  onClose?: () => void;
}

const Alert = ({ status, title, message, onClose }: AlertProps) => {
  const styles = {
    success: {
      border: 'border-green-500/30',
      bg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      bar: 'bg-green-500',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.1)]',
      icon: <CheckCircle2 size={18} />,
    },
    warning: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      bar: 'bg-amber-500',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]',
      icon: <AlertTriangle size={18} />,
    },
    error: {
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      bar: 'bg-red-500',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]',
      icon: <XCircle size={18} />,
    },
  };

  const current = styles[status];
  const displayTitle = title || status.toUpperCase();

  return (
    <div
      className={`relative flex w-full min-w-[300px] max-w-sm overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-5 ${current.border} ${current.bg} ${current.glow} p-4`}
    >
      {/* Icon Area */}
      <div
        className={`mr-4 flex shrink-0 items-start pt-0.5 ${current.iconColor}`}
      >
        {current.icon}
      </div>

      {/* Content Area */}
      <div className="flex-1 pr-4">
        <h5
          className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${current.iconColor} italic`}
        >
          {displayTitle}
        </h5>
        <p className="text-sm font-medium text-black dark:text-white leading-relaxed">
          {message}
        </p>
      </div>

      {/* Close Action */}
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {/* Tactical Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black/5 dark:bg-white/5">
        <div
          className={`h-full ${current.bar} shadow-[0_0_8px_rgba(0,0,0,0.2)] animate-progress-shrink`}
        />
      </div>
    </div>
  );
};

export default Alert;
