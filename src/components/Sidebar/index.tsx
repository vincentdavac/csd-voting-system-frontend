import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/csd_logo_darkmode.svg';
import {
  GraduationCap,
  LayoutDashboard,
  QrCode,
  ScanLine,
  Star,
  UsersRound,
  Vote,
  Settings,
  ChevronLeft,
  Fingerprint,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { authUser } = useAuth();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#020d26] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-8">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="w-55 h-auto" />
          {/* <div className="flex flex-col">
            <span className="text-xl font-black text-white italic tracking-tighter leading-none">
              ITECHTIVITY<span className="text-primary">2026</span>
            </span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">
              Admin Terminal
            </span>
          </div> */}
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden text-white hover:text-primary transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear px-4">
        <nav className="mt-5 lg:mt-9">
          {/* MAIN MENU SECTION */}
          <div>
            <h3 className="mb-4 ml-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
              MAIN
            </h3>

            <ul className="mb-6 flex flex-col gap-2">
              {/* DASHBOARD */}
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                    pathname.includes('admin/dashboard') &&
                    'bg-primary/10 !text-white shadow-[inset_0_0_20px_rgba(60,80,224,0.1)]'
                  }`}
                >
                  <LayoutDashboard
                    size={20}
                    className={`${
                      pathname.includes('admin/dashboard')
                        ? 'text-primary'
                        : 'group-hover:text-primary'
                    }`}
                  />
                  Dashboard
                  {pathname.includes('admin/dashboard') && (
                    <div className="absolute right-0 h-5 w-1 bg-primary rounded-l-full shadow-[0_0_10px_#3C50E0]" />
                  )}
                </NavLink>
              </li>

              {/* USER MANAGEMENT (DROPDOWN) */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('admin/user-management')}
              >
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to="#"
                      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                        pathname.includes('admin/user-management') &&
                        'text-white'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSidebarExpanded(true);
                        handleClick();
                      }}
                    >
                      <UsersRound
                        size={20}
                        className={`${
                          pathname.includes('admin/user-management')
                            ? 'text-primary'
                            : 'group-hover:text-primary'
                        }`}
                      />
                      User Management
                      <ChevronLeft
                        size={16}
                        className={`absolute right-4 transition-transform duration-300 ${
                          open ? '-rotate-90' : ''
                        }`}
                      />
                    </NavLink>

                    <div
                      className={`translate transform overflow-hidden ${
                        !open && 'hidden'
                      }`}
                    >
                      <ul className="mt-2 mb-4 flex flex-col gap-2 pl-10 border-l border-white/10 ml-6">
                        <li>
                          <NavLink
                            to="/admin/user-management/voters"
                            className={({ isActive }) =>
                              `group relative flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
                                isActive
                                  ? 'text-primary'
                                  : 'text-gray-500 hover:text-white'
                              }`
                            }
                          >
                            <Fingerprint size={14} />
                            Voters
                          </NavLink>
                        </li>
                        {authUser?.user?.role === 'super_admin' && (
                          <li>
                            <NavLink
                              to="/admin/user-management/administrators"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
                                  isActive
                                    ? 'text-primary'
                                    : 'text-gray-500 hover:text-white'
                                }`
                              }
                            >
                              <ShieldCheck size={14} />
                              Administrators
                            </NavLink>
                          </li>
                        )}
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>

              {/* TRANSACTIONS */}

              {authUser?.user?.role === 'super_admin' && (
                <li>
                  <NavLink
                    to="/admin/transactions"
                    className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                      pathname.includes('admin/transactions') &&
                      'bg-primary/10 !text-white'
                    }`}
                  >
                    <ScanLine size={20} className="group-hover:text-primary" />
                    Transactions
                  </NavLink>
                </li>
              )}

              {/* PROGRAMS */}
              <li>
                <NavLink
                  to="/admin/programs"
                  className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                    pathname.includes('admin/programs') &&
                    'bg-primary/10 !text-white'
                  }`}
                >
                  <GraduationCap
                    size={20}
                    className="group-hover:text-primary"
                  />
                  Programs
                </NavLink>
              </li>
            </ul>
          </div>

          {/* SUPER ADMIN TOOLS SECTION */}
          {authUser?.user?.role === 'super_admin' && (
            <div className="mt-10">
              <h3 className="mb-4 ml-4 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                Others
              </h3>
              <ul className="mb-6 flex flex-col gap-2">
                <li>
                  <NavLink
                    to="/admin/exhibitors"
                    className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                      pathname.includes('admin/exhibitors') &&
                      'bg-primary/10 !text-white'
                    }`}
                  >
                    <QrCode size={20} className="group-hover:text-primary" />
                    Exhibitors
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/voting-results"
                    className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                      pathname.includes('admin/voting-results') &&
                      'bg-primary/10 !text-white'
                    }`}
                  >
                    <Vote size={20} className="group-hover:text-primary" />
                    People's Choice
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/booth-rating"
                    className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                      pathname.includes('admin/booth-rating') &&
                      'bg-primary/10 !text-white'
                    }`}
                  >
                    <Star size={20} className="group-hover:text-primary" />
                    Best Booth
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/global-settings"
                    className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-bold text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5 ${
                      pathname.includes('admin/global-settings') &&
                      'bg-primary/10 !text-white'
                    }`}
                  >
                    <Settings size={20} className="group-hover:text-primary" />
                    Global Settings
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>

      {/* TACTICAL FOOTER LOG */}
      <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
