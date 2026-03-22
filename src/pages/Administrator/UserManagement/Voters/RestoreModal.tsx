import { useState } from 'react';
import {
  Mail,
  Smartphone,
  Calendar,
  RefreshCw,
  QrCode,
  Vote,
  Wallet,
  GraduationCap,
  IdCard,
  Loader2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAlert } from '../../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../../config/api';
import { useAuth } from '../../../../context/AuthContext';
import { VOTER } from './VotersTable';

interface RestoreModalProps {
  voter: VOTER;
  onClose: () => void;
  onRestore: (voter: VOTER) => void;
}

const RestoreModal = ({ voter, onClose, onRestore }: RestoreModalProps) => {
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();
  const { authUser } = useAuth();
  const token = authUser?.token;

  const handleRestore = async () => {
    if (!token) {
      showAlert('error', 'Unauthorized. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/clients/restore/${voter.id}?_method=PATCH`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to restore user');
      }

      showAlert('success', data.message || 'User restored successfully.');

      onRestore(voter);
      onClose();
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl flex flex-col rounded-[40px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-white/10 transform transition-all animate-in zoom-in-95 duration-200">
        {/* RECOVERY ACCENT STRIPE */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#10b981,#10b981_10px,#059669_10px,#059669_20px)]" />

        <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-500/10 text-green-600 ring-1 ring-green-200 dark:ring-green-500/30">
              <RefreshCw size={32} className="animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-[0.3em]">
                Registry Recovery
              </span>
              <h2 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter">
                Restore Voter?
              </h2>
            </div>
          </div>

          {/* VOTER PROFILE MINI-CARD */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <img
                src={voter.idPicture}
                alt={voter.fullName}
                className="h-32 w-32 rounded-[32px] object-cover border-4 border-white dark:border-boxdark shadow-2xl transition-transform group-hover:scale-105"
              />
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-600/30">
                <ShieldCheck size={20} />
              </div>
            </div>
            <h3 className="mt-4 text-xl font-black text-black dark:text-white uppercase italic tracking-tight">
              {voter.fullName}
            </h3>
          </div>

          {/* DETAILED DATA GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <RestoreInfoItem
              icon={GraduationCap}
              label="Program"
              value={voter.program}
            />
            <RestoreInfoItem
              icon={IdCard}
              label="Student No."
              value={voter.studentNo}
            />
            <RestoreInfoItem
              icon={Mail}
              label="Email Address"
              value={voter.email}
            />
            <RestoreInfoItem
              icon={Smartphone}
              label="Contact"
              value={voter.contactNumber}
            />
            <RestoreInfoItem
              icon={QrCode}
              label="Access Token"
              value={voter.qrCode}
            />
            <RestoreInfoItem
              icon={Vote}
              label="Remaining"
              value={`${voter.remainingVotes} Votes`}
            />
            <RestoreInfoItem
              icon={Wallet}
              label="Total Volume"
              value={`${voter.totalVotesPurchased} Purchased`}
            />
            <RestoreInfoItem
              icon={Calendar}
              label="Registered"
              value={voter.datetime}
            />
          </div>

          <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest px-6 mb-8 leading-relaxed">
            Restoring will reactivate all system privileges and allow this
            entity to cast vote immediately.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
            >
              Cancel Recovery
            </button>
            <button
              onClick={handleRestore}
              disabled={loading}
              className="order-1 sm:order-2 flex-[1.5] flex items-center justify-center gap-3 py-4 bg-green-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-green-600/20 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Confirm Restore
                </>
              )}
            </button>
          </div>
        </div>

        {/* TOP RIGHT CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-meta-4 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
};

// Helper component for consistent grid items
const RestoreInfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl border border-stroke dark:border-strokedark bg-gray-50/50 dark:bg-meta-4/20">
    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-white dark:bg-boxdark text-gray-400 shadow-sm">
      <Icon size={14} />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-0.5">
        {label}
      </p>
      <p className="text-xs font-bold text-black dark:text-white truncate">
        {value}
      </p>
    </div>
  </div>
);

export default RestoreModal;
