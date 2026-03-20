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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-start py-8 relative transition-colors duration-300">
      <div className="absolute top-4 left-4 sm:hidden">
        <button
          onClick={() => navigate('/client/dashboard')} // Change this to your actual route path
          className="p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-300 active:scale-95 transition-all border border-gray-100 dark:border-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="w-full max-w-4xl px-6 text-center mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-[#071c4f] dark:text-blue-400 mb-2 tracking-tight">
          QR Code Scanner
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
          Scan a QR code to cast your vote
        </p>
      </div>

      <div className="w-full max-w-lg px-6 flex flex-col items-center">
        {/* Scanner Container with Overlay Effects */}
        <div className="relative bg-black dark:bg-boxdark rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden aspect-square flex items-center justify-center border-4 border-white dark:border-gray-800 w-full group">
          {/* The Video Feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            muted
            playsInline
          />

          {/* Scanner Overlay UI */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Corner Brackets */}
            <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
            <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
            <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
            <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

            {/* Animated Scanning Line */}
            <div className="w-[80%] h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan opacity-60" />
          </div>
        </div>

        {/* Helpful Hint */}
        <div className="mt-6 flex items-start gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
          <Info
            size={18}
            className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
          />
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
            <span className="font-bold">Tip:</span> Center the QR code within
            the frame and ensure there is enough light for a faster scan.
          </p>
        </div>

        {/* Image Upload Fallback UI */}
        <div className="mt-10 flex flex-col items-center w-full">
          <div className="relative w-full flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
            </div>
            <span className="relative bg-gray-50 dark:bg-gray-900 px-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              Or use a file
            </span>
          </div>

          <label className="group cursor-pointer flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-200 px-8 py-3.5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 font-bold text-sm border border-gray-200 dark:border-gray-700 w-full justify-center active:scale-95">
            <Upload size={18} className="group-hover:animate-bounce" />
            Upload QR Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

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
          0% { transform: translateY(-120px); }
          50% { transform: translateY(120px); }
          100% { transform: translateY(-120px); }
        }
          .animate-scan {
            animation: scan 3s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default QRCodeScanner;
