import { useState, useEffect } from 'react';
import { XCircle, Image, BookOpen, AlignLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

interface EXHIBITOR {
  id: number;
  image: string;
  title: string;
  description: string;
  program: string;
  program_id: number;
}

interface Program {
  id: number;
  name: string;
}

const UpdateExhibitor = ({ exhibitor, onClose, onUpdate }: any) => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
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
      const res = await fetch(`${API_BASE_URL}/programs`);
      const json = await res.json();
      setPrograms(json.data.map((p: any) => ({ id: p.id, name: p.attributes.name })));
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
        headers: { 'Authorization': `Bearer ${authUser.token}`, 'Accept': 'application/json' },
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
      console.error('Update failed', error);
      showAlert('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-boxdark p-6 overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
            <XCircle size={24} />
          </button>
          <h2 className="mb-6 text-2xl font-semibold text-center dark:text-white">Update Exhibitor</h2>

          <div className="flex flex-col items-center mb-6">
            <img src={imagePreview} className="h-28 w-28 rounded-lg border object-cover shadow" />
            <input
              type="file"
              className="mt-3 text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { setSelectedFile(file); setImagePreview(URL.createObjectURL(file)); }
              }}
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3 dark:bg-gray-800">
              <BookOpen size={20} className="text-gray-500" />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent outline-none dark:text-white"
                placeholder="Project Title"
              />
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3 dark:bg-gray-800">
              <AlignLeft size={20} className="text-gray-500 mt-1" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-transparent outline-none dark:text-white resize-none"
                placeholder="Project Description"
              />
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 dark:bg-gray-800">
              <GraduationCap size={20} className="text-gray-500" />
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full bg-transparent outline-none dark:text-white"
              >
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="border px-4 py-2 rounded-lg dark:text-white">
              Cancel
            </button>
            <button onClick={handleSubmit} className="bg-yellow-600 px-5 py-2 text-white rounded-lg">
              Update
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-boxdark rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-yellow-600" size={22} />
              <h3 className="font-semibold dark:text-white">Confirm Update</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to update this exhibitor?
            </p>
            <div className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Program:</strong> {programs.find(p => p.id.toString() === programId)?.name}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border rounded-lg dark:text-white">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Changes...' : 'Yes, Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateExhibitor;