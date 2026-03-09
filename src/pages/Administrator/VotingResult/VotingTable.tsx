import { Search, FileText } from 'lucide-react';
import { useState } from 'react';

interface VOTE {
  image: string;
  fullName: string;
  votedExhibitor: string;
  comment: string;
  voteCount: number;
  dateTime: string;
}

const votesData: VOTE[] = Array.from({ length: 20 }, (_, i) => ({
  image: 'https://via.placeholder.com/50',
  fullName: `Voter ${i + 1}`,
  votedExhibitor: `Project ${(i % 10) + 1}`,
  comment: i % 2 === 0 ? 'Great project!' : 'Interesting idea',
  voteCount: Math.floor(Math.random() * 10) + 1,
  dateTime: new Date().toLocaleString(),
}));

const rowsPerPage = 10;

const VotingTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filteredData = votesData.filter(
    (v) =>
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.votedExhibitor.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handleGenerateResult = () => {
    alert('Generate result functionality goes here!');
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
              <th className="p-3">Image</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Voted Exhibitor</th>
              <th className="p-3">Comment</th>
              <th className="p-3">Vote Counts</th>
              <th className="p-3">Date - Time</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((v, index) => (
              <tr key={index} className="border-b border-stroke">
                <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>
                <td className="p-3">
                  <img
                    src={v.image}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>
                <td className="p-3 font-medium">{v.fullName}</td>
                <td className="p-3">{v.votedExhibitor}</td>
                <td className="p-3 max-w-[200px] truncate">{v.comment}</td>
                <td className="p-3 font-medium">{v.voteCount}</td>
                <td className="p-3">{v.dateTime}</td>
              </tr>
            ))}
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
