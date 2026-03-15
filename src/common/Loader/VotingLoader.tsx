// src/components/Loader/VotingLoader.tsx

interface VotingLoaderProps {
  title?: string;
  description?: string;
}

const VotingLoader = ({
  title = 'Loading Dashboard',
  description = 'Preparing your voting data...',
}: VotingLoaderProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-white dark:bg-boxdark">
      {/* Rotating rings */}
      <div className="relative h-28 w-28">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary opacity-80" />

        {/* Middle counter-rotating ring */}
        <div
          className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-b-primary border-l-primary opacity-60"
          style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="10" width="18" height="11" rx="2" />
              <path d="M9 10V7a3 3 0 0 1 6 0v3" />
              <path d="M9 16l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Animated progress bar */}
      <div className="w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-1.5 rounded-full bg-primary"
          style={{ animation: 'progressBar 1.8s ease-in-out infinite' }}
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-black dark:text-white">
          {title}
        </p>
        <p
          className="text-sm text-gray-500 dark:text-gray-400"
          style={{ animation: 'fadeInOut 1.8s ease-in-out infinite' }}
        >
          {description}
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes progressBar {
          0%   { width: 0%;  margin-left: 0%; }
          50%  { width: 70%; margin-left: 15%; }
          100% { width: 0%;  margin-left: 100%; }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VotingLoader;
