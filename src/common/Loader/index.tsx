import React, { useState, useEffect } from 'react';
import Logo from '../../images/logo/csd_logo.svg';

const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);

  // Simulated boot sequence progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white dark:bg-boxdark p-6 overflow-hidden">
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* LOGO WITH SCANNER EFFECT */}
        <div className="relative group mb-8">
          <img
            src={Logo}
            alt="Logo"
            className="h-24 sm:h-28 w-auto transition-transform duration-700 animate-pulse"
          />
          {/* Vertical Scan Line */}
          <div className="absolute inset-0 w-full h-[2px] bg-primary/40 shadow-[0_0_15px_1px_#3C50E0] animate-scan-v pointer-events-none" />
        </div>

        {/* IDENTITY SECTION */}
        <div className="text-center mb-10 space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-[#071c4f] dark:text-white uppercase italic tracking-tighter leading-none">
            ITECHTIVITY <span className="text-primary">2026</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-gray-300 dark:bg-strokedark" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
              Voting Terminal
            </p>
            <span className="h-[1px] w-8 bg-gray-300 dark:bg-strokedark" />
          </div>
        </div>

        {/* PROGRESS BLOCK */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">
                {progress < 100 ? 'Synchronizing Ledger...' : 'Access Granted'}
              </p>
              <p className="text-[8px] font-bold text-gray-400 uppercase italic">
                Node: PH-MNL-2026-SYS
              </p>
            </div>
            <span className="text-2xl font-black text-[#071c4f] dark:text-white italic tracking-tighter">
              {progress}%
            </span>
          </div>

          {/* CUSTOM PROGRESS BAR */}
          <div className="h-3 w-full bg-gray-100 dark:bg-meta-4 rounded-full overflow-hidden border border-stroke dark:border-strokedark p-[2px]">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(60,80,224,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* FOOTER ENCRYPTION METER */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full transition-colors duration-500 ${
                  progress > i * 20
                    ? 'bg-primary'
                    : 'bg-gray-200 dark:bg-strokedark'
                }`}
              />
            ))}
          </div>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
            End-to-End Encrypted Session
          </p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan-v {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-v {
          animation: scan-v 2.5s ease-in-out infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default Loader;
