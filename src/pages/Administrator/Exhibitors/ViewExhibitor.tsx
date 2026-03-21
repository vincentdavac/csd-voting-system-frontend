import { X, AlignLeft, GraduationCap, QrCode } from 'lucide-react';

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
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
    {/* Added max-h-[95vh] and flex-col to allow internal scrolling */}
    <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-boxdark shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      
      {/* Header / Hero Section - Reduced height (h-32) for small laptops */}
      <div className="relative h-32 sm:h-44 w-full shrink-0 bg-gray-100 dark:bg-meta-4">
        <img
          src={exhibitor.image}
          alt={exhibitor.title}
          className="h-full w-full object-cover opacity-60 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-boxdark to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-white hover:text-danger dark:bg-black/50 dark:text-white transition-all shadow-md"
        >
          <X size={20} />
        </button>

        {/* Floating Profile Image - Adjusted for smaller screens */}
        <div className="absolute -bottom-6 left-6 sm:left-8 flex items-end gap-3 sm:gap-5">
          <img
            src={exhibitor.image}
            className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl border-4 border-white dark:border-boxdark object-cover shadow-xl"
            alt="Profile"
          />
          <div className="mb-2 pb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white leading-tight truncate max-w-[200px] sm:max-w-none">
              {exhibitor.title}
            </h2>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary">
              <GraduationCap size={16} />
              {exhibitor.program}
            </p>
          </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar mt-8 p-6 sm:p-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Main Info (Left 2 Columns) */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                <AlignLeft size={14} /> Project Overview
              </h4>
              {/* description text sizes adjusted for readability */}
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {exhibitor.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 border-t border-stroke dark:border-strokedark pt-6">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Status
                </h4>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                  Active Exhibitor
                </span>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Entry ID
                </h4>
                <p className="text-sm font-mono font-bold text-black dark:text-white">
                  #{exhibitor.qrCode}
                </p>
              </div>
            </div>
          </div>

          {/* QR Section (Sticky-ish on md screens) */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center rounded-2xl border border-stroke bg-gray-50 p-5 dark:border-strokedark dark:bg-meta-4 shadow-inner">
              <div className="mb-3 rounded-xl bg-white p-2 shadow-sm">
                <img
                  src={exhibitor.qrImage}
                  alt="QR Code"
                  className="h-24 w-24 sm:h-28 sm:w-28 object-contain"
                />
              </div>
              <p className="text-center text-[10px] font-bold uppercase text-gray-400 tracking-tighter mb-2">
                Scan to Vote
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-black dark:text-white bg-white dark:bg-boxdark px-3 py-1.5 rounded-full border border-stroke dark:border-strokedark">
                <QrCode size={12} />
                {exhibitor.qrCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED FOOTER - Always visible */}
      <div className="shrink-0 bg-white dark:bg-boxdark px-8 py-5 border-t border-stroke dark:border-strokedark flex justify-end">
        <button
          onClick={onClose}
          className="w-full sm:w-auto rounded-xl bg-gray-100 px-8 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-200 dark:bg-meta-4 dark:text-gray-300 dark:hover:bg-opacity-80"
        >
          Close Details
        </button>
      </div>
    </div>
  </div>
);
};

export default ViewExhibitor;
