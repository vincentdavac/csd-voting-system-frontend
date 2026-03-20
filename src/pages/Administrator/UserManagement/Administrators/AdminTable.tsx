import { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Plus,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
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
  const [selectedAdmin, setSelectedAdmin] = useState<{
    id: number;
    name: string;
    action: 'grant' | 'revoke';
  } | null>(null);
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
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'N/A';

          return {
            id: u.id,
            image: u.image
              ? `${backendBaseUrl}/storage/${u.image}`
              : '/user-profile.png',
            name: u.first_name
              ? `${u.first_name} ${u.last_name}`
              : u.name || 'Unknown User',
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
      const endpoint =
        selectedAdmin.action === 'grant'
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
  const currentData = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="rounded-[24px] border border-stroke bg-white p-2 shadow-default dark:border-strokedark dark:bg-boxdark relative overflow-hidden animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="p-6 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              System Control
            </span>
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic">
            Admin Directory
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search credentials..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-stroke bg-gray-50 dark:bg-meta-4/20 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white dark:border-strokedark transition-all shadow-inner"
            />
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline uppercase tracking-wider text-xs">
              New Admin
            </span>
          </button>
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full table-auto text-left border-separate border-spacing-y-2 px-4">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
              <th className="px-4 py-4">Identity</th>
              <th className="px-4 py-4">Communication</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-center">Authority</th>
            </tr>
          </thead>

          <tbody className="before:block before:h-2">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
                      Syncing Encrypted Data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-20 text-gray-400 italic font-medium"
                >
                  No active personnel found matching criteria.
                </td>
              </tr>
            ) : (
              currentData.map((user) => (
                <tr key={user.id} className="group transition-all">
                  {/* IDENTITY CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 rounded-l-2xl px-4 py-4 border-y border-l border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={user.image || '/user-profile.png'}
                          alt={user.name}
                          className="h-11 w-11 rounded-xl object-cover ring-2 ring-white dark:ring-boxdark shadow-md"
                        />
                        {user.is_active && (
                          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-boxdark bg-green-500 shadow-sm"></span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-black dark:text-white truncate text-sm">
                          {user.name}
                        </p>
                        {user.role === 'super_admin' ? (
                          <span className="text-[9px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-tighter bg-purple-500/10 px-1.5 py-0.5 rounded">
                            Lvl: Super Admin
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter">
                            Lvl: Standard
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* CONTACT CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 px-4 py-4 border-y border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-black dark:text-white">
                        {user.email}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-tight">
                        {user.contact_number}
                      </span>
                    </div>
                  </td>

                  {/* STATUS CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 px-4 py-4 border-y border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                        user.is_active
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.is_active
                            ? 'bg-green-600 animate-pulse'
                            : 'bg-red-600'
                        }`}
                      ></span>
                      {user.is_active ? 'Authorized' : 'Deactivated'}
                    </span>
                  </td>

                  {/* ACTIONS CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 rounded-r-2xl px-4 py-4 border-y border-r border-stroke dark:border-strokedark text-center group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex justify-center">
                      {authUser?.user?.id === user.id ? (
                        <span className="rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-[10px] font-black text-gray-500 uppercase italic">
                          Self Entry
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            openModal(
                              user.id,
                              user.name,
                              user.is_active ? 'revoke' : 'grant',
                            )
                          }
                          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                            user.is_active
                              ? 'bg-white dark:bg-boxdark text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-red-500/20'
                              : 'bg-primary text-white hover:bg-opacity-90 hover:shadow-primary/20'
                          }`}
                        >
                          {user.is_active ? (
                            <>
                              {' '}
                              <ShieldAlert size={14} /> Revoke{' '}
                            </>
                          ) : (
                            <>
                              {' '}
                              <ShieldCheck size={14} /> Grant{' '}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="p-6 border-t border-stroke dark:border-strokedark flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing Page {page}{' '}
          <span className="lowercase italic text-gray-300 mx-1">of</span>{' '}
          {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl border border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl border border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {isModalOpen && selectedAdmin && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-boxdark rounded-[40px] shadow-2xl p-10 border border-white/10 text-center relative overflow-hidden">
            {/* Modal Branding Decoration */}
            <div
              className={`absolute top-0 left-0 w-full h-2 ${
                selectedAdmin.action === 'grant' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />

            <div className="relative mx-auto h-24 w-24 mb-6">
              <div
                className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                  selectedAdmin.action === 'grant'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              />
              <div
                className={`relative h-24 w-24 rounded-full flex items-center justify-center border-2 ${
                  selectedAdmin.action === 'grant'
                    ? 'bg-green-500/10 border-green-500/50 text-green-500'
                    : 'bg-red-500/10 border-red-500/50 text-red-500'
                }`}
              >
                {selectedAdmin.action === 'grant' ? (
                  <ShieldCheck size={48} />
                ) : (
                  <ShieldAlert size={48} />
                )}
              </div>
            </div>

            <h3 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-2">
              Security Override
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
              System Access Modification
            </p>

            <div className="mb-8 p-4 rounded-2xl bg-gray-50 dark:bg-meta-4/50 border border-stroke dark:border-strokedark">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                Confirm{' '}
                {selectedAdmin.action === 'grant' ? 'granting' : 'revoking'}{' '}
                access for <br />
                <span className="text-black dark:text-white font-black uppercase italic">
                  {selectedAdmin.name}
                </span>
                ?
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={handleAccessChange}
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                  selectedAdmin.action === 'grant'
                    ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20'
                    : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                }`}
              >
                {isProcessing
                  ? 'PROCESSING...'
                  : `YES, ${selectedAdmin.action} ACCESS`}
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isProcessing}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.2); border-radius: 10px; }
      `,
        }}
      />

      {/* ADD ADMIN MODAL COMPONENT */}
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
