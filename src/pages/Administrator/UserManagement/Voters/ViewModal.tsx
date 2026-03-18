import { X, Mail, Phone, CalendarDays, User, School, Hash, Wallet, Ticket } from 'lucide-react';
import { VOTER } from './VotersTable';

interface ViewModalProps {
  voter: VOTER;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ voter, onClose }) => {
  const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
    <div className="flex items-start gap-3.5 rounded-lg border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-primary dark:bg-meta-4 dark:text-white">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-black dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-boxdark animate-slideIn">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stroke bg-white px-7 py-5 dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2.5">
            <User className="text-primary" />
            Voter Profile Details
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-danger transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-meta-4">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-7 md:p-9 space-y-9">
          
          {/* Profile Card with QR and ID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border border-stroke rounded-xl p-6 bg-gray-50 dark:border-strokedark dark:bg-meta-4">
            
            {/* ID Picture */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-sm font-medium text-gray-500">Official ID Picture</p>
              <img
                src={voter.idPicture}
                alt="ID"
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg dark:border-boxdark"
              />
            </div>

            {/* Basic Info & Role */}
            <div className="text-center md:text-left space-y-2">
              <h4 className="text-2xl font-extrabold text-black dark:text-white">
                {voter.fullName}
              </h4>
              
              <div className="mt-3 mb-4 flex justify-center md:justify-start">
                {voter.studentRole === 'president' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    President
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    Student
                  </span>
                )}
              </div>
              {/* ---------------------------- */}

              <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <Hash size={16} /> {voter.studentNo}
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <School size={16} /> {voter.program} - Year {voter.yearLevel}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-sm font-medium text-gray-500">Voter QR Code</p>
              <img
                src={voter.qrImage}
                alt="QR Code"
                className="h-32 w-32 rounded-lg p-2 bg-white shadow-md border border-stroke"
              />
              <p className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded dark:bg-boxdark">{voter.qrCode}</p>
            </div>
          </div>

          {/* Detailed Information Grid */}
          <div>
            <h5 className="mb-5 text-lg font-semibold text-black dark:text-white border-l-4 border-primary pl-3">
              Contact & Account Information
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DetailItem icon={Mail} label="Email Address" value={voter.email} />
              <DetailItem icon={Phone} label="Contact Number" value={voter.contactNumber} />
              <DetailItem icon={CalendarDays} label="Date Registered" value={voter.datetime} />
              <DetailItem icon={Ticket} label="Total Purchased Votes" value={voter.totalVotesPurchased} />
              <DetailItem icon={Wallet} label="Remaining Votes" value={voter.remainingVotes} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-stroke px-7 py-5 sticky bottom-0 bg-white dark:border-strokedark dark:bg-boxdark flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-6 py-2.5 font-medium text-black hover:bg-gray-200 transition-colors dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-80"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;