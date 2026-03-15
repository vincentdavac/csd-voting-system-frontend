import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import CastVote from '../../Client/CastVote/CastVote';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

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
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(null);
  const [remainingVotes, setRemainingVotes] = useState<number>(0);
  const [clientId, setClientId] = useState<number | null>(null);

  const exhibitorsRef = useRef<EXHIBITOR[]>([]);
  const isProcessingRef = useRef<boolean>(false); // Soft pause reference
  const scanCooldown = 2000;
  const lastScanRef = useRef<number>(0);

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
        devices.find((device) =>
          device.label.toLowerCase().includes('back'),
        ) || devices[0];

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
      showAlert('error', 'Camera initialization failed. Please ensure permissions are granted.');
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
      showAlert('error', 'Could not detect a valid QR code in the uploaded image.');
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
    <div className="min-h-screen flex flex-col items-center justify-start py-6">
      <div className="w-full max-w-4xl px-4 text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071c4f] mb-2">
          QR Code Scanner
        </h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
          Scan a QR code to cast your vote
        </p>
      </div>

      <div className="w-full max-w-lg px-4 flex flex-col items-center">
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl overflow-hidden aspect-square flex items-center justify-center border border-stroke dark:border-strokedark w-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        </div>

        <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Note:</span> Move your camera closer
          to the QR code for faster and more accurate scanning.
        </p>

        {/* Image Upload Fallback UI */}
        <div className="mt-6 flex flex-col items-center border-t border-stroke dark:border-strokedark pt-4 w-full">
          <span className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
            Camera not working? Upload a picture of the QR code instead:
          </span>
          <label className="cursor-pointer bg-[#071c4f] hover:bg-[#1a2b6f] text-white px-6 py-2 rounded-full shadow-md transition-all font-medium text-sm">
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
    </div>
  );
};

export default QRCodeScanner;