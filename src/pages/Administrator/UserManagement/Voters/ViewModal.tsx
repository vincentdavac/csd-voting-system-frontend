import {
  XCircle,
  Mail,
  Smartphone,
  Calendar,
  Wallet,
  Vote,
  QrCode,
  SquareUser,
  IdCardLanyard,
  Computer,
} from 'lucide-react';

interface VOTER {
  studentNo: string;
  fullName: string;
  program: string;
  email: string;
  qrCode: string;
  contactNumber: string;
  idPicture: string;
  remainingVotes: number;
  totalVotesPurchased: number;
  datetime: string;
}

interface ViewModalProps {
  voter: VOTER;
  onClose: () => void;
}

const ViewModal = ({ voter, onClose }: ViewModalProps) => {
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
          Voter Details
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

        {/* Voter Info Containers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Program */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Computer size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.program}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Computer size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Year Level
            </span>
          </div>

          {/* Student Number */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <IdCardLanyard
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.studentNo}
            </span>
          </div>

          {/* Full Name */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <SquareUser
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.fullName}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Mail size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.email}
            </span>
          </div>

          {/* Contact Number */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Smartphone
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.contactNumber}
            </span>
          </div>

          {/* QR Code */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <QrCode size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.qrCode}
            </span>
          </div>

          {/* Remaining Votes */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Vote size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Remaining Votes: {voter.remainingVotes}
            </span>
          </div>

          {/* Total Votes Purchased */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Wallet size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Total Votes Purchased: {voter.totalVotesPurchased}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {voter.datetime}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-strokedark px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <XCircle size={18} /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
