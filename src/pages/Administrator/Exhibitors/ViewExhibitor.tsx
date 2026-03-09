import {
  XCircle,
  BookOpen,
  AlignLeft,
  GraduationCap,
  QrCode,
} from 'lucide-react';

interface EXHIBITOR {
  image: string;
  title: string;
  description: string;
  program: string;
  qrImage: string;
  qrCode: string;
}

interface ViewExhibitorProps {
  exhibitor: EXHIBITOR;
  onClose: () => void;
}

const ViewExhibitor = ({ exhibitor, onClose }: ViewExhibitorProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <XCircle size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white text-center">
          Exhibitor Details
        </h2>

        {/* Project Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={exhibitor.image}
            alt={exhibitor.title}
            className="h-28 w-28 rounded-lg border-2 border-strokedark dark:border-strokedark object-cover shadow-md"
          />
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm font-medium">
            Project Image
          </p>
        </div>

        {/* Exhibitor Info Containers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <BookOpen size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {exhibitor.title}
            </span>
          </div>

          {/* Program */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <GraduationCap
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {exhibitor.program}
            </span>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800 md:col-span-2">
            <AlignLeft
              size={20}
              className="text-gray-500 dark:text-gray-400 mt-1"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {exhibitor.description}
            </span>
          </div>

          {/* QR Code Text */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <QrCode size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {exhibitor.qrCode}
            </span>
          </div>

          {/* QR Image */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 dark:border-strokedark p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <img
              src={exhibitor.qrImage}
              alt="QR Code"
              className="h-24 w-24 object-contain"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              QR Image
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-strokedark px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <XCircle size={18} /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExhibitor;
