import { useState, useEffect } from 'react';
import CastVote from '../../Client/CastVote/CastVote';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';
import VotingLoader from '../../../common/Loader/VotingLoader'; // import loader

// Defined interfaces to match your backend resource structure
interface EXHIBITOR {
  id: number;
  image: string;
  title: string;
  description: string;
  program: string;
  qrCode: string;
  hasRated?: boolean;
}

interface PROGRAM_SECTION {
  id: number;
  name: string;
  exhibitors: EXHIBITOR[];
}

const Dashboard = () => {
  const { authUser } = useAuth(); //
  const { showAlert } = useAlert(); //
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(
    null,
  );
  const [sections, setSections] = useState<PROGRAM_SECTION[]>([]);
  const [remainingVotes, setRemainingVotes] = useState<number>(0);
  const [clientId, setClientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    if (!authUser?.token) return; //

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
          client_id: clientId, //
          exhibitor_id: selectedExhibitor.id, //
          votes_casted: votes, //
          rating: rating, //
          comment: comment, //
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
    <div className="min-h-screen dark:bg-gray-900 flex flex-col py-6">
      {sections.map((section) => (
        <div key={section.id} className="w-full max-w-6xl px-4 mx-auto mb-12">
          {/* Program Header */}
          <div className="text-center mb-8 border-b border-stroke dark:border-strokedark pb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071c4f] uppercase tracking-wider dark:text-white">
              {section.name}
            </h2>
          </div>

          {/* Exhibitor Grid for this Program */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.exhibitors.length > 0 ? (
              section.exhibitors.map((exhibitor) => (
                <div
                  key={exhibitor.id}
                  className="bg-white dark:bg-boxdark rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#071c4f]/20"
                >
                  <div
                    className="h-28 w-28 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 border-4 border-[#071c4f] shadow-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${exhibitor.image})` }}
                  ></div>

                  <h3 className="font-bold text-xs sm:text-sm text-[#071c4f] text-center mb-1 dark:text-white">
                    {exhibitor.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono mb-4 uppercase">
                    {exhibitor.qrCode}
                  </p>

                  <button
                    onClick={() => setSelectedExhibitor(exhibitor)}
                    className="w-full bg-[#071c4f] hover:bg-[#1a2b6f] text-white py-2 rounded-xl shadow-md transition-colors font-bold text-xs"
                  >
                    VOTE
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-4">
                <p className="text-gray-500 italic">
                  No exhibitors for this program.
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
