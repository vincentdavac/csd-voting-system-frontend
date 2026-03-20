import { useState } from 'react';
import {
  XCircle,
  Wallet,
  ShieldCheck,
  User,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-gray-100 dark:border-strokedark">
          {/* Top Accent Line */}
          <div className="h-1.5 w-full bg-primary" />

          <div className="p-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 transition-colors"
            >
              <XCircle size={22} />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Edit Transaction
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adjust the top-up amount for this record.
              </p>
            </div>

            {/* USER INFO CARD */}
            <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-strokedark">
              <div className="relative">
                {transaction.idPicture ? (
                  <img
                    src={transaction.idPicture}
                    alt={transaction.fullName}
                    className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                    N/A
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-blue-500 border-2 border-white dark:border-boxdark p-1 rounded-full">
                  <User size={10} className="text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-black dark:text-white truncate">
                  {transaction.fullName}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs">
                  <span className="text-gray-500">
                    Current:{' '}
                    <b className="text-green-600 dark:text-green-400">
                      ₱{transaction.amountPaid}
                    </b>
                  </span>
                  <span className="text-gray-400">
                    {transaction.createdDate}
                  </span>
                </div>
              </div>
            </div>

            {/* AMOUNT INPUT */}
            <div className="mb-8">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 block">
                New Amount (₱)
              </label>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Wallet size={20} />
                </div>
                <input
                  type="number"
                  value={amount}
                  min={1}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-strokedark rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-black dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0.00"
                />
              </div>

              {/* Quick Preview Difference */}
              <div className="mt-3 flex items-center gap-2 px-1">
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <p className="text-xs text-gray-500">
                  Adjustment:{' '}
                  <span
                    className={
                      amount >= transaction.amountPaid
                        ? 'text-green-600'
                        : 'text-red-500'
                    }
                  >
                    {amount >= transaction.amountPaid ? '+' : ''}
                    {amount - transaction.amountPaid} credits
                  </span>
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 order-2 sm:order-1 px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 order-1 sm:order-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-opacity-90 active:scale-95 transition-all"
              >
                Review Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL (Step-up Auth) */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-white dark:bg-boxdark rounded-3xl shadow-2xl p-8 border border-yellow-500/20">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-16 w-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white">
                Elevated Permission
              </h3>
              <p className="text-sm text-gray-500 mt-2 px-4">
                A Super Admin must authorize this change to the ledger.
              </p>
            </div>

            <div className="space-y-4 mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between text-xs font-medium uppercase tracking-tighter text-gray-400">
                <span>Old: ₱{transaction.amountPaid}</span>
                <ArrowRight size={14} />
                <span className="text-green-600">New: ₱{amount}</span>
              </div>
            </div>

            {/* PASSCODE */}
            <div className="mb-4">
              <input
                type="password"
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError('');
                }}
                className="w-full border-2 text-center text-lg tracking-widest rounded-xl px-4 py-3 outline-none dark:bg-transparent dark:border-strokedark focus:border-yellow-500 transition-colors"
                autoFocus
              />
              {passcodeError && (
                <p className="text-red-500 text-xs font-medium mt-2 text-center animate-shake">
                  {passcodeError}
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="grid gap-3">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Authorize & Update'}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPasscode('');
                  setPasscodeError('');
                }}
                disabled={loading}
                className="w-full py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateModal;
