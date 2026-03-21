import { CheckCircle, Loader2, ShieldCheck, XCircle, Zap } from 'lucide-react';
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

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents any accidental page refresh

    if (!token || !authUser?.user?.id) {
      showAlert('error', 'Unauthorized. Please login again.');
      return;
    }

    const userId = authUser.user.id;
    const userRole = authUser.role;

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
          handler_type: userRole,
        }),
      });

      const data = await res.json();

      // FIX: Check for the `data.errors` object specifically!
      if (
        !res.ok ||
        data.status === 'error' ||
        data.status === false ||
        data.errors
      ) {
        // Extract the exact validation message (e.g., "Amount paid must be in multiples of 5 pesos.")
        let errorMsg = data.message || 'Failed to top up credits.';
        if (data.errors) {
          // Grabs the very first error string from the errors array
          errorMsg = Object.values(data.errors).flat()[0] as string;
        }

        throw new Error(errorMsg);
      }

      showAlert(
        'success',
        data.message || `Added ${amount} credits successfully.`,
      );

      if (onSuccess) onSuccess();
      onClose(); // Will ONLY close now if there are absolutely no errors
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md max-h-[90vh] rounded-[32px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-white/10 flex flex-col">
        {/* FIXED TOP: SECURITY STRIPE */}
        <div className="shrink-0 h-3 w-full bg-[repeating-linear-gradient(45deg,#22c55e,#22c55e_10px,#16a34a_10px,#16a34a_20px)]" />

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          {/* CLOSE OVERRIDE */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 transition-all"
          >
            <XCircle size={24} />
          </button>

          {/* HEADER: VALIDATION STATUS */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6 relative">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-green-500/10 border-2 border-green-500/20 text-green-600 dark:text-green-400">
                <ShieldCheck size={36} className="sm:size-11" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white uppercase tracking-tighter italic">
              Verify Funds
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              ID: TXN-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </p>
          </div>

          {/* VIRTUAL RECEIPT CARD */}
          <div className="relative rounded-3xl bg-gray-50 dark:bg-meta-4/20 p-5 sm:p-6 mb-8 border border-stroke dark:border-strokedark overflow-hidden">
            <Zap
              className="absolute -bottom-4 -right-4 text-gray-200 dark:text-gray-800 opacity-20"
              size={120}
            />

            <div className="relative z-10 space-y-5">
              <div className="flex justify-between items-end border-b border-dashed border-gray-300 dark:border-gray-600 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    Recipient
                  </span>
                  <p className="font-black text-base sm:text-lg text-black dark:text-white leading-none truncate max-w-[150px] sm:max-w-none">
                    {voter.fullName}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                  {voter.studentNo}
                </span>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Balance
                </span>
                <span className="font-bold text-sm text-black dark:text-white">
                  {voter.remainingVotes}{' '}
                  <span className="text-[10px] text-gray-400">VOTES</span>
                </span>
              </div>

              <div className="pt-2">
                <div className="group relative flex justify-between items-center rounded-2xl bg-black dark:bg-white p-4 sm:p-5 shadow-xl transition-transform hover:scale-[1.02]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">
                      Credit Injection
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase italic">
                      Finalizing
                    </p>
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-white dark:text-black tracking-tighter">
                    ₱{amount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DECISION MATRIX */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-3 rounded-2xl bg-green-600 px-8 py-4 sm:py-5 text-sm font-black text-white uppercase tracking-widest shadow-lg hover:bg-green-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin" />
                  Updating...
                </span>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Confirm
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
            >
              Cancel Transaction
            </button>
          </div>
        </div>

        {/* FIXED FOOTER: SYSTEM LOG */}
        <div className="shrink-0 bg-gray-50 dark:bg-black/20 px-8 py-4 border-t border-stroke dark:border-strokedark">
          <p className="text-[9px] font-bold text-gray-400 text-center leading-relaxed">
            Acknowledging physical receipt of{' '}
            <span className="text-black dark:text-white">₱{amount}.00</span>.
          </p>
        </div>
      </div>

      {/* CUSTOM SCROLLBAR CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.3);
        border-radius: 10px;
      }
    `,
        }}
      />
    </div>
  );
};

export default TopUpConfirmation;
