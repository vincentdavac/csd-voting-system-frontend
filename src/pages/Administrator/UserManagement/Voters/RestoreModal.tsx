import { useState } from 'react';
import {
  XCircle,
  Mail,
  Smartphone,
  Calendar,
  RefreshCw,
  Computer,
  IdCardLanyard,
  SquareUser,
  QrCode,
  Vote,
  Wallet,
} from 'lucide-react';
import { useAlert } from '../../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../../config/api';
import { useAuth } from '../../../../context/AuthContext';

export interface VOTER {
  id: number;
  studentNo: string;
  fullName: string;
  program: string;
  yearLevel: number;
  email: string;
  qrCode: string;
  qrImage: string;
  contactNumber: string;
  idPicture: string;
  remainingVotes: number;
  totalVotesPurchased: number;
  datetime: string;
  isActive: boolean;
}

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
        `${API_BASE_URL}/clients/restore/${voter.id}`,
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
          Restore User
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
            <Computer size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.program}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Computer size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Year Level: {voter.yearLevel}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <IdCardLanyard size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.studentNo}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <SquareUser size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.fullName}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Mail size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.email}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Smartphone size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.contactNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <QrCode size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.qrCode}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Vote size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Remaining Votes: {voter.remainingVotes}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Wallet size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Total Votes Purchased: {voter.totalVotesPurchased}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Calendar size={20} className="text-gray-500 dark:text-gray-400"/>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.datetime}
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-strokedark px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <XCircle size={18}/> Cancel
          </button>

          <button
            onClick={handleRestore}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            <RefreshCw size={18}/>
            {loading ? 'Restoring...' : 'Restore'}
          </button>

        </div>

      </div>
    </div>
  );
};

export default RestoreModal;