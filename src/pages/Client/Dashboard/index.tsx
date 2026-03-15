import { useState, useEffect } from 'react';
import CastVote from '../../Client/CastVote/CastVote';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import API_BASE_URL from '../../../config/api';

interface EXHIBITOR {
  id: number;
  image: string;
  title: string;
  description: string;
  program: string;
  qrCode: string;
}

const Dashboard = () => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(null);
  const [exhibitors, setExhibitors] = useState<EXHIBITOR[]>([]);
  const [remainingVotes, setRemainingVotes] = useState<number>(0);
  const [clientId, setClientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clientProgram = (authUser?.user as any)?.program?.name || 'Assigned Program';

  const fetchDashboardData = async () => {
    if (!authUser?.token) return;

    try {
      const exhRes = await fetch(`${API_BASE_URL}/exhibitors`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authUser.token}`,
          'Accept': 'application/json',
        },
      });

      if (!exhRes.ok) throw new Error('Failed to fetch exhibitors');

      const exhJson = await exhRes.json();
      const exhData = exhJson.data || exhJson;

      const mappedExhibitors: EXHIBITOR[] = exhData.map((item: any) => ({
        id: item.id,
        image: item.attributes.image || 'https://via.placeholder.com/150',
        title: item.attributes.project_title,
        description: item.attributes.project_description,
        program: item.attributes.program?.name || 'Unknown Program',
        qrCode: item.attributes.qr_string,
      }));

      setExhibitors(mappedExhibitors);

      const clientRes = await fetch(`${API_BASE_URL}/clients/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authUser.token}`,
          'Accept': 'application/json',
        },
      });

      if (clientRes.ok) {
        const clientJson = await clientRes.json();
        const currentVotes = clientJson.data?.client?.attributes?.remaining_votes 
                          ?? clientJson.data?.client?.remaining_votes 
                          ?? 0;
        setRemainingVotes(currentVotes);

        const currentId = clientJson.data?.client?.id ?? clientJson.data?.id;
        setClientId(currentId);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [authUser]);

  const handleSubmitVote = async (votes: number, rating: number, comment: string) => {
    if (!selectedExhibitor || !authUser?.token) return;
    
    if (!clientId) {
      showAlert('error', 'Client ID not found. Please refresh the page and try again.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/votes/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authUser.token}`,
          'Accept': 'application/json',
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
      
      // Refresh local dashboard state
      await fetchDashboardData(); 

      // Dispatch a custom event so the ClientHeader knows to update the Wallet badge!
      window.dispatchEvent(new Event('votesUpdated'));

    } catch (error: any) {
      console.error('Error casting vote:', error);
      showAlert('error', error.message || 'An error occurred while casting your vote.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center py-6">
        <p className="text-xl text-[#071c4f] dark:text-white font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center py-6">
      {/* Program Name */}
      <div className="w-full max-w-6xl px-4 text-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#071c4f]">
          {clientProgram}
        </h2>
        {/* Remaining Votes Pill has been removed from here! */}
      </div>

      {/* Exhibitor / Candidate Cards Grid */}
      <div className="w-full max-w-6xl px-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 mx-auto">
        {exhibitors.length > 0 ? (
          exhibitors.map((exhibitor) => (
            <div
              key={exhibitor.id}
              className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-5 flex flex-col items-center justify-center transition-transform hover:scale-105 hover:shadow-2xl"
            >
              <div 
                className="h-28 w-28 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 border-4 border-gradient-to-r from-[#071c4f] to-[#1a2b6f] shadow-md transform transition-transform hover:scale-110 bg-cover bg-center"
                style={{ backgroundImage: `url(${exhibitor.image})` }}
              ></div>

              <h3 className="font-bold text-xs sm:text-sm text-[#071c4f] text-center">
                {exhibitor.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                {exhibitor.qrCode}
              </p>

              <button
                onClick={() => setSelectedExhibitor(exhibitor)}
                className="bg-gradient-to-r from-[#071c4f] to-[#1a2b6f] text-white px-5 py-1 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all font-semibold"
              >
                Vote
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No exhibitors found.
          </div>
        )}
      </div>

      {/* CastVote Modal */}
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