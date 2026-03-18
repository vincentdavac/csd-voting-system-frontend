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
  <div className="flex h-screen flex-col items-center justify-center gap-8 bg-gray-50 px-4 dark:bg-gray-900 transition-colors duration-500">
    
    {/* Refined Loader Container */}
    <div className="relative flex flex-col items-center">
      
      {/* Halo Effect Background */}
      <div className="absolute -inset-4 rounded-full bg-primary/5 blur-2xl animate-pulse dark:bg-primary/10" />

      {/* Main Spinner */}
      <div className="relative h-24 w-24 sm:h-32 sm:w-32">
        {/* Track Ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-200 dark:border-gray-800" />
        
        {/* Active Spinning Segment */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)]" 
             style={{ animationDuration: '1s' }} 
        />

        {/* Inner Pulsing Icon Circle */}
        <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 sm:h-16 sm:w-16 dark:bg-primary/10">
            {/* Shield/Vote Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary sm:h-8 sm:w-8 animate-bounce"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* Modern Progress Tracking */}
    <div className="flex flex-col items-center gap-4 w-full max-w-[240px]">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
          style={{ 
            width: '40%',
            animation: 'shimmer 2s infinite linear' 
          }}
        />
      </div>

      {/* Status Text Block */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white uppercase sm:text-xl">
          {title || "Securing Vote"}
        </h3>
        <p className="text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 opacity-80 sm:text-sm">
          {description || "Please wait while we encrypt your selection..."}
        </p>
      </div>
    </div>

    {/* Animations */}
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes shimmer {
        0% { transform: translateX(-150%); }
        100% { transform: translateX(250%); }
      }
      h3 {
        letter-spacing: 0.05em;
      }
    `}} />
  </div>
);
};

export default VotingLoader;
