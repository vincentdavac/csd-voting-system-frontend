import { CheckCircle, XCircle } from 'lucide-react';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';

interface Props {
  voter: any;
  amount: number;
  onClose: () => void;
  onSuccess?: () => void; // simplified — parent handles refetch
}

const TopUpConfirmation = ({ voter, amount, onClose, onSuccess }: Props) => {
  const { showAlert } = useAlert();
  const { authUser } = useAuth();
  const token = authUser?.token;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!token || !authUser?.user?.id) {
      showAlert('error', 'Unauthorized. Please login again.');
      return;
    }

    const userId = authUser.user.id;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/client/purchase-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_id: voter.id,
          amount_paid: amount,
          handled_by: userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to top up credits.');

      showAlert(
        'success',
        data.message || `Added ${amount} credits successfully.`,
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Decorative Top Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-green-400 to-green-600" />

        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 transition-all"
          >
            <XCircle size={22} />
          </button>

          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
              <CheckCircle
                size={36}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Review Transaction
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please confirm the top-up details below.
            </p>
          </div>

          {/* Info Card / Receipt Style */}
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-5 space-y-4 mb-8 border border-gray-100 dark:border-gray-700/50">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Student
              </span>
              <span className="font-semibold text-black dark:text-white truncate max-w-[180px]">
                {voter.fullName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Current Balance
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {voter.remainingVotes} votes
              </span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center rounded-xl bg-green-600/10 dark:bg-green-400/10 p-4 border border-green-200 dark:border-green-900/30">
                <span className="text-sm font-bold text-green-700 dark:text-green-400 uppercase">
                  Amount to Add
                </span>
                <span className="text-2xl font-black text-green-700 dark:text-green-400">
                  +{amount}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing
                </span>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Confirm Top Up
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpConfirmation;
