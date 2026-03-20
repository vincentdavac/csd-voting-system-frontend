// src/components/Loader/VotingLoader.tsx

import { Zap } from 'lucide-react';

interface VotingLoaderProps {
  title?: string;
  description?: string;
}

const VotingLoader = ({
  title = 'Loading Dashboard',
  description = 'Preparing your voting data...',
}: VotingLoaderProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8 sm:gap-12 bg-[#f8fafc] px-6 dark:bg-[#010717] transition-colors duration-500 overflow-hidden relative">
      {/* BACKGROUND GRID DECOR (Subtle BSIT/Tech vibe) */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#3c50e0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* MAIN LOADER CORE */}
      <div className="relative flex flex-col items-center scale-90 sm:scale-100 transition-transform">
        {/* BREATHING ENERGY FIELD */}
        <div className="absolute -inset-12 sm:-inset-16 rounded-full bg-primary/10 blur-[40px] sm:blur-[60px] animate-pulse dark:bg-primary/20" />

        {/* MULTI-STAGE SPINNER - Scaled for mobile (32 to 48) */}
        <div className="relative h-32 w-32 sm:h-48 sm:w-48">
          {/* OUTER STATIC RING */}
          <div className="absolute inset-0 rounded-full border-[1px] border-primary/20 dark:border-primary/10 scale-110" />

          {/* FAST OUTER ROTATOR */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-t-[3px] border-primary shadow-[0_0_15px_rgba(60,80,224,0.4)]"
            style={{ animationDuration: '0.8s' }}
          />

          {/* REVERSE INNER ROTATOR */}
          <div
            className="absolute inset-3 sm:inset-4 animate-spin-reverse rounded-full border-b-[2px] border-primary/40 border-l-[2px] border-l-transparent"
            style={{ animationDuration: '1.5s' }}
          />

          {/* CENTRAL HUD CORE */}
          <div className="absolute inset-6 sm:inset-8 flex items-center justify-center rounded-full bg-white dark:bg-[#020d26] shadow-2xl border border-slate-200 dark:border-white/10">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 sm:h-20 sm:w-20 dark:bg-primary/10">
              <Zap
                size={24}
                className="text-primary animate-pulse filter drop-shadow-[0_0_8px_rgba(60,80,224,0.6)] sm:w-8 sm:h-8"
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DATA STATUS BLOCK */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[320px] sm:max-w-sm relative z-10">
        {/* PROGRESS TRACK */}
        <div className="relative h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/50">
          <div
            className="h-full rounded-full bg-primary shadow-[0_0_15px_rgba(60,80,224,0.6)] transition-all duration-700"
            style={{
              width: '65%', // Controlled by prop in real use
              backgroundImage:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '100px 100%',
              animation: 'shimmer-flow 1.5s infinite linear',
            }}
          />
        </div>

        {/* TERMINAL TEXT - Optimized for smaller viewports */}
        <div className="space-y-4 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/5">
            <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.25em] animate-pulse">
              System Synchronizing
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
              {title || 'Updating Ledger'}
            </h3>
            <div className="flex flex-col items-center px-4">
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 opacity-80 leading-relaxed max-w-[240px] sm:max-w-none">
                {description ||
                  'Finalizing credit injection & security handshake...'}
              </p>
            </div>
          </div>

          {/* NODAL METADATA - Shrunk for mobile */}
          <div className="pt-2">
            <p className="text-[8px] sm:text-[9px] font-mono text-primary/60 dark:text-primary/40 uppercase tracking-[0.2em] sm:tracking-widest">
              Node: 127.0.0.1 // Protocol: SUNOD-SECURE
            </p>
          </div>
        </div>
      </div>

      {/* GLOBAL ANIMATIONS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes shimmer-flow {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes spin-reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      .animate-spin-reverse {
        animation: spin-reverse 1.5s infinite linear;
      }
    `,
        }}
      />
    </div>
  );
};

export default VotingLoader;
