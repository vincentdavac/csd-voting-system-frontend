import { XCircle, BookOpen, AlignLeft } from 'lucide-react';

interface ViewProgramProps {
  program: {
    image: string;
    name: string;
    description: string;
    dateTime: string;
  };
  onClose: () => void;
}

const ViewProgram = ({ program, onClose }: ViewProgramProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <XCircle size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white text-center">
          View Program
        </h2>

        {/* Program Image */}
        <div className="flex justify-center mb-6">
          <img
            src={program.image}
            alt={program.name}
            className="h-28 w-28 rounded-lg border object-cover shadow"
          />
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-strokedark">
            <BookOpen size={20} className="text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {program.name}
            </span>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-strokedark">
            <AlignLeft size={20} className="text-gray-500 mt-1" />
            <span className="text-gray-700 dark:text-gray-300">
              {program.description}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-strokedark">
            <span className="text-gray-500 font-medium">Date & Time:</span>
            <span className="text-gray-700 dark:text-gray-300">
              {program.dateTime}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProgram;
