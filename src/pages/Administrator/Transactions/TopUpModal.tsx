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
  X,
  Camera,
  Zap,
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-boxdark shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-5 border-b border-stroke dark:border-strokedark flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <div>
            <h2 className="text-2xl font-black text-black dark:text-white flex items-center gap-2">
              <div className="h-8 w-2 bg-primary rounded-full" />
              Top Up Credits
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Scan student QR or enter ID manually to add votes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT SIDE - Scanner (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Camera size={18} className="text-primary" />
                  Live Scanner
                </label>

                <div className="relative rounded-2xl border-4 border-gray-100 dark:border-gray-800 overflow-hidden aspect-square bg-black shadow-inner">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-80"
                    playsInline
                    muted
                    autoPlay
                  />
                  {/* Scanner Overlay UI */}
                  <div className="absolute inset-0 border-[40px] border-black/40">
                    <div className="w-full h-full border-2 border-primary/50 relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/30 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-dashed border-stroke dark:border-strokedark bg-gray-50/50 dark:bg-meta-4/20">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">
                  Manual Entry
                </label>
                <div className="flex gap-2">
                  <div className="flex flex-1 rounded-xl border-2 border-transparent bg-white dark:bg-boxdark shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary dark:border-strokedark transition-all">
                    <span className="flex items-center px-4 py-3 bg-gray-100 dark:bg-meta-4 text-gray-500 dark:text-gray-400 font-bold text-sm select-none border-r dark:border-strokedark">
                      CLI-{new Date().getFullYear()}-
                    </span>
                    <input
                      type="text"
                      value={manualQr}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 4);
                        setManualQr(val);
                      }}
                      className="flex-1 px-4 py-3 outline-none text-lg font-bold text-black dark:text-white bg-transparent"
                      placeholder="0000"
                    />
                  </div>
                  <button
                    onClick={handleManualQr}
                    disabled={isFetching}
                    className="rounded-xl bg-primary px-6 py-3 text-white font-bold hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all"
                  >
                    Find
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Information (7 Cols) */}
            <div className="lg:col-span-7">
              {isFetching ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 py-20 bg-gray-50/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-stroke dark:border-strokedark">
                  <div className="relative">
                    <Loader2 size={48} className="animate-spin text-primary" />
                    <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                  </div>
                  <p className="font-medium text-gray-500">
                    Searching database...
                  </p>
                </div>
              ) : !voter ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-gray-50/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-stroke dark:border-strokedark space-y-4">
                  <div className="p-4 bg-white dark:bg-boxdark rounded-full shadow-sm">
                    <QrCode size={40} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-400">
                      Waiting for Scan
                    </p>
                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                      Please point the camera at the student's QR code or type
                      their ID.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Voter Identity Card */}
                  <div className="rounded-3xl border border-stroke dark:border-strokedark bg-white dark:bg-boxdark shadow-sm overflow-hidden">
                    <div className="p-6 flex items-start gap-6">
                      <div className="space-y-3">
                        <div className="relative group">
                          <img
                            src={voter.idPicture || '/user-profile.png'}
                            className="w-32 h-32 object-cover rounded-2xl border-4 border-gray-50 shadow-md group-hover:scale-105 transition-transform"
                            alt="Student"
                          />
                          <span
                            className={`absolute -top-2 -right-2 px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                              voter.isActive
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                          >
                            {voter.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <img
                          src={voter.qrImage}
                          className="w-32 h-12 object-contain bg-white rounded-lg p-1 border border-gray-100"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-tighter">
                            {voter.studentNo}
                          </p>
                          <h3 className="text-2xl font-black text-black dark:text-white leading-tight">
                            {voter.fullName}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <GraduationCap size={14} /> {voter.program} • Year{' '}
                            {voter.yearLevel}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-2 rounded-lg">
                            <Mail size={14} className="text-primary" />
                            <span className="truncate">{voter.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-2 rounded-lg">
                            <Phone size={14} className="text-primary" />
                            <span>{voter.contactNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-t border-stroke dark:border-strokedark">
                      <div className="p-4 text-center border-r border-stroke dark:border-strokedark bg-blue-50/30 dark:bg-blue-900/10">
                        <p className="text-[10px] font-black text-blue-500 uppercase">
                          Current Balance
                        </p>
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          {voter.remainingVotes}
                        </p>
                      </div>
                      <div className="p-4 text-center bg-purple-50/30 dark:bg-purple-900/10">
                        <p className="text-[10px] font-black text-purple-500 uppercase">
                          Total Purchased
                        </p>
                        <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                          {voter.totalVotesPurchased}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Top Up Action - Light Modern Theme */}
                  <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-black uppercase tracking-wider text-primary/70">
                        Enter Top-up Amount
                      </label>
                      <div className="flex gap-2">
                        {[20, 50, 100].map((quickAmt) => (
                          <button
                            key={quickAmt}
                            onClick={() => setAmount(quickAmt)}
                            className="text-[10px] font-bold px-2 py-1 rounded-md bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          >
                            +₱{quickAmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1 group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-primary group-focus-within:scale-110 transition-transform">
                          ₱
                        </span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) =>
                            setAmount(parseInt(e.target.value) || 0)
                          }
                          className="w-full bg-white border-2 border-primary/10 rounded-2xl py-4 pl-12 pr-4 text-2xl font-black text-black outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300 shadow-inner"
                          placeholder="0.00"
                          min={1}
                        />
                      </div>

                      <button
                        onClick={handleTopUp}
                        disabled={!amount || amount <= 0}
                        className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/25 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                      >
                        <Zap size={22} fill="currentColor" />
                        Confirm Top-up
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-3 text-center italic">
                      Ensure the amount matches the cash received before
                      confirming.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
  );
};

export default TopUpModal;
