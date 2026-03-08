import { useState } from 'react';
import TopUpConfirmation from './TopUpConfirmation';
import QrReader from 'react-qr-scanner';
import { User, Mail, Book, CreditCard } from 'lucide-react'; // icons

interface VOTER {
  studentNo: string;
  fullName: string;
  program: string;
  email: string;
  remainingVotes: number;
  totalVotesPurchased: number;
}

interface TopUpModalProps {
  onClose: () => void;
}

const TopUpModal = ({ onClose }: TopUpModalProps) => {
  const [qrCode, setQrCode] = useState('');
  const [manualQr, setManualQr] = useState('');
  const [voter, setVoter] = useState<VOTER | null>(null);
  const [amount, setAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchVoter = (code: string) => {
    setVoter({
      studentNo: '2023-0001',
      fullName: 'Student 1',
      program: 'BSIT',
      email: 'student1@gmail.com',
      remainingVotes: 5,
      totalVotesPurchased: 10,
    });
  };

  const handleScan = (data: any) => {
    if (data) {
      setQrCode(data);
      fetchVoter(data);
    }
  };

  const handleManualQr = () => {
    if (manualQr) {
      setQrCode(manualQr);
      fetchVoter(manualQr);
    }
  };

  const handleTopUp = () => {
    if (!amount || !voter) return;
    setShowConfirmation(true);
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-boxdark shadow-xl p-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 font-bold text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-5 text-center text-black dark:text-white">
          Top Up Points
        </h2>

        {/* QR Scanner */}
        <div className="mb-6">
          <p className="mb-2 text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
            Scan QR Code:
          </p>
          <div className="rounded border overflow-hidden">
            <QrReader
              onResult={(result: { text: any }, error: any) => {
                if (!!result) handleScan(result?.text);
              }}
              constraints={{ facingMode: 'environment' }}
              className="w-full"
            />
          </div>
        </div>

        {/* Fallback QR Input */}
        <div className="mb-6">
          <p className="mb-2 text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
            Or enter QR code manually:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualQr}
              onChange={(e) => setManualQr(e.target.value)}
              className="flex-1 rounded border px-3 py-2 dark:border-strokedark dark:bg-transparent outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter QR code"
            />
            <button
              onClick={handleManualQr}
              className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 flex items-center gap-1"
            >
              Find
            </button>
          </div>
        </div>

        {/* Voter Info */}
        {voter && (
          <div className="mb-6 rounded-xl border border-stroke dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-boxdark">
            <h3 className="text-lg font-semibold mb-3 text-black dark:text-white flex items-center gap-2">
              Voter Information
            </h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Book size={16} /> <strong>Student No:</strong>{' '}
                {voter.studentNo}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <User size={16} /> <strong>Full Name:</strong> {voter.fullName}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Book size={16} /> <strong>Program:</strong> {voter.program}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Mail size={16} /> <strong>Email:</strong> {voter.email}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CreditCard size={16} /> <strong>Remaining Votes:</strong>{' '}
                {voter.remainingVotes}
              </p>
            </div>
          </div>
        )}

        {/* Top Up Amount */}
        {voter && (
          <div className="mb-6">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full rounded border px-3 py-2 dark:border-strokedark dark:bg-transparent outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter amount to top up"
            />
          </div>
        )}

        {/* Top Up Button */}
        {voter && (
          <button
            onClick={handleTopUp}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 flex justify-center items-center gap-2"
          >
            <CreditCard size={18} /> Add Credits
          </button>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && voter && (
          <TopUpConfirmation
            voter={voter}
            amount={amount}
            onClose={() => setShowConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TopUpModal;
