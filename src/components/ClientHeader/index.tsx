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
          Authorization: `Bearer ${authUser.token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const currentVotes =
          json.data?.client?.attributes?.remaining_votes ??
          json.data?.client?.remaining_votes ??
          0;
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
    <header className="sticky top-0 z-[999] flex w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-[#020d26]/80 transition-all duration-300">
      <div className="flex flex-grow items-center justify-between px-4 py-3 sm:py-4 shadow-sm md:px-6 2xl:px-11">
        {/* LEFT SECTION: BRANDING */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            className="relative block flex-shrink-0 group transition-transform active:scale-95"
            to="/client/dashboard"
          >
            {/* Subtle glow behind logo in dark mode */}
            <div className="absolute inset-0 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <img
              src={LogoIcon}
              alt="S.U.N.O.D. Logo"
              className="h-10 sm:h-12 lg:h-14 w-auto relative z-10 object-contain"
            />
          </Link>
        </div>

        {/* RIGHT SECTION: SYSTEM TOOLS */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <ul className="flex items-center gap-3 sm:gap-5">
            {/* TICKET HUD COUNTER */}
            <li className="relative">
              <div
                className="group flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:border-blue-500/50"
                title="Available Vote Credits"
              >
                <Tickets
                  size={20}
                  className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors"
                />

                {/* Value badge - Styled as a digital notification */}
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-lg bg-blue-600 text-[10px] text-white font-black shadow-lg shadow-blue-600/40 animate-in zoom-in">
                  {remainingVotes}
                </span>
              </div>
            </li>

            {/* NOTIFICATION HUB */}
            <li className="relative">
              <DropdownNotification />
            </li>
          </ul>

          {/* SYSTEM USER PROFILE */}
          <div className="flex items-center pl-3 sm:pl-6 border-l border-slate-200 dark:border-white/10">
            <DropdownUser />
          </div>
        </div>
      </div>

      {/* TACTICAL PROGRESS LINE (Bottom Accent) */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
    </header>
  );
};

export default Header;
