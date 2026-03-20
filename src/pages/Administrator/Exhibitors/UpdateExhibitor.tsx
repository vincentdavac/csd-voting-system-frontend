import { useState, useEffect, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  BookOpen,
  AlignLeft,
  GraduationCap,
  ShieldCheck,
  Edit3,
  Loader2,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

interface Program {
  id: number;
  name: string;
}

const UpdateExhibitor = ({ exhibitor, onClose, onUpdate }: any) => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(exhibitor.image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState(exhibitor.title);
  const [description, setDescription] = useState(exhibitor.description);
  const [programId, setProgramId] = useState(exhibitor.program_id.toString());
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/programs`);
        const json = await res.json();
        setPrograms(
          json.data.map((p: any) => ({ id: p.id, name: p.attributes.name })),
        );
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  const handleSubmit = () => {
    if (!title || !description || !programId) {
      showAlert('warning', 'Please fill in all required fields.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!authUser?.token) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('project_title', title);
    formData.append('project_description', description);
    formData.append('program_id', programId);
    if (selectedFile) formData.append('image', selectedFile);

    try {
      const res = await fetch(`${API_BASE_URL}/exhibitors/${exhibitor.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (res.ok) {
        showAlert('success', 'Exhibitor updated successfully.');
        onUpdate();
        onClose();
      } else {
        const errorData = await res.json();
        showAlert('error', errorData.message || 'Failed to update exhibitor.');
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
        <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-boxdark shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/10">
                <Edit3 size={18} />
              </div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                Edit Exhibitor
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-danger transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[75vh]">
            {/* Image Preview / Upload */}
            <div className="group relative mb-8 flex flex-col items-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-xl dark:border-strokedark">
                <img
                  src={imagePreview}
                  className="h-full w-full object-cover"
                  alt="Preview"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Upload className="text-white" size={24} />
                </button>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Click image to replace
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className="space-y-5">
              {/* Title Input */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Project Title
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BookOpen size={18} />
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-11 pr-4 outline-none focus:border-amber-500 dark:border-strokedark dark:text-white"
                    placeholder="Enter project name"
                  />
                </div>
              </div>

              {/* Program Select */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Program / Course
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <GraduationCap size={18} />
                  </span>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-stroke bg-transparent py-3 pl-11 pr-4 outline-none focus:border-amber-500 dark:border-strokedark dark:text-white"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Description
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400">
                    <AlignLeft size={18} />
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-11 pr-4 outline-none focus:border-amber-500 dark:border-strokedark dark:text-white resize-none"
                    placeholder="Project details..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-stroke bg-gray-50 px-6 py-4 dark:border-strokedark dark:bg-meta-4">
            <button
              onClick={onClose}
              className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-amber-600 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 shadow-lg shadow-amber-600/20 active:scale-95"
            >
              Update Details
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-[400px] rounded-[32px] bg-white p-8 shadow-2xl dark:bg-boxdark animate-in zoom-in duration-200 border border-stroke dark:border-strokedark">
            {/* Icon & Title */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 shadow-inner">
                <ShieldCheck size={42} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white">
                Review Changes
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Double check the details before saving. This will update the
                public exhibition entry.
              </p>
            </div>

            {/* Comparison / Summary Box */}
            <div className="my-8 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-900/5">
              <div className="px-4 py-3 border-b border-amber-100 dark:border-amber-900/20 bg-amber-50/50 dark:bg-amber-900/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-500">
                  Target Entry
                </p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    className="h-10 w-10 rounded-lg object-cover ring-2 ring-white dark:ring-boxdark shadow-sm"
                    alt="Thumbnail"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-black dark:text-white">
                      {title}
                    </p>
                    <p className="text-[11px] font-medium text-gray-500 truncate">
                      {
                        programs.find((p) => p.id.toString() === programId)
                          ?.name
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 text-sm font-bold text-white transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-amber-600/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Apply Changes'
                )}
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-xl py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                Nevermind, go back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateExhibitor;
