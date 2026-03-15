import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import API_BASE_URL from '../../../../config/api';

interface USER {
  id: number;
  image: string | null;
  name: string;
  contact_number: string;
  email: string;
  created_at: string;
}

const rowsPerPage = 10;

const AdminTable = () => {
  const { authUser } = useAuth();
  const [usersData, setUsersData] = useState<USER[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Fetch real users from backend
  useEffect(() => {
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
          // Safely format the image path from the backend
          const backendBaseUrl = API_BASE_URL.replace(/\/api\/?$/, '');

          const mapped = json.data.map((u: any) => {
            // Safely format the date
            const formattedDate = u.created_at 
                ? new Date(u.created_at).toLocaleString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric', 
                    hour: '2-digit', minute: '2-digit'
                  })
                : 'N/A';

            return {
              id: u.id,
              image: u.image ? `${backendBaseUrl}/storage/${u.image}` : '/user-profile.png',
              // Combine first_name and last_name (with fallback for 'name' just in case)
              name: u.first_name ? `${u.first_name} ${u.last_name}` : (u.name || 'Unknown User'),
              contact_number: u.contact_number || 'N/A',
              email: u.email,
              created_at: formattedDate,
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

    fetchAdmins();
  }, [authUser?.token]);

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
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Search Bar */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search administrators..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page when searching
            }}
            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark"
          />

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
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
              <th className="p-3">Date - Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-10 text-gray-500">
                  Loading administrators...
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-10 text-gray-500 italic">
                  No administrators found.
                </td>
              </tr>
            ) : (
              currentData.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-stroke dark:border-strokedark"
                >
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
                  </td>

                  <td className="p-3">{user.contact_number}</td>

                  <td className="p-3">{user.email}</td>

                  <td className="p-3">{user.created_at}</td>
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

        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="rounded border px-4 py-1 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default AdminTable;