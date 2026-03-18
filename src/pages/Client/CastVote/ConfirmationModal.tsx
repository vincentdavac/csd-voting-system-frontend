import { CheckCircle, XCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 flex flex-col items-center p-8">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />

        {/* Close button - Integrated more subtly */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <XCircle size={20} />
        </button>

        {/* Confirmation Icon with Pulse Effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30">
            <CheckCircle
              size={36}
              className="text-green-600 dark:text-green-400"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Are you sure?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
            {message || 'Please confirm your action to proceed.'}
          </p>
        </div>

        {/* Action buttons - Full width for better mobile tap targets */}
        <div className="flex flex-col sm:flex-row w-full gap-3">
          <button
            onClick={onCancel}
            className="flex-1 order-2 sm:order-1 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 order-1 sm:order-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-green-600 text-sm font-semibold text-white hover:bg-black dark:hover:bg-green-500 shadow-lg shadow-green-900/10 transition-all active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
