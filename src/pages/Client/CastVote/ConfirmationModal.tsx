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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6 flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <XCircle size={24} />
        </button>

        {/* Confirmation Icon */}
        <div className="mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        {/* Message */}
        <p className="text-center text-gray-800 dark:text-gray-200 text-lg font-semibold mb-6">
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex w-full justify-center gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-center"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
