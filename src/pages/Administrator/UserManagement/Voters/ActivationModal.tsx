import { useState } from 'react';
import { Power, Loader2, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { VOTER } from './VotersTable';
import { useAlert } from '../../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../../config/api';
import { useAuth } from '../../../../context/AuthContext';

interface ActivationModalProps {
  voter: VOTER;
  onClose: () => void;
  onSuccess: (updatedVoter: VOTER) => void;
}

const ActivationModal = ({
  voter,
  onClose,
  onSuccess,
}: ActivationModalProps) => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { authUser } = useAuth();

  const isActivating = !voter.isActivated;

  const handleToggle = async () => {
    if (!authUser?.token) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/clients/${voter.id}/toggle-activation?_method=PATCH`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        showAlert(
          'success',
          `Account ${isActivating ? 'activated' : 'deactivated'} successfully.`,
        );
        onSuccess({ ...voter, isActivated: !voter.isActivated });
        onClose();
      } else {
        throw new Error(data.message || 'Action failed');
      }
    } catch (error: any) {
      showAlert('error', error.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-[40px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-white/10 transform animate-in zoom-in-95">
        {/* Progress Bar Decor */}
        <div
          className={`h-2 w-full ${
            isActivating ? 'bg-green-500' : 'bg-red-500'
          } opacity-20`}
        >
          <div
            className={`h-full animate-pulse ${
              isActivating ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: '100%' }}
          />
        </div>

        <div className="p-8 md:p-10 text-center">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${
              isActivating
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            } dark:bg-opacity-10 ring-1 ${
              isActivating ? 'ring-green-200' : 'ring-red-200'
            }`}
          >
            {isActivating ? (
              <ShieldCheck size={40} />
            ) : (
              <ShieldAlert size={40} />
            )}
          </div>

          <h2 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-2">
            {isActivating ? 'Activate Account?' : 'Deactivate Account?'}
          </h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
            Target:{' '}
            <span className="text-black dark:text-white">{voter.fullName}</span>
          </p>

          <div className="bg-gray-50 dark:bg-meta-4/30 p-6 rounded-[24px] mb-8 border border-stroke dark:border-strokedark">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {isActivating
                ? 'This will grant the voter full access to the system and enable their voting credentials immediately.'
                : 'This will revoke all active sessions and prevent the voter from participating in any active polls.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white"
            >
              Cancel Request
            </button>
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`flex-[1.5] flex items-center justify-center gap-3 py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
                isActivating
                  ? 'bg-green-600 shadow-green-600/20 hover:bg-green-700'
                  : 'bg-red-600 shadow-red-600/20 hover:bg-red-700'
              }`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Power size={16} />
              )}
              {isActivating ? 'Initialize Activation' : 'Execute Deactivation'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-xl"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ActivationModal;
