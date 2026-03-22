import {
  Archive,
  ArchiveRestore,
  Search,
  SquareUser,
  Shield,
  ShieldOff,
  ChevronRight,
  ChevronLeft,
  Mail,
  Loader2,
  Power,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ViewModal from './ViewModal';
import RestoreModal from './RestoreModal';
import ArchiveModal from './ArchiveModal';
import { useAlert } from '../../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../../config/api';
import { useAuth } from '../../../../context/AuthContext';
import ActivationModal from './ActivationModal';

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
  isActivated: boolean;
  studentRole: string;
  // New Audit Fields
  activatedAt: string | null;
  activator: string | null;
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

  const [showActivationModal, setShowActivationModal] = useState(false);

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
          if (res.ok && data.status === 'success') {
            // Check if your API returns an array or a single object.
            // If it's the list of clients:
            const voters: VOTER[] = data.data.map((item: any) => {
              const attrs = item.attributes;

              return {
                id: item.id,
                studentNo: attrs.student_id,
                fullName: attrs.full_name,
                program: attrs.program?.name || 'N/A',
                yearLevel: attrs.year_level,
                email: attrs.email,
                qrCode: attrs.qr_string,
                qrImage: attrs.qr_image,
                contactNumber: attrs.contact_number,
                idPicture: attrs.id_picture,
                remainingVotes: attrs.remaining_votes,
                totalVotesPurchased: attrs.total_votes_purchased,
                datetime: `${attrs.createdDate} ${attrs.createdTime}`,
                isActive: attrs.is_active,
                studentRole: attrs.student_role || 'student',
                isActivated: attrs.is_activated,

                // Mapped from activated_at object
                activatedAt: attrs.activated_at
                  ? `${attrs.activated_at.date} at ${attrs.activated_at.time}`
                  : null,

                // Fix: If the API doesn't provide an 'activator' object yet,
                // you might want to default to 'System' or keep it null.
                activator:
                  attrs.activator?.name ||
                  (attrs.is_activated ? 'CSD Staff' : null),
              };
            });
            setVotersData(voters);
          }
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
      const endpoint =
        roleAction === 'promote'
          ? `${API_BASE_URL}/clients/${selectedVoter.id}/promote?_method=PATCH`
          : `${API_BASE_URL}/clients/${selectedVoter.id}/demote?_method=PATCH`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        showAlert(
          'success',
          `${selectedVoter.fullName} has been ${
            roleAction === 'promote'
              ? 'promoted to President'
              : 'demoted to Student'
          }.`,
        );

        setVotersData((prev) =>
          prev.map((v) =>
            v.id === selectedVoter.id
              ? {
                  ...v,
                  studentRole:
                    roleAction === 'promote' ? 'president' : 'student',
                }
              : v,
          ),
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
  const filteredData = votersData.filter((voter) => {
    const searchTerm = search.toLowerCase();
    return (
      voter.fullName.toLowerCase().includes(searchTerm) ||
      voter.studentNo.toLowerCase().includes(searchTerm) ||
      voter.program.toLowerCase().includes(searchTerm) ||
      voter.email.toLowerCase().includes(searchTerm) ||
      voter.contactNumber.toLowerCase().includes(searchTerm) ||
      voter.qrCode.toLowerCase().includes(searchTerm) ||
      voter.yearLevel.toString().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="rounded-[24px] border border-stroke bg-white p-2 shadow-default dark:border-strokedark dark:bg-boxdark relative overflow-hidden animate-in fade-in duration-500">
      {/* HEADER & SEARCH SECTION */}
      <div className="p-6 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              Electoral Registry
            </span>
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter italic">
            Voter Directory
          </h2>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by name, ID, program, email, or QR..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-stroke bg-gray-50 dark:bg-meta-4/20 py-2.5 pl-10 pr-4 text-sm font-bold outline-none focus:border-primary focus:bg-white dark:border-strokedark transition-all shadow-inner"
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full table-auto text-left border-separate border-spacing-y-2 px-4">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
              <th className="px-4 py-4">Student Identity</th>
              <th className="px-4 py-4">Security Key (QR)</th>
              <th className="px-4 py-4">Contact & Program</th>
              <th className="px-4 py-4">Voting Power</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-center">System Actions</th>
            </tr>
          </thead>

          <tbody className="before:block before:h-2">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
                      Synchronizing Records...
                    </span>
                  </div>
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((voter, index) => (
                <tr key={voter.id} className="group transition-all">
                  {/* IDENTITY CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 rounded-l-2xl px-4 py-4 border-y border-l border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={voter.idPicture || '/user-profile.png'}
                          alt="ID"
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-white dark:ring-boxdark shadow-md"
                        />
                        <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-black text-white italic ring-2 ring-white dark:ring-boxdark">
                          {(page - 1) * rowsPerPage + index + 1}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-black dark:text-white truncate text-sm uppercase italic leading-tight">
                          {voter.fullName}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter">
                          SN: {voter.studentNo}
                        </p>
                        {voter.studentRole === 'president' && (
                          <span className="mt-1 inline-flex items-center rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-blue-600 tracking-tighter">
                            President
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* QR CODE CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 px-4 py-4 border-y border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex flex-col items-start gap-2">
                      <div className="relative h-20 w-20 bg-white p-1.5 rounded-xl border border-stroke shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                        <img
                          src={voter.qrImage}
                          alt="Security QR"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col max-w-[120px]">
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest truncate">
                          {voter.qrCode}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 px-4 py-4 border-y border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />{' '}
                        {voter.email}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">
                        {voter.program} • {voter.contactNumber}
                      </span>
                    </div>
                  </td>

                  {/* VOTES CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 px-4 py-4 border-y border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-primary italic leading-none">
                        {voter.remainingVotes}{' '}
                        <span className="text-[9px] uppercase tracking-tighter text-gray-400 not-italic">
                          Rem.
                        </span>
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                        Total: {voter.totalVotesPurchased}
                      </span>
                    </div>
                  </td>

                  {/* STATUS CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 px-4 py-4 border-y border-stroke dark:border-strokedark group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                        voter.isActive
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          voter.isActive
                            ? 'bg-green-600 animate-pulse'
                            : 'bg-red-600'
                        }`}
                      ></span>
                      {voter.isActive ? 'Verified' : 'Archived'}
                    </span>
                  </td>

                  {/* ACTIONS CELL */}
                  <td className="bg-gray-50 dark:bg-meta-4/10 rounded-r-2xl px-4 py-4 border-y border-r border-stroke dark:border-strokedark text-center group-hover:bg-gray-100 dark:group-hover:bg-meta-4/20 transition-colors">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedVoter(voter);
                          setShowViewModal(true);
                        }}
                        className="p-2 rounded-xl bg-white dark:bg-boxdark text-gray-400 hover:text-primary hover:shadow-lg transition-all"
                        title="View Details"
                      >
                        <SquareUser size={18} />
                      </button>

                      {voter.isActive ? (
                        <button
                          onClick={() => {
                            setSelectedVoter(voter);
                            setShowArchive(true);
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-boxdark text-gray-400 hover:text-red-500 hover:shadow-lg transition-all"
                          title="Archive"
                        >
                          <Archive size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedVoter(voter);
                            setShowRestore(true);
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-boxdark text-gray-400 hover:text-green-500 hover:shadow-lg transition-all"
                          title="Restore"
                        >
                          <ArchiveRestore size={18} />
                        </button>
                      )}

                      {/* ROLE MANAGEMENT BUTTON - Restricted to super_admin */}
                      {authUser?.user.role === 'super_admin' && (
                        <button
                          onClick={() => {
                            setSelectedVoter(voter);
                            setRoleAction(
                              voter.studentRole === 'president'
                                ? 'demote'
                                : 'promote',
                            );
                            setShowRoleModal(true);
                          }}
                          className={`p-2 rounded-xl bg-white dark:bg-boxdark transition-all hover:shadow-lg ${
                            voter.studentRole === 'president'
                              ? 'text-gray-400 hover:text-orange-500'
                              : 'text-gray-400 hover:text-purple-600'
                          }`}
                          title={
                            voter.studentRole === 'president'
                              ? 'Demote'
                              : 'Promote'
                          }
                        >
                          {voter.studentRole === 'president' ? (
                            <ShieldOff size={18} />
                          ) : (
                            <Shield size={18} />
                          )}
                        </button>
                      )}
                      {/* SEPARATE ACTIVATE/DEACTIVATE TOGGLE */}
                      <button
                        onClick={() => {
                          setSelectedVoter(voter);
                          setShowActivationModal(true);
                        }}
                        className={`p-2 rounded-xl bg-white dark:bg-boxdark transition-all hover:shadow-lg ${
                          voter.isActivated // Use consistent naming
                            ? 'text-green-500 hover:bg-green-50'
                            : 'text-gray-300 hover:text-red-500'
                        }`}
                        title={
                          voter.isActivated
                            ? 'Deactivate Account'
                            : 'Activate Account'
                        }
                      >
                        <Power size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-20 text-gray-400 font-bold uppercase italic tracking-widest"
                >
                  Zero Intelligence Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="p-6 border-t border-stroke dark:border-strokedark flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Showing Page {page}{' '}
          <span className="lowercase italic text-gray-300 mx-1">of</span>{' '}
          {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl border border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl border border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* MODALS SECTION */}
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

      {showActivationModal && selectedVoter && (
        <ActivationModal
          voter={selectedVoter}
          onClose={() => setShowActivationModal(false)}
          onSuccess={(updatedVoter) => {
            setVotersData((prev) =>
              prev.map((v) => (v.id === updatedVoter.id ? updatedVoter : v)),
            );
          }}
        />
      )}

      {showRoleModal && selectedVoter && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm flex flex-col rounded-[40px] bg-white dark:bg-boxdark shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 transform transition-all animate-in zoom-in-95 duration-200">
            {/* DYNAMIC SCANNER BAR */}
            <div
              className={`h-1.5 w-full relative overflow-hidden ${
                roleAction === 'promote'
                  ? 'bg-purple-600/20'
                  : 'bg-orange-500/20'
              }`}
            >
              <div
                className={`absolute inset-0 w-1/3 animate-scan shadow-[0_0_15px_2px_currentColor] ${
                  roleAction === 'promote'
                    ? 'bg-purple-500 text-purple-400'
                    : 'bg-orange-500 text-orange-400'
                }`}
              />
            </div>

            <div className="p-10 text-center">
              {/* ICON SPHERE */}
              <div
                className={`relative mx-auto h-24 w-24 mb-8 flex items-center justify-center rounded-[32px] transition-all duration-500 ${
                  roleAction === 'promote'
                    ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 ring-1 ring-purple-200 dark:ring-purple-500/30 rotate-0'
                    : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 ring-1 ring-orange-200 dark:ring-orange-500/30 -rotate-12'
                }`}
              >
                {roleAction === 'promote' ? (
                  <Shield size={40} strokeWidth={2.5} />
                ) : (
                  <ShieldOff size={40} strokeWidth={2.5} />
                )}

                {/* Decorative Corner Accents */}
                <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-current opacity-40" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-current opacity-40" />
              </div>

              {/* TYPOGRAPHY */}
              <div className="space-y-1 mb-8">
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                    roleAction === 'promote'
                      ? 'text-purple-600'
                      : 'text-orange-500'
                  }`}
                >
                  {roleAction === 'promote'
                    ? 'Privilege Ascension'
                    : 'Authority Restriction'}
                </span>
                <h3 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter">
                  Confirm Shift
                </h3>
              </div>

              {/* DATA PREVIEW BOX */}
              <div className="mb-10 relative group">
                <div className="p-6 rounded-[24px] bg-gray-50 dark:bg-meta-4/40 border border-stroke dark:border-strokedark transition-all group-hover:bg-white dark:group-hover:bg-meta-4/60">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3">
                    Target Subject
                  </p>
                  <p className="text-lg font-black text-black dark:text-white uppercase italic leading-tight">
                    {selectedVoter.fullName}
                  </p>
                  <div className="mt-3 flex justify-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-boxdark shadow-sm border border-stroke dark:border-strokedark text-gray-500">
                      ID: {selectedVoter.studentNo}
                    </span>
                  </div>
                </div>
              </div>

              {/* BUTTON STACK */}
              <div className="space-y-4">
                <button
                  onClick={handleRoleChange}
                  disabled={isProcessingRole}
                  className={`group relative w-full py-5 rounded-[20px] font-black uppercase tracking-[0.25em] text-xs text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50 overflow-hidden ${
                    roleAction === 'promote'
                      ? 'bg-purple-600 shadow-purple-500/30 hover:bg-purple-700'
                      : 'bg-orange-500 shadow-orange-500/30 hover:bg-orange-600'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isProcessingRole ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Rewriting Permissions...
                      </>
                    ) : (
                      `Execute ${roleAction}`
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => setShowRoleModal(false)}
                  className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
                >
                  Abort Protocol
                </button>
              </div>
            </div>

            {/* FOOTER METRICS */}
            <div className="px-10 py-4 bg-gray-50 dark:bg-meta-4/20 border-t border-stroke dark:border-strokedark flex justify-between items-center">
              <span className="text-[8px] font-bold text-gray-400 uppercase italic">
                Encryption: AES-256
              </span>
              <span className="text-[8px] font-bold text-gray-400 uppercase italic tracking-tighter">
                Verified Admin Session
              </span>
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
      @keyframes scan {
        0% { left: -40%; }
        100% { left: 110%; }
      }
      .animate-scan {
        position: absolute;
        animation: scan 2s linear infinite;
      }
    `,
            }}
          />
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
      .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.2); border-radius: 10px; }
    `,
        }}
      />
    </div>
  );
};

export default VotersTable;
