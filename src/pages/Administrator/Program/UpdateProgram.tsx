import { useState, useEffect } from 'react';
import { XCircle, Image, BookOpen, AlignLeft, ShieldCheck } from 'lucide-react';
import { PROGRAM } from './ProgramTable';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

interface UpdateProgramProps {
  program: PROGRAM;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateProgram = ({ program, onClose, onUpdate }: UpdateProgramProps) => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();

  const [imagePreview, setImagePreview] = useState<string>(program.image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState(program.name);
  const [description, setDescription] = useState(program.description);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setImagePreview(program.image);
    setName(program.name);
    setDescription(program.description);
  }, [program]);

  const handleSubmit = () => {
    if (!name || !description) {
      showAlert('warning', 'Please fill in all required fields.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!authUser?.token) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    
    formData.append('_method', 'PATCH');

    try {
      const res = await fetch(`${API_BASE_URL}/programs/${program.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (res.ok) {
        showAlert('success', 'Program updated successfully.');
        onUpdate();
        onClose();
      } else {
        const errorData = await res.json();
        showAlert('error', errorData.message || 'Failed to update program.');
        setShowConfirm(false);
      }
    } catch (error) {
      console.error('Update failed', error);
      showAlert('error', 'An unexpected error occurred. Please try again.');
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          >
            <XCircle size={24} />
          </button>

          <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white text-center">
            Update Program
          </h2>

          <div className="flex flex-col items-center mb-6">
            {imagePreview ? (
              <img
                src={imagePreview}
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
              accept="image/*"
              className="mt-3 text-sm text-gray-500"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
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

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              <XCircle size={18} /> Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-5 py-2 text-white hover:bg-opacity-90"
            >
              Update Program
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-boxdark rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-green-600" size={22} />
              <h3 className="font-semibold text-black dark:text-white">
                Confirm Update Program
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to update this program?
            </p>
            <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Description:</strong> {description}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProgram;