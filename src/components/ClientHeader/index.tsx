import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/csd_logo_lightmode.svg';
import { Tickets } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const Header = () => {
  const { authUser } = useAuth();
  const [remainingVotes, setRemainingVotes] = useState<number>(0);

  const fetchRemainingVotes = async () => {
    if (!authUser?.token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/clients/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authUser.token}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const currentVotes = json.data?.client?.attributes?.remaining_votes 
                          ?? json.data?.client?.remaining_votes 
                          ?? 0;
        setRemainingVotes(currentVotes);
      }
    } catch (error) {
      console.error('Failed to fetch remaining votes for header:', error);
    }
  };

  useEffect(() => {
    fetchRemainingVotes();

    window.addEventListener('votesUpdated', fetchRemainingVotes);

    return () => {
      window.removeEventListener('votesUpdated', fetchRemainingVotes);
    };
  }, [authUser]);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link className="block flex-shrink-0" to="/client/dashboard">
            <img src={LogoIcon} alt="Logo" className="h-13 lg:h-15 w-auto" />
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Ticket Icon with Dynamic Value */}
            <div className="relative flex items-center" title="Remaining Votes">
              <Tickets />
              {/* Value badge */}
              <span className="absolute -top-1 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#071c4f] text-[10px] text-white font-bold">
                {remainingVotes}
              </span>
            </div>
            {/* */}
            <DropdownNotification />
            {/* */}
          </ul>
          {/* */}
          <DropdownUser />
          {/* */}
        </div>
      </div>
    </header>
  );
};

export default Header;