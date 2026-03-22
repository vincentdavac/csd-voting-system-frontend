import { useState } from 'react';
import { Archive, AlertTriangle, IdCard, Loader2, X } from 'lucide-react';
import { VOTER } from './VotersTable';
import { useAlert } from '../../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../../config/api';
import { useAuth } from '../../../../context/AuthContext';

interface ArchiveModalProps {
  voter: VOTER;
  onClose: () => void;
  onArchive: (voter: VOTER) => void;
}

const ArchiveModal = ({ voter, onClose, onArchive }: ArchiveModalProps) => {
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();
  const { authUser } = useAuth();
  const token = authUser?.token;

  const handleArchive = async () => {
    if (!token) {
      showAlert('error', 'Unauthorized. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/clients/archive/${voter.id}?_method=PATCH`,
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
        throw new Error(data.message || 'Failed to archive user');
      }

      showAlert('success', data.message || 'User archived successfully.');

      onArchive(voter); // update table state
      onClose();
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl flex flex-col rounded-[40px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-white/10 transform transition-all animate-in zoom-in-95 duration-200">
        {/* TOP WARNING STRIPE */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#facc15,#facc15_10px,#ef4444_10px,#ef4444_20px)]" />

        <div className="p-8 md:p-10">
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 ring-1 ring-red-200 dark:ring-red-500/30">
              <AlertTriangle size={32} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-[0.3em]">
                System Deactivation
              </span>
              <h2 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter">
                Archive Voter?
              </h2>
            </div>
          </div>

          {/* TARGET USER CARD */}
          <div className="relative mb-8 p-6 rounded-[32px] bg-gray-50 dark:bg-meta-4/30 border border-stroke dark:border-strokedark overflow-hidden">
            {/* Background Decorative Icon */}
            <Archive className="absolute -right-4 -bottom-4 h-24 w-24 text-gray-200 dark:text-white/5 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <div className="relative">
                <img
                  src={voter.idPicture}
                  alt={voter.fullName}
                  className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-boxdark shadow-xl"
                />
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg">
                  <Archive size={16} />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Target Entity
                  </p>
                  <p className="text-xl font-black text-black dark:text-white uppercase italic tracking-tight">
                    {voter.fullName}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-boxdark border border-stroke dark:border-strokedark text-[10px] font-bold text-gray-500 uppercase">
                    <IdCard size={12} /> {voter.studentNo}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-boxdark border border-stroke dark:border-strokedark text-[10px] font-bold text-gray-500 uppercase">
                    {voter.program}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CONFIRMATION TEXT */}
          <div className="mb-10 text-center px-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
              Archiving will{' '}
              <span className="text-red-600 font-bold">
                suspend all voting privileges
              </span>{' '}
              for this user. This action is recorded in the system logs but can
              be reversed via the Archive tab.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
            >
              Abort Protocol
            </button>
            <button
              onClick={handleArchive}
              disabled={loading}
              className="order-1 sm:order-2 flex-[1.5] flex items-center justify-center gap-3 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Archive size={16} />
                  Confirm Archive
                </>
              )}
            </button>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-meta-4 transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ArchiveModal;
