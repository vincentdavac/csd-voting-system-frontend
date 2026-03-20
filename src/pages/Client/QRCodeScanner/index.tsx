import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import CastVote from '../../Client/CastVote/CastVote';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import { ArrowLeft, Info, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EXHIBITOR {
  id: number;
  image: string;
  title: string;
  description: string;
  program: string;
  qrCode: string;
}

const QRCodeScanner = () => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const controlsRef = useRef<any>(null);

  const [exhibitors, setExhibitors] = useState<EXHIBITOR[]>([]);
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(
    null,
  );
  const [remainingVotes, setRemainingVotes] = useState<number>(0);
  const [clientId, setClientId] = useState<number | null>(null);

  const exhibitorsRef = useRef<EXHIBITOR[]>([]);
  const isProcessingRef = useRef<boolean>(false); // Soft pause reference
  const scanCooldown = 2000;
  const lastScanRef = useRef<number>(0);
  const navigate = useNavigate();

  // Keep refs synced with state
  useEffect(() => {
    exhibitorsRef.current = exhibitors;
  }, [exhibitors]);

  // Sync the soft pause with the modal state
  useEffect(() => {
    isProcessingRef.current = !!selectedExhibitor;
  }, [selectedExhibitor]);

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
  };

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      const devices = await BrowserQRCodeReader.listVideoInputDevices();

      const backCamera =
        devices.find((device) => device.label.toLowerCase().includes('back')) ||
        devices[0];

      controlsRef.current = await codeReader.current.decodeFromVideoDevice(
        backCamera.deviceId,
        videoRef.current,
        (result) => {
          if (!result) return;

          // SOFT PAUSE: If the modal is open, completely ignore the scan
          if (isProcessingRef.current) return;

          const now = Date.now();

          // prevent duplicate scans
          if (now - lastScanRef.current < scanCooldown) return;

          lastScanRef.current = now;

          handleScan(result.getText());
        },
      );
    } catch (error) {
      console.error('Camera initialization failed:', error);
      showAlert(
        'error',
        'Camera initialization failed. Please ensure permissions are granted.',
      );
    }
  };

  // Only start/stop the camera when the component mounts/unmounts
  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const fetchData = async () => {
    if (!authUser?.token) return;

    try {
      const exhRes = await fetch(`${API_BASE_URL}/exhibitors`, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });

      if (exhRes.ok) {
        const exhJson = await exhRes.json();
        const exhData = exhJson.data || exhJson;

        const mappedExhibitors: EXHIBITOR[] = exhData.map((item: any) => ({
          id: item.id,
          image: item.attributes.image || 'https://via.placeholder.com/150',
          title: item.attributes.project_title,
          description: item.attributes.project_description,
          program: item.attributes.program?.name || 'Unknown Program',
          qrCode: item.attributes.qr_string,
        }));

        setExhibitors(mappedExhibitors);
      }

      const clientRes = await fetch(`${API_BASE_URL}/clients/me`, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });

      if (clientRes.ok) {
        const clientJson = await clientRes.json();

        const currentVotes =
          clientJson.data?.client?.attributes?.remaining_votes ??
          clientJson.data?.client?.remaining_votes ??
          0;

        setRemainingVotes(currentVotes);

        const currentId = clientJson.data?.client?.id ?? clientJson.data?.id;

        setClientId(currentId);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authUser]);

  const handleScan = (data: string) => {
    const foundExhibitor = exhibitorsRef.current.find(
      (ex) => ex.qrCode === data,
    );

    if (foundExhibitor) {
      setSelectedExhibitor(foundExhibitor);
    } else {
      isProcessingRef.current = true; // Briefly pause to prevent alert spam
      showAlert('error', 'Invalid QR Code or Exhibitor not found.');
      setTimeout(() => {
        // Only unpause if the user didn't open a modal in the meantime
        if (!selectedExhibitor) isProcessingRef.current = false;
      }, 3000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    try {
      const result = await codeReader.current.decodeFromImageUrl(objectUrl);
      if (result) {
        handleScan(result.getText());
      }
    } catch (error) {
      console.error('Error decoding uploaded image:', error);
      showAlert(
        'error',
        'Could not detect a valid QR code in the uploaded image.',
      );
    } finally {
      URL.revokeObjectURL(objectUrl);
      e.target.value = '';
    }
  };

  const handleSubmitVote = async (
    votes: number,
    rating: number,
    comment: string,
  ) => {
    if (!selectedExhibitor || !authUser?.token) return;

    if (!clientId) {
      showAlert(
        'error',
        'Client ID not found. Please refresh the page and try again.',
      );
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/votes/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          exhibitor_id: selectedExhibitor.id,
          votes_casted: votes,
          rating: rating,
          comment: comment,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Failed to cast vote.');
      }

      showAlert('success', json.message || 'Vote cast successfully.');

      setSelectedExhibitor(null);

      await fetchData();

      window.dispatchEvent(new Event('votesUpdated'));
    } catch (error: any) {
      console.error('Error casting vote:', error);
      showAlert(
        'error',
        error.message || 'An error occurred while casting your vote.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020d26] flex flex-col items-center justify-start py-8 relative transition-colors duration-300 overflow-hidden">
      {/* TACTICAL GRID BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* BACK BUTTON */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/client/dashboard')}
          className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-white dark:bg-white/5 shadow-xl text-slate-600 dark:text-slate-400 active:scale-95 transition-all border border-slate-100 dark:border-white/10 hover:border-blue-500"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="w-full max-w-4xl px-6 mt-12 text-center mb-10 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase italic">
          QR Scanner
        </h1>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          Align target{' '}
          <span className="text-blue-600 dark:text-blue-400">Exhibitor</span> to
          cast vote.
        </p>
      </div>

      <div className="w-full max-w-lg px-6 flex flex-col items-center relative z-10">
        {/* SCANNER VIEWPORT */}
        <div className="relative group w-full aspect-square">
          {/* Exterior Glow */}
          <div className="absolute -inset-1 bg-blue-600/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative h-full w-full bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white dark:border-white/5 flex items-center justify-center">
            {/* THE VIDEO FEED */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale-[0.3] group-hover:grayscale-0"
              muted
              playsInline
            />

            {/* TACTICAL HUD OVERLAY */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12">
              {/* Corner Brackets with Tech Styling */}
              <div className="absolute top-12 left-12 w-16 h-16 border-t-4 border-l-4 border-blue-500/60 rounded-tl-3xl shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              <div className="absolute top-12 right-12 w-16 h-16 border-t-4 border-r-4 border-blue-500/60 rounded-tr-3xl shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              <div className="absolute bottom-12 left-12 w-16 h-16 border-b-4 border-l-4 border-blue-500/60 rounded-bl-3xl shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              <div className="absolute bottom-12 right-12 w-16 h-16 border-b-4 border-r-4 border-blue-500/60 rounded-br-3xl shadow-[0_0_15px_rgba(59,130,246,0.3)]" />

              {/* Scanning Laser Line */}
              <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan opacity-80" />

              {/* HUD Central Reticle */}
              <div className="w-8 h-8 border-2 border-white/10 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM HINT BOX */}
        <div className="mt-8 flex items-start gap-4 px-5 py-4 bg-white dark:bg-white/5 rounded-2xl border-2 border-slate-100 dark:border-white/5 shadow-sm">
          <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
            <Info size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              System Advisory
            </p>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
              Ensure optical clarity. Center QR within brackets for high-speed
              detection.
            </p>
          </div>
        </div>

        {/* ALTERNATIVE INPUT METHOD */}
        <div className="mt-12 flex flex-col items-center w-full">
          <div className="relative w-full flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-slate-100 dark:border-white/5"></span>
            </div>
            <span className="relative bg-slate-50 dark:bg-[#020d26] px-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
              Manual Upload
            </span>
          </div>

          <label className="group w-full cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

            <div className="relative flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-300">
              <Upload
                size={18}
                className="group-hover:-translate-y-1 transition-transform"
              />
              Process Image File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </label>
        </div>
      </div>

      {/* MODAL LAYER */}
      {selectedExhibitor && (
        <CastVote
          exhibitor={selectedExhibitor}
          remainingVotes={remainingVotes}
          onClose={() => setSelectedExhibitor(null)}
          onSubmit={handleSubmitVote}
        />
      )}

      <style>
        {`
      @keyframes scan {
        0% { transform: translateY(-140px); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateY(140px); opacity: 0; }
      }
      .animate-scan {
        animation: scan 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      `}
      </style>
    </div>
  );
};

export default QRCodeScanner;
