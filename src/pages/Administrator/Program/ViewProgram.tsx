import { X, BookOpen, AlignLeft, Calendar, Info } from 'lucide-react';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="relative w-full max-w-xl rounded-[32px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Banner / Header Section */}
        <div className="relative h-40 w-full bg-gray-100 dark:bg-meta-4">
          <img
            src={program.image}
            alt={program.name}
            className="h-full w-full object-cover opacity-40 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-boxdark to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-white hover:text-danger dark:bg-black/50 dark:text-white transition-all shadow-md"
          >
            <X size={20} />
          </button>

          {/* Floating Program Icon */}
          <div className="absolute -bottom-6 left-8 flex items-end gap-5">
            <div className="h-24 w-24 rounded-2xl border-4 border-white dark:border-boxdark bg-white shadow-xl overflow-hidden">
              <img
                src={program.image}
                className="h-full w-full object-cover"
                alt="Program Icon"
              />
            </div>
            <div className="mb-2 pb-1">
              <h2 className="text-2xl font-black text-black dark:text-white leading-tight tracking-tight">
                {program.name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Info size={14} />
                Program Details
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 p-8 pt-4">
          <div className="space-y-8">
            {/* Description Section */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                <AlignLeft size={14} /> Overview
              </h4>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {program.description ||
                  'No description provided for this program.'}
              </p>
            </div>

            {/* Meta Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stroke dark:border-strokedark pt-8">
              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-meta-4/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm dark:bg-boxdark">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Schedule
                  </p>
                  <p className="text-sm font-bold text-black dark:text-white">
                    {program.dateTime || 'TBA'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-meta-4/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm dark:bg-boxdark">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Type
                  </p>
                  <p className="text-sm font-bold text-black dark:text-white">
                    Academic Program
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-100 px-8 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-200 active:scale-95 dark:bg-meta-4 dark:text-gray-300 dark:hover:bg-opacity-80"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProgram;
