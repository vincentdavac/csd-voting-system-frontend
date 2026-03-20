import {
  Search,
  FileText,
  Star,
  User,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

interface ApiBoothRating {
  client: {
    id: number;
    full_name: string;
    email: string;
  };
  exhibitor: {
    id: number;
    project_title: string;
  };
  rating: number | null;
  createdDate: string;
  createdTime: string;
}

const rowsPerPage = 10;

const BoothTable = () => {
  const { authUser } = useAuth();
  const [ratingsData, setRatingsData] = useState<ApiBoothRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRatings = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/booth-ratings`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });

        if (res.ok) {
          const responseData = await res.json();
          setRatingsData(responseData.data || []);
        }
      } catch (error) {
        console.error('Error fetching booth ratings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [authUser]);

  const filteredData = ratingsData.filter(
    (v) =>
      v.client.full_name.toLowerCase().includes(search.toLowerCase()) ||
      v.exhibitor.project_title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="rounded-[32px] border border-stroke bg-white p-6 shadow-2xl dark:border-strokedark dark:bg-boxdark transition-all">
      {/* HEADER & CONTROLS */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stroke pb-6 dark:border-strokedark">
        <div>
          <h2 className="text-xl font-black text-black dark:text-white tracking-tight text-center sm:text-left">
            Booth Ratings Logs
          </h2>
          <p className="text-xs font-medium text-gray-400">
            Review real-time feedback from event participants
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search rater or project..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            onClick={() => alert('Exporting results...')}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95"
          >
            <FileText size={18} />
            <span>Generate Result</span>
          </button>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stroke dark:border-strokedark">
              <th className="pb-4 pl-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Ref.
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Participant
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Rated Project
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Score
              </th>
              <th className="pb-4 pr-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Timestamp
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-strokedark">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="py-6">
                    <div className="h-10 w-full rounded-xl bg-gray-100 dark:bg-meta-4"></div>
                  </td>
                </tr>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((v, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-meta-4/10"
                >
                  <td className="py-5 pl-4">
                    <span className="font-mono text-xs font-bold text-gray-300">
                      #{(page - 1) * rowsPerPage + index + 1}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4 text-gray-500">
                        <User size={16} />
                      </div>
                      <span className="font-bold text-black dark:text-white">
                        {v.client.full_name}
                      </span>
                    </div>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate max-w-[200px] text-gray-600 dark:text-gray-300 font-medium">
                        {v.exhibitor.project_title}
                      </span>
                    </div>
                  </td>

                  <td className="py-5">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1 ring-inset ${
                        v.rating && v.rating >= 4
                          ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400'
                          : v.rating && v.rating >= 3
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400'
                          : 'bg-gray-50 text-gray-600 ring-gray-600/20 dark:bg-white/5 dark:text-gray-400'
                      }`}
                    >
                      <Star
                        size={12}
                        fill={v.rating ? 'currentColor' : 'none'}
                      />
                      {v.rating ?? 'N/A'}
                    </div>
                  </td>

                  <td className="py-5 pr-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-black dark:text-white">
                        {v.createdDate}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 italic">
                        {v.createdTime}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <Inbox size={48} />
                    <p className="mt-2 font-bold uppercase tracking-widest text-xs">
                      No entries found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION AREA */}
      <div className="mt-8 flex items-center justify-between border-t border-stroke pt-6 dark:border-strokedark">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-100 text-gray-500 transition-all hover:bg-gray-100 disabled:opacity-30 dark:border-strokedark dark:hover:bg-meta-4"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-100 text-gray-500 transition-all hover:bg-gray-100 disabled:opacity-30 dark:border-strokedark dark:hover:bg-meta-4"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoothTable;
