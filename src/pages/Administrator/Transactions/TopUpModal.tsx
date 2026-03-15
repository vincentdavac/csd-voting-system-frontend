import { useEffect, useRef, useState } from 'react';
import TopUpConfirmation from './TopUpConfirmation';
import { BrowserQRCodeReader } from '@zxing/browser';
import {
  User,
  Mail,
  Book,
  CreditCard,
  Phone,
  GraduationCap,
  QrCode,
  Loader2,
} from 'lucide-react';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

interface VOTER {
  id: number;
  studentNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  program: string;
  email: string;
  contactNumber: string;
  yearLevel: number;
  qrString: string;
  qrImage: string;
  idPicture: string;
  isActive: boolean;
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

  const { showAlert } = useAlert();
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [qrCode, setQrCode] = useState('');
  const [manualQr, setManualQr] = useState('');
  const [voter, setVoter] = useState<VOTER | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const refetchVoter = async () => {
    if (!qrCode) return;
    await fetchVoter(qrCode);
  };

  const safeStop = () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.warn('Failed to stop video tracks:', e);
    }

    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    } catch (e) {
      console.warn('Failed to stop code reader:', e);
    }
  };

  const fetchVoter = async (code: string) => {
    if (!token) {
      showAlert('error', 'Unauthorized. Please login again.');
      return;
    }

    setIsFetching(true);

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
      const attrs = client.attributes;

      const mapped: VOTER = {
        id: client.id,
        studentNo: attrs.student_id,
        firstName: attrs.first_name,
        lastName: attrs.last_name,
        fullName: attrs.full_name,
        program: attrs.program?.name || 'N/A',
        email: attrs.email,
        contactNumber: attrs.contact_number,
        yearLevel: attrs.year_level,
        qrString: attrs.qr_string,
        qrImage: attrs.qr_image,
        idPicture: attrs.id_picture,
        isActive: attrs.is_active,
        remainingVotes: data.data.remaining_votes,
        totalVotesPurchased: data.data.total_votes_purchased,
      };

      setVoter(mapped);
      setQrCode(code);
      safeStop();
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Failed to fetch client.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleScan = (data: string) => {
    if (!data) return;
    fetchVoter(data);
  };

  useEffect(() => {
    let cancelled = false;

    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        if (cancelled) return;

        const backCamera =
          devices.find((d) => d.label.toLowerCase().includes('back')) ||
          devices[0];

        if (!backCamera) {
          console.warn('No camera device found.');
          return;
        }

        controlsRef.current = await codeReader.current.decodeFromVideoDevice(
          backCamera.deviceId,
          videoRef.current,
          (result) => {
            if (result) handleScan(result.getText());
          },
        );
      } catch (error) {
        if (!cancelled) console.error('Scanner error:', error);
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      safeStop();
    };
  }, []);

  const handleManualQr = () => {
    if (!manualQr || manualQr.length !== 4) {
      showAlert('error', 'Please enter the 4-digit QR code suffix.');
      return;
    }

    const fullQrCode = `CLI-${new Date().getFullYear()}-${manualQr}`;
    fetchVoter(fullQrCode);
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
      <div className="relative w-full max-w-4xl rounded-xl bg-white dark:bg-boxdark shadow-xl p-6 overflow-y-auto max-h-screen">
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
          {/* LEFT SIDE - Scanner */}
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
                autoPlay
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
                <div className="flex flex-1 rounded border overflow-hidden focus-within:ring-2 focus-within:ring-primary dark:border-strokedark">
                  {/* Static prefix */}
                  <span className="flex items-center px-3 py-2 bg-gray-100 dark:bg-meta-4 text-gray-500 dark:text-gray-400 font-medium text-sm select-none whitespace-nowrap border-r dark:border-strokedark">
                    CLI-{new Date().getFullYear()}-
                  </span>

                  {/* Only last 4 digits */}
                  <input
                    type="text"
                    value={manualQr}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setManualQr(val);
                    }}
                    className="flex-1 px-3 py-2 dark:bg-transparent outline-none text-black dark:text-white"
                    placeholder="0001"
                    maxLength={4}
                  />
                </div>

                <button
                  onClick={handleManualQr}
                  disabled={isFetching}
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Find
                </button>
              </div>

              <p className="text-xs mt-1 text-gray-400">
                Enter the last 4 digits of the QR code (e.g.{' '}
                <strong>0001</strong> for CLI-{new Date().getFullYear()}-0001)
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Voter Info */}
          <div>
            {/* Loading State */}
            {isFetching && (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-3 border rounded-lg p-6 bg-gray-50 dark:bg-boxdark">
                <Loader2 size={36} className="animate-spin text-primary" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fetching client information...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isFetching && !voter && (
              <div className="h-full min-h-[300px] flex items-center justify-center text-gray-500 text-sm text-center border rounded-lg p-6">
                Scan a QR code to load voter information
              </div>
            )}

            {/* Voter Info */}
            {!isFetching && voter && (
              <>
                <div className="mb-4 rounded-xl border border-stroke dark:border-strokedark p-4 bg-gray-50 dark:bg-boxdark">
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">
                    Voter Information
                  </h3>

                  {/* ID Picture + QR side by side */}
                  <div className="flex gap-3 mb-4">
                    {voter.idPicture && (
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 text-center">
                          ID Picture
                        </p>
                        <img
                          src={voter.idPicture}
                          alt="ID Picture"
                          className="w-full h-28 object-contain rounded-lg border bg-gray-100"
                        />
                      </div>
                    )}

                    {voter.qrImage && (
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 text-center">
                          QR Code
                        </p>
                        <img
                          src={voter.qrImage}
                          alt="QR Code"
                          className="w-full h-28 object-contain rounded-lg border bg-white p-1"
                        />
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                        voter.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {voter.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Book size={15} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>Student No:</strong> {voter.studentNo}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <User size={15} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>Full Name:</strong> {voter.fullName}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Book size={15} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>Program:</strong> {voter.program}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <GraduationCap
                        size={15}
                        className="shrink-0 text-gray-400"
                      />
                      <span>
                        <strong>Year Level:</strong> {voter.yearLevel}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Mail size={15} className="shrink-0 text-gray-400" />
                      <span className="truncate">
                        <strong>Email:</strong> {voter.email}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone size={15} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>Contact:</strong> {voter.contactNumber}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <QrCode size={15} className="shrink-0 text-gray-400" />
                      <span>
                        <strong>QR String:</strong> {voter.qrString}
                      </span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stroke dark:border-strokedark mt-2">
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Remaining Votes
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {voter.remainingVotes}
                        </p>
                      </div>

                      <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-2 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Purchased
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {voter.totalVotesPurchased}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full rounded border px-3 py-2 dark:border-strokedark dark:bg-transparent outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter amount to top up"
                    min={1}
                  />
                </div>

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

        {showConfirmation && voter && (
          <TopUpConfirmation
            voter={voter}
            amount={amount}
            onClose={() => setShowConfirmation(false)}
            onSuccess={refetchVoter}
          />
        )}
      </div>
    </div>
  );
};

export default TopUpModal;
