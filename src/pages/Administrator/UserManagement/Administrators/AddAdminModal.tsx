import React, { useState } from 'react';
import { X, User, Mail, Phone, ShieldAlert, Loader2 } from 'lucide-react';
import API_BASE_URL from '../../../../config/api';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  token,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(
          data.message || 'Failed to create administrator. Check inputs.',
        );
      }
    } catch (err) {
      console.error(err);
      setError('A system error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-[32px] bg-white dark:bg-boxdark shadow-2xl overflow-hidden border border-white/10 flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
        {/* BRANDING STRIPED ACCENT */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#3c50e0,#3c50e0_10px,#2563eb_10px,#2563eb_20px)]" />

        <div className="p-8 sm:p-10">
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-meta-4 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={20} />
          </button>

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                Identity Access Management
              </span>
            </div>
            <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter italic uppercase">
              New Admin
            </h2>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 dark:bg-red-900/10 p-4 border border-red-200 dark:border-red-900/30 animate-in slide-in-from-top-2">
              <div className="shrink-0 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <ShieldAlert size={16} />
              </div>
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase italic">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Given Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-meta-4/30 py-4 pl-12 pr-4 text-sm font-bold text-black dark:text-white outline-none focus:border-primary focus:bg-white dark:focus:bg-meta-4/50 transition-all shadow-inner"
                    placeholder="Enter first name"
                  />
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Surname
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-meta-4/30 py-4 pl-12 pr-4 text-sm font-bold text-black dark:text-white outline-none focus:border-primary focus:bg-white dark:focus:bg-meta-4/50 transition-all shadow-inner"
                    placeholder="Enter last name"
                  />
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Official Email Endpoint
              </label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-meta-4/30 py-4 pl-12 pr-4 text-sm font-bold text-black dark:text-white outline-none focus:border-primary focus:bg-white dark:focus:bg-meta-4/50 transition-all shadow-inner"
                  placeholder="admin@domain.com"
                />
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Contact Protocol
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="contact_number"
                  required
                  value={formData.contact_number}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-meta-4/30 py-4 pl-12 pr-4 text-sm font-bold text-black dark:text-white outline-none focus:border-primary focus:bg-white dark:focus:bg-meta-4/50 transition-all shadow-inner"
                  placeholder="e.g. 09123456789"
                />
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="order-2 sm:order-1 px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="order-1 sm:order-2 flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-black dark:bg-white dark:text-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deploying...
                  </>
                ) : (
                  'Authorize Admin'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
