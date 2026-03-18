import { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert, Plus } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import API_BASE_URL from '../../../../config/api';
import AddAdminModal from './AddAdminModal';

interface USER {
  id: number;
  image: string | null;
  name: string;
  contact_number: string;
  email: string;
  created_at: string;
  is_active: boolean; // Added
  role: string; // Added
}

const rowsPerPage = 10;

const AdminTable = () => {
  const { authUser } = useAuth();
  const [usersData, setUsersData] = useState<USER[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<{ id: number, name: string, action: 'grant' | 'revoke' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchAdmins = async () => {
    if (!authUser?.token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/all-users`, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });
      const json = await res.json();

      if (json.data) {
        const backendBaseUrl = API_BASE_URL.replace(/\/api\/?$/, '');

        const mapped = json.data.map((u: any) => {
          const formattedDate = u.created_at 
              ? new Date(u.created_at).toLocaleString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', 
                  hour: '2-digit', minute: '2-digit'
                })
              : 'N/A';

          return {
            id: u.id,
            image: u.image ? `${backendBaseUrl}/storage/${u.image}` : '/user-profile.png',
            name: u.first_name ? `${u.first_name} ${u.last_name}` : (u.name || 'Unknown User'),
            contact_number: u.contact_number || 'N/A',
            email: u.email,
            created_at: formattedDate,
            is_active: Boolean(u.is_active), // Map is_active
            role: u.role || 'admin', // Map role
          };
        });
        
        setUsersData(mapped);
      }
    } catch (error) {
      console.error('Error fetching administrators:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [authUser?.token]);

  // Handle Access Change
  const handleAccessChange = async () => {
    if (!selectedAdmin || !authUser?.token) return;
    setIsProcessing(true);

    try {
      const endpoint = selectedAdmin.action === 'grant' 
        ? `${API_BASE_URL}/users/${selectedAdmin.id}/grant-access`
        : `${API_BASE_URL}/users/${selectedAdmin.id}/revoke-access`;

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        await fetchAdmins(); // Refresh data
        setIsModalOpen(false);
        setSelectedAdmin(null);
      } else {
        alert(data.message || `Failed to ${selectedAdmin.action} access.`);
      }
    } catch (error) {
      console.error(`Error during ${selectedAdmin.action}:`, error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (id: number, name: string, action: 'grant' | 'revoke') => {
    setSelectedAdmin({ id, name, action });
    setIsModalOpen(true);
  };

  // Filter users based on search
  const filteredUsers = usersData.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.contact_number?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const currentData = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark relative">
      {/* Search Bar */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search administrators..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
        >
          <Plus size={20} />
          Add Administrator
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3">No.</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Contact Number</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-10 text-gray-500">Loading administrators...</td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-10 text-gray-500 italic">No administrators found.</td>
              </tr>
            ) : (
              currentData.map((user, index) => (
                <tr key={user.id} className="border-b border-stroke dark:border-strokedark">
                  <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>
                  <td className="p-3">
                    <img
                      src={user.image || '/user-profile.png'}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-stroke dark:border-strokedark"
                    />
                  </td>
                  <td className="p-3 font-medium text-black dark:text-white">
                    {user.name}
                    {user.role === 'super_admin' && (
                      <span className="ml-2 rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        Super Admin
                      </span>
                    )}
                  </td>
                  <td className="p-3">{user.contact_number}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    {/* Prevent logged-in admin from taking actions on themselves */}
                    {authUser?.user?.id === user.id ? (
                      <span className="text-xs text-gray-400 italic">Current User</span>
                    ) : user.is_active ? (
                      <button
                        onClick={() => openModal(user.id, user.name, 'revoke')}
                        className="flex items-center gap-1 rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                      >
                        <ShieldAlert size={14} /> Revoke Access
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(user.id, user.name, 'grant')}
                        className="flex items-center gap-1 rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40"
                      >
                        <ShieldCheck size={14} /> Grant Access
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded border px-4 py-1 disabled:opacity-40"
        >
          ←
        </button>
        <span className="text-sm">Page {page} of {totalPages || 1}</span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="rounded border px-4 py-1 disabled:opacity-40"
        >
          →
        </button>
      </div>

      {/* CONFIRMATION MODAL */}
      {isModalOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white flex items-center gap-2">
              {selectedAdmin.action === 'grant' ? <ShieldCheck className="text-green-600" /> : <ShieldAlert className="text-red-600" />}
              Confirm {selectedAdmin.action === 'grant' ? 'Access Grant' : 'Access Revocation'}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to {selectedAdmin.action} access for <strong>{selectedAdmin.name}</strong>?
              {selectedAdmin.action === 'revoke' && " They will immediately be unable to log in to the portal."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isProcessing}
                className="rounded border border-stroke px-4 py-2 font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={handleAccessChange}
                disabled={isProcessing}
                className={`rounded px-4 py-2 font-medium text-white ${
                  selectedAdmin.action === 'grant' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {isProcessing ? 'Processing...' : `Yes, ${selectedAdmin.action} Access`}
              </button>
            </div>
          </div>
        </div>
      )}
      {authUser?.token && (
        <AddAdminModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchAdmins}
          token={authUser.token}
        />
      )}
    </div>
  );
};

export default AdminTable;