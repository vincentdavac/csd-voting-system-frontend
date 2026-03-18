import React, { useState } from 'react';
import { X, User, Mail, Phone } from 'lucide-react';
import API_BASE_URL from '../../../../config/api';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose, onSuccess, token }) => {
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
        alert('Administrator created successfully! Their credentials have been emailed to them.');
        onSuccess(); 
        onClose(); 
      } else {
        setError(data.message || 'Failed to create administrator. Please check the inputs.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-default dark:bg-boxdark">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Add New Administrator
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke bg-transparent py-3 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark"
                  placeholder="Enter first name"
                />
                <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">Last Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke bg-transparent py-3 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark"
                  placeholder="Enter last name"
                />
                <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded border border-stroke bg-transparent py-3 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark"
                placeholder="Enter email address"
              />
              <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">Contact Number</label>
            <div className="relative">
              <input
                type="text"
                name="contact_number"
                required
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full rounded border border-stroke bg-transparent py-3 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark"
                placeholder="e.g. 09123456789"
              />
              <Phone className="absolute left-4 top-3.5 text-gray-500" size={20} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-stroke px-6 py-2 font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;