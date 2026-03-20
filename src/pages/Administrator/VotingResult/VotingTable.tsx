import {
  Search,
  FileText,
  User,
  MessageSquare,
  Ticket,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Clock,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

interface ApiVote {
  client: {
    id: number;
    full_name: string;
    email: string;
    remaining_votes: number;
  };
  exhibitor: {
    id: number;
    project_title: string;
    total_votes: number;
  };
  votes_casted: number | null;
  comment: string | null;
  rating: number | null;
  createdDate: string;
  createdTime: string;
}

const rowsPerPage = 10;

const VotingTable = () => {
  const { authUser } = useAuth();
  const [votesData, setVotesData] = useState<ApiVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchVotes = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/votes`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });

        if (res.ok) {
          const responseData = await res.json();
          setVotesData(responseData.data || []);
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVotes();
  }, [authUser]);

  const filteredData = votesData.filter(
    (v) =>
      v.client.full_name.toLowerCase().includes(search.toLowerCase()) ||
      v.exhibitor.project_title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleGenerateResult = async () => {
    if (!authUser?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/votes-transactions/pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/pdf',
        },
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Voting_Transactions.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to generate the PDF report.');
    }
  };

  return (
    <div className="rounded-[32px] border border-stroke bg-white p-6 shadow-2xl dark:border-strokedark dark:bg-boxdark transition-all">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stroke pb-6 dark:border-strokedark">
        <div>
          <h2 className="text-xl font-black text-black dark:text-white tracking-tight">
            Voting Transactions
          </h2>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">
            Audit Log & Public Choice Records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search voter or project..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1-2 text-gray-400"
            />
          </div>

          <button
            onClick={handleGenerateResult}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
          >
            <FileText size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stroke dark:border-strokedark">
              <th className="pb-4 pl-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                #
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Voter Name
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Project Title
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Feedback
              </th>
              <th className="pb-4 font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Ticket(s)
              </th>
              <th className="pb-4 pr-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px]">
                Logged At
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-strokedark">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="py-6">
                    <div className="h-10 w-full rounded-xl bg-gray-100 dark:bg-meta-4"></div>
                  </td>
                </tr>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((v, index) => (
                <tr
                  key={index}
                  className="group hover:bg-gray-50/50 dark:hover:bg-meta-4/10"
                >
                  <td className="py-5 pl-4">
                    <span className="font-mono text-xs font-bold text-gray-300">
                      {(page - 1) * rowsPerPage + index + 1}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                        <User size={14} />
                      </div>
                      <span className="font-bold text-black dark:text-white">
                        {v.client.full_name}
                      </span>
                    </div>
                  </td>

                  <td className="py-5">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {v.exhibitor.project_title}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-2 max-w-[250px]">
                      <MessageSquare
                        size={14}
                        className="text-gray-300 shrink-0"
                      />
                      <p className="truncate text-xs text-gray-500 italic">
                        {v.comment ? `"${v.comment}"` : 'No comment left.'}
                      </p>
                    </div>
                  </td>

                  <td className="py-5">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                      <Ticket size={12} />
                      {v.votes_casted ?? 0}
                    </div>
                  </td>

                  <td className="py-5 pr-4 text-right">
                    <div className="flex flex-col items-end opacity-70">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-black dark:text-white">
                        <Calendar size={10} /> {v.createdDate}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                        <Clock size={10} /> {v.createdTime}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center opacity-20 text-gray-400">
                    <Inbox size={48} strokeWidth={1} />
                    <p className="mt-2 font-bold uppercase tracking-widest text-xs">
                      Zero Transactions
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
      <div className="mt-8 flex items-center justify-between border-t border-stroke pt-6 dark:border-strokedark">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Showing Page {page} of {totalPages || 1}
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-gray-100 text-gray-500 transition-all hover:bg-gray-100 disabled:opacity-30 dark:border-strokedark dark:hover:bg-meta-4"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-gray-100 text-gray-500 transition-all hover:bg-gray-100 disabled:opacity-30 dark:border-strokedark dark:hover:bg-meta-4"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingTable;
