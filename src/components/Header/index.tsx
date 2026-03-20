import { Link } from 'react-router-dom';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/csd_logo.svg';
import DarkModeSwitcher from './DarkModeSwitcher';
import { X, Menu } from 'lucide-react';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white/80 backdrop-blur-md dark:border-strokedark dark:bg-boxdark/80">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        {/* MOBILE SECTION: Toggle & Logo */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* TACTICAL HAMBURGER TOGGLE */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-999 block rounded-xl border border-stroke bg-white p-2 shadow-sm transition-all hover:bg-gray-50 dark:border-strokedark dark:bg-meta-4 lg:hidden"
          >
            {props.sidebarOpen ? (
              <X size={20} className="text-primary" />
            ) : (
              <Menu size={20} className="text-black dark:text-white" />
            )}
          </button>

          {/* MOBILE LOGO WITH STATUS GLOW */}
          <Link
            className="relative block flex-shrink-0 lg:hidden"
            to="/admin/dashboard"
          >
            <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-full animate-pulse" />
            <img src={LogoIcon} alt="Logo" className="relative h-9 w-auto" />
          </Link>
        </div>

        {/* SEARCH / BREADCRUMB PLACEHOLDER (Optional) */}
        <div className="hidden sm:block">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Central Operations Center
          </span>
        </div>

        {/* ACTION AREA: Right Side */}
        <div className="ml-auto flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* DARK MODE SWITCHER */}
            <div className="p-1 rounded-xl bg-gray-50 dark:bg-meta-4/50">
              <DarkModeSwitcher />
            </div>

            {/* NOTIFICATIONS */}
            <DropdownNotification />
          </ul>

          {/* VERTICAL DIVIDER */}
          <div className="h-8 w-[1px] bg-stroke dark:bg-strokedark mx-1 hidden sm:block" />

          {/* USER PROFILE */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
