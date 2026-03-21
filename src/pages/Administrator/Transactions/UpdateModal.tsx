import { useState } from 'react';
import { XCircle, ShieldAlert, ArrowRight, Fingerprint } from 'lucide-react';
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
            handler_by: 'admin',
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-md max-h-[90vh] rounded-[32px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-gray-100 dark:border-strokedark flex flex-col">
          {/* FIXED HEADER ACCENT */}
          <div className="shrink-0 h-2 w-full bg-[repeating-linear-gradient(45deg,#3c50e0,#3c50e0_10px,#2563eb_10px,#2563eb_20px)]" />

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-meta-4 hover:text-red-500 transition-all"
            >
              <XCircle size={24} />
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Administrative Override
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tighter italic uppercase leading-none">
                Edit Entry
              </h2>
            </div>

            {/* USER INFO CARD */}
            <div className="flex items-center gap-4 mb-8 p-5 rounded-[24px] bg-gray-50 dark:bg-meta-4/30 border border-stroke dark:border-strokedark relative overflow-hidden group">
              <div className="relative z-10 shrink-0">
                {transaction.idPicture ? (
                  <img
                    src={transaction.idPicture}
                    alt={transaction.fullName}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover ring-4 ring-white dark:ring-boxdark shadow-lg"
                  />
                ) : (
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-400">
                    NO_IMG
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 z-10">
                <p className="font-black text-black dark:text-white text-base sm:text-lg leading-tight truncate">
                  {transaction.fullName}
                </p>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Original:{' '}
                    <b className="text-primary">₱{transaction.amountPaid}</b>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    TS: {transaction.createdDate}
                  </span>
                </div>
              </div>
              <Fingerprint
                className="absolute -right-4 -bottom-4 text-gray-200 dark:text-gray-800 opacity-20"
                size={100}
              />
            </div>

            {/* AMOUNT INPUT */}
            <div className="mb-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block ml-1">
                New Credit Value (₱)
              </label>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                  <p className="font-black text-xl">₱</p>
                </div>
                <input
                  type="number"
                  value={amount}
                  min={1}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-meta-4/50 border-2 border-transparent focus:border-primary rounded-2xl py-5 sm:py-6 pl-12 pr-6 text-2xl sm:text-3xl font-black text-black dark:text-white outline-none transition-all shadow-inner"
                  placeholder="0.00"
                />
              </div>

              <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-dashed border-stroke dark:border-strokedark">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Balance
                  </span>
                  <span
                    className={`text-sm font-black italic ${
                      amount >= transaction.amountPaid
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {amount >= transaction.amountPaid ? '▲' : '▼'}{' '}
                    {Math.abs(amount - transaction.amountPaid)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FIXED FOOTER BUTTONS */}
          <div className="shrink-0 p-6 sm:p-8 pt-0 bg-white dark:bg-boxdark">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleProceed}
                className="w-full py-4 sm:py-5 bg-black dark:bg-white dark:text-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Review Changes
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL (Scrollable) */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-sm max-h-[95vh] overflow-y-auto bg-white dark:bg-boxdark rounded-[40px] shadow-2xl p-8 sm:p-10 border border-yellow-500/30 text-center custom-scrollbar">
            <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24 mb-6">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping" />
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/50">
                <ShieldAlert className="text-yellow-500" size={40} />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-2">
              Super Admin Required
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-8">
              Database Manipulation Detected
            </p>

            <div className="flex items-center justify-center gap-4 mb-8 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-meta-4">
              <span className="text-xs font-black text-gray-400 line-through">
                ₱{transaction.amountPaid}
              </span>
              <ArrowRight size={14} className="text-yellow-500" />
              <span className="text-lg font-black text-green-500 tracking-tighter">
                ₱{amount}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">
                Enter Authorization Key
              </p>
              <input
                type="password"
                placeholder="••••"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError('');
                }}
                className="w-full bg-transparent border-b-4 border-yellow-500 text-center text-3xl sm:text-4xl tracking-[0.5em] py-2 outline-none font-black text-black dark:text-white"
                autoFocus
              />
              {passcodeError && (
                <p className="text-red-500 text-[10px] font-black mt-4 uppercase animate-shake italic">
                  {passcodeError}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-4 sm:py-5 bg-yellow-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-yellow-400 transition-all disabled:opacity-50"
              >
                {loading ? 'SYNCING...' : 'AUTHORIZE UPDATE'}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPasscode('');
                  setPasscodeError('');
                }}
                disabled={loading}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.2); border-radius: 10px; }
    `,
        }}
      />
    </>
  );
};

export default UpdateModal;
