import { Search, FileText } from 'lucide-react';
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
        } else {
          console.error('Failed to fetch voting transactions');
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
      v.exhibitor.project_title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleGenerateResult = async () => {
    if (!authUser?.token) {
      console.error('No authorization token found.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/votes-transactions/pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/pdf', 
        },
      });

      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }

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
      console.error('Error generating result:', error);
      alert('Failed to generate the PDF report.');
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* TOP CONTROLS */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* SEARCH */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search voter or project..."
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

        {/* GENERATE RESULT BUTTON */}
        <button
          onClick={handleGenerateResult}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FileText size={18} /> Generate Result
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3">No.</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Voted Exhibitor</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Vote Counts</th>
              <th className="p-3">Date - Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading data...</td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((v, index) => (
                <tr key={index} className="border-b border-stroke">
                  <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>
                  <td className="p-3 font-medium">{v.client.full_name}</td>
                  <td className="p-3">{v.exhibitor.project_title}</td>
                  <td className="p-3 max-w-[200px] truncate">{v.comment || 'N/A'}</td>
                  <td className="p-3 font-medium">{v.votes_casted ?? 0}</td>
                  <td className="p-3">{v.createdDate} - {v.createdTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">No votes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
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

export default VotingTable;