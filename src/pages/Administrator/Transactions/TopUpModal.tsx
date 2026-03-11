import { useEffect, useRef, useState } from 'react';
import TopUpConfirmation from './TopUpConfirmation';
import { BrowserQRCodeReader } from '@zxing/browser';
import { User, Mail, Book, CreditCard } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const controlsRef = useRef<any>(null);

  const [qrCode, setQrCode] = useState('');
  const [manualQr, setManualQr] = useState('');
  const [voter, setVoter] = useState<VOTER | null>(null);
  const [amount, setAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchVoter = (code: string) => {
    // Replace with API request later
    setVoter({
      studentNo: '2023-0001',
      fullName: 'Student 1',
      program: 'BSIT',
      email: 'student1@gmail.com',
      remainingVotes: 5,
      totalVotesPurchased: 10,
    });
  };

  const handleScan = (data: string) => {
    setQrCode(data);
    fetchVoter(data);

    // Stop scanner after successful scan
    if (controlsRef.current) {
      controlsRef.current.stop();
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();

        const backCamera =
          devices.find((device) =>
            device.label.toLowerCase().includes('back'),
          ) || devices[0];

        controlsRef.current = await codeReader.current.decodeFromVideoDevice(
          backCamera.deviceId,
          videoRef.current,
          (result) => {
            if (result) {
              handleScan(result.getText());
            }
          },
        );
      } catch (error) {
        console.error(error);
      }
    };

    startScanner();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

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
      {/* Modal */}
      <div className="relative w-full max-w-3xl rounded-xl bg-white dark:bg-boxdark shadow-xl p-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Top Up Points
        </h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE — QR Scanner */}
          <div>
            <p className="mb-2 text-gray-600 dark:text-gray-300 font-medium">
              Scan QR Code
            </p>

            <div className="rounded-lg border overflow-hidden aspect-square flex items-center justify-center bg-black">
              <video ref={videoRef} className="w-full h-full object-cover" />
            </div>

            <p className="text-xs mt-2 text-gray-500 text-center">
              Move the camera closer to the QR code for faster scanning
            </p>

            {/* Manual QR Input */}
            <div className="mt-5">
              <p className="mb-2 text-gray-600 dark:text-gray-300 font-medium">
                Or enter QR manually
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
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                  Find
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — Voter Information */}
          <div>
            {!voter && (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm text-center border rounded-lg p-6">
                Scan a QR code to load voter information
              </div>
            )}

            {voter && (
              <>
                {/* Voter Info */}
                <div className="mb-6 rounded-xl border border-stroke dark:border-strokedark p-4 bg-gray-50 dark:bg-boxdark">
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">
                    Voter Information
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Book size={16} />
                      <strong>Student No:</strong> {voter.studentNo}
                    </p>

                    <p className="flex items-center gap-2">
                      <User size={16} />
                      <strong>Full Name:</strong> {voter.fullName}
                    </p>

                    <p className="flex items-center gap-2">
                      <Book size={16} />
                      <strong>Program:</strong> {voter.program}
                    </p>

                    <p className="flex items-center gap-2">
                      <Mail size={16} />
                      <strong>Email:</strong> {voter.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <CreditCard size={16} />
                      <strong>Remaining Votes:</strong> {voter.remainingVotes}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full rounded border px-3 py-2 dark:border-strokedark dark:bg-transparent outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter amount to top up"
                  />
                </div>

                {/* Top Up Button */}
                <button
                  onClick={handleTopUp}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 flex justify-center items-center gap-2"
                >
                  <CreditCard size={18} /> Add Credits
                </button>
              </>
            )}
          </div>
        </div>

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
