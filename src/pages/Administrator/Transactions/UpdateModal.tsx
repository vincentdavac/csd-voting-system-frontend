import { useState } from 'react';
import { XCircle, Wallet, ShieldCheck, IdCard } from 'lucide-react';

interface TRANSACTION {
  studentNo: string;
  fullName: string;
  idPicture: string;
  votesGiven: number;
  amountPaid: number;
  datetime: string;
}

interface UpdateModalProps {
  transaction: TRANSACTION;
  onClose: () => void;
  onUpdate: (amount: number) => void;
}

const UpdateModal = ({ transaction, onClose, onUpdate }: UpdateModalProps) => {
  const [amount, setAmount] = useState<number>(transaction.amountPaid);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleProceed = () => {
    if (!amount || amount <= 0) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (passcode !== 'CSD2026!') {
      setError('Invalid Super Admin Passcode.');
      return;
    }

    onUpdate(amount);
    setShowConfirm(false);
    onClose();
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
            <img
              src={transaction.idPicture}
              className="h-14 w-14 rounded-full object-cover"
            />

            <div className="text-sm">
              <p className="font-semibold text-black dark:text-white">
                {transaction.fullName}
              </p>

              <p className="text-gray-500 flex items-center gap-1">
                <IdCard size={14} /> {transaction.studentNo}
              </p>

              <p className="text-gray-500">
                Votes Given: {transaction.votesGiven}
              </p>

              <p className="text-gray-500 text-xs">{transaction.datetime}</p>
            </div>
          </div>

          {/* AMOUNT INPUT */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
              Amount Paid
            </label>

            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 dark:border-strokedark">
              <Wallet size={18} className="text-gray-400" />
              <input
                type="number"
                value={amount}
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

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Confirm update for:
              <span className="font-semibold"> {transaction.fullName}</span>
            </p>

            {/* PASSCODE */}
            <input
              type="password"
              placeholder="Enter Super Admin Passcode"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              className="w-full border rounded-lg px-3 py-2 mb-2 outline-none dark:bg-transparent dark:border-strokedark"
            />

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateModal;
