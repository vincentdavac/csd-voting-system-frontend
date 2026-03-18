import { Archive, ArchiveRestore, Search, SquareUser, Shield, ShieldOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import ViewModal from './ViewModal'; 
import RestoreModal from './RestoreModal'; 
import ArchiveModal from './ArchiveModal';
import { useAlert } from '../../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../../config/api';
import { useAuth } from '../../../../context/AuthContext';

export interface VOTER {
  id: number;
  studentNo: string;
  fullName: string;
  program: string;
  yearLevel: number;
  email: string;
  qrCode: string;
  qrImage: string;
  contactNumber: string;
  idPicture: string;
  remainingVotes: number;
  totalVotesPurchased: number;
  datetime: string;
  isActive: boolean;
  studentRole: string;
}

const rowsPerPage = 10;

const VotersTable = () => {
  const { showAlert } = useAlert();
  const [votersData, setVotersData] = useState<VOTER[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedVoter, setSelectedVoter] = useState<VOTER | null>(null);
  
  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleAction, setRoleAction] = useState<'promote' | 'demote'>('promote');
  const [isProcessingRole, setIsProcessingRole] = useState(false);

  const { authUser } = useAuth();
  const token = authUser?.token;

  // Fetch clients from API
  useEffect(() => {
    const fetchVoters = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/clients`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.status === 'success') {
          const voters: VOTER[] = data.data.map((item: any) => ({
            id: item.id,
            studentNo: item.attributes.student_id,
            fullName: item.attributes.full_name,
            program: item.attributes.program?.name || 'N/A',
            yearLevel: item.attributes.year_level,
            email: item.attributes.email,
            qrCode: item.attributes.qr_string,
            qrImage: item.attributes.qr_image,
            contactNumber: item.attributes.contact_number,
            idPicture: item.attributes.id_picture,
            remainingVotes: item.attributes.remaining_votes,
            totalVotesPurchased: item.attributes.total_votes_purchased,
            datetime: `${item.attributes.createdDate} ${item.attributes.createdTime}`,
            isActive: item.attributes.is_active,
            studentRole: item.attributes.student_role || 'student', 
          }));

          setVotersData(voters);
        } else {
          showAlert('error', data.message || 'Failed to fetch clients');
        }
      } catch (err) {
        console.error(err);
        showAlert('error', 'Something went wrong while fetching clients.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, [showAlert, token]);

  const handleRestoreUser = (restoredVoter: VOTER) => {
    showAlert('success', `${restoredVoter.fullName} has been restored!`);
    setVotersData((prev) =>
      prev.map((v) =>
        v.id === restoredVoter.id ? { ...v, isActive: true } : v,
      ),
    );
  };

  const handleRoleChange = async () => {
    if (!selectedVoter || !token) return;
    setIsProcessingRole(true);

    try {
      const endpoint = roleAction === 'promote' 
        ? `${API_BASE_URL}/clients/${selectedVoter.id}/promote`
        : `${API_BASE_URL}/clients/${selectedVoter.id}/demote`;

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        showAlert('success', `${selectedVoter.fullName} has been ${roleAction === 'promote' ? 'promoted to President' : 'demoted to Student'}.`);
        
        setVotersData((prev) =>
          prev.map((v) =>
            v.id === selectedVoter.id 
              ? { ...v, studentRole: roleAction === 'promote' ? 'president' : 'student' } 
              : v
          )
        );
        setShowRoleModal(false);
      } else {
        showAlert('error', `Failed to ${roleAction} user.`);
      }
    } catch (error) {
      console.error(error);
      showAlert('error', `An error occurred during ${roleAction}.`);
    } finally {
      setIsProcessingRole(false);
    }
  };

  // Filter and paginate
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
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark relative">
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
              <th className="p-3">Contact Number</th>
              <th className="p-3">Status</th>
              <th className="p-3">Remaining Votes</th>
              <th className="p-3">Total Purchased</th>
              <th className="p-3">Date - Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="text-center py-4">Loading data...</td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((voter, index) => (
                <tr
                  key={voter.id}
                  className="border-b border-stroke dark:border-strokedark"
                >
                  <td className="p-3">{(page - 1) * rowsPerPage + index + 1}</td>
                  <td className="p-3">
                    <img
                      src={voter.idPicture}
                      className="h-10 w-10 rounded-full object-cover"
                      alt="ID"
                    />
                  </td>
                  <td className="p-3">{voter.studentNo}</td>
                  <td className="p-3">
                    {voter.fullName}
                    {/* Role Badge Indicator */}
                    {voter.studentRole === 'president' && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                        President
                      </span>
                    )}
                  </td>
                  <td className="p-3">{voter.program}</td>
                  <td className="p-3">{voter.email}</td>
                  <td className="p-3">{voter.contactNumber}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        voter.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {voter.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{voter.remainingVotes}</td>
                  <td className="p-3">{voter.totalVotesPurchased}</td>
                  <td className="p-3">{voter.datetime}</td>
                  
                  {/* Actions Column */}
                  <td className="p-3 flex flex-wrap gap-3 justify-center">
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

                    {voter.isActive ? (
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
                    ) : (
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
                    )}

                    {/* Promote / Demote Buttons */}
                    {voter.studentRole === 'president' ? (
                      <button
                        className="flex items-center gap-1 text-orange-500 hover:text-orange-700 transition"
                        title="Demote to Student"
                        onClick={() => {
                          setSelectedVoter(voter);
                          setRoleAction('demote');
                          setShowRoleModal(true);
                        }}
                      >
                        <ShieldOff size={16} />
                        Demote
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
                        title="Promote to President"
                        onClick={() => {
                          setSelectedVoter(voter);
                          setRoleAction('promote');
                          setShowRoleModal(true);
                        }}
                      >
                        <Shield size={16} />
                        Promote
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-center py-4">No voters found.</td>
              </tr>
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

      {/* Existing Modals */}
      {showViewModal && selectedVoter && (
        <ViewModal
          voter={selectedVoter}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showRestore && selectedVoter && (
        <RestoreModal
          voter={selectedVoter}
          onClose={() => setShowRestore(false)}
          onRestore={(restoredVoter) => {
            handleRestoreUser(restoredVoter);
            setShowRestore(false);
          }}
        />
      )}

      {showArchive && selectedVoter && (
        <ArchiveModal
          voter={selectedVoter}
          onClose={() => setShowArchive(false)}
          onArchive={(archivedVoter) => {
            showAlert(
              'success',
              `${archivedVoter.fullName} has been archived!`,
            );
            setVotersData((prev) =>
              prev.map((v) =>
                v.id === archivedVoter.id ? { ...v, isActive: false } : v,
              ),
            );
            setShowArchive(false);
          }}
        />
      )}

      {/* Role Confirmation Modal */}
      {showRoleModal && selectedVoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white flex items-center gap-2">
              {roleAction === 'promote' ? <Shield className="text-purple-600" /> : <ShieldOff className="text-orange-500" />}
              Confirm {roleAction === 'promote' ? 'Promotion' : 'Demotion'}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to {roleAction} <strong>{selectedVoter.fullName}</strong> 
              {roleAction === 'promote' ? ' to President?' : ' to Student?'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={isProcessingRole}
                className="rounded border border-stroke px-4 py-2 font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                disabled={isProcessingRole}
                className={`rounded px-4 py-2 font-medium text-white ${
                  roleAction === 'promote' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-orange-500 hover:bg-orange-600'
                } disabled:opacity-50`}
              >
                {isProcessingRole ? 'Processing...' : `Yes, ${roleAction}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotersTable;