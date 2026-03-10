const Dashboard = () => {
  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center py-6">
      {/* Program Name */}
      <div className="w-full max-w-6xl px-4  text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#071c4f] mb-4">
          BS in Information Technology
        </h2>
      </div>

      {/* Exhibitor / Candidate Cards Grid */}
      <div className="w-full max-w-6xl px-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 mx-auto">
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-5 flex flex-col items-center justify-center transition-transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Candidate Avatar */}
            <div className="h-28 w-28 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 border-4 border-gradient-to-r from-[#071c4f] to-[#1a2b6f] shadow-md transform transition-transform hover:scale-110"></div>

            {/* Candidate Info */}
            <h3 className="font-bold text-xs sm:text-sm text-[#071c4f] text-center">
              X-STREAM
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
              EXH-2026-0001
            </p>

            {/* Vote Button */}
            <button className="bg-gradient-to-r from-[#071c4f] to-[#1a2b6f] text-white px-5 py-1 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all font-semibold">
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
