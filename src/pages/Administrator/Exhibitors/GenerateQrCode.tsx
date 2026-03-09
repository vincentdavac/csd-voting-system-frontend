import { useState } from 'react';
import { XCircle, QrCode, ShieldCheck } from 'lucide-react';

interface EXHIBITOR {
  image: string;
  title: string;
  description: string;
  program: string;
  qrImage: string;
  qrCode: string;
}

interface GenerateQrCodeProps {
  onClose: () => void;
  exhibitor: EXHIBITOR;
}

const GenerateQrCode = ({ onClose, exhibitor }: GenerateQrCodeProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Static values
  const { title: projectTitle, qrImage, qrCode } = exhibitor;

  const handleConfirm = () => {
    // For now, just close modal after confirmation
    setShowConfirm(false);
    onClose();
    alert('QR PDF would be generated (static version)');
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          >
            <XCircle size={24} />
          </button>

          <h2 className="mb-2 text-2xl font-semibold text-black dark:text-white text-center">
            Generate QR Code PDF
          </h2>

          {/* Project Name */}
          <h3 className="mb-6 text-lg font-medium text-center text-gray-700 dark:text-gray-300">
            {projectTitle}
          </h3>

          {/* QR Preview */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={qrImage}
              alt="QR Code"
              className="h-28 w-28 object-contain border rounded-lg shadow mb-2"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
              {qrCode}
            </p>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <QrCode size={18} /> Generate PDF
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-boxdark rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-blue-600" size={22} />
              <h3 className="font-semibold text-black dark:text-white">
                Confirm QR PDF
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
              Generate a PDF file for <strong>{projectTitle}</strong> QR code?
            </p>

            <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4 text-center">
              <img
                src={qrImage}
                alt="QR Preview"
                className="mx-auto h-24 w-24 mb-2"
              />
              <p className="font-mono">{qrCode}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateQrCode;
