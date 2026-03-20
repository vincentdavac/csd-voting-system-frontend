import { useState, useEffect, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  BookOpen,
  AlignLeft,
  ShieldCheck,
  Edit3,
  Upload,
  Loader2,
} from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (selectedFile) formData.append('image', selectedFile);
    formData.append('_method', 'PATCH');

    try {
      const res = await fetch(`${API_BASE_URL}/programs/${program.id}`, {
        method: 'POST', // Using POST with _method PATCH for FormData compatibility
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
      showAlert('error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
        <div className="relative w-full max-w-lg rounded-[32px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stroke px-8 py-5 dark:border-strokedark">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10">
                <Edit3 size={20} />
              </div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                Edit Program
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-danger dark:hover:bg-white/10 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto max-h-[70vh]">
            {/* Interactive Image Edit Area */}
            <div className="group relative mb-8 flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-28 w-28 cursor-pointer overflow-hidden rounded-3xl border-4 border-white shadow-2xl transition-transform hover:scale-105 dark:border-strokedark"
              >
                <img
                  src={imagePreview}
                  className="h-full w-full object-cover"
                  alt="Preview"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="text-white" size={24} />
                </div>
              </div>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Click icon to replace
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

            <div className="space-y-6">
              {/* Program Name */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Program Title
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BookOpen size={18} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-stroke bg-transparent py-3.5 pl-12 pr-4 text-sm outline-none focus:border-amber-500 dark:border-strokedark dark:text-white"
                    placeholder="Program name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Detailed Description
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400">
                    <AlignLeft size={18} />
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-stroke bg-transparent py-3.5 pl-12 pr-4 text-sm outline-none focus:border-amber-500 dark:border-strokedark dark:text-white resize-none"
                    placeholder="Describe the program objectives..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 bg-gray-50 px-8 py-5 dark:bg-meta-4 border-t border-stroke dark:border-strokedark">
            <button
              onClick={onClose}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-amber-600 px-10 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95"
            >
              Update Program
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-all duration-300">
          <div className="w-full max-w-[400px] rounded-[40px] bg-white p-8 shadow-2xl dark:bg-boxdark animate-in zoom-in duration-200 border border-stroke dark:border-strokedark">
            {/* Header & Icon */}
            <div className="flex flex-col items-center text-center">
              <div className="group relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-amber-50 text-amber-600 dark:bg-amber-500/10 shadow-inner ring-8 ring-amber-50/50 dark:ring-amber-500/5">
                  <ShieldCheck size={42} strokeWidth={1.5} />
                </div>
                {/* Subtle pulse effect for the icon */}
                <div className="absolute inset-0 animate-ping rounded-[28px] bg-amber-400/20 duration-[2000ms]" />
              </div>

              <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">
                Save Changes?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                This will modify the official records for this program.
              </p>
            </div>

            {/* Verification Card */}
            <div className="my-8 overflow-hidden rounded-3xl border border-amber-100 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-900/5">
              <div className="flex items-center gap-4 p-5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-md dark:border-strokedark">
                  <img
                    src={imagePreview}
                    className="h-full w-full object-cover"
                    alt="New Icon"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-500">
                    Target Update
                  </p>
                  <p className="truncate text-base font-bold text-black dark:text-white">
                    {name || program.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 text-sm font-bold text-white transition-all hover:bg-amber-700 active:scale-[0.97] disabled:opacity-70 shadow-lg shadow-amber-600/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Apply Update'
                )}
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-xl py-2 text-sm font-bold text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
              >
                Review again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProgram;
