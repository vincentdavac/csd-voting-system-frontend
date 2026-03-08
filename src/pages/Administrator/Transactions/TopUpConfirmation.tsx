import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  voter: any;
  amount: number;
  onClose: () => void;
}

const TopUpConfirmation = ({ voter, amount, onClose }: Props) => {
  const handleConfirm = () => {
    // Call API to top up points here
    alert(`Added ${amount} credits to ${voter.fullName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <XCircle size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle
            size={28}
            className="text-green-600 dark:text-green-400"
          />
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Confirm Top Up
          </h2>
        </div>

        {/* Info */}
        <div className="mb-6 space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Student:</span> {voter.fullName}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Amount:</span> {amount} credits
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Remaining Votes:</span>{' '}
            {voter.remainingVotes}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg border border-strokedark px-4 py-2 text-gray-700 dark:text-gray-300 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <XCircle size={18} />
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
          >
            <CheckCircle size={18} />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpConfirmation;
