import { useEffect, useRef, useState } from 'react';
import TopUpConfirmation from './TopUpConfirmation';
import { BrowserQRCodeReader } from '@zxing/browser';
import {
  Mail,
  Phone,
  GraduationCap,
  QrCode,
  Loader2,
  Camera,
  X,
  Zap,
  AlertCircle,
  TrendingUp,
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
  const [amount, setAmount] = useState<number | string>('');
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
    if (!amount) {
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl rounded-[40px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-white/20">
        {/* HEADER: COMMAND CENTER STYLE */}
        <div className="px-10 py-7 border-b border-stroke dark:border-strokedark flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter">
                Credits Terminal
              </h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                Authorized Personnel Only • Session Active
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 transition-all border border-transparent hover:border-red-200"
          >
            <X
              size={24}
              className="group-hover:rotate-90 transition-transform"
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN: ACQUISITION (SCANNER) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                    <Camera size={16} className="text-primary" />
                    Live Optical Scan
                  </label>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">
                      Hardware Ready
                    </span>
                  </span>
                </div>

                <div className="relative rounded-[32px] border-[6px] border-gray-100 dark:border-gray-800 overflow-hidden aspect-square bg-black shadow-2xl">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-70 grayscale-[0.3]"
                    playsInline
                    muted
                    autoPlay
                  />

                  {/* CYBER SCANNER OVERLAY */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-10 border-2 border-primary/30 rounded-xl">
                      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary shadow-[0_0_15px_rgba(60,80,224,0.5)]" />
                      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary shadow-[0_0_15px_rgba(60,80,224,0.5)]" />
                      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary shadow-[0_0_15px_rgba(60,80,224,0.5)]" />
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary shadow-[0_0_15px_rgba(60,80,224,0.5)]" />

                      {/* LASER LINE */}
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/60 shadow-[0_0_20px_rgba(60,80,224,0.8)] animate-scan-line" />
                    </div>
                    {/* VIGNETTE */}
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
                  </div>
                </div>
              </div>

              {/* MANUAL ENTRY HUD */}
              <div className="p-6 rounded-[24px] bg-gray-50 dark:bg-meta-4/20 border-2 border-dashed border-stroke dark:border-strokedark">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">
                  Manual ID Override
                </label>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {/* Input Container */}
                  <div className="flex flex-1 rounded-2xl border-2 border-transparent bg-white dark:bg-boxdark shadow-md overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <span className="flex items-center px-4 sm:px-5 py-4 bg-gray-100 dark:bg-meta-4 text-gray-500 font-black text-xs select-none border-r border-stroke dark:border-strokedark">
                      ID-
                    </span>
                    <input
                      type="text"
                      inputMode="numeric" // Triggers numeric keypad on mobile
                      value={manualQr}
                      onChange={(e) =>
                        setManualQr(
                          e.target.value.replace(/\D/g, '').slice(0, 4),
                        )
                      }
                      className="flex-1 px-4 py-4 outline-none text-xl font-black text-black dark:text-white bg-transparent tracking-widest min-w-0"
                      placeholder="0000"
                    />
                  </div>

                  {/* Fetch Button */}
                  <button
                    onClick={handleManualQr}
                    disabled={isFetching}
                    className="w-full sm:w-auto rounded-2xl bg-black dark:bg-white dark:text-black px-8 py-4 text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] sm:hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isFetching ? '...' : 'Fetch'}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PROCESSING & DATA */}
            <div className="lg:col-span-7">
              {isFetching ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-primary/5 rounded-[40px] border-2 border-dashed border-primary/20">
                  <div className="relative mb-6">
                    <Loader2 size={64} className="animate-spin text-primary" />
                    <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse" />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-primary animate-pulse">
                    Querying Database...
                  </p>
                </div>
              ) : !voter ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-gray-50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-stroke dark:border-strokedark">
                  <div className="p-8 bg-white dark:bg-boxdark rounded-[32px] shadow-2xl mb-6 ring-1 ring-stroke">
                    <QrCode
                      size={56}
                      className="text-gray-200 dark:text-gray-700"
                    />
                  </div>
                  <h3 className="text-xl font-black text-black dark:text-white uppercase italic">
                    System Standby
                  </h3>
                  <p className="text-xs text-gray-400 max-w-[280px] mt-2 font-bold leading-relaxed uppercase tracking-tighter">
                    Awaiting Optical Input or Manual Identification to Begin
                    Transaction
                  </p>
                </div>
              ) : (
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                  {/* VOTER IDENTITY CARD: PREMIUM LOOK */}
                  <div className="rounded-[32px] border border-stroke dark:border-strokedark bg-white dark:bg-boxdark shadow-2xl overflow-hidden group">
                    <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                      <div className="relative">
                        <div className="h-40 w-40 overflow-hidden rounded-[24px] border-[6px] border-gray-50 dark:border-meta-4 shadow-xl transition-transform group-hover:scale-105">
                          <img
                            src={voter.idPicture || '/user-profile.png'}
                            className="w-full h-full object-cover"
                            alt="Student"
                          />
                        </div>
                        <div
                          className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                            voter.isActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {voter.isActive ? 'Verified' : 'Flagged'}
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                            {voter.studentNo}
                          </span>
                          <h3 className="text-4xl font-black text-black dark:text-white leading-none uppercase italic tracking-tighter">
                            {voter.fullName}
                          </h3>
                          <p className="text-xs font-bold text-gray-400 mt-2 flex items-center justify-center md:justify-start gap-2">
                            <GraduationCap size={16} className="text-primary" />
                            {voter.program} • Level {voter.yearLevel}
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-stroke dark:border-strokedark">
                            <Mail size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase text-gray-500">
                              {voter.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BALANCE HUD */}
                    <div className="grid grid-cols-2 bg-gray-50 dark:bg-meta-4/20 border-t border-stroke dark:border-strokedark">
                      <div className="p-6 text-center border-r border-stroke dark:border-strokedark group/bal">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover/bal:text-primary transition-colors">
                          Current Credits
                        </p>
                        <p className="text-4xl font-black text-black dark:text-white tracking-tighter">
                          {voter.remainingVotes}
                        </p>
                      </div>
                      <div className="p-6 text-center group/bal">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover/bal:text-purple-500 transition-colors">
                          Lifetime Points
                        </p>
                        <p className="text-4xl font-black text-black dark:text-white tracking-tighter">
                          {voter.totalVotesPurchased}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TRANSACTION HUB */}
                  <div className="bg-primary/5 border-2 border-primary/20 rounded-[32px] p-8 shadow-inner relative overflow-hidden">
                    {/* FIXED: Added pointer-events-none so this doesn't block the buttons */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <TrendingUp size={80} />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                        Input Load Amount
                      </label>
                      <div className="flex gap-2">
                        {[20, 50, 100, 500].map((quickAmt) => (
                          <button
                            key={quickAmt}
                            type="button"
                            onClick={() => setAmount(quickAmt)}
                            className={`px-4 py-2 rounded-xl border-2 transition-all shadow-sm text-[10px] font-black 
              ${
                amount === quickAmt
                  ? 'bg-primary text-white border-primary scale-110 shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-boxdark border-primary/10 text-primary hover:bg-primary hover:text-white hover:scale-110'
              }`}
                          >
                            +₱{quickAmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-5">
                      <div className="relative flex-1 group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-primary transition-transform group-focus-within:scale-125">
                          ₱
                        </span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) =>
                            setAmount(
                              e.target.value === ''
                                ? ''
                                : parseInt(e.target.value),
                            )
                          }
                          className="w-full bg-white dark:bg-boxdark border-3 border-primary/10 rounded-[24px] py-6 pl-14 pr-6 text-4xl font-black text-black dark:text-white outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all shadow-2xl"
                          placeholder="0.00"
                          min={1}
                        />
                      </div>

                      <button
                        onClick={handleTopUp}
                        disabled={!amount}
                        className="group/btn bg-primary text-white px-12 py-6 rounded-[24px] font-black text-xl uppercase italic tracking-tighter flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(60,80,224,0.3)] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                      >
                        <Zap
                          size={24}
                          fill="currentColor"
                          className="group-hover/btn:animate-bounce"
                        />
                        Commit Ticket(s)
                      </button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-primary/10 w-max mx-auto">
                      <AlertCircle size={14} className="text-primary" />
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Cross-verify cash amount before final commit
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for the Laser Line - Add to your globals.css or a styled component */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes scan-line {
        0% { top: 0%; opacity: 0.1; }
        50% { opacity: 1; }
        100% { top: 100%; opacity: 0.1; }
      }
      .animate-scan-line {
        animation: scan-line 2s linear infinite;
      }
    `,
        }}
      />

      {showConfirmation && voter && (
        <TopUpConfirmation
          voter={voter}
          amount={Number(amount)}
          onClose={() => setShowConfirmation(false)}
          onSuccess={refetchVoter}
        />
      )}
    </div>
  );
};

export default TopUpModal;
