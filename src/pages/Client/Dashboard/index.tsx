import { useState, useEffect } from 'react';
import CastVote from '../../Client/CastVote/CastVote';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import VotingLoader from '../../../common/Loader/VotingLoader'; // import loader
import { ShieldAlert, UserCheck } from 'lucide-react';

// Defined interfaces to match your backend resource structure
interface EXHIBITOR {
  id: number;
  image: string;
  title: string;
  description: string;
  program: string;
  qrCode: string;
  hasRated?: boolean;
  hasCommented?: boolean;
}

interface PROGRAM_SECTION {
  id: number;
  name: string;
  exhibitors: EXHIBITOR[];
}

const Dashboard = () => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(
    null,
  );
  const [sections, setSections] = useState<PROGRAM_SECTION[]>([]);
  const [remainingVotes, setRemainingVotes] = useState<number>(0);
  const [clientId, setClientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isActivated = authUser?.is_activated ?? false;

  // const accountValidated = authUser?.user.

  const fetchDashboardData = async () => {
    if (!authUser?.token) return;

    try {
      // 1. Fetch all exhibitors grouped by their programs
      const exhRes = await fetch(
        `${API_BASE_URL}/exhibitors/grouped-by-program`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        },
      );

      if (!exhRes.ok) throw new Error('Failed to fetch exhibitors');

      const json = await exhRes.json();
      const groupedData = json.data; //

      // Map the backend groups to our frontend section structure
      const mappedSections: PROGRAM_SECTION[] = groupedData.map(
        (group: any) => ({
          id: group.program.id,
          name: group.program.name,
          exhibitors: group.exhibitors.map((item: any) => ({
            id: item.id,
            image: item.attributes.image || 'https://via.placeholder.com/150',
            title: item.attributes.project_title,
            description: item.attributes.project_description,
            program: group.program.name,
            qrCode: item.attributes.qr_string,
            hasRated: item.attributes.has_rated || false,
            hasCommented: item.attributes.has_commented || false,
          })),
        }),
      );

      setSections(mappedSections);

      // 2. Fetch current client data for ID and remaining votes
      const clientRes = await fetch(`${API_BASE_URL}/clients/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });

      if (clientRes.ok) {
        const clientJson = await clientRes.json();
        // Accessing votes from ClientResource attributes
        const currentVotes =
          clientJson.data?.client?.attributes?.remaining_votes ??
          clientJson.data?.client?.remaining_votes ??
          0;
        setRemainingVotes(currentVotes);

        const currentId = clientJson.data?.client?.id ?? clientJson.data?.id;
        setClientId(currentId);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showAlert('error', 'Could not load exhibitors.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [authUser]);

  const handleSubmitVote = async (
    votes: number,
    rating: number,
    comment: string,
  ) => {
    if (!selectedExhibitor || !authUser?.token) return; //

    if (!clientId) {
      showAlert('error', 'Client ID not found. Please refresh the page.');
      return;
    }

    try {
      // Sending payload to castVote endpoint
      const res = await fetch(`${API_BASE_URL}/votes/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          exhibitor_id: selectedExhibitor.id,
          votes_casted: votes,
          rating: rating,
          comment: comment,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Failed to cast vote.');
      }

      showAlert('success', json.message || 'Vote cast successfully.');
      setSelectedExhibitor(null);

      await fetchDashboardData();
      window.dispatchEvent(new Event('votesUpdated')); // Signal Navbar to refresh
    } catch (error: any) {
      console.error('Error casting vote:', error);
      showAlert('error', error.message || 'An error occurred.');
    }
  };

  if (isLoading) {
    return (
      <VotingLoader
        title="Loading Exhibitor"
        description="Fetching exhibitors..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#010717] flex flex-col py-8 sm:py-12 transition-colors duration-500">
      {/* --- ACTIVATION WARNING CARD --- */}
      {!isActivated && (
        <div className="w-full max-w-7xl px-4 sm:px-6 mx-auto mb-10">
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-500/5 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
            {/* Background Flair */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] -mr-32 -mt-32" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/40 animate-pulse">
                <ShieldAlert className="text-white" size={32} />
              </div>

              <div className="flex-grow text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-400 uppercase italic tracking-tight mb-2">
                  Account Activation Required
                </h2>
                <p className="text-sm font-medium text-amber-800/80 dark:text-amber-200/60 max-w-2xl">
                  Your account is currently{' '}
                  <span className="font-black underline">Inactive</span>. To
                  participate in the voting process, please visit the
                  <span className="text-amber-900 dark:text-amber-300 font-bold">
                    {' '}
                    Registration Booth
                  </span>{' '}
                  or locate a
                  <span className="text-amber-900 dark:text-amber-300 font-bold">
                    {' '}
                    CSD Staff member
                  </span>{' '}
                  to verify your credentials.
                </p>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <UserCheck
                    size={16}
                    className="text-amber-600 dark:text-amber-400"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    Status: Pending Verification
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isActivated &&
        sections.map((section) => (
          <div
            key={section.id}
            className="w-full max-w-7xl px-4 sm:px-6 mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            {/* Program Header - Tactical Terminal Look */}
            <div className="flex flex-col items-center mb-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 mb-3">
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">
                  Program
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-center">
                {section.name}
              </h2>
              <div className="h-1 w-12 bg-blue-600 mt-4 rounded-full" />
            </div>

            {/* Exhibitor Grid - Optimized for Mobile Stacking */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {section.exhibitors.length > 0 ? (
                section.exhibitors.map((exhibitor) => (
                  <div
                    key={exhibitor.id}
                    className="group relative bg-white dark:bg-[#020d26] rounded-[2rem] border-2 border-slate-100 dark:border-white/5 p-6 flex flex-col items-center shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Visual Flair Background */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-blue-600/10 transition-colors" />

                    {/* Profile Image with Tactical Ring */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full border-2 border-blue-600 animate-ping opacity-0 group-hover:opacity-20 transition-opacity" />
                      <div
                        className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-[#041130] shadow-xl bg-cover bg-center z-10 relative"
                        style={{ backgroundImage: `url(${exhibitor.image})` }}
                      />
                    </div>

                    {/* Info Block */}
                    <div className="text-center mb-6 flex-grow">
                      <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white uppercase italic tracking-tight leading-tight mb-2">
                        {exhibitor.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                          {exhibitor.qrCode || 'ID: UNKNOWN'}
                        </p>
                      </div>
                    </div>

                    {/* Action - Tactical Button */}
                    <button
                      onClick={() => setSelectedExhibitor(exhibitor)}
                      className="w-full group/btn relative overflow-hidden bg-[#071c4f] hover:bg-blue-700 text-white py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all duration-300 active:scale-95"
                    >
                      <span className="relative z-10 font-black text-xs uppercase tracking-[0.2em]">
                        Submit Vote
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center py-20 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                  <p className="text-slate-400 dark:text-slate-500 font-bold italic uppercase tracking-widest text-sm">
                    No active exhibitors detected in this sector
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

      {selectedExhibitor && (
        <CastVote
          exhibitor={selectedExhibitor}
          remainingVotes={remainingVotes}
          onClose={() => setSelectedExhibitor(null)}
          onSubmit={handleSubmitVote}
        />
      )}
    </div>
  );
};

export default Dashboard;
