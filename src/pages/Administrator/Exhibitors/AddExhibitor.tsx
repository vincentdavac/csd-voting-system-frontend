import { useState, useEffect, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  BookOpen,
  AlignLeft,
  GraduationCap,
  ShieldCheck,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

interface Program {
  id: number;
  name: string;
}

interface AddExhibitorProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddExhibitor = ({ onClose, onAdd }: AddExhibitorProps) => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [programId, setProgramId] = useState('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/programs`);
        const json = await res.json();
        const mapped = (json.data || []).map((p: any) => ({
          id: p.id,
          name: p.attributes.name,
        }));
        setPrograms(mapped);
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!title || !description || !programId || !selectedFile) {
      showAlert(
        'warning',
        'Please fill in all fields, including the project image.',
      );
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!authUser?.token) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('project_title', title);
    formData.append('project_description', description);
    formData.append('program_id', programId);
    formData.append('image', selectedFile!);

    try {
      const res = await fetch(`${API_BASE_URL}/exhibitors`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (res.ok) {
        showAlert('success', 'Exhibitor added successfully.');
        onAdd();
        onClose();
      } else {
        const errorData = await res.json();
        showAlert('error', errorData.message || 'Failed to create exhibitor.');
        setShowConfirm(false);
      }
    } catch (error) {
      showAlert('error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-boxdark shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
            <h2 className="text-xl font-bold text-black dark:text-white">
              New Exhibitor
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-danger transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[75vh]">
            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`group relative mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all
                ${
                  imagePreview
                    ? 'border-primary py-2'
                    : 'border-gray-300 py-10 hover:border-primary dark:border-strokedark'
                }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-full rounded-lg object-cover shadow-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg">
                    <p className="text-white text-sm font-medium">
                      Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2 rounded-full bg-primary/10 p-4 text-primary">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    Click to upload project image
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG or WEBP (Max 2MB)
                  </p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Project Title
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BookOpen size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark"
                  />
                </div>
              </div>

              {/* Program Field */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Program / Course
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <GraduationCap size={18} />
                  </span>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-stroke bg-transparent py-3 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark"
                  >
                    <option value="">Select a program</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Project Overview
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400">
                    <AlignLeft size={18} />
                  </span>
                  <textarea
                    placeholder="Describe the project goals and features..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-11 pr-4 outline-none focus:border-primary dark:border-strokedark resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-stroke bg-gray-50 px-6 py-4 dark:border-strokedark dark:bg-meta-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-opacity-90 shadow-md active:scale-95"
            >
              Add Exhibitor
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-[380px] rounded-3xl bg-white p-6 shadow-2xl dark:bg-boxdark animate-in zoom-in duration-200 border border-stroke dark:border-strokedark">
            {/* Icon & Title Section */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-500/10 shadow-inner">
                <ShieldCheck size={38} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white">
                Publish Exhibitor?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Once published, this project will be visible to all attendees
                and voters.
              </p>
            </div>

            {/* Mini Preview Card */}
            <div className="my-6 flex items-center gap-3 rounded-2xl border border-dashed border-stroke bg-gray-50 p-3 dark:border-strokedark dark:bg-meta-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="h-12 w-12 rounded-lg object-cover border border-white shadow-sm"
                  alt="Thumbnail"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <ImageIcon size={20} className="text-gray-400" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold text-black dark:text-white">
                  {title || 'Untitled Project'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {programs.find((p) => p.id.toString() === programId)?.name ||
                    'No program selected'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-green-600/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Confirm & Publish</span>
                  </>
                )}
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-xl py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Back to editing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddExhibitor;
