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
  const scanCooldown = 2000;
  const lastScanRef = useRef<number>(0);

  useEffect(() => {
    exhibitorsRef.current = exhibitors;
  }, [exhibitors]);

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

          const now = Date.now();

          // prevent duplicate scans
          if (now - lastScanRef.current < scanCooldown) return;

          lastScanRef.current = now;

          handleScan(result.getText());
        },
      );
    } catch (error) {
      console.error('Camera initialization failed:', error);
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  // Pause scanner when modal opens
  useEffect(() => {
    if (selectedExhibitor) {
      stopScanner();
    } else {
      startScanner();
    }
  }, [selectedExhibitor]);

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
      showAlert('error', 'Invalid QR Code or Exhibitor not found.');
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
      {/* Header */}
      <div className="w-full max-w-4xl px-4 text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071c4f] mb-2">
          QR Code Scanner
        </h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
          Scan a QR code to cast your vote
        </p>
      </div>

      {/* Scanner */}
      <div className="w-full max-w-lg px-4">
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl overflow-hidden aspect-square flex items-center justify-center border border-stroke dark:border-strokedark">
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
      </div>

      {/* Cast Vote Modal */}
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