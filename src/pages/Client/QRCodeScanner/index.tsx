import { useState } from 'react';
import { X } from 'lucide-react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = () => {
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedValue(data);
      setModalOpen(true);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

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
      <div className="w-full max-w-md px-4">
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl overflow-hidden">
          <QrReader
            constraints={{ facingMode: 'environment' }} // use rear camera
            scanDelay={300} // replaces 'delay'
            onResult={(result, error) => {
              // replaces onScan/onError
              if (result) handleScan(result.getText());
              if (error) handleError(error);
            }}
          />
        </div>
      </div>

      {/* Modal for scanned value */}
      {modalOpen && scannedValue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-2xl w-11/12 max-w-sm p-6 text-center relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-[#071c4f] mb-4">
              QR Code Scanned!
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 break-words">
              {scannedValue}
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-[#071c4f] text-white px-6 py-2 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all font-semibold"
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
