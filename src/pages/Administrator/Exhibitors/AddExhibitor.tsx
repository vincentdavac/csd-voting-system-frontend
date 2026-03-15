import { useState, useEffect } from 'react';
import {
  XCircle,
  Image,
  BookOpen,
  AlignLeft,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext'; 
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api'; //

interface Program {
  id: number;
  name: string;
}

interface AddExhibitorProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddExhibitor = ({ onClose, onAdd }: AddExhibitorProps) => {
  const { authUser } = useAuth(); //
  const { showAlert } = useAlert();
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
        const res = await fetch(`${API_BASE_URL}/programs`); //
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

  const handleSubmit = () => {
    if (!title || !description || !programId) {
        showAlert('warning', 'Please fill in all required fields.');
        return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!authUser?.token) return; //
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('project_title', title);
    formData.append('project_description', description);
    formData.append('program_id', programId);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/exhibitors`, { //
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${authUser.token}`,
            'Accept': 'application/json' 
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
      console.error('Creation failed', error);
      showAlert('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            Add New Exhibitor
          </h2>

          {/* Image Upload */}
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
            {/* Title */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-3 bg-gray-50 dark:bg-gray-800">
              <BookOpen size={20} className="text-gray-500" />
              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-300"
              />
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-3 bg-gray-50 dark:bg-gray-800">
              <AlignLeft size={20} className="text-gray-500 mt-1" />
              <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-300 resize-none"
              />
            </div>

            {/* Program Selection */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-strokedark p-3 bg-gray-50 dark:bg-gray-800">
              <GraduationCap size={20} className="text-gray-500" />
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-300"
              >
                <option value="">Select Program / Course</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XCircle size={18} /> Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-5 py-2 text-white hover:bg-opacity-90"
            >
              Add Exhibitor
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
                Confirm Add Exhibitor
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to add this exhibitor?
            </p>
            <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Program:</strong> {programs.find(p => p.id.toString() === programId)?.name}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddExhibitor;