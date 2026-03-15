import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../images/logo/csd_logo.svg';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the first segment of the last URL path
  const firstSegment = location.pathname.split('/')[1]; // e.g., "admin" or "client"

  // Decide where to redirect based on segment
  let redirectTo = '/client/signin'; 
  if (firstSegment === 'admin') redirectTo = '/admin/signin';
  else if (firstSegment === 'client') redirectTo = '/client/signin';

  useEffect(() => {
    const timer = setTimeout(() => navigate(redirectTo), 5000);
    return () => clearTimeout(timer);
  }, [redirectTo, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-2 dark:bg-boxdark-2 p-4">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="mb-6 h-30 w-auto" />

      {/* 404 Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-[#071c4f] mb-4 text-center">
        404 Not Found
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 text-center max-w-xs">
        The page you are looking for does not exist or has been moved.
      </p>

      {/* Redirect Button */}
      <Link
        to={redirectTo}
        className="px-6 py-3 rounded-lg bg-[#071c4f] text-white font-medium hover:bg-opacity-90 transition text-sm sm:text-base"
      >
        Go to Sign In
      </Link>
    </div>
  );
};

export default PageNotFound;
