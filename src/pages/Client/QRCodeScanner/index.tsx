import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { X } from 'lucide-react';

const QRCodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const controlsRef = useRef<any>(null);

  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleScan = (data: string) => {
    setScannedValue(data);
    setModalOpen(true);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 dark:bg-gray-900 py-6">
      {/* Header */}
      <div className="w-full max-w-4xl px-4 text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071c4f] mb-2">
          QR Code Scanner
        </h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
          Scan a QR code to cast your vote
        </p>
      </div>

      {/* QR Scanner */}
      <div className="w-full max-w-lg px-4">
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" />
        </div>

        <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Note:</span> Move your camera closer
          to the QR code for faster and more accurate scanning.
        </p>
      </div>

      {/* Modal */}
      {modalOpen && scannedValue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-2xl w-11/12 max-w-sm p-6 text-center relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-[#071c4f] mb-4">
              QR Code Scanned!
            </h2>

            <p className="text-sm text-gray-700 mb-6 break-words">
              {scannedValue}
            </p>

            <button
              onClick={() => setModalOpen(false)}
              className="bg-[#071c4f] text-white px-6 py-2 rounded-full shadow-md hover:shadow-xl transition-all font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
