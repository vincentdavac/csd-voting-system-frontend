import { Search, FileDown, SquarePen, Wallet } from 'lucide-react';
import { useState } from 'react';
import TopUpModal from './TopUpModal';

interface TRANSACTION {
  program: string;
  studentNo: string;
  idPicture: string;
  fullName: string;
  amountPaid: number;
  votesGiven: number;
  datetime: string;
}

const transactionsData: TRANSACTION[] = Array.from({ length: 30 }, (_, i) => ({
  program: i % 2 === 0 ? 'BSIT' : 'BSBA',
  studentNo: '2023-00' + (i + 1),
  idPicture: 'https://via.placeholder.com/40',
  fullName: 'Student ' + (i + 1),
  amountPaid: 50,
  votesGiven: 10,
  datetime: `2026-03-${(i % 9) + 1} 10:30 AM`,
}));

const rowsPerPage = 10;

const TransactionsTable = () => {
  const [showTopUp, setShowTopUp] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filter
  const filteredData = transactionsData.filter((t) => {
    const matchSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.studentNo.toLowerCase().includes(search.toLowerCase());

    const matchDate = dateFilter ? t.datetime.includes(dateFilter) : true;

    return matchSearch && matchDate;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // Revenue Calculations
  const totalRevenue = filteredData.reduce((sum, t) => sum + t.amountPaid, 0);

  const revenuePerProgram = filteredData.reduce((acc: any, t) => {
    acc[t.program] = (acc[t.program] || 0) + t.amountPaid;
    return acc;
  }, {});

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Top Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search student..."
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

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded border px-3 py-2 bg-transparent dark:border-strokedark dark:[color-scheme:dark]"
          />

          <div>
            {/* Top Up Points Button */}
            <button
              onClick={() => setShowTopUp(true)}
              className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <Wallet size={18} />
              Top Up Points
            </button>
          </div>
          {/* Generate PDF */}
          <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90">
            <FileDown size={18} />
            Generate PDF
          </button>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h3 className="text-xl font-bold">₱{totalRevenue}</h3>
        </div>

        {Object.entries(revenuePerProgram).map(([program, value]) => (
          <div key={program} className="rounded border p-4">
            <p className="text-sm text-gray-500">Revenue - {program}</p>
            <h3 className="text-xl font-bold">₱{value as number}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto ">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3">No.</th>
              <th className="p-3">ID Picture</th>
              <th className="p-3">Student No.</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Amount Paid</th>
              <th className="p-3">Vote Given</th>
              <th className="p-3">Date - Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((t, index) => (
              <tr key={index} className="border-b border-stroke">
                <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>

                <td className="p-3">
                  <img src={t.idPicture} className="h-10 w-10 rounded-full" />
                </td>

                <td className="p-3">{t.studentNo}</td>
                <td className="p-3">{t.fullName}</td>
                <td className="p-3">₱{t.amountPaid}</td>
                <td className="p-3">{t.votesGiven}</td>
                <td className="p-3">{t.datetime}</td>

                {/* Action */}
                <td className="p-3 flex justify-center">
                  <button
                    className="text-blue-600 hover:underline"
                    title="Update (Requires Super Admin Approval)"
                  >
                    <SquarePen size={18} />{' '}
                  </button>
                </td>
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

      {/* Show Modal */}
      {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} />}
    </div>
  );
};

export default TransactionsTable;
