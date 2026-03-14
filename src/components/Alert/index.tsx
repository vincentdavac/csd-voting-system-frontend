import { X } from 'lucide-react';

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
      border: 'border-green-500',
      bg: 'bg-green-100',
      iconBg: 'bg-green-500',
      titleColor: 'text-green-800',
    },
    warning: {
      border: 'border-amber-500',
      bg: 'bg-amber-100',
      iconBg: 'bg-amber-500',
      titleColor: 'text-amber-800',
    },
    error: {
      border: 'border-red-500',
      bg: 'bg-red-100',
      iconBg: 'bg-red-500',
      titleColor: 'text-red-800',
    },
  };

  const current = styles[status];

  const defaultTitles = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
  };

  const displayTitle = title || defaultTitles[status];

  return (
    <div
      className={`flex w-full max-w-[90vw] sm:max-w-sm border-l-4 sm:border-l-[6px] ${current.border} ${current.bg} px-3 py-3 sm:px-5 sm:py-4 shadow-lg rounded-md`}
    >
      {/* Icon */}
      <div
        className={`mr-3 sm:mr-4 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg ${current.iconBg} text-white text-sm sm:text-base font-bold`}
      >
        {status === 'success' && '✓'}
        {status === 'warning' && '!'}
        {status === 'error' && '✕'}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h5
          className={`font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base ${current.titleColor}`}
        >
          {displayTitle}
        </h5>
        <p className="text-xs sm:text-sm text-gray-600">{message}</p>
      </div>

      {/* Close */}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 sm:ml-3 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} className="sm:size-[18px]" />
        </button>
      )}
    </div>
  );
};

export default Alert;
