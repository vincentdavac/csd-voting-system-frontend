import { useEffect, useRef, useState } from 'react';
import TopUpConfirmation from './TopUpConfirmation';
import { BrowserQRCodeReader } from '@zxing/browser';
import { User, Mail, Book, CreditCard } from 'lucide-react';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

interface VOTER {
  id: number;
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
  const mediaStreamRef = useRef<MediaStream | null>(null); // store stream

  const { showAlert } = useAlert();
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [qrCode, setQrCode] = useState('');
  const [manualQr, setManualQr] = useState('');
  const [voter, setVoter] = useState<VOTER | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const stopScanner = () => {
    try {
      if (controlsRef.current && typeof controlsRef.current.stop === 'function') {
        controlsRef.current.stop();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    } catch (err) {
      console.warn('Error stopping scanner', err);
    }
  };

  const fetchVoter = async (code: string) => {
    if (!token) {
      showAlert('error', 'Unauthorized. Please login again.');
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/clients/client-information?qr_string=${code}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Client not found');
      }

      const client = data.data.client;

      const mapped: VOTER = {
        id: client.id,
        studentNo: client.attributes.student_id,
        fullName: client.attributes.full_name,
        program: client.attributes.program?.name || 'N/A',
        email: client.attributes.email,
        remainingVotes: data.data.remaining_votes,
        totalVotesPurchased: data.data.total_votes_purchased,
      };

      setVoter(mapped);
      setQrCode(code);

      // Stop scanner safely after fetching
      stopScanner();
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Failed to fetch client.');
    }
  };

  const handleScan = (data: string) => {
    if (!data) return;
    fetchVoter(data);
  };

  useEffect(() => {
    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        const backCamera =
          devices.find(device => device.label.toLowerCase().includes('back')) ||
          devices[0];

        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: backCamera.deviceId },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStreamRef.current;
          await videoRef.current.play();
        }

        controlsRef.current = codeReader.current.decodeFromVideoDevice(
          backCamera.deviceId,
          videoRef.current,
          (result) => {
            if (result) handleScan(result.getText());
          },
        );
      } catch (error) {
        console.error('Scanner error:', error);
      }
    };

    startScanner();

    return () => stopScanner();
  }, []);

  const handleManualQr = () => {
    if (!manualQr) {
      showAlert('error', 'Please enter QR code.');
      return;
    }
    fetchVoter(manualQr);
  };

  const handleTopUp = () => {
    if (!amount || amount <= 0) {
      showAlert('error', 'Please enter a valid amount.');
      return;
    }

    if (!voter) {
      showAlert('error', 'No client selected.');
      return;
    }

    setShowConfirmation(true);
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl rounded-xl bg-white dark:bg-boxdark shadow-xl p-6 overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Top Up Points
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT SIDE */}
          <div>
            <p className="mb-2 text-gray-600 dark:text-gray-300 font-medium">
              Scan QR Code
            </p>

            <div className="rounded-lg border overflow-hidden aspect-square flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
            </div>

            <p className="text-xs mt-2 text-gray-500 text-center">
              Move the camera closer to the QR code for faster scanning
            </p>

            {/* Manual Input */}
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

          {/* RIGHT SIDE */}
          <div>
            {!voter && (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm text-center border rounded-lg p-6">
                Scan a QR code to load voter information
              </div>
            )}

            {voter && (
              <>
                <div className="mb-6 rounded-xl border border-stroke dark:border-strokedark p-4 bg-gray-50 dark:bg-boxdark">
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">
                    Voter Information
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Book size={16}/>
                      <strong>Student No:</strong> {voter.studentNo}
                    </p>
                    <p className="flex items-center gap-2">
                      <User size={16}/>
                      <strong>Full Name:</strong> {voter.fullName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Book size={16}/>
                      <strong>Program:</strong> {voter.program}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={16}/>
                      <strong>Email:</strong> {voter.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard size={16}/>
                      <strong>Remaining Votes:</strong> {voter.remainingVotes}
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard size={16}/>
                      <strong>Total Votes Purchased:</strong> {voter.totalVotesPurchased}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full rounded border px-3 py-2 dark:border-strokedark dark:bg-transparent outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter amount to top up"
                  />
                </div>

                <button
                  onClick={handleTopUp}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 flex justify-center items-center gap-2"
                >
                  <CreditCard size={18}/> Add Credits
                </button>
              </>
            )}
          </div>
        </div>

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