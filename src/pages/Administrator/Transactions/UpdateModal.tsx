import { useState } from 'react';
import { XCircle, Wallet, ShieldCheck } from 'lucide-react';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

interface TRANSACTION {
  id: number;
  fullName: string;
  clientId: number;
  idPicture: string;
  votesGiven: number;
  amountPaid: number;
  createdDate: string;
  createdTime: string;
}

interface UpdateModalProps {
  transaction: TRANSACTION;
  onClose: () => void;
  onUpdate: (amount: number) => void;
}

const UpdateModal = ({ transaction, onClose, onUpdate }: UpdateModalProps) => {
  const { showAlert } = useAlert();
  const { authUser } = useAuth();
  const token = authUser?.token;
  const userId = authUser?.user.id;

  const [amount, setAmount] = useState<number>(transaction.amountPaid);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProceed = () => {
    if (!amount || amount <= 0) {
      showAlert('error', 'Please enter a valid amount.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (passcode !== 'CSD2026!') {
      setPasscodeError('Invalid Super Admin Passcode.');
      return;
    }

    if (!token) {
      showAlert('error', 'Unauthorized. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/purchase-transactions/${transaction.id}?_method=PATCH`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            client_id: transaction.clientId,
            amount_paid: amount,
            handled_by: userId,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update transaction.');
      }

      showAlert('success', data.message || 'Transaction updated successfully.');
      onUpdate(amount);
      setShowConfirm(false);
      onClose();
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN UPDATE MODAL */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-boxdark shadow-xl p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <XCircle size={22} />
          </button>

          <h2 className="text-xl font-semibold text-center text-black dark:text-white mb-6">
            Update Transaction
          </h2>

          {/* USER INFO */}
          <div className="flex items-center gap-4 mb-6 border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
            {transaction.idPicture ? (
              <img
                src={transaction.idPicture}
                alt={transaction.fullName}
                className="h-14 w-14 rounded-full object-cover border shrink-0"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 shrink-0">
                N/A
              </div>
            )}

            <div className="text-sm">
              <p className="font-semibold text-black dark:text-white">
                {transaction.fullName}
              </p>

              <p className="text-gray-500">
                Votes Given:{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {transaction.votesGiven}
                </span>
              </p>

              <p className="text-gray-500">
                Amount Paid:{' '}
                <span className="font-medium text-green-600 dark:text-green-400">
                  ₱{transaction.amountPaid}
                </span>
              </p>

              <p className="text-gray-400 text-xs mt-1">
                {transaction.createdDate} — {transaction.createdTime}
              </p>
            </div>
          </div>

          {/* AMOUNT INPUT */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
              New Amount Paid
            </label>

            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 dark:border-strokedark focus-within:ring-2 focus-within:ring-primary">
              <Wallet size={18} className="text-gray-400 shrink-0" />
              <input
                type="number"
                value={amount}
                min={1}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-transparent outline-none text-black dark:text-white"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={handleProceed}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-boxdark rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-yellow-500" size={22} />
              <h3 className="font-semibold text-black dark:text-white">
                Super Admin Approval
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Confirm update for:{' '}
              <span className="font-semibold">{transaction.fullName}</span>
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              New Amount:{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">
                ₱{amount}
              </span>
            </p>

            {/* PASSCODE */}
            <input
              type="password"
              placeholder="Enter Super Admin Passcode"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setPasscodeError('');
              }}
              className="w-full border rounded-lg px-3 py-2 mb-2 outline-none dark:bg-transparent dark:border-strokedark focus:ring-2 focus:ring-primary"
            />

            {passcodeError && (
              <p className="text-red-500 text-xs mb-3">{passcodeError}</p>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPasscode('');
                  setPasscodeError('');
                }}
                disabled={loading}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateModal;
