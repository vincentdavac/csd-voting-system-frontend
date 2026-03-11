import { useState } from 'react';
import CastVote from '../../Client/CastVote/CastVote'; // make sure path is correct

interface EXHIBITOR {
  image: string;
  title: string;
  description: string;
  program: string;
  qrCode: string;
}

const Dashboard = () => {
  const [selectedExhibitor, setSelectedExhibitor] = useState<EXHIBITOR | null>(
    null,
  );

  // Sample exhibitor data for testing
  const exhibitors: EXHIBITOR[] = [
    {
      image: 'https://via.placeholder.com/150',
      title: 'X-STREAM',
      description:
        'An innovative tech project for studentssssssssssssssssssssssssssssssssssssssssss.',
      program:
        'BS in entertainment and multimedia computing sssssssssssssssssssssssssssssssssssss',
      qrCode: 'EXH-2026-0001',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Y-TECH',
      description: 'A creative solution for smart classrooms.',
      program: 'BS in Information Technology',
      qrCode: 'EXH-2026-0002',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Z-DEV',
      description: 'Web app development project for learning.',
      program: 'BS in Information Technology',
      qrCode: 'EXH-2026-0003',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'A-BOOTH',
      description: 'AI-based booth for efficient voting.',
      program: 'BS in Information Technology',
      qrCode: 'EXH-2026-0004',
    },
  ];

  const handleSubmitVote = (votes: number, rating: number, comment: string) => {
    console.log('Votes:', votes);
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    alert(`You cast ${votes} votes with ${rating} stars.\nComment: ${comment}`);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center py-6">
      {/* Program Name */}
      <div className="w-full max-w-6xl px-4 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#071c4f] mb-4">
          BS in Information Technology
        </h2>
      </div>

      {/* Exhibitor / Candidate Cards Grid */}
      <div className="w-full max-w-6xl px-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 mx-auto">
        {exhibitors.map((exhibitor, index) => (
          <div
            key={index}
            className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-5 flex flex-col items-center justify-center transition-transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Candidate Avatar */}
            <div className="h-28 w-28 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 border-4 border-gradient-to-r from-[#071c4f] to-[#1a2b6f] shadow-md transform transition-transform hover:scale-110"></div>

            {/* Candidate Info */}
            <h3 className="font-bold text-xs sm:text-sm text-[#071c4f] text-center">
              {exhibitor.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
              {exhibitor.qrCode}
            </p>

            {/* Vote Button */}
            <button
              onClick={() => setSelectedExhibitor(exhibitor)}
              className="bg-gradient-to-r from-[#071c4f] to-[#1a2b6f] text-white px-5 py-1 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all font-semibold"
            >
              Vote
            </button>
          </div>
        ))}
      </div>

      {/* CastVote Modal */}
      {selectedExhibitor && (
        <CastVote
          exhibitor={selectedExhibitor}
          onClose={() => setSelectedExhibitor(null)}
          onSubmit={handleSubmitVote}
        />
      )}
    </div>
  );
};

export default Dashboard;
