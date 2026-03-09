import { Archive, ArchiveRestore, Search, SquareUser } from 'lucide-react';
import { useState } from 'react';
import ViewModal from './ViewModal'; // import the modal
import RestoreModal from './RestoreModal'; // adjust path if needed
import ArchiveModal from './ArchiveModal';

export interface VOTER {
  studentNo: string;
  fullName: string;
  program: string;
  email: string;
  qrCode: string;
  contact: string; // consistent name
  idPicture: string;
  remainingVotes: number;
  totalVotesPurchased: number;
  datetime: string;
}

const votersData: VOTER[] = Array.from({ length: 25 }, (_, i) => ({
  program: 'BSIT',
  studentNo: '2023-000' + (i + 1),
  idPicture: 'https://via.placeholder.com/40',
  fullName: 'Student ' + (i + 1),
  email: `student${i + 1}@gmail.com`,
  qrCode: 'QR-' + (i + 1),
  contact: '09123456789',
  remainingVotes: 3,
  totalVotesPurchased: 10,
  datetime: '2026-03-08 10:30 AM',
}));

const rowsPerPage = 10;

const VotersTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<any>(null);
  const [showRestore, setShowRestore] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const handleRestoreUser = (restoredVoter: VOTER) => {
    alert(`${restoredVoter.fullName} has been restored!`);
    // TODO: update your state or call API here to mark user as active
  };

  // Filter voters
  const filteredData = votersData.filter(
    (voter) =>
      voter.fullName.toLowerCase().includes(search.toLowerCase()) ||
      voter.studentNo.toLowerCase().includes(search.toLowerCase()) ||
      voter.program.toLowerCase().includes(search.toLowerCase()) ||
      voter.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = filteredData.slice(
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
            placeholder="Search voters..."
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

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="p-3">No.</th>
              <th className="p-3">ID Picture</th>
              <th className="p-3">Student Number</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Program</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">QR Code</th>
              <th className="p-3">Contact Number</th>
              <th className="p-3">Status</th>
              <th className="p-3">Remaining Votes</th>
              <th className="p-3">Total Purchased</th>
              <th className="p-3">Date - Time</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((voter, index) => (
              <tr
                key={index}
                className="border-b border-stroke dark:border-strokedark"
              >
                <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>

                <td className="p-3">
                  <img
                    src={voter.idPicture}
                    className="h-10 w-10 rounded-full"
                  />
                </td>

                <td className="p-3">{voter.studentNo}</td>
                <td className="p-3">{voter.fullName}</td>
                <td className="p-3">{voter.program}</td>
                <td className="p-3">{voter.email}</td>
                <td className="p-3">{voter.qrCode}</td>
                <td className="p-3">{voter.contact}</td>
                <td className="p-3">Active</td>
                <td className="p-3">{voter.remainingVotes}</td>
                <td className="p-3">{voter.totalVotesPurchased}</td>
                <td className="p-3">{voter.datetime}</td>
                <td className="p-3 flex gap-4 justify-center">
                  {/* VIEW / UPDATE */}
                  <button
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    title="View Voter"
                    onClick={() => {
                      setSelectedVoter(voter);
                      setShowViewModal(true);
                    }}
                  >
                    <SquareUser size={16} />
                    View
                  </button>

                  {/* RESTORE */}
                  <button
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
                    title="Restore User"
                    onClick={() => {
                      setSelectedVoter(voter);
                      setShowRestore(true);
                    }}
                  >
                    <ArchiveRestore size={16} />
                    Restore
                  </button>

                  {/* ARCHIVE */}
                  <button
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                    title="Archive User"
                    onClick={() => {
                      setSelectedVoter(voter);
                      setShowArchive(true);
                    }}
                  >
                    <Archive size={16} />
                    Archive
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

      {showViewModal && selectedVoter && (
        <ViewModal
          voter={selectedVoter}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showRestore && selectedVoter && (
        <RestoreModal
          voter={selectedVoter} // pass the voter from this row
          onClose={() => setShowRestore(false)}
          onRestore={(restoredVoter) => {
            handleRestoreUser(restoredVoter); // call the defined handler
            setShowRestore(false);
          }}
        />
      )}

      {showArchive && selectedVoter && (
        <ArchiveModal
          voter={selectedVoter}
          onClose={() => setShowArchive(false)}
          onArchive={(archivedVoter) => {
            // handle the archive logic here
            alert(`${archivedVoter.fullName} has been archived!`);
            setShowArchive(false);
          }}
        />
      )}
    </div>
  );
};

export default VotersTable;
