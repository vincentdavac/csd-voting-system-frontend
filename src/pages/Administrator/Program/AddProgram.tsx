import { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  BookOpen,
  AlignLeft,
  ShieldCheck,
  PlusCircle,
  Upload,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

interface AddProgramProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddProgram = ({ onClose, onAdd }: AddProgramProps) => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

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

    try {
      const res = await fetch(`${API_BASE_URL}/programs`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        showAlert('success', 'Program added successfully.');
        onAdd();
        onClose();
      } else {
        const errorData = await res.json();
        showAlert('error', errorData.message || 'Failed to add program.');
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
        <div className="relative w-full max-w-lg rounded-[32px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stroke px-8 py-5 dark:border-strokedark">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PlusCircle size={20} />
              </div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                New Program
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
            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative mb-8 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 transition-all hover:border-primary hover:bg-primary/5 dark:border-strokedark dark:bg-meta-4 dark:hover:border-primary"
            >
              {imagePreview ? (
                <div className="relative h-24 w-24">
                  <img
                    src={imagePreview}
                    className="h-full w-full rounded-2xl object-cover shadow-lg"
                    alt="Preview"
                  />
                  <div className="absolute -right-2 -top-2 rounded-full bg-primary p-1 text-white shadow-md">
                    <Upload size={14} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm dark:bg-boxdark">
                    <ImageIcon size={28} />
                  </div>
                  <p className="text-sm font-semibold text-gray-500">
                    Upload Program Icon
                  </p>
                  <p className="text-xs text-gray-400">Click to browse files</p>
                </>
              )}
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
              {/* Name Input */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Program Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BookOpen size={18} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-stroke bg-transparent py-3.5 pl-12 pr-4 text-sm outline-none focus:border-primary dark:border-strokedark dark:text-white"
                    placeholder="e.g. BS in Information Technology"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
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
                    className="w-full rounded-2xl border border-stroke bg-transparent py-3.5 pl-12 pr-4 text-sm outline-none focus:border-primary dark:border-strokedark dark:text-white resize-none"
                    placeholder="Briefly describe this program..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 bg-gray-50 px-8 py-5 dark:bg-meta-4 border-t border-stroke dark:border-strokedark">
            <button
              onClick={onClose}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-primary px-10 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              Create Program
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-all">
          <div className="w-full max-w-[400px] rounded-[32px] bg-white p-8 shadow-2xl dark:bg-boxdark animate-in zoom-in duration-200 border border-stroke dark:border-strokedark">
            {/* Icon & Title */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-green-50 text-green-600 dark:bg-green-500/10 shadow-inner ring-8 ring-green-50/50 dark:ring-green-500/5">
                <ShieldCheck size={42} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">
                Confirm Creation
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You are adding a new program to the directory. Please verify the
                details below.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="my-8 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4/30">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm dark:border-strokedark">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="h-full w-full object-cover"
                      alt="Icon"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-boxdark">
                      <BookOpen size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                    Program Name
                  </p>
                  <p className="truncate text-base font-bold text-black dark:text-white">
                    {name || 'Untitled Program'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-green-600/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Finalize & Create</span>
                  </>
                )}
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-xl py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
              >
                Review details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProgram;
