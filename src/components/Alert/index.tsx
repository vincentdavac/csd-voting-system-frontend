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
      border: 'border-[#34D399]',
      bg: 'bg-[#34D399] bg-opacity-[50%]',
      iconBg: 'bg-[#34D399]',
      titleColor: 'text-[#065F46]',
    },
    warning: {
      border: 'border-warning',
      bg: 'bg-warning bg-opacity-[50%]',
      iconBg: 'bg-warning',
      titleColor: 'text-[#9D5425]',
    },
    error: {
      border: 'border-[#F87171]',
      bg: 'bg-[#F87171] bg-opacity-[50%]',
      iconBg: 'bg-[#F87171]',
      titleColor: 'text-[#B45454]',
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
      className={`flex w-full max-w-[90vw] sm:max-w-sm border-l-4 sm:border-l-6 ${current.border} ${current.bg} px-3 py-3 sm:px-5 sm:py-4 shadow-lg rounded-md`}
    >
      {/* Icon */}
      <div
        className={`mr-3 sm:mr-4 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg ${current.iconBg} text-white text-sm sm:text-base`}
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

        <p className="text-xs sm:text-sm text-gray-700">{message}</p>
      </div>

      {/* Close */}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 sm:ml-3 text-gray-500 hover:text-red-500"
        >
          <X size={16} className="sm:size-[18px]" />
        </button>
      )}
    </div>
  );
};

export default Alert;
