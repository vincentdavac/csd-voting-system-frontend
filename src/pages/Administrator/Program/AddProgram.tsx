import { useState } from 'react';
import { XCircle, Image, BookOpen, AlignLeft, ShieldCheck } from 'lucide-react';

interface AddProgramProps {
  onClose: () => void;
  onAdd: (data: { image: string; name: string; description: string }) => void;
}

const AddProgram = ({ onClose, onAdd }: AddProgramProps) => {
  const [image, setImage] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    if (!name || !description) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onAdd({ image, name, description });
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      {/* MAIN ADD PROGRAM MODAL */}
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
            Add Program
          </h2>

          {/* Image Upload */}
          <div className="flex flex-col items-center mb-6">
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="h-28 w-28 rounded-lg border object-cover shadow"
              />
            ) : (
              <div className="h-28 w-28 flex items-center justify-center border rounded-lg bg-gray-100 dark:bg-gray-800">
                <Image size={28} className="text-gray-400" />
              </div>
            )}
            <input
              type="file"
              className="mt-3 text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(URL.createObjectURL(file));
              }}
            />
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 gap-4">
            {/* Name */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-3 bg-gray-50 dark:bg-gray-800">
              <BookOpen size={20} className="text-gray-500" />
              <input
                type="text"
                placeholder="Program Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-300"
              />
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-3 bg-gray-50 dark:bg-gray-800">
              <AlignLeft size={20} className="text-gray-500 mt-1" />
              <textarea
                placeholder="Program Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-300 resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XCircle size={18} /> Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-5 py-2 text-white hover:bg-opacity-90"
            >
              Add Program
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-boxdark rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-green-600" size={22} />
              <h3 className="font-semibold text-black dark:text-white">
                Confirm Add Program
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to add this program?
            </p>

            <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Description:</strong> {description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProgram;
