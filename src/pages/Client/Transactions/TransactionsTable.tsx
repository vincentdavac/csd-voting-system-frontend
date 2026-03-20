import {
  Search,
  FileDown,
  SquarePen,
  Wallet,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
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
        `${API_BASE_URL}/client/purchase-transactions/pdf`,
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
    <div className="rounded-[32px] border border-stroke bg-white p-6 shadow-2xl dark:border-strokedark dark:bg-boxdark transition-all">
      {/* Top Controls: Search & Filters */}
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between border-b border-stroke pb-8 dark:border-strokedark">
        <div>
          <h3 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter">
            Transaction Logs
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Financial Audit & Point Distribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full xl:w-72 rounded-2xl border border-stroke bg-gray-50 py-3 pl-12 pr-4 text-sm font-bold uppercase tracking-tight outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-strokedark dark:bg-meta-4 transition-all"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-2xl border border-stroke bg-gray-50 px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:[color-scheme:dark]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTopUp(true)}
              className="flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-700 active:scale-95"
            >
              <Wallet size={16} />
              <span>Top Up</span>
            </button>

            <button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-opacity-90 active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <FileDown size={16} />
              )}
              <span>{isGeneratingPDF ? 'Working...' : 'PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            label: 'Total Revenue',
            val: totalRevenue,
            color: 'text-primary',
            bg: 'bg-primary/5',
            icon: <TrendingUp className="text-primary" />,
          },
          {
            label: 'Revenue - Students',
            val: studentRevenue,
            color: 'text-green-600',
            bg: 'bg-green-50',
            icon: <UserCheck className="text-green-600" />,
          },
          {
            label: 'Revenue - Visitors',
            val: visitorRevenue,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            icon: <Users className="text-orange-600" />,
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-[24px] border border-stroke p-5 dark:border-strokedark transition-all hover:shadow-xl ${card.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                {card.label}
              </span>
              <div className="p-2 rounded-xl bg-white dark:bg-boxdark shadow-sm">
                {card.icon}
              </div>
            </div>
            <h3 className={`text-2xl font-black ${card.color}`}>
              ₱{card.val.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-3xl border border-stroke dark:border-strokedark">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-meta-4 border-b border-stroke dark:border-strokedark">
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                No.
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Client Info
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Classification
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                Wallet Status
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Payment
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Auditor
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Timestamp
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={14} className="p-15 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <RefreshCw
                      size={32}
                      className="animate-spin text-primary"
                    />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Syncing Ledger...
                    </p>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={14}
                  className="p-15 text-center italic text-gray-400 font-bold uppercase text-xs tracking-widest"
                >
                  No transaction records found
                </td>
              </tr>
            ) : (
              currentData.map((t, index) => (
                <tr
                  key={t.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors group"
                >
                  <td className="px-5 py-4 text-xs font-bold text-gray-400">
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-strokedark">
                        {t.idPicture ? (
                          <img
                            src={t.idPicture}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-[10px] font-bold dark:bg-gray-700">
                            NA
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-black dark:text-white uppercase leading-tight">
                          {t.fullName}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 lowercase">
                          {t.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                        t.yearLevel !== null
                          ? 'bg-blue-50 text-blue-600 ring-blue-500/20'
                          : 'bg-orange-50 text-orange-600 ring-orange-500/20'
                      }`}
                    >
                      {getYearLevelLabel(t.yearLevel)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">
                          REM:
                        </span>
                        <span className="text-xs font-black text-green-600">
                          {t.remainingVotes}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">
                          PUR:
                        </span>
                        <span className="text-xs font-black text-purple-600">
                          {t.totalVotesPurchased}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-black text-green-600 leading-none">
                        ₱{t.amountPaid.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-blue-500 mt-1">
                        +{t.votesGiven} VOTES
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 shrink-0 rounded-full border border-stroke">
                        {t.handlerImage ? (
                          <img
                            src={t.handlerImage}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 h-full rounded-full" />
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase text-gray-500">
                        {t.handlerFullName}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-[10px] font-black text-black dark:text-white leading-none">
                      {t.createdDate}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                      {t.createdTime}
                    </p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedTransaction(t);
                          setShowUpdate(true);
                        }}
                        className="group/btn relative flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-blue-600 dark:bg-white/5 dark:hover:bg-blue-600 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all duration-300 active:scale-95 shadow-sm hover:shadow-blue-500/20"
                      >
                        {/* Subtle Icon with scale effect */}
                        <SquarePen
                          size={14}
                          strokeWidth={2.5}
                          className="group-hover/btn:scale-110 group-hover/btn:rotate-3 transition-transform duration-300"
                        />

                        {/* Tactical Label */}
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] font-mono">
                          Edit
                        </span>

                        {/* Hover Glow Detail */}
                        <div className="absolute inset-0 rounded-xl bg-blue-400/0 group-hover/btn:bg-blue-400/10 blur-md transition-all -z-10" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination: Nav Style */}
      <div className="mt-8 flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Showing Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-white font-bold transition-all hover:bg-gray-50 disabled:opacity-20 dark:bg-boxdark"
          >
            ←
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-white font-bold transition-all hover:bg-gray-50 disabled:opacity-20 dark:bg-boxdark"
          >
            →
          </button>
        </div>
      </div>

      {/* Modals */}
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
          onUpdate={() => fetchTransactions()}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
