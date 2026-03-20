import { Search, FileDown, SquarePen, Wallet, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import TopUpModal from './TopUpModal';
import UpdateModal from './UpdateModal';
import { TRANSACTION } from './Transactions';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransactionsTableProps {
  transactions: TRANSACTION[];
  fetchTransactions: () => void;
  isFetching: boolean;
}

const rowsPerPage = 10;

const getYearLevelLabel = (yearLevel: number | null): string =>
  yearLevel === null ? 'Visitor' : `Year ${yearLevel}`;

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  fetchTransactions,
  isFetching,
}) => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TRANSACTION | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { authUser } = useAuth();
  const token = authUser?.token;
  const { showAlert } = useAlert();
  // Filtered & paginated data
  const filteredData = transactions.filter((t) => {
    const matchSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());

    const matchDate = dateFilter
      ? (() => {
          const txnDate = new Date(t.datetime);
          const selectedDate = new Date(dateFilter);
          return (
            txnDate.getFullYear() === selectedDate.getFullYear() &&
            txnDate.getMonth() === selectedDate.getMonth() &&
            txnDate.getDate() === selectedDate.getDate()
          );
        })()
      : true;

    return matchSearch && matchDate;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );
  const navigate = useNavigate();

  const totalRevenue = filteredData.reduce((sum, t) => sum + t.amountPaid, 0);
  const studentRevenue = filteredData
    .filter((t) => t.yearLevel !== null)
    .reduce((sum, t) => sum + t.amountPaid, 0);
  const visitorRevenue = filteredData
    .filter((t) => t.yearLevel === null)
    .reduce((sum, t) => sum + t.amountPaid, 0);

  const handleGeneratePDF = async () => {
    if (!token) {
      showAlert('error', 'Please login again.');
      return;
    }

    try {
      // Optional: indicate loading
      setIsGeneratingPDF(true);

      const response = await fetch(
        `${API_BASE_URL}/purchase-transactions/pdf`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/pdf',
          },
        },
      );

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'transactions-report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showAlert('success', 'PDF generated successfully!.');
    } catch (error) {
      console.error(error);
      showAlert('error', 'Failed to generate PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="absolute top-4 left-4 sm:hidden">
        <button
          onClick={() => navigate('/client/dashboard')} // Change this to your actual route path
          className="p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-300 active:scale-95 transition-all border border-gray-100 dark:border-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

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

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* Top Up Points Button */}
            <button
              onClick={() => setShowTopUp(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-green-600 
               px-3 py-2 sm:px-5 sm:py-2.5 
               text-xs sm:text-sm font-semibold text-white 
               transition-all hover:bg-green-700 active:scale-95 shadow-sm"
            >
              <Wallet className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span>Top Up</span>
            </button>

            {/* Generate PDF Button */}
            <button
              onClick={handleGeneratePDF}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary 
               px-3 py-2 sm:px-5 sm:py-2.5 
               text-xs sm:text-sm font-semibold text-white 
               transition-all hover:bg-opacity-90 active:scale-95 
               disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled={isGeneratingPDF}
            >
              <FileDown className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span>{isGeneratingPDF ? '...' : 'PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h3 className="text-xl font-bold">₱{totalRevenue}</h3>
        </div>

        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Revenue - Students</p>
          <h3 className="text-xl font-bold">₱{studentRevenue}</h3>
        </div>

        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Revenue - Visitors</p>
          <h3 className="text-xl font-bold">₱{visitorRevenue}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3 whitespace-nowrap">No.</th>
              <th className="p-3 whitespace-nowrap">ID Picture</th>
              <th className="p-3 whitespace-nowrap">Full Name</th>
              <th className="p-3 whitespace-nowrap">Email</th>
              <th className="p-3 whitespace-nowrap">Contact</th>
              <th className="p-3 whitespace-nowrap">Year Level</th>
              <th className="p-3 whitespace-nowrap">Remaining Votes</th>
              <th className="p-3 whitespace-nowrap">Total Purchased</th>
              <th className="p-3 whitespace-nowrap">Amount Paid</th>
              <th className="p-3 whitespace-nowrap">Votes Given</th>
              <th className="p-3 whitespace-nowrap">Handled By</th>
              <th className="p-3 whitespace-nowrap">Date</th>
              <th className="p-3 whitespace-nowrap">Time</th>
              <th className="p-3 whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isFetching && (
              <tr>
                <td colSpan={14} className="p-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw size={18} className="animate-spin" />
                    Loading transactions...
                  </div>
                </td>
              </tr>
            )}

            {!isFetching && currentData.length === 0 && (
              <tr>
                <td colSpan={14} className="p-8 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}

            {!isFetching &&
              currentData.map((t, index) => (
                <tr
                  key={t.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition"
                >
                  {/* No. */}
                  <td className="p-3 text-gray-500 whitespace-nowrap">
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>

                  {/* ID Picture */}
                  <td className="p-3">
                    {t.idPicture ? (
                      <img
                        src={t.idPicture}
                        alt={t.fullName}
                        className="h-10 w-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>

                  {/* Full Name */}
                  <td className="p-3 font-medium text-black dark:text-white whitespace-nowrap">
                    {t.fullName}
                  </td>

                  {/* Email */}
                  <td className="p-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {t.email}
                  </td>

                  {/* Contact */}
                  <td className="p-3 whitespace-nowrap">{t.contactNumber}</td>

                  {/* Year Level */}
                  <td className="p-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full text-xs font-semibold px-2 py-0.5 ${
                        t.yearLevel !== null
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      }`}
                    >
                      {getYearLevelLabel(t.yearLevel)}
                    </span>
                  </td>

                  {/* Remaining Votes */}
                  <td className="p-3 text-center whitespace-nowrap">
                    <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-0.5">
                      {t.remainingVotes}
                    </span>
                  </td>

                  {/* Total Purchased */}
                  <td className="p-3 text-center whitespace-nowrap">
                    <span className="inline-block rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold px-2 py-0.5">
                      {t.totalVotesPurchased}
                    </span>
                  </td>

                  {/* Amount Paid */}
                  <td className="p-3 font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                    ₱{t.amountPaid}
                  </td>

                  {/* Votes Given */}
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {t.votesGiven}
                  </td>

                  {/* Handled By */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {t.handlerImage ? (
                        <img
                          src={t.handlerImage}
                          alt={t.handlerFullName}
                          className="h-7 w-7 rounded-full object-cover border shrink-0"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 shrink-0">
                          ?
                        </div>
                      )}
                      <span className="text-gray-600 dark:text-gray-300 text-xs">
                        {t.handlerFullName}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="p-3 text-gray-500 text-xs whitespace-nowrap">
                    {t.createdDate}
                  </td>

                  {/* Time */}
                  <td className="p-3 text-gray-500 text-xs whitespace-nowrap">
                    {t.createdTime}
                  </td>

                  {/* Actions */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedTransaction(t);
                          setShowUpdate(true);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <SquarePen size={16} />
                        Update
                      </button>
                    </div>
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
      {showTopUp && (
        <TopUpModal
          onClose={() => {
            setShowTopUp(false);
            fetchTransactions();
          }}
        />
      )}

      {showUpdate && selectedTransaction && (
        <UpdateModal
          transaction={selectedTransaction}
          onClose={() => setShowUpdate(false)}
          onUpdate={(amount: any) => {
            console.log('Updated Amount:', amount);
            console.log('Student:', selectedTransaction.fullName);
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
