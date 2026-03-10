import React from 'react';
import Logo from '../../images/logo/csd_logo.svg';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-4">
      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        className="mb-4 h-16 sm:h-20 w-auto" // smaller on mobile
      />

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-extrabold text-[#071c4f] mb-2 text-center">
        ITECHTIVITY 2026
      </h1>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center max-w-xs">
        Voting System is loading ...
      </p>

      {/* Spinner */}
      <div className="h-10 w-10 sm:h-14 sm:w-14 animate-spin rounded-full border-4 border-solid border-[#071c4f] border-t-transparent"></div>
    </div>
  );
};

export default Loader;
