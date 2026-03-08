import { useState } from 'react';
import { Search } from 'lucide-react';

interface USER {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
}

const usersData: USER[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: 'User ' + (i + 1),
  email: `user${i + 1}@gmail.com`,
  email_verified_at: i % 2 === 0 ? '2026-03-08 10:30 AM' : null,
  created_at: '2026-03-08 10:30 AM',
}));

const rowsPerPage = 10;

const AdminTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Filter users based on search
  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
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
              setPage(1);
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
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Email Verified</th>
              <th className="p-3">Date - Time</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-stroke dark:border-strokedark"
              >
                <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>

                <td className="p-3 font-medium text-black dark:text-white">
                  {user.name}
                </td>

                <td className="p-3">{user.email}</td>

                <td className="p-3">
                  {user.email_verified_at ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-500">Not Verified</span>
                  )}
                </td>

                <td className="p-3">{user.created_at}</td>
              </tr>
            ))}
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
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
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
