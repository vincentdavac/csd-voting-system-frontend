import { useState } from 'react';
import { XCircle, Archive, User, IdCardLanyard } from 'lucide-react';
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
        `${API_BASE_URL}/clients/archive/${voter.id}`,
        {
          method: 'PATCH',
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <XCircle size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white text-center">
          Archive User
        </h2>

        {/* ID Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={voter.idPicture}
            alt={voter.fullName}
            className="h-28 w-28 rounded-full border-2 border-strokedark dark:border-strokedark object-cover shadow-md"
          />
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm font-medium">
            ID Picture
          </p>
        </div>

        {/* Voter Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <User size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.fullName}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <IdCardLanyard
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.program} — {voter.studentNo}
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-700 dark:text-gray-300">
          Are you sure you want to archive this user? This action can be
          reversed later.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-strokedark px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <XCircle size={18} /> Cancel
          </button>

          <button
            onClick={handleArchive}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            <Archive size={18} />
            {loading ? 'Archiving...' : 'Archive'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;